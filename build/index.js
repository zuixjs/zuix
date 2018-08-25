// Commons
const path = require('path');
// Build scripts
const lint = require(path.join(process.cwd(), 'build/scripts/lint')).lint;
const build = require(path.join(process.cwd(), 'build/scripts/build')).build;
const dox = require(path.join(process.cwd(), 'build/scripts/dox')).build;

// lint runs synchronously
console.log('\nChecking code with ESLint ...');
lint((stats)=>{ checkResult(stats.error); });

// build zuix and zuix-bundler
console.log('Building zuix ...');
build('src/js/main.js', 'zuix', (code)=>{
    checkResult(code);
    console.log('Building zuix-bundler ...');
    build('src/js/bundler.js', 'zuix-bundler', (code)=>{
        checkResult(code);
        console.log('Generating API docs and TypeScript .d.ts ...');
        dox();
    });
});

function checkResult(code) {
    if (code !== 0) process.exit(code);
}
