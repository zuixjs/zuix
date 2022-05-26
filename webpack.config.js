const path = require('path');

/**
 * Creates WebPack config.
 *
 * @param {string} target
 * @param {boolean} [minimize]
 * @return {{output: {path: string, filename: string, library: {umdNamedDefine: boolean, type}}, entry: {'zuix-bundler': string, zuix: string}, optimization: {minimize: (boolean)}, experiments: {outputModule: (boolean)}}}
 */
function createConfig(target, minimize) {
  return {
    entry: {
      'zuix': './src/js/main.js',
      'zuix-bundler': './src/js/bundler.js'
    },
    output: {
      filename: '[name]'+(target !== 'var' ?'.'+target:'')+(minimize?'.min':'')+'.js',
      path: path.resolve(__dirname, 'dist/js'),
      library: {
        name: target === 'var' ? 'zuix' : undefined,
        type: target
        //auxiliaryComment: 'zUIx.js - brought to you, with love, by G-Labs =)',
        //umdNamedDefine: true
      }
    },
    experiments: {
      outputModule: target === 'module'
    },
    optimization: {
      minimize: minimize === true
    },
    target: ['web', 'es5']
  };
}

module.exports = [
  createConfig('var'),
  createConfig('var', true),
  createConfig('module'),
  createConfig('module', true)
];
