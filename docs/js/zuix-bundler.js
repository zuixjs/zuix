/* zUIx v1.0.25 22.03.17 16:22:18 */

var zuix;
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 460:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
var __WEBPACK_AMD_DEFINE_RESULT__;/* eslint-disable */
/*!
 * @license
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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

/**
 *
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

/* global define */



// TODO: detect whether running in a browser environment or not
(function(root, factory) {
  if (true) {
    // AMD. Register as an anonymous module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
      return (root.zuix = (factory).call(root));
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else {}
}(this, __webpack_require__(94)));


/***/ }),

/***/ 35:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.2
 * 2016-06-16 18:25:19
 *
 * By Eli Grey, http://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 */

/* eslint-disable */

/* global self */
/* jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */

/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/FileSaver.js */

var saveAs = saveAs || (function(view) {
	"use strict";
	// IE <10 is explicitly unsupported
	if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
		return;
	}
	var
		  doc = view.document
		  // only get URL when necessary in case Blob.js hasn't overridden it yet
		, get_URL = function() {
			return view.URL || view.webkitURL || view;
		}
		, save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
		, can_use_save_link = "download" in save_link
		, click = function(node) {
			var event = new MouseEvent("click");
			node.dispatchEvent(event);
		}
		, is_safari = /constructor/i.test(view.HTMLElement) || view.safari
		, is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
		, throw_outside = function(ex) {
			(view.setImmediate || view.setTimeout)(function() {
				throw ex;
			}, 0);
		}
		, force_saveable_type = "application/octet-stream"
		// the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
		, arbitrary_revoke_timeout = 1000 * 40 // in ms
		, revoke = function(file) {
			var revoker = function() {
				if (typeof file === "string") { // file is an object URL
					get_URL().revokeObjectURL(file);
				} else { // file is a File
					file.remove();
				}
			};
			setTimeout(revoker, arbitrary_revoke_timeout);
		}
		, dispatch = function(filesaver, event_types, event) {
			event_types = [].concat(event_types);
			var i = event_types.length;
			while (i--) {
				var listener = filesaver["on" + event_types[i]];
				if (typeof listener === "function") {
					try {
						listener.call(filesaver, event || filesaver);
					} catch (ex) {
						throw_outside(ex);
					}
				}
			}
		}
		, auto_bom = function(blob) {
			// prepend BOM for UTF-8 XML and text/* types (including HTML)
			// note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
			if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
				return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
			}
			return blob;
		}
		, FileSaver = function(blob, name, no_auto_bom) {
			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			// First try a.download, then web filesystem, then object URLs
			var
				  filesaver = this
				, type = blob.type
				, force = type === force_saveable_type
				, object_url
				, dispatch_all = function() {
					dispatch(filesaver, "writestart progress write writeend".split(" "));
				}
				// on any filesys errors revert to saving with object URLs
				, fs_error = function() {
					if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
						// Safari doesn't allow downloading of blob urls
						var reader = new FileReader();
						reader.onloadend = function() {
							var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
							var popup = view.open(url, '_blank');
							if(!popup) view.location.href = url;
							url=undefined; // release reference before dispatching
							filesaver.readyState = filesaver.DONE;
							dispatch_all();
						};
						reader.readAsDataURL(blob);
						filesaver.readyState = filesaver.INIT;
						return;
					}
					// don't create more object URLs than needed
					if (!object_url) {
						object_url = get_URL().createObjectURL(blob);
					}
					if (force) {
						view.location.href = object_url;
					} else {
						var opened = view.open(object_url, "_blank");
						if (!opened) {
							// Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
							view.location.href = object_url;
						}
					}
					filesaver.readyState = filesaver.DONE;
					dispatch_all();
					revoke(object_url);
				}
			;
			filesaver.readyState = filesaver.INIT;

			if (can_use_save_link) {
				object_url = get_URL().createObjectURL(blob);
				setTimeout(function() {
					save_link.href = object_url;
					save_link.download = name;
					click(save_link);
					dispatch_all();
					revoke(object_url);
					filesaver.readyState = filesaver.DONE;
				});
				return;
			}

			fs_error();
		}
		, FS_proto = FileSaver.prototype
		, saveAs = function(blob, name, no_auto_bom) {
			return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
		}
	;
	// IE 10+ (native saveAs)
	if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
		return function(blob, name, no_auto_bom) {
			name = name || blob.name || "download";

			if (!no_auto_bom) {
				blob = auto_bom(blob);
			}
			return navigator.msSaveOrOpenBlob(blob, name);
		};
	}

	FS_proto.abort = function(){};
	FS_proto.readyState = FS_proto.INIT = 0;
	FS_proto.WRITING = 1;
	FS_proto.DONE = 2;

	FS_proto.error =
	FS_proto.onwritestart =
	FS_proto.onprogress =
	FS_proto.onwrite =
	FS_proto.onabort =
	FS_proto.onerror =
	FS_proto.onwriteend =
		null;

	return saveAs;
}(
	   typeof self !== "undefined" && self
	|| typeof window !== "undefined" && window
	|| this.content
));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

