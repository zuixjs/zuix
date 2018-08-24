// Run tasks in sequence
// - scripts/lint.js
// - scripts/build.js src/js/main.js zuix
// - scripts/build.js src/js/bundler.js zuix-bundler
// - scripts/dox.js

const { spawn } = require('child_process');

console.log('\nChecking code with ESLint ...\n');
lint((code)=>{
    checkResult(code);
    console.log('\nBuilding zuix ...\n');
    build('src/js/main.js', 'zuix', (code)=>{
        checkResult(code);
        console.log('\nBuilding zuix-bundler ...\n');
        build('src/js/bundler.js', 'zuix-bundler', ()=>{
            checkResult(code);
            console.log('\nGenerating API docs and TypeScript .d.ts ...\n');
            dox((code)=>{
                checkResult(code);
            });
        });
    });
});

function checkResult(code) {
    if (code !== 0) process.exit(code);
}

function lint(callback) {
    const lint = spawn('node', ['build/scripts/lint.js']);
    lint.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
    lint.stderr.on('data', (data) => {
        process.stdout.write(data);
    });
    lint.on('close', (code) => {
        if (callback) callback(code);
    });
}

function build(startFile, baseName, callback) {
    const bp = spawn('node', ['build/scripts/build.js', startFile, baseName]);
    bp.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
    bp.stderr.on('data', (data) => {
        process.stdout.write(data);
    });
    bp.on('close', (code) => {
        if (callback) callback(code);
    });
}

function dox(callback) {
    const dox = spawn('node', ['build/scripts/dox.js']);
    dox.stdout.on('data', (data) => {
        process.stdout.write(data);
    });
    dox.stderr.on('data', (data) => {
        process.stdout.write(data);
    });
    dox.on('close', (code) => {
        if (callback) callback(code);
    });
}
