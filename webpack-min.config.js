const path = require('path');

module.exports = {
  entry: {
    'zuix': './src/js/main.js',
    'zuix-bundler': './src/js/bundler.js'
  },
  output: {
    filename: '[name].min.js',
    path: path.resolve(__dirname, 'dist/js'),
    library: 'zuix'
  },
  optimization: {
    minimize: true
  }
};
