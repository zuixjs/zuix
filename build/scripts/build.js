/*
 * Copyright 2015-2018 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
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
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

// Commons
const fs = require('fs');
const path = require('path');
const baseFolder = process.cwd();
const distFolder = path.join(baseFolder, 'dist');
// logging
const tlog = require(path.join(baseFolder, 'src/lib/logger'));
// Browserify
const browserify = require('browserify');
const derequire = require('browserify-derequire');
// Google Closure Compiler
const ClosureCompiler = require('google-closure-compiler').compiler;

function build(mainFile, baseName, callback) {

    const browserifyTask = browserify({
        standalone: baseName,
        plugin: [ derequire ]
    });

    // prepare main output stream
    const fileName = path.join(distFolder, 'js/', `${baseName}.js`);
    const fileNameMin = path.join(distFolder, 'js/', `${baseName}.min.js`);
    const output = fs.createWriteStream(fileName);

    // add jsDoc header to declare zuix object as {Zuix}
    output.write('/** @typedef {Zuix} window.zuix */\n');

    tlog.info('^B%s^:', baseName)
        .info('   ^yBrowserify^:')
        .info('     %s', fileName);

    browserifyTask.add(mainFile);
    browserifyTask.bundle().pipe(output).on('error', (err) => {
        // TODO: not sure this event is implemented by browserify...
        output.end();
        tlog.error(err);
        //process.exit(-1);
        callback(-1);
    });

    // start compile process once browserify finished writing output file
    output.on('finish', ()=>{
        tlog.info('   ^yGoogle Closure Compiler^:')
            .info('     %s', fileNameMin)
            .info('     %s.map', fileNameMin);
        new ClosureCompiler({
            js: fileName,
            js_output_file: fileNameMin,
            // debug: true, // <-- DO NOT ACTIVATE, causes errors in generated js
            warning_level: 'QUIET',
            compilation_level: 'SIMPLE',
            language_in: 'ECMASCRIPT6_STRICT',
            language_out: 'ES6_STRICT',
            // useTypesForOptimization: true,
            // define: [
            //  "goog.DEBUG=false"
            // ],
            create_source_map: `${fileNameMin}.map`,
            source_map_location_mapping: 'dist/js/|./',
            output_wrapper: `%output%\n//# sourceMappingURL=${baseName}.min.js.map`
        }).run((exitCode, stdOut, stdErr) => {
            //compilation complete
            output.end();
            tlog.info(' ^G\u2713^:done\n\n');
            if (exitCode != 0) {
                tlog.err(exitCode, stdOut, stdErr);
            }
            callback(exitCode);
        });
    });

}

module.exports = {
    build: build
};
