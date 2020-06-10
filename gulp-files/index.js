const cmdOptions = require('minimist')(process.argv.slice(3)) || {};
exports.cmdOptions = cmdOptions;

const _ = require('lodash');
const execCmd = require('./helper.gulp-file').execCmd;

Object.assign(
  exports,
  _.mapKeys(require('./frontend.gulp-file'), (value, key) => key + ':frontend'),
  require('./helper.gulp-file')
);

exports.build = () => {
  return execCmd('gulp', ['build:frontend', '--prod', '--zip']);
};
