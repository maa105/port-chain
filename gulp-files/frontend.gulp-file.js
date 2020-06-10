const gulp = require('gulp');
const gulpZip = require('gulp-zip');
const fs = require('fs-extra');
const { camelCase, constantCase } = require('change-case');

const { cmdOptions } = require('.');
const { getBuildEnv, wait, noopTask, execCmd } = require('./helper.gulp-file');

exports.install = () => {
  process.chdir('frontend');
  return execCmd('npm', ['install']).finally(() => process.chdir('..'));
};

exports.run = () => {
  process.chdir('frontend');
  return execCmd('npm', ['start']);
};

exports.test = () => {
  process.chdir('frontend');
  return execCmd('npm', ['run', 'test']).finally(() => process.chdir('..'));
};

exports.testOnce = () => {
  process.chdir('frontend');
  return execCmd('npm', ['run', 'test', '--', '--watchAll=false']).finally(() => process.chdir('..'));
};

const buildApp = async () => {
  const environment = getBuildEnv();
  console.log('- Building for: ' + environment);

  switch(environment) {
    case 'development':
    case 'staging':
    case 'production':
      break;
    default:
      reject(new Error('No build not setup for environment "' + environment + '"'));
      return;
  }
  
  let oldConfigValue;
  let newConfigValue;
  const oldCwd = process.cwd();
  process.chdir('frontend');

  try {

    oldConfigValue = fs.readFileSync('./src/config/index.js', 'utf8');
    newConfigValue = fs.readFileSync('./src/config/' + environment + '.config.js', 'utf8');
  
    fs.writeFileSync('./src/config/index.js', newConfigValue, 'utf8');
    await wait(100);
    
    await execCmd('npm', ['run', 'build']);
  
    fs.writeFileSync('./src/config/index.js', oldConfigValue, 'utf8');
    await wait(100);

    process.chdir(oldCwd);

  }
  catch(err) {
    if(oldConfigValue) {
      fs.writeFileSync('./src/config/index.js', oldConfigValue, 'utf8');
    }
    console.error('Global Error:', err);
    await wait(100);
    
    process.chdir(oldCwd);
    throw (err || new Error('Global Error'));
  }
};

const moveBuildToEnvBuilds = () => {
  const environment = getBuildEnv();
  const oldCwd = process.cwd();

  return new Promise(async (resolve, reject) => {
    try {
      process.chdir('frontend');
  
      if(!fs.existsSync('./builds')) {
        fs.mkdirSync('./builds');
      }
      await wait(100);
  
      const folder = './builds/' + environment;
      if(fs.existsSync(folder)) {
        fs.removeSync(folder);
      }
      await wait(100);
  
      fs.moveSync('./build', folder);

      process.chdir(oldCwd);
      resolve();
    }
    catch(err) {
      console.error('Error:', err);
      process.chdir(oldCwd);
      reject(err || new Error('Error'));
    }
  })
  .then(async () => {
    await wait(100);
    fs.removeSync('./frontend/build');
    await wait(100);
  });
};

const zipBuild = () => {
  const environment = getBuildEnv();
  return gulp.src('./frontend/builds/' + environment + '/**')
    .pipe(gulpZip(environment + '.zip'))
    .pipe(gulp.dest('./frontend/builds/'));
};

const cleanBuildFolder = () => {
  const environment = getBuildEnv();
  return fs.remove('./frontend/builds/' + environment);
};

exports.build = (done) => {
  const zip = cmdOptions.zip;
  const clean = zip && !(cmdOptions.keep ||cmdOptions.keepFolder ||  cmdOptions.keepBuildFolder || cmdOptions['keep-folder'] || cmdOptions['keep-build-folder']);
  return gulp.series(exports.testOnce, buildApp, moveBuildToEnvBuilds, zip ? zipBuild : noopTask, clean ? cleanBuildFolder : noopTask)(done);
};

