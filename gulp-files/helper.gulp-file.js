const { spawn } = require('child_process');
const { assign, omit } = require('lodash');
const cmdOptions = require('.').cmdOptions;

exports.getBuildEnv = () => {
  return (process.env.NODE_ENV || cmdOptions.env || cmdOptions.environment) || 
          ((cmdOptions.isProd || cmdOptions.prod || cmdOptions.production || cmdOptions.mawad) ? 'production' : 
          ((cmdOptions.isPreProd || cmdOptions.preProd || cmdOptions.preProd || cmdOptions['pre-prod'] || cmdOptions.preProduction || cmdOptions['pre-production'] || cmdOptions.mawadTest || cmdOptions['mawad-test']) ? 'pre-production' : 
          ((cmdOptions.isStaging || cmdOptions.isStg || cmdOptions.stg || cmdOptions.staging) ? 'staging' : 
          'development')));
};

exports.noopTask = () => Promise.resolve();

exports.wait = (duration, data) => {
  return new Promise((resolve) => setTimeout(resolve.bind(null, data), duration));
};

exports['print:env'] = (done) => {
  console.log(process.env);
  done();
};
exports['print:options'] = (done) => {
  console.log(cmdOptions);
  done();
};
exports['print:build-env'] = (done) => {
  console.log(getBuildEnv());
  done();
};

/**
 * promisified wrapper to spawn method
 * @param {string} cmd 
 * @param {string[]} cmdArgs 
 * @param {{errorMessage:string,env:object|true,cwd:string,detached:boolean,shell:boolean,stdio:[import('stream').Stream|string]}} options 
 * @returns Promise<any>
 */
const execCmd = (cmd, cmdArgs, options = {}) => {
  const errorMessage = options.errorMessage || 'Error executing ' + cmd;
  options = assign({ detached: false, shell: true, stdio: 'inherit' }, omit(options, 'errorMessage'));
  if(options.env === true) {
    options.env = Object.assign({}, process.env);
  }
  return new Promise((resolve, reject) => {
    try {
      const buildCmd = spawn(cmd, cmdArgs, options);
      let rejected = false;
      buildCmd.on('error', async (err) => {
        if(!rejected) {
          rejected = true;
          reject(err);
        }
      });
      buildCmd.on('exit', async (code) => {
        if (code !== 0) {
          if(!rejected) {
            rejected = true;
            reject(new Error(errorMessage + '. Code: ' + code));
          }
        }
        else {
          resolve();
        }
      });
    }
    catch(err) {
      console.error('Global Error:', err);
      reject(err || new Error('Global Error'));
    }
  });
}
exports.execCmd = execCmd;
