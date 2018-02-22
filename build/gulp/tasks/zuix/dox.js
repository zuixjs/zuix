var gulp = require('gulp');
var dox = require("gulp-dox");
var fs = require('fs');
var srcFolder = './src/js';
var jsonApiFolder = './_docs/content/api/data';

module.exports = function () {
    console.log('\nGenerating JSON API files from JSDoc...');
    return Promise.all([
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/Zuix.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/ComponentContext.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/ContextController.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/zuix/ComponentCache.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/helpers/ZxQuery.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        }),
        new Promise(function(resolve, reject) {
            gulp.src(srcFolder+'/localizer/Localizer.js')
                .pipe(dox({ raw: true }))
                .pipe(gulp.dest(jsonApiFolder))
                .on('end', resolve);
        })
    ]).then(function () {
        console.log('...wrote to "'+jsonApiFolder+'".');
        // Generate ZUIX TypeScript Definition file
        console.log('\nGenerating TypeScript definitions file...');
        var tsDefs = generateTypescriptDefs('Zuix');
            tsDefs += generateTypescriptDefs('ComponentContext');
            tsDefs += generateTypescriptDefs('ContextController');
            tsDefs += generateTypescriptDefs('ComponentCache');
            tsDefs += generateTypescriptDefs('ZxQuery');
            tsDefs += '\ndeclare const zuix: Zuix;\n';
        // Write TypeScript definitions to file
        var targetFolder = 'dist/ts';
        if (!fs.existsSync(targetFolder)){
            fs.mkdirSync(targetFolder);
        }
        fs.writeFileSync(targetFolder+'/zuix.d.ts', tsDefs);
        console.log('... wrote to "'+targetFolder+'" folder.\n');
    });
};

function generateTypescriptDefs(objName) {
    var json = JSON.parse(fs.readFileSync(jsonApiFolder+'/'+objName+'.json'));
    var output = ''; var contextOpen = false;

    var openContext = function(name) {
        if (!contextOpen) {
            output += 'interface ' + name + ' {\n';
            contextOpen = true;
        }
    };
    var closeContext = function () {
        if (contextOpen) {
            output += '}\n';
            contextOpen = false;
        }
    };

    for (var j = 0; j < json.length; j++){
        var obj = json[j];

        var ctx = obj.ctx;
        if (ctx != null && ctx.type === 'method' && ctx.constructor === objName) {

            openContext(objName);

            output +=  indentTab() + ctx.name + '(';
            for (var t = 0; t < obj.tags.length; t++) {
                var tag = obj.tags[t];
                if (tag.type === 'param') {

                    if (tag.name[0] === '[')
                        output += tag.name.substring(1, tag.name.length - 1)+'?: ';
                    else
                        output += tag.name+': ';
                    output += getTypes(tag.types);
                    if (t < obj.tags.length-2)
                        output += ', ';

                } else if (tag.type === 'return' || tag.type === 'returns') {

                    output += '): ';
                    var returnTypes = getTypes(tag.types);
                    if (returnTypes === '')
                        returnTypes = 'void';
                    output += returnTypes;
                    output += ';\n';

                }
            }

        } else {

            for (var key in obj) {
                var definitions = obj[key];
                if (key === 'tags' && definitions != null && definitions.length > 0) {

                    var tagType = definitions[0].type;
                    var name = definitions[0].string.replace(/{.[^}]+}\s+/ig, '');

                    if (tagType === 'typedef') {

                        closeContext();
                        output += 'interface ' + name + ' {\n';
                        for (var i = 1; i < definitions.length; i++) {
                            var d = definitions[i];
                            if (d.type === 'property') {
                                output += indentTab() + d.name + (d.optional ? '?' : '') + ': ';
                                output += getTypes(d.types);
                                output += ';\n';
                            }
                        }
                        output += '}\n';

                    } else if (tagType === 'callback') {

                        closeContext();
                        output += 'interface ' + name + ' {\n';
                        output += indentTab() + '(';
                        for (var i = 1; i < definitions.length; i++) {
                            var d = definitions[i];
                            if (d.type === 'param') {
                                output += d.name + (d.optional ? '?' : '') + ': ';
                                output += getTypes(d.types);
                                if (i < definitions.length - 2)
                                    output += ', ';
                            }
                        }
                        output += '): void;\n';
                        output += '}\n';

                    } else {

                        //console.log('\nWARNING: Unsupported type "' + objType + '"!\n');

                    }

                }
            }
        }

    }

    closeContext();

    return output;
}

function getTypes(types) {
    var typesString = '';
    for (var t = 0; t < types.length; t++) {
        var typeName = types[t];
        if (typeof typeName !== 'string')
            typeName = JSON.stringify(typeName);
        if (typeName.substring(0, 15) === 'Array.<Object.<') {
            // key/value dictionary type
            var map = typeName.substring(15, typeName.length - 2).split(',');
            typeName = '{ [k: '+map[0]+']: '+ map[1].trim() +' }';
        } else if (typeName.substring(0, 6) === 'Array.') {
            // array
            typeName = typeName.substring(7, typeName.length - 1) + '[]';
        }
        typeName = typeName.charAt(0).toUpperCase() + typeName.slice(1);
        typesString += typeName + (t < types.length - 1 ? ' | ' : '');
    }
    return typesString;
}

function indentTab(n) {
    return '    ';
}
