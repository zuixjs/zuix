const baseFolder = process.cwd();
// Commons
const path = require('path');
// Build scripts
const lint = require(path.join(baseFolder, 'build/scripts/lint')).lint;
const build = require(path.join(baseFolder, 'build/scripts/build')).build;

// lint runs synchronously
console.log('\nChecking code with ESLint ...');
lint((stats)=>{
  checkResult(stats.error);
});

// build zuix and zuix-bundler
console.log('Building zuix and zuix-bundler ...');
build('webpack.config.js', (code)=>{
  checkResult(code);
});

function checkResult(code) {
  if (code !== 0) process.exit(code);
}