if ( true && module.exports) {
  module.exports.saveAs = saveAs;
} else if (( true && __webpack_require__.amdD !== null) && (__webpack_require__.amdO !== null)) {
  !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    return saveAs;
  }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}


/***/ }),

/***/ 458:
/***/ ((module) => {

/*
 Copyright (c) 2014, Yahoo! Inc. All rights reserved.
 Copyrights licensed under the New BSD License.
 See the accompanying LICENSE file for terms.

    https://github.com/yahoo/serialize-javascript

 */

const isRegExp = function(re) {
  return Object.prototype.toString.call(re) === '[object RegExp]';
};

const UID = Math.floor(Math.random() * 0x10000000000).toString(16);
const PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R)-' + UID + '-(\\d+)__@"', 'g');

const IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
const UNSAFE_CHARS_REGEXP = /[<>\/\u2028\u2029]/g;

// Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
// Unicode char counterparts which are safe to use in JavaScript strings.
const ESCAPED_CHARS = {
  '<': '\\u003C',
  '>': '\\u003E',
  '/': '\\u002F',
  '\u2028': '\\u2028',
  '\u2029': '\\u2029'
};

function escapeUnsafeChars(unsafeChar) {
  return ESCAPED_CHARS[unsafeChar];
}

module.exports = function serialize(obj, options) {
  options || (options = {});

  // component item serialization

  // Backwards-compatability for `space` as the second argument.
  if (typeof options === 'number' || typeof options === 'string') {
    options = {space: options};
  }

  const functions = [];
  const regexps = [];

  // Returns placeholders for functions and regexps (identified by index)
  // which are later replaced by their string representation.
  function replacer(key, value) {
    if (!value) {
      return value;
    }

    const type = typeof value;

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

  let str;

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
  return str.replace(PLACE_HOLDER_REGEXP, function(match, type, valueIndex) {
    if (type === 'R') {
      return regexps[valueIndex].toString();
    }

    const fn = functions[valueIndex];
    const serializedFn = fn.toString();

    if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
      throw new TypeError('Serializing native function: ' + fn.name);
    }

    return serializedFn;
  });
};


/***/ }),

/***/ 94:
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

"use strict";
/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const fileSaver = __webpack_require__(35);
const serialize = __webpack_require__(458);
const _optionAttributes = __webpack_require__(541);

/**
 * Create application bundle containing all components
 * and resources used in the app. This method can be called
 * from the browser developer console. When using lazy-loading
 * only components loaded so far will be bundled (incremental bundle).
 * To force inclusion of all components/resources
 * disable lazy-loading first by calling
 * `zuix.lazyLoad(false)` and then `zuix.saveBundle()`.
 * After the bundle is created it will be downloaded
 * by the browser as 'app.bundle.js' file that you can
 * then compress, copy and include in your app.
 * This will speed-up resource loading and improve
 * user experience.
 *
 * @return {string} bundle
 */
