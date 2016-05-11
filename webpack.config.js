var devDirectory = __dirname + '/src';

var config = {
  context: __dirname
};

config.entry = {
  'experiments': devDirectory + '/main',
};

config.output = {
  path:     __dirname + '/app',
  filename: '[name].js',
};

module.exports = config;