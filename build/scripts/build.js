/*
 * Copyright 2015-2018 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

// Commons
const fs = require('fs');
const path = require('path');
// Browserify
const derequire = require('browserify-derequire');
const browserify = require('browserify')({
    standalone: 'zuix',
    plugin: [ derequire ]
});
// Google Closure Compiler
const ClosureCompiler = require('google-closure-compiler').compiler;

// read script arguments
if (process.argv.length < 4) {
    console.log(`usage: ${process.argv[1]} <main_file.js> <output_base_name>`);
    process.exit(-1);
}
const mainFile = process.argv[2];
const baseName = process.argv[3];

// prepare main output stream
const output = fs.createWriteStream(`dist/js/${baseName}.js`);

// add jsDoc header to declare zuix object as {Zuix}
output.write('/** @typedef {Zuix} window.zuix */\n');

console.log(baseName, 'Browserifying...');

browserify.add(mainFile);
browserify.bundle().pipe(output).on('error', (err) => {
    // TODO: not sure this event is implemented by browserify...
    console.log('ERROR', err);
    process.exit(-1);
});

// start compile process once browserify finished writing output file
output.on('finish', ()=>{
    console.log(baseName, 'Compiling...');
    new ClosureCompiler({
        js: `dist/js/${baseName}.js`,
        js_output_file: `dist/js/${baseName}.min.js`,
        // debug: true, // <-- DO NOT ACTIVATE, causes errors in generated js
        warning_level: 'QUIET',
        compilation_level: 'SIMPLE',
        language_in: 'ECMASCRIPT6_STRICT',
        language_out: 'ES6_STRICT',
        // useTypesForOptimization: true,
        // define: [
        //  "goog.DEBUG=false"
        // ],
        create_source_map: `dist/js/${baseName}.min.js.map`,
        source_map_location_mapping: 'dist/js/|./',
        output_wrapper: `%output%\n//# sourceMappingURL=${baseName}.min.js.map`
    }).run((exitCode, stdOut, stdErr) => {
        //compilation complete
        console.log(baseName, 'Done.');
        if (exitCode != 0) {
            console.log("ERROR", exitCode, stdOut, stdErr);
        }
        process.exit(exitCode);
    });
});