exports.createAction = (done) => {
  let app = cmdOptions.app || cmdOptions.application;
  if(!app) {
    console.warn('No app provided. Setting app to "frontend". case u need to specify an app use: --app <app_name>');
    app = 'frontend';
  }

  if(!fs.existsSync('./' + app)) {
    done(new Error('app "' + app + '" does not exist!'));
    return;
  }

  const module = (cmdOptions.m || cmdOptions.module || cmdOptions.moduleName || cmdOptions['module-name'] || '').trim();

  if(!module) {
    done(new Error('module name missing. specify --m <module_name>'));
    return;
  }

  if(!fs.existsSync('./' + app + '/src/actions/' + module + '.actions.js')) {
    console.warn('file "./' + app + '/src/actions/' + module + '.actions.js" does not exist. creating it.');
    fs.createFileSync('./' + app + '/src/actions/' + module + '.actions.js');
  }

  const action = cmdOptions.a || cmdOptions.action || cmdOptions.actionName || cmdOptions['action-name'];

  if(!module) {
    done(new Error('action name missing. specify --a <action_name>'));
    return;
  }

  const actionFunctionName = camelCase(action);
  const actionConstantName = constantCase(action);
  const single = cmdOptions.single || cmdOptions.s;
  const prefix = cmdOptions.prefix || cmdOptions.pre || cmdOptions.p || camelCase(module);

  const inputs = (cmdOptions.i || cmdOptions.in || cmdOptions.ins || cmdOptions.input || cmdOptions.inputs || '').trim().split(',').map((inpt) => inpt.trim()).filter((inpt) => inpt).join(', ');
  if(!inputs) {
    console.warn('no inputs provided (which is ok). case u need inputs specify --i <input_1>,<input_2>');
  }

  const outputs = (cmdOptions.o || cmdOptions.out || cmdOptions.outs || cmdOptions.output || cmdOptions.outputs || '').trim().split(',').map((out) => out.trim()).filter((out) => out).join(', ');
  if(!outputs && !single) {
    console.warn('no outputs provided (which is ok). case u need outputs specify --o <output_1>,<output_2>');
  }

  const actionCode = (single ? `
  export const ${actionConstantName} = '${prefix}.${actionConstantName}';
  export const ${actionFunctionName} = (${inputs}) => ({
    type: ${actionConstantName}${inputs ? ',\r\n    ' + inputs : ''}
  });
  ` : `
  export const ${actionConstantName} = '${prefix}.${actionConstantName}';
  export const ${actionConstantName}_STARTED = '${prefix}.${actionConstantName}_STARTED';
  export const ${actionConstantName}_SUCCESSFUL = '${prefix}.${actionConstantName}_SUCCESSFUL';
  export const ${actionConstantName}_ERRORED = '${prefix}.${actionConstantName}_ERRORED';
  
  export const ${actionFunctionName} = (${inputs}) => ({
    type: ${actionConstantName}${inputs ? ',\r\n    ' + inputs : ''}
  });
  export const ${actionFunctionName}Started = (${inputs}) => ({
    type: ${actionConstantName}_STARTED${inputs ? ',\r\n    ' + inputs : ''}
  });
  export const ${actionFunctionName}Successful = (${inputs ? (inputs + (outputs ? ', ' : '')) : ''}${outputs}) => ({
    type: ${actionConstantName}_SUCCESSFUL${((inputs || outputs) ? ',\r\n    ' : '')}${inputs ? (inputs + (outputs ? ', ' : '')) : ''}${outputs}
  });
  export const ${actionFunctionName}Errored = (${inputs ? (inputs + ', ') : ''}error) => ({
    type: ${actionConstantName}_ERRORED,
    ${inputs ? (inputs + ', ') : ''}error
  });
  `).replace(/(?:\r)/g, '').replace(/(?:\n) {2}/g, '\n').replace(/(?:\n)/g, '\r\n');

  const content = fs.readFileSync('./' + app + '/src/actions/' + module + '.actions.js', { encoding: 'utf8' });
  fs.writeFileSync('./' + app + '/src/actions/' + module + '.actions.js', content + actionCode, { encoding: 'utf8' });
  done();
};

