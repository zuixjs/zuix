/*
 * Copyright 2015-2019 G-Labs. All Rights Reserved.
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

const baseFolder = process.cwd();
// Commons
const fs = require('fs');
const path = require('path');
// logging
const tlog = require(path.join(baseFolder, 'src/lib/logger'));
// Dox jsDoc parser
const dox = require('dox');

// Config
const srcFolder = './src/js/';
const jsonApiFolder = path.join(baseFolder, 'docs/api/data/');
const inputFiles = [
    'zuix/Zuix.js',
    'zuix/ComponentContext.js',
    'zuix/ContextController.js',
    'zuix/ComponentCache.js',
    'observable/ObjectObserver.js',
    'observable/ObservableListener.js',
    'observable/ObservableObject.js',
    'helpers/ZxQuery.js',
    'helpers/Logger.js',
    'localizer/Localizer.js'
];

function build() {
    // Generate JSON data from jsDoc
    tlog.info('^BAPI data^:');
    inputFiles.map((f, i)=>{
        const sourceFile = path.join(srcFolder, f);
        const code = fs.readFileSync(sourceFile, 'utf8');
        const jsonData = dox.parseComments(code, {raw: true});
        const targetFile = path.join(jsonApiFolder, path.basename(f+'on'));
        tlog.info('   ^w%s^:', targetFile);
        const targetFolder = path.dirname(targetFile);
        if (!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }
        fs.writeFileSync(targetFile, JSON.stringify(jsonData));
    });
    // Generate ZUIX TypeScript Definition file
    const targetFolder = path.join(baseFolder, 'dist/ts');
    const targetFile = path.join(targetFolder, 'zuix.d.ts');
    tlog.br()
        .info('^BTypeScript defs^:')
        .info('   ^w%s^:', targetFile);
    let tsDefs = generateTypescriptDefs('Zuix');
    tsDefs += generateTypescriptDefs('ComponentContext');
    tsDefs += generateTypescriptDefs('ContextController');
    tsDefs += generateTypescriptDefs('ComponentCache');
    tsDefs += generateTypescriptDefs('ZxQuery');
    tsDefs += generateTypescriptDefs('ZxQuery', 'ZxQueryStatic');
    tsDefs += generateTypescriptDefs('ObjectObserver');
    tsDefs += generateTypescriptDefs('ObservableObject');
    tsDefs += generateTypescriptDefs('ObservableListener');
    tsDefs += generateTypescriptDefs('Logger');
    tsDefs += '\ndeclare const zuix: Zuix;\nexport default zuix;';
    // Write TypeScript definitions to file
    if (!fs.existsSync(targetFolder)) {
        fs.mkdirSync(targetFolder);
    }
    fs.writeFileSync(targetFile, tsDefs);
    tlog.br().info(' ^G\u2713^:done\n\n');
}

function generateTypescriptDefs(objName, innerClass) {
    const json = JSON.parse(fs.readFileSync(path.join(jsonApiFolder, objName+'.json')));
    let output = '';
    let contextOpen = false;
    if (innerClass != null) {
        objName = innerClass;
    }

    const openContext = function(name) {
        if (!contextOpen) {
            output += 'export interface ' + name + ' {\n';
            contextOpen = true;
        }
    };
    const closeContext = function() {
        if (contextOpen) {
            output += '}\n';
            contextOpen = false;
        }
    };

    json.map((obj, j)=>{
        const ctx = obj.ctx;
        const isClass = obj.isClass;
        const isConstructor = (ctx && ctx.type === 'method' && ctx.constructor === objName);
        const isStaticClass = (isClass && ctx && ctx.type === 'function' && ctx.name === objName);
        if (ctx != null && (isConstructor || isStaticClass)) {
            openContext(objName);
            output += indentTab() + (!isStaticClass ? ctx.name : '') + '(';
            obj.tags.map((tag, t)=>{
                if (tag.type === 'param') {
                    if (tag.name[0] === '[') {
                        output += tag.name.substring(1, tag.name.length - 1) + '?: ';
                    } else {
                        output += tag.name + ': ';
                    }
                    output += getTypes(tag.types);
                    if (t < obj.tags.length - 2) {
                        output += ', ';
                    }
                } else if (tag.type === 'property') {
                    output += '): ';
                    output += getTypes(tag.types);
                    output += ';\n';
                } else if (tag.type === 'return' || tag.type === 'returns') {
                    output += '): ';
                    let returnTypes = getTypes(tag.types);
                    if (returnTypes === '') {
                        returnTypes = 'void';
                    }
                    output += returnTypes;
                    output += ';\n';
                }
            });
        } else if (ctx != null && ctx.type === 'property' && ctx.constructor === objName) {
            if (obj.tags.length > 0) {
                openContext(objName);
                obj.tags.map((tag, t) => {
                    if (tag.type === 'property' || tag.type === 'type') {
                        output += indentTab() + ctx.name + ': ';
                        output += getTypes(tag.types);
                        output += ';\n';
                    }
                });
            }
        } else {
            for (let key in obj) {
                const definitions = obj[key];
                if (key === 'tags' && definitions != null && definitions.length > 0) {
                    const tagType = definitions[0].type;
                    const name = definitions[0].string.replace(/\{.[^\}]+\}\s+/ig, '');
                    if (tagType === 'typedef' && innerClass == null) {
                        closeContext();
                        output += 'export interface ' + name + ' {\n';
                        definitions.map((d, i)=>{
                            if (d.type === 'property') {
                                output += indentTab() + getName(d) + ': ';
                                output += getTypes(d.types);
                                output += ';\n';
                            }
                        });
                        output += '}\n';
                    } else if (tagType === 'callback' && innerClass == null) {
                        closeContext();
                        output += 'export interface ' + name + ' {\n';
                        output += indentTab() + '(';
                        definitions.map((d, i)=>{
                            if (d.type === 'param') {
                                output += getName(d) + ': ';
                                output += getTypes(d.types);
                                if (i < definitions.length - 2) {
                                    output += ', ';
                                }
                            }
                        });
                        output += '): void;\n';
                        output += '}\n';
                    } else if (tagType === 'memberOf' && ctx != null && ctx.receiver === objName) {
                        // static method
                        output += indentTab() + ctx.name + '(';
                        let hasReturnValue = false;
                        definitions.map((d, i)=>{
                            if (d.type === 'param') {
                                output += getName(d) + ': ';
                                output += getTypes(d.types);
                                if (i < definitions.length - 2) {
                                    output += ', ';
                                }
                            } else if (d.type === 'return' || d.type === 'returns') {
                                output += '): ';
                                let returnTypes = getTypes(d.types);
                                if (returnTypes === '') {
                                    returnTypes = 'void';
                                }
                                output += returnTypes;
                                output += ';\n';
                                hasReturnValue = true;
                            }
                        });
                        if (!hasReturnValue) {
                            output += ');\n';
                        }
                    } else {
                        //console.log('\nWARNING: Unsupported type "' + tagType + '"!\n');
                    }
                }
            }
        }
    });
    closeContext();
    return output;
}

function getTypes(types) {
    let typesString = '';
    types.map((typeName, t)=>{
        if (typeof typeName !== 'string') {
            typeName = JSON.stringify(typeName);
        }
        if (typeName.substring(0, 15) === 'Array.<Object.<') {
            // key/value dictionary type
            const map = typeName.substring(15, typeName.length - 2).split(',');
            typeName = '{ [k: '+map[0]+']: '+ map[1].trim() +' }';
        } else if (typeName.substring(0, 6) === 'Array.') {
            // array
            typeName = typeName.substring(7, typeName.length - 1) + '[]';
        }
        typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        typesString += typeName + (t < types.length - 1 ? ' | ' : '');
    });
    return typesString;
}

function getName(d) {
    let name = d.name;
    if (d.optional) {
        name = name.replace('[', '').replace(']', '') + '?';
    }
    return name;
}
function indentTab(n) {
    return '    ';
}

module.exports = {
    build: build
};
