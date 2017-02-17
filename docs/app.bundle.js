zuix.bundle([{"componentId":"ui\u002Fusability\u002Fcontent_path","view":"\u003Csection data-ui-field=\"page-usage\" data-ui-lazyload=\"scroll\" class=\"zuix-css-ignore\"\u003E\n                \u003Cdiv layout=\"column top-center\" self=\"size-x1\" class=\"page-content\"\u003E\n                    \u003C!-- Your content goes here --\u003E\n                    \u003Cdiv self=\"size-larger top-center\" class=\"section-content mdl-shadow--8dp\"\u003E\n\n                        \u003C!-- include content from local resource --\u003E\n                        \u003Cdiv data-ui-include=\"content\u002Fget_started\" data-ui-priority=\"2\" data-ui-options=\"main.options.content\" class=\"progressive-content-container\" style=\"visibility: hidden;\"\u003E\u003C\u002Fdiv\u003E\n\n                    \u003C\u002Fdiv\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fsection\u003E","css":null,"controller":function (cp) {
    var currentTitle = '', currentPos = 0;
    var offset = 200, items = [], title = null;
    var timeout = null;

    cp.create = function () {
        title = zuix.$(cp.options().target);
        cp.view().on('scroll', function (e) {
            postUpdate();
        });
        cp.expose('update', function () {
            title.attr('title', '');
            currentPos = 0;
            postUpdate();
        });
    };

    function postUpdate() {
        if (timeout != null)
            clearTimeout(timeout);
        timeout = setTimeout(update, 100);
    }

    function update() {
        var direction = '', top = 0;
        currentTitle = '';
        items = cp.view().find(cp.options().tags);
        items.each(function (k, v) {
            var p = this.position();
            if (p.y < offset) {
                top = this.get().offsetTop;
                currentTitle = this.html().replace(/<i.*>.*<\/i>/g, '');
            }
        });
        if (currentTitle != null) {
            if (title.attr('title') != currentTitle) {
                title.attr('title', currentTitle);
                if (currentPos != 0) {
                    if (currentPos > top)
                        direction = 'Down';
                    else
                        direction = 'Up';
                }
                currentPos = top;
                title.animateCss('fadeOut'+direction, { duration: '0.2s' }, function () {
                    this.html(currentTitle)
                        .animateCss('fadeIn'+direction, { duration: '0.2s' });
                });
            }
        }
    }

}},{"componentId":"ui\u002Fwidgets\u002Fzuix_hackbox","view":"\u003Cdiv data-ui-field=\"toolbox\" layout=\"columns spread-stretch\" class=\"toolbox mdl-shadow--24dp\"\u003E\n    \u003Cdiv class=\"header\" layout=\"row center-justify\"\u003E\n        \u003Cdiv class=\"logo\"\u003E\n            \u003Cspan\u003Ez\u003C\u002Fspan\u003E\u003Cstrong\u003EUI\u003C\u002Fstrong\u003E\u003Cspan\u003Ex\u003C\u002Fspan\u003E\n            hack box\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv self=\"size-x1\" align=\"right\"\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"fragment-log\" self=\"size-x1\" layout=\"column stretch\" class=\"log-box mdl-shadow--16dp\"\u003E\n        \u003Cdiv data-ui-field=\"debug-log\"\u003E\u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"fragment-bundle\" self=\"size-x1\" layout=\"columns top-center\" class=\"bundle-box mdl-color-text--lime-400 content-padding\"\u003E\n        \u003Ch6\u003EBundle\u003C\u002Fh6\u003E\n        \u003Cp\u003E\n            This will pack all components (html, css, js) into a single \u003Cstrong\u003Eapp.bundle.js\u003C\u002Fstrong\u003E file.\n            \u003Cbr\u003E\n            Using a single app bundle will speed up loading when ready for\n            \u003Cbr\u003E\n            production. Include the generated file right after the \u003Cu\u003Ezuix.min.js\u003C\u002Fu\u003E script.\n        \u003C\u002Fp\u003E\n        \u003Cdiv data-ui-field=\"bundle-progress\" self=\"size-1of3\" class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate is-upgraded\" data-upgraded=\",MaterialProgress\"\u003E\u003Cdiv class=\"progressbar bar bar1\" style=\"width: 0%;\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"bufferbar bar bar2\" style=\"width: 100%;\"\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"auxbar bar bar3\" style=\"width: 0%;\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\n        \u003Cdiv align=\"center\"\u003E\n            \u003Ca data-ui-field=\"button-generate\" class=\"mdl-button mdl-js-button mdl-button--raised mdl-color-text--lime-400\" data-upgraded=\",MaterialButton\"\u003EGenerate app.bundle.js\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv class=\"footer\" layout=\"row center-justify\"\u003E\n        \u003Ca data-ui-field=\"button-hide\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\" data-upgraded=\",MaterialButton,MaterialRipple\"\u003E\n            \u003Ci class=\"material-icons\"\u003Echevron_left\u003C\u002Fi\u003E\n        \u003Cspan class=\"mdl-button__ripple-container\"\u003E\u003Cspan class=\"mdl-ripple\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\n        \u003Cdiv self=\"size-x1\"\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Ca data-ui-field=\"button-log\" class=\"mdl-button mdl-js-button\" data-upgraded=\",MaterialButton\"\u003ELog\u003C\u002Fa\u003E\n        \u003Ca data-ui-field=\"button-bundle\" class=\"mdl-button mdl-js-button\" data-upgraded=\",MaterialButton\"\u003EBundle\u003C\u002Fa\u003E\n        \u003Ci data-ui-field=\"components\" class=\"material-icons mdl-color-text--blue-900 mdl-badge mdl-badge--overlap\" data-badge=\"..\"\u003E\n            extension\n        \u003C\u002Fi\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-field=\"log-overlay\" class=\"log-overlay\"\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-field=\"fab-menu\" class=\"fab-menu\"\u003E\n    \u003Ca data-ui-field=\"components\" class=\"mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-color--yellow-A400 mdl-js-ripple-effect mdl-shadow--24dp mdl-badge mdl-badge--overlap\" data-badge=\"..\" data-upgraded=\",MaterialButton,MaterialRipple\"\u003E\n        \u003Ci class=\"material-icons mdl-color-text--blue-900\"\u003Eextension\u003C\u002Fi\u003E\n    \u003Cspan class=\"mdl-button__ripple-container\"\u003E\u003Cspan class=\"mdl-ripple\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\n\u003C\u002Fdiv\u003E\n","css":"code {\n    padding-left: 8px;\n}\n.header {\n    padding: 4px 8px 4px 4px;\n    border: solid 1px rgba(150,150,150,0.5);\n    background-color: rgba(230,230,255,0.95);\n}\n.header .logo {\n    margin-left: 8px;\n}\n.footer {\n    padding: 8px 24px 8px 0;\n    border: solid 1px rgba(150,150,150,0.5);\n    background-color: rgba(230,230,255,0.95);\n    z-index: 1;\n}\n.log-box {\n    border: solid 1px rgba(150,150,150,0.5);\n    padding: 8px;\n    overflow: hidden;\n    overflow-y: auto;\n    color: greenyellow;\n}\n.bundle-box {\n    border: solid 1px rgba(150,150,150,0.5);\n    padding: 8px;\n    overflow: hidden;\n    overflow-y: auto;\n    color: greenyellow;\n}\n.log-row {\n    color: white;\n    vertical-align: middle;\n    line-height: 200%;\n    margin-bottom: 1px;\n}\n.log-row.linked {\n    cursor: pointer;\n}\n.log-row:hover {\n    background-color: rgba(150,150,150,0.4);\n}\n.log-row .level {\n    width: 30px;\n    text-align: right;\n    padding-right: 12px;\n    margin-left: 8px;\n}\n.log-row .odd {\n    color: yellow;\n}\n.log-row.error { }\n.log-row.warn { }\n.log-row.info { background-color: rgba(150,255,100,0.2); }\n.log-row.debug { }\n.log-row.trace { }\n.log-row .level.error { background-color: rgba(255,0,0,0.5)}\n.log-row .level.warn { background-color: rgba(255,255,0,0.5)}\n.log-row .level.info { background-color: rgba(255,255,255,0.5)}\n.log-row .level.debug { background-color: rgba(100,50,250,0.5)}\n.log-row .level.trace { background-color: rgba(40,140,0,0.5)}\n\ndiv[data-ui-field=debug-log] {\n    color: white;\n    font-size:70%;\n    font-family: monospace;\n    text-align: left;\n}\na[data-ui-field=\"components\"] {\n    overflow: visible;\n}\n.fab-menu {\n    position: absolute;\n    bottom: -24px;\n    left: -24px;\n    padding: 8px;\n}\n.toolbox {\n    height: 100%;\n    background-color: rgba(0,0,0,0.9);\n    overflow: hidden;\n}\n.is-active {\n    border-top: 4px solid ;\n    color: rgba(255,0,100,0.8);\n    transform: translate(0,-4px);\n}\n","controller":function (cp) {
    var toolbox = null;
    var timeout = null;
    var logCache = [];

    var bundleBox = null, logBox = null;
    var logOverlay = null, fab = null, hide = null;

    cp.create = function () {
        // the main toolbox fragment
        toolbox = cp.field('toolbox').hide();
        // the bundle fragment
        bundleBox = cp.field('fragment-bundle').hide();
        // the debug log fragment
        logBox = cp.field('fragment-log').show();
        // the fab button
        fab = cp.field('fab-menu');
        fab.on('click', showToolbox);
        // the hide button
        hide = cp.field('button-hide')
            .on('click', hideToolbox);
        // move overlay to the document root
        logOverlay = cp.field('log-overlay');
        logOverlay.css({
            overflow: 'hidden',
            position: 'absolute',
            left: 0, top: 0, bottom: 0, right: 0
        });
        document.body.appendChild(logOverlay.get());
        // event listeners
        cp.field('button-bundle').on('click', showBundle);
        cp.field('button-log').on('click', showLog);
        cp.field('button-generate').on('click', generateBundle);
        // hide the toolbox at startup
        showLog(false);
        hideToolbox(false);
        // init
        initialize();
        cp.expose('saveBundle', saveBundle);
    };

    function showBundle() {
        logBox.hide();
        cp.field('button-log').removeClass('is-active');
        bundleBox.show().animateCss('fadeInRight', { duration: '0.5s' });
        cp.field('button-bundle').addClass('is-active');
    }

    function showLog(animate) {
        bundleBox.hide();
        cp.field('button-bundle').removeClass('is-active');
        logBox.show();
        if (animate) logBox
            .animateCss('fadeInLeft', { duration: '0.5s' });
        cp.field('button-log').addClass('is-active');
    }

    function generateBundle() {
        cp.field('bundle-progress').show();
        cp.field('button-generate').hide();
        // build app bundle
        zuix.bundle(true, function () {
            cp.field('bundle-progress').hide();
            cp.field('button-generate').show();
            saveBundle();
        });
    }

    function showToolbox() {
        cp.view().css('width', '');
        cp.view().css('height', '');
        toolbox.animateCss('fadeInUp').show();
        fab.animateCss('fadeOutLeft', function () {
            this.hide();
            // scroll to last log item
            var entries = cp.field('debug-log').children();
            if (entries.length() > 0)
                entries.eq(entries.length()-1)
                    .get()
                    .scrollIntoView({block: "end", behavior: "smooth"});
        });
    }

    function hideToolbox(animate) {
        var hide = function () {
            toolbox.hide();
            cp.view().css('width', '0');
            cp.view().css('height', '64px');
        };
        if (animate)
            toolbox.animateCss('fadeOutDown', function () {
                hide();
            });
        else hide();
        fab.animateCss('fadeInLeft').show();
    }

    function initialize() {
        zuix.monitor = function (level, args) {
            if (level.toLowerCase() == 'trace')
                return;
            logCache.push({ level: level, args: args });
            if (timeout != null)
                clearTimeout(timeout);
            timeout = setTimeout(update, 100);
        };
        cp.field('bundle-progress').hide();
    }

    function update() {
        var log  = logCache;
        logCache = [];

        if (log.length > 0)
            cp.field('components')
                .animateCss('tada', function () {
                    this.attr('data-badge', zuix.bundle().length);
                });
        else return;

        for (var i = 0; i < log.length; i++) {

            var level = log[i].level;
            var args = log[i].args;

            var row = '<div layout="row top-spread">';
            zuix.$.each(args, function (index, item) {
                if (typeof item !== 'string' && typeof item !== 'number')
                    item = '[object]'; //JSON.stringify(item);
                var options = '';
                if (index == 0) options = 'sm-hide size-x1';
                var alternateColor = '';
                if (index % 2 == 1)
                    alternateColor = 'odd';
                row += '<div self="'+options+'" class="' + alternateColor + '"><code>' + item + '</code></div>';
            });
            row += '<div class="level ' + level.toLowerCase() + '">' + level.substring(0, 1) + '</div>';
            row += '<div><code>' + (new Date().toISOString().substring(11).replace('Z', '')) + '</code></div>';
            row += '</div>';
            var el = zuix.$(document.createElement('div'))
                .addClass('log-row '+level.toLowerCase())
                .html(row);
            if (args[1] === 'component:loaded') {
                var view = zuix.$(zuix.context(args[2]).view());
                (function(el, view) {
                    el.on('mouseover', function () {
                        highlight(view, true);
                    }).on('mouseout', function () {
                        highlight(view, false);
                    }).on('click', function () {
                        view.get().scrollIntoView({block: "end", behavior: "smooth"});
                        highlight(view, false);
                        setTimeout(function () {
                            highlight(view, true);
                        }, 500);
                    }).addClass('linked');
                })(el, view);
            }
            cp.field('debug-log').append(el.get());
            if (i == log.length -1)
                el.get().scrollIntoView({block: "end", behavior: "smooth"});
        }
    }

    function highlight(view, enable) {
        if (enable) {
            var p = view.position();
            if (!p.visible) return;
            var boxElement = document.createElement('div');
            zuix.$(boxElement).css({
                'left': p.x + 'px',
                'top': p.y + 'px',
                'width': view.get().offsetWidth + 'px',
                'height': view.get().offsetHeight + 'px',
                'position': 'absolute',
                'border': 'solid 4px rgba(255,0,100,0.8)',
                'padding': '2px',
                'z-index': 900,
                'background-color': 'rgba(255,255,0,0.3)'
            }).animateCss('flash', {duration: '0.25s'/*, 'iteration-count': '3'*/});
            view.get().hackBoxRef = boxElement;
            logOverlay.append(boxElement);
        } else if (view.get().hackBoxRef) {
            logOverlay.get().removeChild(view.get().hackBoxRef);
            view.get().hackBoxRef = null;
            delete view.get().hackBoxRef;
        }
    }

    function saveBundle() {

        var isRegExp = function (re) {
            return Object.prototype.toString.call(re) === '[object RegExp]';
        };

        // FileSaver polyfill:
        //      https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.min.js
        // Generate an internal UID to make the regexp pattern harder to guess.

        var UID                 = Math.floor(Math.random() * 0x10000000000).toString(16);
        var PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R)-' + UID + '-(\\d+)__@"', 'g');

        var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
        var UNSAFE_CHARS_REGEXP   = /[<>\/\u2028\u2029]/g;

        // Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
        // Unicode char counterparts which are safe to use in JavaScript strings.
        var ESCAPED_CHARS = {
            '<'     : '\\u003C',
            '>'     : '\\u003E',
            '/'     : '\\u002F',
            '\u2028': '\\u2028',
            '\u2029': '\\u2029'
        };

        function escapeUnsafeChars(unsafeChar) {
            return ESCAPED_CHARS[unsafeChar];
        }

        var serialize = function(obj, options) {
            options || (options = {});

            // Backwards-compatability for `space` as the second argument.
            if (typeof options === 'number' || typeof options === 'string') {
                options = {space: options};
            }

            var functions = [];
            var regexps = [];

            // Returns placeholders for functions and regexps (identified by index)
            // which are later replaced by their string representation.
            function replacer(key, value) {
                if (!value) {
                    return value;
                }

                var type = typeof value;

                if (type === 'object') {
                    if (isRegExp(value)) {
                        return '@__R-' + UID + '-' + (regexps.push(value) - 1) + '__@';
                    }

                    return value;
                }

                if (type === 'function') {
                    return '@__F-' + UID + '-' + (functions.push(value) - 1) + '__@';
                }

                return value;
            }

            var str;

            // Creates a JSON string representation of the value.
            // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
            if (options.isJSON && !options.space) {
                str = JSON.stringify(obj);
            } else {
                str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
            }

            // Protects against `JSON.stringify()` returning `undefined`, by serializing
            // to the literal string: "undefined".
            if (typeof str !== 'string') {
                return String(str);
            }

            // Replace unsafe HTML and invalid JavaScript line terminator chars with
            // their safe Unicode char counterpart. This _must_ happen before the
            // regexps and functions are serialized and added back to the string.
            str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);

            if (functions.length === 0 && regexps.length === 0) {
                return str;
            }

            // Replaces all occurrences of function and regexp placeholders in the JSON
            // string with their string representations. If the original value can not
            // be found, then `undefined` is used.
            return str.replace(PLACE_HOLDER_REGEXP, function (match, type, valueIndex) {
                if (type === 'R') {
                    return regexps[valueIndex].toString();
                }

                var fn = functions[valueIndex];
                var serializedFn = fn.toString();

                if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
                    throw new TypeError('Serializing native function: ' + fn.name);
                }

                return serializedFn;
            });
        };
        var saveAs = saveAs || function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
        var bundle = serialize(zuix.bundle());
        // revert loaded status before exporting
        bundle = bundle.replace(/data-ui-loaded=\\"true\\"/g, 'data-ui-loaded=\\"false\\"');
        bundle = bundle.replace(/zuix-loaded=\\"true\\"/g, 'zuix-loaded=\\"false\\"');
        // save bundle
        var blob = new Blob(['zuix.bundle('+bundle+');'], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "app.bundle.js");
        return bundle;
    }

}},{"componentId":"content\u002Fhome","view":"\u003Cdiv data-ui-include=\"content\u002Fhome\u002Fcover\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fhome\u002Flinks\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fhome\u002Ffeatures\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Ffooter\" data-ui-options=\"main.options.content_no_md\"\u003E\u003C\u002Fdiv\u003E","css":"div {\n    font-size: 102%;\n}\np {\n    margin-bottom: 12px;\n    line-height: 140%;\n    font-weight: 200;\n}\n\n.material-icons {\n    margin-left: 8px;\n    margin-right: 8px;\n    font-size: 110%;\n    vertical-align: middle;\n}\n\ncite {\n    font-size: 60%;\n    text-wrap: avoid;\n    white-space: nowrap;\n}\n.intro {\n    margin-top: 24px;\n}\n.mdl-mini-footer, .mdl-logo {\n    background-color: rgb(255,235,59);\n    color: dimgrey;\n}\n.mdl-mini-footer a {\n    color: #545454;\n    text-decoration: none;\n}\n","controller":function (){}},{"componentId":"content\u002Fapi","view":"\u003Cp\u003E\u003Ca id=\"ZUIX_API\"\u003E\u003C\u002Fa\u003E\u003C\u002Fp\u003E\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fzuix\" data-ui-options=\"main.options.content_no_css\" data-ui-lazyload=\"false\" data-ui-loaded=\"false\" data-ui-component=\"content\u002Fapi\u002Fzuix\" style=\"visibility: hidden;\"\u003E\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fcomponent_context\" data-ui-options=\"main.options.content_no_css\" data-ui-lazyload=\"false\"\u003E\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fcontext_controller\" data-ui-options=\"main.options.content_no_css\" data-ui-lazyload=\"false\"\u003E\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fzxquery\" data-ui-options=\"main.options.content_no_css\" data-ui-lazyload=\"false\"\u003E\u003C\u002Fdiv\u003E\n\u003Cscript zuix-loaded=\"false\"\u003E\nvar api_loader_options = {\n    html: false,\n    markdown: true,\n    prism: true\n};\n\u003C\u002Fscript\u003E","css":"h3 {\n    font-weight:200;\n    margin-top: 48px;\n}\nh3 code {\n    font-weight:400;\n    font-size: 80%;\n}\n","controller":function (){}},{"componentId":"ui\u002Flayout\u002Fpaged_view","controller":function (cp) {

    cp.create = function () {
        cp.expose('setPage', setPage);
        cp.expose('getPage', getPage);
        cp.expose('getCurrent', getCurrent);
        cp.view().children().each(function (i, el) {
            el.style['position'] = 'absolute';
            el.style['top'] = '0';
            el.style['left'] = '0';
            el.style['bottom'] = '0';
            el.style['right'] = '0';
            el.style['overflow'] = 'auto';
            el.style['overflow-x'] = 'hidden';
            this.hide();
        });
        setPage(0);
    };

    cp.destroy = function () {
        cp.view().children().each(function () {
            // TODO: should restore original container styles
        });
        currentPage = -1;
    };

    // Private Members

    var currentPage = -1;

    function getPage(p) {
        var pages = cp.view().children();
        return pages.eq(p);
    }

    function getCurrent() {
        return currentPage;
    }

    function setPage(p, anchor) {
        var pages = cp.view().children();
        var oldPage = currentPage;
        if (p != currentPage) {
            currentPage = p;
            pages.eq(p).show();
            zuix.componentize();
            if (oldPage != -1) {
                pages.eq(oldPage).hide();
                cp.trigger('page:change', {
                    old: oldPage,
                    page: currentPage
                });
            }
        }
        if (!isNaN(anchor)) pages.get(p).scrollTop = anchor;
        else if (anchor != null) {
            var targetTop = pages.eq(p).find('a[id='+anchor+']')
                .position().y;
            pages.get(p).scrollTop = targetTop;
        }
    }

}},{"componentId":"content\u002Fapi\u002Fmenu","view":"\u003Cdiv style=\"position: fixed;right:32px;bottom:16px;z-index:100; height: auto;\"\u003E\n    \u003Cdiv data-ui-options=\"api_menu_options\" data-ui-load=\"site\u002Fcomponents\u002Factions_menu\" data-ui-context=\"menu_api\" class=\"content-padding\" layout=\"column center-right\"\u003E\n        \u003C!-- menu actions --\u003E\n        \u003C!-- Colored FAB button with ripple --\u003E\n        \u003Cdiv layout=\"column center-right\" class=\"options mdl-shadow--8dp\"\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EAPI\u003C\u002Fspan\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EZuix class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EContextOptions object\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Eradio_button_unchecked\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EComponentContext class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EContextController class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EZxQuery class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv class=\"menu\"\u003E\n            \u003Ca class=\"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-color--blue mdl-shadow--6dp\" data-upgraded=\",MaterialButton,MaterialRipple\"\u003E\n                \u003Ci class=\"material-icons\"\u003Etoc\u003C\u002Fi\u003E\n            \u003Cspan class=\"mdl-button__ripple-container\"\u003E\u003Cspan class=\"mdl-ripple\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript zuix-loaded=\"false\"\u003E\n    var api_menu_options = {\n        css: false,\n        html: false,\n        on: {\n            'view:create': function () {\n                this.hide();\n            },\n            'item:click': function (e, i) {\n                var p = pagedView.getPage(2);\n                switch (parseInt(i)) {\n                    case 0:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API').position().y);\n                        break;\n                    case 1:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--Zuix').position().y);\n                        break;\n                    case 2:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ContextOptions').position().y);\n                        break;\n                    case 3:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ComponentContext').position().y);\n                        break;\n                    case 4:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ContextController').position().y);\n                        break;\n                    case 5:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ZxQuery').position().y);\n                        break;\n                }\n                e.preventDefault();\n            }\n        }\n    };\n\u003C\u002Fscript\u003E\n","css":".options .menu-item {\n    padding: 16px;\n    height: 48px;\n    cursor: pointer;\n    vertical-align: middle;\n}\ndiv.options {\n    margin-bottom: 16px;\n    margin-right: -12px;\n    margin-left: 32px;\n    padding: 16px;\n    color:white;\n    background-color: rgba(60, 60, 60, 0.9);\n    font-weight: 400;\n    -webkit-border-radius: 20px;\n    -moz-border-radius: 20px;\n    border-radius: 20px;\n}\n.options .menu-item i {\n    color: white;\n}\n.menu {\n    max-width: 56px;\n}","controller":function (){}},{"componentId":"content\u002Fquick_start\u002Fmenu","view":"\u003Cdiv style=\"position: fixed;right:32px;bottom:16px;z-index:100; height: auto;\"\u003E\n    \u003Cdiv data-ui-options=\"get_started_menu_options\" data-ui-load=\"site\u002Fcomponents\u002Factions_menu\" data-ui-context=\"menu_getting_started\" class=\"content-padding zuix-css-ignore\" layout=\"column center-right\" data-ui-loaded=\"false\" style=\"visibility: hidden;\"\u003E\n        \u003C!-- menu actions --\u003E\n        \u003C!-- Colored FAB button with ripple --\u003E\n        \u003Cdiv layout=\"column center-right\" class=\"options mdl-shadow--8dp\"\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EUsage\u003C\u002Fspan\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EQuick Start Guide\u003C\u002Fspan\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EContent Management\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Edashboard\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EView Templates\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Esettings_ethernet\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EComponent Management\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Eextension\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv class=\"menu\"\u003E\n            \u003Ca class=\"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp\" data-upgraded=\",MaterialButton,MaterialRipple\"\u003E\n                \u003Ci class=\"material-icons\"\u003Etoc\u003C\u002Fi\u003E\n            \u003Cspan class=\"mdl-button__ripple-container\"\u003E\u003Cspan class=\"mdl-ripple\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript zuix-loaded=\"false\"\u003E\n    var get_started_menu_options = {\n        css: false,\n        html: false,\n        on: {\n            'view:create': function () {\n                this.hide();\n            },\n            'item:click': function (e, i) {\n                var p = pagedView.getPage(1);\n                switch (parseInt(i)) {\n                    case 0:\n                        scrollTo(p.get(), p.position().y \u002F*p.find('a[id=Getting_Started').position().y*\u002F);\n                        break;\n                    case 1:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--Quick_Start').position().y);\n                        break;\n                    case 2:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--Content_Management').position().y);\n                        break;\n                    case 3:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--View_Templates').position().y);\n                        break;\n                    case 4:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--Component_Management').position().y);\n                        break;\n                }\n                e.preventDefault();\n            }\n        }\n    };\n\n\n    \u002F\u002F TODO: move this to ZxQuery\n    function scrollTo(el, targetY) {\n        if (targetY === 0 || targetY == null)\n            return;\n        var duration = 500;\n        var scrollTop = el.scrollTop+targetY - 56;\n        var scrollOffset = el.scrollTop-scrollTop;\n        el.firstElementChild.style.transition = 'transform '+duration+'ms ease';\n        if (typeof el.firstElementChild.style.WebkitTransform !== 'undefined')\n            el.firstElementChild.style.WebkitTransform = \"translate(0, \" + (scrollOffset) + \"px)\";\n        else if (typeof el.firstElementChild.style.MozTransform !== 'undefined')\n            el.firstElementChild.style.MozTransform= \"translate(0, \" + (scrollOffset) + \"px)\";\n        else\n            el.firstElementChild.style.transform = \"translate(0, \" + (scrollOffset) + \"px)\";\n        window.setTimeout(function () {\n            \u002F\u002F TODO: should backup and restore old value\n            if (typeof el.firstElementChild.style.WebkitTransform !== 'undefined')\n                el.firstElementChild.style.WebkitTransform = \"\";\n            else if (typeof el.firstElementChild.style.MozTransform !== 'undefined')\n                el.firstElementChild.style.MozTransform= \"\";\n            else\n                el.firstElementChild.style.transform = \"\";\n            el.firstElementChild.style.transition = '';\n            el.scrollTop = scrollTop;\n        }, duration);\n\n    }\n\u003C\u002Fscript\u003E","css":".options .menu-item {\n    padding: 16px;\n    height: 48px;\n    cursor: pointer;\n    vertical-align: middle;\n}\ndiv.options {\n    margin-bottom: 16px;\n    margin-right: -12px;\n    margin-left: 32px;\n    padding: 16px;\n    color:white;\n    background-color: rgba(60, 60, 60, 0.9);\n    font-weight: 400;\n    -webkit-border-radius: 20px;\n    -moz-border-radius: 20px;\n    border-radius: 20px;\n}\n.options .menu-item i {\n    color: white;\n}\n.menu {\n    max-width: 56px;\n}","controller":function (){}},{"componentId":"content\u002Fhome\u002Fcover","view":"\u003Cdiv layout=\"column center-center\" class=\"opaqueBlocK mdl-shadow--8dp animated bounceInDown\"\u003E\n\n    \u003Cdiv self=\"size-medium top-center\"\u003E\n\n        \u003Cdiv align=\"center\"\u003E\n            \u003Ch3 layout=\"row center-center\" class=\"logo animated zoomIn\"\u003E\n                \u003Cspan\u003EZ\u003C\u002Fspan\u003E\u003Cstrong class=\"animated bounceInDown\"\u003EUI\u003C\u002Fstrong\u003E\u003Cspan\u003EX\u003C\u002Fspan\u003E\n            \u003C\u002Fh3\u003E\n            \u003Cdiv class=\"animated rubberBand\"\u003E\n                \u003Csmall class=\"mdl-color-text--grey\"\u003E\u003Ccite\u003Ethe easy shift to component-based development\u003C\u002Fcite\u003E\u003C\u002Fsmall\u003E\n            \u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n\n        \u003Cdiv class=\"intro animated fadeIn\"\u003E\n            \u003Cp\u003E\n                \u003Cspan class=\"logo-text\"\u003Ezuix\u003C\u002Fspan\u003E\u003Cstrong\u003E.js\u003C\u002Fstrong\u003E is a JavaScript library\n                for creating component-based web sites and applications.\n            \u003C\u002Fp\u003E\n            \u003Cp\u003E\n                Component-based development helps keeping application files smaller,\n                better organized and easier to mantain.\n            \u003C\u002Fp\u003E\n            \u003Cp\u003E\n                It allows reusing which improves UI consistency and also grants\n                a better user experience.\n            \u003C\u002Fp\u003E\n        \u003C\u002Fdiv\u003E\n\n    \u003C\u002Fdiv\u003E\n\n    \u003Cdiv layout=\"rows center-center\" data-ui-options=\"main.options.sharing_buttons_options\" data-ui-include=\"content\u002Fhome\u002Fsharing\" data-ui-loaded=\"false\" data-ui-component=\"content\u002Fhome\u002Fsharing\" style=\"visibility: hidden;\"\u003E\n        \u003Ca data-ui-field=\"url\" href=\"http:\u002F\u002Fzuix.it\" target=\"_blank\"\u003EZUIX Home\u003C\u002Fa\u003E\n        \u003Cp data-ui-field=\"description\"\u003EJavaScript UI content and component manager for creating sites and web apps.\u003C\u002Fp\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cscript zuix-loaded=\"false\"\u003E\n        main.options.sharing_buttons_options = {\n            ready: function () {\n                var html = this.view().innerHTML,\n                    outHtml = '',\n                    matched = 0, currentIndex = 0;\n                var tags = new RegExp(\u002F[^{}]+(?=})\u002Fg);\n                while (result = tags.exec(html)) {\n                    var value = '{'+result[0]+'}';\n                    switch (result[0]) {\n                        case 'url':\n                            matched++;\n                            value = encodeURIComponent(this.model()[result[0]].href);\n                            break;\n                        case 'description':\n                            matched++;\n                            value = encodeURIComponent(this.model()[result[0]].innerHTML);\n                            break;\n                    }\n                    outHtml += html.substr(currentIndex, result.index-currentIndex-1)+value;\n                    currentIndex = result.index+result[0].length+1;\n                }\n                if (matched \u003E 0) {\n                    outHtml += html.substr(currentIndex);\n                    this.view(outHtml);\n                }\n            }\n        };\n    \u003C\u002Fscript\u003E\n\n\u003C\u002Fdiv\u003E\n","css":".opaqueBlocK {\n    overflow: hidden;\n    background-color: rgba(16, 16, 53, 0.9);\n    color:white;\n    padding: 24px;\n    font-size: 110%;\n}\n.logo {\n    margin:0;\n    padding:0;\n    color:yellow;\n    font-size: 200%;\n}\n.logo .material-icons {\n    font-size: 90%;\n}\n.logo span {\n    font-size: 90%;\n}\n.logo-text {\n    color:yellow;\n}\np {\n    font-size: 100%;\n}\nh3 {\n    font-weight: 400;\n}\n.content-padding {\n  padding-top: 0;\n}","controller":function (){}},{"componentId":"content\u002Fhome\u002Flinks","view":"\n\u003Cdiv layout=\"column center-center\" class=\"opaqueBlocK mdl-shadow--8dp\"\u003E\n\n\n    \u003Cdiv self=\"size-large\" layout=\"rows center-spread\"\u003E\n\n        \u003Cdiv class=\"animated rubberBand\"\u003E\n            \u003Ca class=\"animated pulse mdl-button mdl-js-button mdl-js-ripple-effect\" layout=\"row center-center\" href=\"javascript:pagedView.setPage(1);\" data-upgraded=\",MaterialButton,MaterialRipple\"\u003E\n                \u003Ci class=\"material-icons mdl-color-text--grey-700\"\u003Eschool\u003C\u002Fi\u003E\n                \u003Cspan class=\"mdl-color-text--grey-700\"\u003EUsage\u003C\u002Fspan\u003E\n            \u003Cspan class=\"mdl-button__ripple-container\"\u003E\u003Cspan class=\"mdl-ripple\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n\n        \u003Cdiv class=\"animated rubberBand\"\u003E\n            \u003Ca class=\"animated pulse mdl-button mdl-js-button mdl-js-ripple-effect\" layout=\"row center-center\" href=\"javascript:pagedView.setPage(2);\" data-upgraded=\",MaterialButton,MaterialRipple\"\u003E\n                \u003Ci class=\"material-icons mdl-color-text--grey-700\"\u003Eimport_contacts\u003C\u002Fi\u003E\n                \u003Cspan class=\"mdl-color-text--grey-700\"\u003EAPI\u003C\u002Fspan\u003E\n            \u003Cspan class=\"mdl-button__ripple-container\"\u003E\u003Cspan class=\"mdl-ripple\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n\n        \u003Cdiv class=\"animated rubberBand\"\u003E\n            \u003Ca class=\"animated pulse mdl-button mdl-js-button mdl-js-ripple-effect\" layout=\"row center-center\" href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\" target=\"_blank\" data-upgraded=\",MaterialButton,MaterialRipple\"\u003E\n                \u003Ci class=\"material-icons mdl-color-text--grey-700\"\u003Ereorder\u003C\u002Fi\u003E\n                \u003Cspan class=\"mdl-color-text--grey-700\"\u003ESource\u003C\u002Fspan\u003E\n            \u003Cspan class=\"mdl-button__ripple-container\"\u003E\u003Cspan class=\"mdl-ripple\"\u003E\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E","css":".opaqueBlocK {\n    background: white;\n    color: gray;\n    font-size: 160%;\n    margin-top: 16px;\n}\n.opaqueBlocK .animated {\n    -webkit-animation-delay: 0.28s;\n    -moz-animation-delay: 0.28s;\n    -o-animation-delay: 0.28s;\n    -ms-animation-delay: 0.28s;\n}\n.opaqueBlocK div {\n    padding: 2px;\n}\n.opaqueBlocK a {\n    color:black;\n    text-decoration: none;\n    font-size: 80%;\n    padding: 32px;\n}","controller":function (){}},{"componentId":"content\u002Fhome\u002Ffeatures","view":"\u003Cdiv layout=\"column center-center\" class=\"opaqueBlocK animated bounceInUp mdl-shadow--8dp\"\u003E\n    \u003Cdiv self=\"size-xlarge center-center\" layout=\"rows top-justify\"\u003E\n        \u003Cdiv self=\"size-1of2 -sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Edashboard\u003C\u002Fi\u003E\n                    Content Manager\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cp\u003E\n                        Simplifies site structuring\n                        and management, with \u003Cstrong\u003Econtent\n                        inclusion\u003C\u002Fstrong\u003E feature, content and style\n                        files can be split and conveniently arranged.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Optimizes speed with \u003Cstrong\u003Elazy-loading\u003C\u002Fstrong\u003E feature,\n                        content will be loaded only when it actually\n                        comes into the user's screen view.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Can load content from different sites\n                        with just one HTML tag,\n                        making of \u003Cstrong\u003Ereusability\u003C\u002Fstrong\u003E a native feature.\n                    \u003C\u002Fp\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv self=\"size-1of2 -sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Esettings_ethernet\u003C\u002Fi\u003E\n                    Template Engine\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cp\u003E\n                        Turns any HTML snippet into a template.\n                        Template \u003Cstrong\u003Epreview is immediate\u003C\u002Fstrong\u003E and\n                        truly matching, NO custom tags\n                        or \u003Cem\u003Emustaches\u003C\u002Fem\u003E needed.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Maps data model's fields to view elements either automatically or\n                        by using custom \u003Cstrong\u003Ebinding-adapters\u003C\u002Fstrong\u003E, with\n                        full control over model-view transformation process.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Prevents style attributes redundancy hell with\n                        \u003Cstrong\u003EScoped CSS\u003C\u002Fstrong\u003E files.\n                    \u003C\u002Fp\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv self=\"size-xlarge center-center\" layout=\"rows top-justify\"\u003E\n        \u003Cdiv self=\"size-x1 sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Eextension\u003C\u002Fi\u003E\n                    Component Manager\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cp\u003E\n                        Empowers the implementation of\n                        \u003Cstrong\u003Eagnostic component logic\u003C\u002Fstrong\u003E\n                        for creating components that can stick to any\n                        UI-framework and easily upgrade at any time.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Enables running of multiple components\n                        on the same UI view with \u003Cstrong\u003Ecomponents\n                        overlapping\u003C\u002Fstrong\u003E feature.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Introduces a new way of app theming with\n                        instant \u003Cstrong\u003Eview switching\u003C\u002Fstrong\u003E, that allow\n                        replacing of the component's view template\n                        at any time.\n                    \u003C\u002Fp\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv self=\"size-x1 sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Eplaylist_add_check\u003C\u002Fi\u003E\n                    Other features\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cstrong\u003EZUIX\u003C\u002Fstrong\u003E is a lightweight library,\n                    though still giving a full feature set.\n                    \u003Cul\u003E\n                        \u003Cli\u003EEvents, Behaviors and Hooks\u003C\u002Fli\u003E\n                        \u003Cli\u003EComponents and fields caching\u003C\u002Fli\u003E\n                        \u003Cli\u003EAutomatic events unbinding\u003C\u002Fli\u003E\n                        \u003Cli\u003EIntegrated resources loader\u003C\u002Fli\u003E\n                        \u003Cli\u003EIntegrated jQuery-like DOM helper\u003C\u002Fli\u003E\n                        \u003Cli\u003ELocalization \u003Csmall\u003E(WIP v0.5.0)\u003C\u002Fsmall\u003E\u003C\u002Fli\u003E\n                    \u003C\u002Ful\u003E\n                \u003C\u002Fdiv\u003E\n                \u003Ca data-ui-field=\"link\"\u003E\u003C\u002Fa\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n","css":".opaqueBlocK {\n    background-color: rgba(27, 106, 185, 0.9);\n    font-size: 90%;\n    margin-top: 16px;\n    margin-bottom: 16px;\n    overflow: hidden;\n}\np {\n    margin-bottom: 28px;\n    font-weight: 400;\n}\nul li {\n    list-style: disc;\n}\n.mdl-card {\n    padding: 16px;\n}\n.mdl-card__title {\n    color:yellow;\n    padding: 0;\n    text-wrap: avoid;\n    white-space: nowrap;\n    vertical-align: middle;\n    margin-bottom: 24px;\n}\n.mdl-card__title .material-icons {\n    color: white;\n}\n.mdl-card__title-text {\n    width: 100%;\n    font-weight: bold;\n    font-size: 140%;\n}\n.mdl-card__supporting-text {\n    font-family: 'Dosis', sans-serif;\n    color:white;\n    padding: 0;\n    padding-left: 48px;\n    padding-right: 32px;\n    font-weight: 400;\n    width: 100%;\n    font-size: 100%;\n    line-height: 180%;\n}\n","controller":function (){}},{"componentId":"content\u002Ffooter","view":"\u003Cfooter class=\"mdl-mini-footer mdl-color--yellow-400\"\u003E\n    \u003Cdiv self=\"top-left\" class=\"mdl-mini-footer__left-section\"\u003E\n        \u003Cspan\u003EZ\u003C\u002Fspan\u003E\u003Cstrong\u003EUI\u003C\u002Fstrong\u003E\u003Cspan\u003EX\u003C\u002Fspan\u003E\n        \u003Cspan\u003E\n            ©\n            \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\" target=\"_blank\"\u003EG-Labs\u003C\u002Fa\u003E\n            2016-2017\n        \u003C\u002Fspan\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv self=\"size-x1 bottom\" layout=\"row top-right\" class=\"mdl-mini-footer__right-section\"\u003E\n        \u003Cul layout=\"rows top-right\" class=\"mdl-mini-footer__link-list\"\u003E\n            \u003Cli\u003E\n                \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\u002F\" target=\"_blank\"\u003E\n                    Contribute\n                    \u003Ci class=\"material-icons mdl-color-text--blue-200\"\u003Elink\u003C\u002Fi\u003E\n                \u003C\u002Fa\u003E\n            \u003C\u002Fli\u003E\n            \u003Cli\u003E\n                \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\u002Fissues\u002Fnew?labels=enhancement\" target=\"_blank\"\u003E\n                    Feature Request\n                    \u003Ci class=\"material-icons mdl-color-text--green-200\"\u003Eadd_circle_outline\u003C\u002Fi\u003E\n                \u003C\u002Fa\u003E\n            \u003C\u002Fli\u003E\n            \u003Cli\u003E\n                \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\u002Fissues\u002Fnew?labels=bug\" target=\"_blank\"\u003E\n                    Bug Report\n                    \u003Ci class=\"material-icons mdl-color-text--red-200\"\u003Ebug_report\u003C\u002Fi\u003E\n                \u003C\u002Fa\u003E\n            \u003C\u002Fli\u003E\n        \u003C\u002Ful\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Ffooter\u003E","css":".mdl-mini-footer__right-section {\n    padding: 8px 8px 16px;\n    font-size: 80%;\n}\n.mdl-mini-footer__left-section {\n    padding: 8px 8px 16px;\n    font-size:80%;\n}\n.mdl-mini-footer {\n    padding-bottom: 16px;\n}","controller":function (){}},{"componentId":"content\u002Fapi\u002Fzuix","view":"\u003Cp\u003E\u003Ca id=\"ZUIX_API--Zuix\"\u003E\u003C\u002Fa\u003E\u003C\u002Fp\u003E\n\u003Ch3 id=\"zuixclass\"\u003E\u003Ccode class=\" language-javascript\"\u003EZuix\u003C\u002Fcode\u003E class\u003C\u002Fh3\u003E\n\u003Cp\u003EIs the main \u003Cem\u003EZUIX\u003C\u002Fem\u003E class\nwhich is exposed as a the global object \u003Ccode class=\" language-javascript\"\u003Ezuix\u003C\u002Fcode\u003E.\u003C\u002Fp\u003E\n\u003Ch4 id=\"methods\"\u003EMethods\u003C\u002Fh4\u003E\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\" data-ui-options=\"api_loader_options\" data-ui-api=\"Zuix\" class=\"api-dox\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active is-upgraded\" data-upgraded=\",MaterialSpinner\"\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-1\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-2\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-3\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-4\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EZuix\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E","css":null,"controller":function (){}},{"componentId":"content\u002Fapi\u002Fcomponent_context","view":"\u003Cp\u003E\u003Ca id=\"ZUIX_API--ContextOptions\"\u003E\u003C\u002Fa\u003E\u003C\u002Fp\u003E\n\u003Ch3 id=\"contextoptionsobject\"\u003E\u003Ccode class=\" language-javascript\"\u003EContextOptions\u003C\u002Fcode\u003E object\u003C\u002Fh3\u003E\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\" data-ui-options=\"api_loader_options\" data-ui-api=\"ContextOptions\" class=\"api-dox\" style=\"visibility: hidden;\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active is-upgraded\" data-upgraded=\",MaterialSpinner\"\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-1\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-2\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-3\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-4\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EContextOptions\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E\u003Ca id=\"ZUIX_API--ComponentContext\"\u003E\u003C\u002Fa\u003E\u003C\u002Fp\u003E\n\u003Ch3 id=\"componentcontextclass\"\u003E\u003Ccode class=\" language-javascript\"\u003EComponentContext\u003C\u002Fcode\u003E class\u003C\u002Fh3\u003E\n\u003Cp\u003EThis is the class that holds all objects and data of a component\ninstance, hence represent a component instance itself.\u003C\u002Fp\u003E\n\u003Cp\u003EA reference to a component can be obtained in two ways:\u003C\u002Fp\u003E\n\u003Cpre class=\" language-javascript code-toolbar\"\u003E\u003Ccode class=\" language-javascript\"\u003E\u003Cspan class=\"token comment\" spellcheck=\"true\"\u003E\u002F\u002F get component context as return value of the ```zuix.load(...)``` command\u003C\u002Fspan\u003E\n\u003Cspan class=\"token keyword\"\u003Evar\u003C\u002Fspan\u003E ctx \u003Cspan class=\"token operator\"\u003E=\u003C\u002Fspan\u003E zuix\u003Cspan class=\"token punctuation\"\u003E.\u003C\u002Fspan\u003E\u003Cspan class=\"token function\"\u003Eload\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E(\u003C\u002Fspan\u003E \u003Cspan class=\"token operator\"\u003E...\u003C\u002Fspan\u003E \u003Cspan class=\"token punctuation\"\u003E)\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E;\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003Cdiv class=\"toolbar\"\u003E\u003Cdiv class=\"toolbar-item\"\u003E\u003Ca\u003ECopy\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eor\u003C\u002Fp\u003E\n\u003Cpre class=\" language-html code-toolbar\"\u003E\u003Ccode class=\"html language-javascript language-html\"\u003E\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token punctuation\"\u003E&lt;\u003C\u002Fspan\u003Ediv\u003C\u002Fspan\u003E \u003Cspan class=\"token attr-name\"\u003Edata-ui-load\u003C\u002Fspan\u003E\u003Cspan class=\"token attr-value\"\u003E\u003Cspan class=\"token punctuation\"\u003E=\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E\"\u003C\u002Fspan\u003Epath\u002Fto\u002Fcomponent_name\u003Cspan class=\"token punctuation\"\u003E\"\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\n     \u003Cspan class=\"token attr-name\"\u003Edata-ui-context\u003C\u002Fspan\u003E\u003Cspan class=\"token attr-value\"\u003E\u003Cspan class=\"token punctuation\"\u003E=\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E\"\u003C\u002Fspan\u003Emy-context-id\u003Cspan class=\"token punctuation\"\u003E\"\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E&gt;\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003Cspan class=\"token comment\" spellcheck=\"true\"\u003E&lt;!-- ... --&gt;\u003C\u002Fspan\u003E\n\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token punctuation\"\u003E&lt;\u002F\u003C\u002Fspan\u003Ediv\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E&gt;\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\n\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token punctuation\"\u003E&lt;\u003C\u002Fspan\u003Escript\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E&gt;\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003Cspan class=\"token script language-javascript\"\u003E\n\u003Cspan class=\"token comment\" spellcheck=\"true\"\u003E\u002F\u002F get component instance starting from it's view or container element\u003C\u002Fspan\u003E\n\u003Cspan class=\"token keyword\"\u003Evar\u003C\u002Fspan\u003E ctx \u003Cspan class=\"token operator\"\u003E=\u003C\u002Fspan\u003E zuix\u003Cspan class=\"token punctuation\"\u003E.\u003C\u002Fspan\u003E\u003Cspan class=\"token function\"\u003Econtext\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E(\u003C\u002Fspan\u003E\u003Cspan class=\"token string\"\u003E'my-context-id'\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E)\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E;\u003C\u002Fspan\u003E\n\u003C\u002Fspan\u003E\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token tag\"\u003E\u003Cspan class=\"token punctuation\"\u003E&lt;\u002F\u003C\u002Fspan\u003Escript\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E&gt;\u003C\u002Fspan\u003E\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003Cdiv class=\"toolbar\"\u003E\u003Cdiv class=\"toolbar-item\"\u003E\u003Ca\u003ECopy\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fpre\u003E\n\u003Ch4 id=\"methods\"\u003EMethods\u003C\u002Fh4\u003E\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\" data-ui-options=\"api_loader_options\" data-ui-api=\"ComponentContext\" class=\"api-dox\" style=\"visibility: hidden;\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n    \u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active is-upgraded\" data-upgraded=\",MaterialSpinner\"\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-1\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-2\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-3\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-4\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\n    \u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EComponentContext\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003C\u002Fp\u003E\u003C\u002Fdiv\u003E\u003Cp\u003E\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E","css":null,"controller":function (){}},{"componentId":"content\u002Fapi\u002Fcontext_controller","view":"\u003Cp\u003E\u003Ca id=\"ZUIX_API--ContextController\"\u003E\u003C\u002Fa\u003E\u003C\u002Fp\u003E\n\u003Ch3 id=\"contextcontrollerclass\"\u003E\u003Ccode class=\" language-javascript\"\u003EContextController\u003C\u002Fcode\u003E class\u003C\u002Fh3\u003E\n\u003Cp\u003EInstance of this class is passed to the \u003Cem\u003Econtext controller handler\u003C\u002Fem\u003E\nand allow accessing and controlling the component's view, events\nand all other aspect of it from inside the controller JavaScript code.\u003C\u002Fp\u003E\n\u003Ch4 id=\"methods\"\u003EMethods\u003C\u002Fh4\u003E\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\" data-ui-options=\"api_loader_options\" data-ui-api=\"ContextController\" class=\"api-dox\" style=\"visibility: hidden;\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active is-upgraded\" data-upgraded=\",MaterialSpinner\"\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-1\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-2\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-3\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-4\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EContextController\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E","css":null,"controller":function (){}},{"componentId":"site\u002Fcomponents\u002Factions_menu","controller":function (cp) {
    var toolbar, fab, actions;
    var open = false; // initial state

    cp.create = function () {

        cp.expose('showMenu', showMenu);
        cp.expose('hideMenu', hideMenu);

        // toolbar view
        toolbar = cp.view();
        toolbar.css('overflow', 'hidden');
        // fab button
        // fab button
        fab = toolbar.find('.menu');
        fab.on('click', function () {
            toolbarToggle();
        });
        // actions buttons
        actions = toolbar.find('.options')
            .css('overflow', 'hidden')
            .hide()
            .children();
        actions.each(function (index, item) {
            this.on('click', function () {
                toolbarToggle();
                cp.trigger('item:click', index);
            });
        });

    };

    cp.destroy = function () {

        actions.each(function (i, item) {
            this.off('click');
        });

    };

    // Private Members

    function showMenu() {
        cp.view().show().animateCss('flipInY', { delay: '0.5s' });
    }
    function hideMenu() {
        if (open) toolbarToggle();
        fab.animateCss('flipOutY', function () {
            if (!cp.view().hasClass('animated'))
                cp.view().hide()
        });
    }

    function toolbarToggle() {
        var duration = 0.5;
        open = !open;
        if (open)
            toolbar.find('.options').show().animateCss('bounceInUp', { duration: duration+'s' }, function () {
                open = true;
            });
        else
            toolbar.find('.options').animateCss('bounceOutDown', { duration: duration+'s' }, function () {
                toolbar.find('.options').hide();
                open = false;
            });
        fab.animateCss('rubberBand', { duration: duration+'s' });
    }

}},{"componentId":"content\u002Fhome\u002Fsharing","controller":function (){},"css":".resp-sharing-button__link,\n.resp-sharing-button__icon {\n    display: inline-block\n}\n\n.resp-sharing-button__link {\n    text-decoration: none;\n    color: #fff;\n    margin-left: 0.4em;\n    margin-right: 0.4em;\n}\n\n.resp-sharing-button {\n    border-radius: 5px;\n    transition: 25ms ease-out;\n    padding: 4px;\n    font-family: Helvetica Neue,Helvetica,Arial,sans-serif\n}\n\n.resp-sharing-button__icon svg {\n    width: 1em;\n    height: 1em;\n    margin-right: 0.4em;\n    vertical-align: top\n}\n\n.resp-sharing-button--small svg {\n    margin: 0;\n    vertical-align: middle\n}\n\n\u002F* Non solid icons get a stroke *\u002F\n.resp-sharing-button__icon {\n    stroke: #facace;\n    fill: white;\n}\n\n\u002F* Solid icons get a fill *\u002F\n.resp-sharing-button__icon--solid,\n.resp-sharing-button__icon--solidcircle {\n    fill: #fff;\n    stroke: none\n}\n\n.resp-sharing-button--facebook {\n    background-color: #3b5998;\n    -webkit-animation-delay: 0.7s;\n    -moz-animation-delay: 0.7s;\n    -o-animation-delay: 0.7s;\n    -ms-animation-delay: 0.7s;\n}\n\n.resp-sharing-button--facebook:hover {\n    background-color: #2d4373\n}\n\n.resp-sharing-button--twitter {\n    background-color: #55acee;\n    -webkit-animation-delay: 0.8s;\n    -moz-animation-delay: 0.8s;\n    -o-animation-delay: 0.8s;\n    -ms-animation-delay: 0.8s;\n}\n\n.resp-sharing-button--twitter:hover {\n    background-color: #2795e9\n}\n\n.resp-sharing-button--google {\n    background-color: #dd4b39;\n    -webkit-animation-delay: 0.9s;\n    -moz-animation-delay: 0.9s;\n    -o-animation-delay: 0.9s;\n    -ms-animation-delay: 0.9s;\n}\n\n.resp-sharing-button--google:hover {\n    background-color: #c23321\n}\n\n.resp-sharing-button--tumblr {\n    background-color: #35465C;\n    -webkit-animation-delay: 1.0s;\n    -moz-animation-delay: 1.0s;\n    -o-animation-delay: 1.0s;\n    -ms-animation-delay: 1.0s;\n}\n\n.resp-sharing-button--tumblr:hover {\n    background-color: #222d3c\n}\n\n.resp-sharing-button--pinterest {\n    background-color: #bd081c;\n    -webkit-animation-delay: 1.1s;\n    -moz-animation-delay: 1.1s;\n    -o-animation-delay: 1.1s;\n    -ms-animation-delay: 1.1s;\n}\n\n.resp-sharing-button--pinterest:hover {\n    background-color: #8c0615\n}\n\n.resp-sharing-button--reddit {\n    background-color: #5f99cf\n}\n\n.resp-sharing-button--reddit:hover {\n    background-color: #3a80c1\n}\n\n.resp-sharing-button--linkedin {\n    background-color: #0077b5\n}\n\n.resp-sharing-button--linkedin:hover {\n    background-color: #046293\n}\n\n.resp-sharing-button--email {\n    background-color: #777\n}\n\n.resp-sharing-button--email:hover {\n    background-color: #5e5e5e\n}\n\n.resp-sharing-button--xing {\n    background-color: #1a7576\n}\n\n.resp-sharing-button--xing:hover {\n    background-color: #114c4c\n}\n\n.resp-sharing-button--whatsapp {\n    background-color: #25D366\n}\n\n.resp-sharing-button--whatsapp:hover {\n    background-color: #1da851\n}\n\n.resp-sharing-button--hackernews {\n    background-color: #FF6600\n}\n.resp-sharing-button--hackernews:hover, .resp-sharing-button--hackernews:focus {   background-color: #FB6200 }\n\n.resp-sharing-button--vk {\n    background-color: #507299\n}\n\n.resp-sharing-button--vk:hover {\n    background-color: #43648c\n}\n\n.resp-sharing-button--facebook {\n    background-color: #3b5998;\n    border-color: #3b5998;\n}\n\n.resp-sharing-button--facebook:hover,\n.resp-sharing-button--facebook:active {\n    background-color: #2d4373;\n    border-color: #2d4373;\n}\n\n.resp-sharing-button--twitter {\n    background-color: #55acee;\n    border-color: #55acee;\n}\n\n.resp-sharing-button--twitter:hover,\n.resp-sharing-button--twitter:active {\n    background-color: #2795e9;\n    border-color: #2795e9;\n}\n\n.resp-sharing-button--google {\n    background-color: #dd4b39;\n    border-color: #dd4b39;\n}\n\n.resp-sharing-button--google:hover,\n.resp-sharing-button--google:active {\n    background-color: #c23321;\n    border-color: #c23321;\n}\n\n.resp-sharing-button--tumblr {\n    background-color: #35465C;\n    border-color: #35465C;\n}\n\n.resp-sharing-button--tumblr:hover,\n.resp-sharing-button--tumblr:active {\n    background-color: #222d3c;\n    border-color: #222d3c;\n}\n\n.resp-sharing-button--email {\n    background-color: #777777;\n    border-color: #777777;\n}\n\n.resp-sharing-button--email:hover,\n.resp-sharing-button--email:active {\n    background-color: #5e5e5e;\n    border-color: #5e5e5e;\n}\n\n.resp-sharing-button--pinterest {\n    background-color: #bd081c;\n    border-color: #bd081c;\n}\n\n.resp-sharing-button--pinterest:hover,\n.resp-sharing-button--pinterest:active {\n    background-color: #8c0615;\n    border-color: #8c0615;\n}\n\n.resp-sharing-button--linkedin {\n    background-color: #0077b5;\n    border-color: #0077b5;\n}\n\n.resp-sharing-button--linkedin:hover,\n.resp-sharing-button--linkedin:active {\n    background-color: #046293;\n    border-color: #046293;\n}\n","view":"\u003C!-- Sharingbutton Facebook --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Ffacebook.com\u002Fsharer\u002Fsharer.php?u={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton Twitter --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Ftwitter.com\u002Fintent\u002Ftweet\u002F?text={description}&amp;url={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton Google+ --\u003E\n\u003Ca class=\"resp-sharing-button__link animated pulse\" href=\"https:\u002F\u002Fplus.google.com\u002Fshare?url={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--google resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M11.37 12.93c-.73-.52-1.4-1.27-1.4-1.5 0-.43.03-.63.98-1.37 1.23-.97 1.9-2.23 1.9-3.57 0-1.22-.36-2.3-1-3.05h.5c.1 0 .2-.04.28-.1l1.36-.98c.16-.12.23-.34.17-.54-.07-.2-.25-.33-.46-.33H7.6c-.66 0-1.34.12-2 .35-2.23.76-3.78 2.66-3.78 4.6 0 2.76 2.13 4.85 5 4.9-.07.23-.1.45-.1.66 0 .43.1.83.33 1.22h-.08c-2.72 0-5.17 1.34-6.1 3.32-.25.52-.37 1.04-.37 1.56 0 .5.13.98.38 1.44.6 1.04 1.84 1.86 3.55 2.28.87.23 1.82.34 2.8.34.88 0 1.7-.1 2.5-.34 2.4-.7 3.97-2.48 3.97-4.54 0-1.97-.63-3.15-2.33-4.35zm-7.7 4.5c0-1.42 1.8-2.68 3.9-2.68h.05c.45 0 .9.07 1.3.2l.42.28c.96.66 1.6 1.1 1.77 1.8.05.16.07.33.07.5 0 1.8-1.33 2.7-3.96 2.7-1.98 0-3.54-1.23-3.54-2.8zM5.54 3.9c.33-.38.75-.58 1.23-.58h.05c1.35.05 2.64 1.55 2.88 3.35.14 1.02-.08 1.97-.6 2.55-.32.37-.74.56-1.23.56h-.03c-1.32-.04-2.63-1.6-2.87-3.4-.13-1 .08-1.92.58-2.5zM23.5 9.5h-3v-3h-2v3h-3v2h3v3h2v-3h3\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton Tumblr --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Fwww.tumblr.com\u002Fwidgets\u002Fshare\u002Ftool?posttype=link&amp;title={description}&amp;caption={description}&amp;content={url}&amp;canonicalUrl={url}&amp;shareSource=tumblr_share_button\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--tumblr resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M13.5.5v5h5v4h-5V15c0 5 3.5 4.4 6 2.8v4.4c-6.7 3.2-12 0-12-4.2V9.5h-3V6.7c1-.3 2.2-.7 3-1.3.5-.5 1-1.2 1.4-2 .3-.7.6-1.7.7-3h3.8z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton E-Mail -- \u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"mailto:?subject={description}&amp;body={url}\" target=\"_self\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--email resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa--\u003E\n\n\u003C!-- Sharingbutton Pinterest --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Fpinterest.com\u002Fpin\u002Fcreate\u002Fbutton\u002F?url={url}&amp;media={url}&amp;description={description}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--pinterest resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M12.14.5C5.86.5 2.7 5 2.7 8.75c0 2.27.86 4.3 2.7 5.05.3.12.57 0 .66-.33l.27-1.06c.1-.32.06-.44-.2-.73-.52-.62-.86-1.44-.86-2.6 0-3.33 2.5-6.32 6.5-6.32 3.55 0 5.5 2.17 5.5 5.07 0 3.8-1.7 7.02-4.2 7.02-1.37 0-2.4-1.14-2.07-2.54.4-1.68 1.16-3.48 1.16-4.7 0-1.07-.58-1.98-1.78-1.98-1.4 0-2.55 1.47-2.55 3.42 0 1.25.43 2.1.43 2.1l-1.7 7.2c-.5 2.13-.08 4.75-.04 5 .02.17.22.2.3.1.14-.18 1.82-2.26 2.4-4.33.16-.58.93-3.63.93-3.63.45.88 1.8 1.65 3.22 1.65 4.25 0 7.13-3.87 7.13-9.05C20.5 4.15 17.18.5 12.14.5z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton LinkedIn -- \u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Fwww.linkedin.com\u002FshareArticle?mini=true&amp;url={url}&amp;title={description}&amp;summary={description}&amp;source={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa--\u003E\n"},{"componentId":"content\u002Fapi\u002Fzxquery","view":"\u003Cp\u003E\u003Ca id=\"ZUIX_API--ZxQuery\"\u003E\u003C\u002Fa\u003E\u003C\u002Fp\u003E\n\u003Ch3 id=\"zxqueryclass\"\u003E\u003Ccode class=\" language-javascript\"\u003EZxQuery\u003C\u002Fcode\u003E class\u003C\u002Fh3\u003E\n\u003Cp\u003E\u003Cem\u003EZxQuery\u003C\u002Fem\u003E is a \u003Cem\u003EZUIX\u003C\u002Fem\u003E built-in class that implements a very\nlite subset of jQuery-like functionality. It can wrap elements\nin a DOM and provide useful methods for manipulating it.\u003C\u002Fp\u003E\n\u003Ch4 id=\"constructor-NaN\"\u003EConstructor\u003C\u002Fh4\u003E\n\u003Cp\u003EThe constructor takes one optional argument that can be a DOM element,\na node list or a valid DOM query selector string expression.\nIf no parameter is given, the ZxQuery will wrap the root \u003Cem\u003Edocument\u003C\u002Fem\u003E element.\u003C\u002Fp\u003E\n\u003Cpre class=\" language-javascript code-toolbar\"\u003E\u003Ccode class=\" language-javascript\"\u003E\u003Cspan class=\"token keyword\"\u003Evar\u003C\u002Fspan\u003E zxElement \u003Cspan class=\"token operator\"\u003E=\u003C\u002Fspan\u003E \u003Cspan class=\"token keyword\"\u003Enew\u003C\u002Fspan\u003E \u003Cspan class=\"token class-name\"\u003EZxQuery\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E(\u003C\u002Fspan\u003Eelement\u003Cspan class=\"token punctuation\"\u003E)\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E;\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003Cdiv class=\"toolbar\"\u003E\u003Cdiv class=\"toolbar-item\"\u003E\u003Ca\u003ECopy\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Eor\u003C\u002Fp\u003E\n\u003Cpre class=\" language-javascript code-toolbar\"\u003E\u003Ccode class=\" language-javascript\"\u003E\u003Cspan class=\"token keyword\"\u003Evar\u003C\u002Fspan\u003E zxElement \u003Cspan class=\"token operator\"\u003E=\u003C\u002Fspan\u003E zuix\u003Cspan class=\"token punctuation\"\u003E.\u003C\u002Fspan\u003E\u003Cspan class=\"token function\"\u003E$\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E(\u003C\u002Fspan\u003Eelement\u003Cspan class=\"token punctuation\"\u003E)\u003C\u002Fspan\u003E\u003Cspan class=\"token punctuation\"\u003E;\u003C\u002Fspan\u003E\u003C\u002Fcode\u003E\u003Cdiv class=\"toolbar\"\u003E\u003Cdiv class=\"toolbar-item\"\u003E\u003Ca\u003ECopy\u003C\u002Fa\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fpre\u003E\n\u003Cp\u003Ewhich is the recommended way of creating \u003Ccode class=\" language-javascript\"\u003EZxQuery\u003C\u002Fcode\u003E objects.\u003C\u002Fp\u003E\n\u003Ch4 id=\"methods\"\u003EMethods\u003C\u002Fh4\u003E\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\" data-ui-options=\"api_loader_options\" data-ui-api=\"ZxQuery\" class=\"api-dox\" style=\"visibility: hidden;\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active is-upgraded\" data-upgraded=\",MaterialSpinner\"\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-1\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-2\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-3\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__layer mdl-spinner__layer-4\"\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__left\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__gap-patch\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003Cdiv class=\"mdl-spinner__circle-clipper mdl-spinner__right\"\u003E\u003Cdiv class=\"mdl-spinner__circle\"\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EZxQuery\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C!-- prevent scroll from blocking\n this content will be replaced after loading ---\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\n\u003C\u002Fdiv\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E","css":null,"controller":function (){}},{"componentId":"ui\u002Ftemplates\u002Fmdl_card","controller":function (){},"css":".mdl-card {\n    height: 100%;\n    width: auto;\n    background: transparent;\n}\n\n.mdl-card__title-text {\n    display: block;\n}","view":"\u003Cdiv class=\"mdl-card\"\u003E\n    \u003Cdiv class=\"mdl-card__title\"\u003E\n        \u003Ch2 data-ui-field=\"title\" class=\"mdl-card__title-text\"\u003ETitle\u003C\u002Fh2\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"text\" class=\"mdl-card__supporting-text\"\u003E\n        Card text...\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n"}]);