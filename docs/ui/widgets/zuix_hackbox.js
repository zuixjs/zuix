/**
 * @license
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
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

/**
 *
 * Find more details about ZUIX here:
 *   http://zuix.it
 *   https://github.com/genielabs/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 *
 */

zuix.controller(function (cp) {
    var toolbox = null;
    var timeout = null;
    var logCache = [];

    var bundleBox = null, logBox = null;
    var logOverlay = null, fab = null, hide = null;

    var logItemController = null;

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
        hideToolbox(false);
        // init
        initialize();
        cp.expose('saveBundle', saveBundle);
    };

    function update() {
        var next = function(i, log) {
            var model = {
                index: i,
                time: log[i].time,
                level: log[i].level,
                args: log[i].args
            };
            zuix.load('ui/widgets/zuix_hackbox/log_item', {
                model: model,
                on: {
                    'item:enter': function (e, sourceView) {
                        highlight(sourceView, true);
                    },
                    'item:leave': function (e, sourceView) {
                        highlight(sourceView, false);
                    },
                    'item:click': function (e, sourceView) {
                        highlight(sourceView, false);
                        sourceView.get()
                            .scrollIntoView({
                                block: 'end',
                                behavior: 'smooth'
                            });
                        highlight(sourceView, true);
                    }
                },
                ready: function () {
                    cp.field('debug-log').append(this.view());
                    setTimeout(function() {
                        if (++i < log.length)
                            next(i, log);
                    }, 1);
                }
            });
        };
        next(0, logCache);
        logCache = [];
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

    function initialize() {
        zuix.monitor = function (level, args) {
            if (level.toLowerCase() == 'trace' || args[0].toString().indexOf('/zuix_hackbox/') > 0)
                return;
            logCache.push({
                level: level,
                args: args,
                time: (new Date().toISOString().substring(11).replace('Z', ''))
            });
            if (timeout != null)
                clearTimeout(timeout);
            timeout = setTimeout(function () {
                cp.field('components')
                    .animateCss('tada', function () {
                        this.attr('data-badge', zuix.bundle().length);
                    });
                update();
            }, 500);
        };
        cp.field('bundle-progress').hide();
    }

    function showBundle() {
        zuix.context('pagedView').setPage(1);
//        bundleBox.show().animateCss('fadeInRight', { duration: '0.5s' });
        cp.field('button-log').removeClass('is-active');
        cp.field('button-bundle').addClass('is-active');
        cp.field('component-list').html('');
        var next = function(i, list) {

            zuix.load('ui/widgets/zuix_hackbox/bundle_item', {
                model: list[i],
                on: {
                    'item:click': function (e, item) {
                        cp.log.e(item.componentId);

                        cp.field('js').html(serialize(item.controller));
                        if (item.view != null) {
                            var html = item.view
                                .replace(/\</g, "&lt;")
                                .replace(/\>/g, "&gt;")
                                .replace(/ zuix-loaded="true"/g, '');
                            cp.field('html').html(html);
                        } else {
                            cp.field('html').html('');
                        }
                        cp.field('css').html(item.css);
                        Prism.highlightElement(cp.field('js').get());
                        Prism.highlightElement(cp.field('html').get());
                        Prism.highlightElement(cp.field('css').get());

                        zuix.context('pagedView')
                            .setPage(2);
                    }
                },
                ready: function () {
                    cp.field('component-list').append(this.view());
                    setTimeout(function () {
                        if (++i < list.length)
                            next(i, list);
                    }, 1);
                }
            });

        };
        next(0, zuix.bundle());
    }

    function showLog(animate) {
        zuix.context('pagedView').setPage(0);
//        if (animate) logBox
//            .animateCss('fadeInLeft', { duration: '0.5s' });
        cp.field('button-bundle').removeClass('is-active');
        cp.field('button-log').addClass('is-active');
    }

    function showToolbox() {
        cp.view().css('width', '');
        cp.view().css('height', '');
        toolbox.animateCss('fadeInUp').show();
        fab.animateCss('fadeOutLeft', function () {
            this.hide();
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

    function saveBundle() {

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
});