function saveBundle() {
  const bundleFileName = 'app.bundle.js';
  const bundleObj = zuix.bundle();
  let headerSummary = '\n/*';
  headerSummary += '\n * zUIx Application Bundle';
  headerSummary += '\n * ';
  headerSummary += '\n * '+bundleFileName+' generated by *zuix-bundler*';
  headerSummary += '\n *   on '+new Date().toISOString();
  headerSummary += '\n * ';
  headerSummary += '\n * Resource list ('+bundleObj.length+'):';
  headerSummary += '\n * ';
  for (let i = 0; i < bundleObj.length; i++) {
    const b = bundleObj[i];
    let ctype = '';
    if (b.view != null) {
      ctype += '[html] ';
    }
    if (b.css != null) {
      ctype += '[css] ';
    }
    if (b.controller != null) {
      ctype += '[js] ';
    }
    let cpath = b.componentId;
    if (b.using != null) {
      cpath = b.using+' ('+cpath+')';
    }
    headerSummary += '\n * - '+ctype;
    headerSummary += '\n *   '+cpath;
    headerSummary += '\n * ';
  }
  headerSummary += '\n * ';
  headerSummary += '\n*/';
  headerSummary += '\n\n';
  let bundle = headerSummary + serialize(zuix.bundle());
  // revert loaded status before exporting
  bundle = bundle.replace(new RegExp(_optionAttributes.dataUiLoaded+'="true"', 'g'),
      _optionAttributes.dataUiLoaded+'="false"');
  bundle = bundle.replace(new RegExp(_optionAttributes.zuixLoaded+'="true"', 'g'),
      _optionAttributes.zuixLoaded+'="false"');
  // save bundle
  const blob = new Blob(['zuix.bundle(' + bundle + ');'], {type: 'text/plain;charset=utf-8'});
  fileSaver.saveAs(blob, bundleFileName);
  return bundle;
}

module.exports = function(root) {
  if (zuix == null) {
    alert('Error: ZuixBundler requires Zuix to be included first.');
    return;
  }
  zuix.saveBundle = saveBundle;
  return zuix;
};


/***/ }),

/***/ 541:
/***/ ((module) => {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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

const OptionAttributes = Object.freeze({
  dataBindModel:
        'z-model,data-bind-model',
  dataBindTo:
        'z-bind,data-bind-to',
  dataUiBehavior:
        'z-behavior',
  dataUiOn:
        'z-on',
  dataUiComponent:
        'z-component',
  dataUiContext:
        'z-context,data-ui-context',
  dataUiField:
        'z-field,data-ui-field',
  dataUiInclude:
        'z-include,data-ui-include',
  dataUiLazyload:
        'z-lazy,data-ui-lazyload',
  dataUiLoad:
        'z-load,data-ui-load',
  dataUiLoaded:
        'z-loaded',
  dataUiOptions:
        'z-options,data-ui-options',
  dataUiPriority:
        'z-priority,data-ui-priority',
  dataUiView:
        'z-view,data-ui-view',
  zuixLoaded:
        'zuix-loaded',
  dataUiReady:
        'z-ready',
  // Types attributes
  resourceType: {
    view: 'view',
    controller: 'ctrl',
    file: 'file'
  },
  // Identifiers attributes
  cssIdPrefix:
      'z-css-'
});

module.exports = OptionAttributes;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/amd define */
/******/ 	(() => {
/******/ 		__webpack_require__.amdD = function () {
/******/ 			throw new Error('define cannot be used indirect');
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/amd options */
/******/ 	(() => {
/******/ 		__webpack_require__.amdO = {};
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__(460);
/******/ 	zuix = __webpack_exports__;
/******/ 	
/******/ })()
;