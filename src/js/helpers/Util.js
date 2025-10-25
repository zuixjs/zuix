/*
 * Copyright 2015-2023 G-Labs. All Rights Reserved.
 *
 *           https://zuixjs.org
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
 *        https://zuixjs.org
 *
 * @author Generoso Martello  -  https://github.com/genemars
 */

'use strict';

/**
 * @typedef QuerySelectors
 * @method {function(): string} getAll
 * @method {function(i: number): string} get
 */

/**
 * Common utility functions.
 * @namespace Utils
 */
const Utils = {

  /**
   * Returns true only if object is null || undefined
   * @param {object} obj The object to test.
   * @return {boolean} True if null or undefined, otherwise false.
   * @memberOf Utils
   */
  isNoU(obj) {
    return (typeof obj === 'undefined' || obj === null);
  },
  /**
   * Gets object property given its name
   * @param {object} o The object to get property from.
   * @param {string} s The property path (dotted/indexed form).
   * @return {object|undefined} The property matching the given path.
   * @memberOf Utils
   */
  propertyFromPath(o, s) {
    if (typeof s !== 'string' || o == null) {
      return;
    }
    try {
      if (typeof o[s] !== 'undefined') {
        return o[s];
      }
    } catch (e) {
      // TODO: "TypeError: Cannot create proxy with a non-object as target or handler"
      console.log(e);
    }
    let ref = o; let path = '';
    const parts = s.match(/\[(".*?"|'.*?'|(.*?))\]|".*?"|'.*?'|[0-9a-zA-Z_$]+/g);
    for (let i = 0; i < parts.length; i++) {
      let m = parts[i];
      if (m.startsWith('[') && m.endsWith(']')) {
        m = m.substring(1, m.length - 1).trim();
      }
      if (m.startsWith('"') && m.endsWith('"')) {
        m = m.substring(1, m.length - 1);
      } else if (m.startsWith('\'') && m.endsWith('\'')) {
        m = m.substring(1, m.length - 1);
      }
      path = path + m;
      let propertyReference;
      try {
        propertyReference = ref[m];
      } catch (e) {
        // TODO: proxy has been revoked
      }
      if (typeof propertyReference !== 'undefined') {
        ref = propertyReference;
      } else {
        // TODO: maybe logging?
        // throw new Error('Undefined property "' + path + '"');
        return;
      }
      path = path + '->';
    }
    return ref;
  },

  /**
   * Creates a copy of a given object.
   * @param {object} obj The source object.
   * @return {object} The object copy.
   * @memberOf Utils
   */
  cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    // Give temp the original object's constructor
    let temp = obj;
    try {
      temp = obj.constructor();
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          temp[key] = this.cloneObject(obj[key]);
        }
      }
    } catch (e) {
      // TODO: should warn when clone is not possible
    }
    return temp;
  },

  // TODO: deprecate `hasPassiveEvents`
  /**
   * Returns true if browser supports passive events.
   * @return {boolean} True if supported, otherwise false.
   * @memberOf Utils
   */
  hasPassiveEvents() {
    let supportsPassive = false;
    try {
      const opts = Object.defineProperty({}, 'passive', {
        get: function() {
          supportsPassive = true;
        }
      });
      window.addEventListener('testPassive', null, opts);
      window.removeEventListener('testPassive', null, opts);
    } catch (e) {}
    return supportsPassive;
  },

  /**
   * Converts the given string to `camelCase`
   * @param {string} s The string to convert.
   * @return {string} The converted string.
   * @memberOf Utils
   */
  hyphensToCamelCase(s) {
    return typeof s === 'string' ? s.replace(/--/g, ':').replace(/-([a-z0-9_$-])/g, function(g) {
      return '_$-'.indexOf(g[1]) > -1 || (+g[1]).toString() === g[1] ?
          '_' + g[1].replace('-', '_') : g[1].toUpperCase();
    }).replace(/:/g, '-') : s;
  },

  /**
   * Converts the given string to `kebab-case`.
   * @param {string} s The string to convert.
   * @return {string} The converted string.
   * @memberOf Utils
   */
  camelCaseToHyphens(s) {
    if (typeof s !== 'string') return s;
    s = s.replace(/(^\w)|(\s+\w)/g, function(letter) {
      return letter.toUpperCase();
    }).replace(/\s/g, '');
    return s.split(/(?=[A-Z])/).join('-').toLowerCase();
  },

  /**
     * Normalizes controller code (ES5/ES6+) to be wrapped in a function
     * that returns the controller class, function, or object.
     *
     * This function is designed to be robust against common code formatting styles,
     * such as leading comments and global variable declarations before the main export.
     *
     * ALGORITHM:
     * 1.  The code is "stripped" of all comments to create a clean version for analysis.
     * 2.  It finds the first top-level declaration keyword ('class', 'function', or 'zuix.controller')
     *     that starts on a new line.
     * 3.  For 'class' or 'function', it extracts a unique "marker" signature from the keyword
     *     up to the opening brace '{' (e.g., "class MyController extends Base").
     * 4.  It finds this unique marker in the original, unmodified code.
     * 5.  It inserts the 'return' keyword right before the marker in the original code,
     *     preserving all leading content (comments, global consts, etc.).
     *
     * KNOWN LIMITATION:
     * This parser will fail if the exact signature of the class/function declaration
     * (e.g., "class MyController extends Base") is present inside a comment *before*
     * the actual code declaration. This is considered a rare edge case.
     *
     * @param {string} javascriptCode The JS code to normalize.
     * @return {string} Normalized JS controller code.
     * @memberOf Utils
     */
  normalizeControllerCode(javascriptCode) {
    if (javascriptCode.indexOf('module.exports') >= 0) {
      return '\'use strict\'; let module = {}; ' + javascriptCode + ';\nreturn module.exports;';
    } else {
      const strippedCode = javascriptCode
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/\/\/.*/g, '');

      const match = strippedCode.match(/^\s*(class|function|zuix\.controller)/m);

      if (!match) {
        return javascriptCode;
      }

      const keyword = match[1];
      const keywordIndex = match.index;

      if (keyword === 'zuix.controller') {
        const originalIndex = javascriptCode.indexOf('zuix.controller');
        return javascriptCode.substring(0, originalIndex) + 'return ' + javascriptCode.substring(originalIndex + 15);
      }

      // Find the opening curly brace '{' that belongs to the class/function definition.
      const openBraceIndex = strippedCode.indexOf('{', keywordIndex);

      if (openBraceIndex > -1) {
        // The marker is the text from the keyword up to (but not including) the curly brace.
        // E.g., "class TimeClock extends ControllerInstance"
        const markerSignature = strippedCode.substring(keywordIndex, openBraceIndex).trim();

        if (markerSignature) {
          // Find this signature in the original code.
          const originalIndex = javascriptCode.indexOf(markerSignature);

          if (originalIndex > -1) {
            // Insert 'return' right before this signature.
            return javascriptCode.substring(0, originalIndex) + 'return ' + javascriptCode.substring(originalIndex);
          }
        }
      }

      return javascriptCode;
    }
  },

  /**
   * Catches errors occurred in the specified component context.
   * @param {ComponentContext} ctx The component context.
   * @param {function} fn Function code to execute.
   * @param {function} errorCallback Error callback.
   * @memberOf Utils
   */
  catchContextError(ctx, fn, errorCallback) {
    try {
      fn();
    } catch (err) {
      ctx._error = err;
      if (errorCallback) errorCallback(err);
      if (err && ctx.options().error) {
        (ctx.options().error)
            .call(ctx, err, ctx);
      } else {
        console.error(err);
      }
    }
  },

  /**
   * @namespace dom
   * @memberof Utils
   */
  dom: {

    /**
     * Gets CSS query for matching the given value in a list of specified attributes.
     * @param {string} name Comma separated list of attribute names.
     * @param {string} value The value to match.
     * @param {QuerySelectors} appendValue Additional CSS query to append
     * @return {string} The query string.
     * @memberof Utils.dom
     */
    queryAttribute(name, value, appendValue) {
      const fields = name.split(/[\s|,]+/g);
      let selector = '';
      fields.forEach(function(f, i) {
        if (value != null) {
          selector += '[' + CSS.escape(f) + '="' + value + '"]';
        } else {
          selector += '[' + CSS.escape(f) + ']';
        }
        if (appendValue) {
          selector += appendValue.get(i);
        }
        if (i < fields.length - 1) selector += ',';
      });
      return selector;
    },
    /**
     * Gets the first non-null value for the given comma-separated list of element attributes.
     * @param {Element} element The target element.
     * @param {string} name Comma separated list of attributes.
     * @return {string} The attribute value.
     * @memberof Utils.dom
     */
    getAttribute(element, name) {
      let value;
      if (typeof name === 'string' && name.indexOf(',') !== -1) {
        const fields = name.split(/[\s|,]+/g);
        for (let i = 0; i < fields.length; i++) {
          const f = fields[i];
          const a = element.getAttribute(f);
          if (a != null) {
            value = a;
            break;
          }
        }
      } else value = element.getAttribute(name);
      return value;
    },
    /**
     * Sets the value of the given comma-separated list of attributes.
     * @param {Element} element The target element.
     * @param {string} name Comma separated list of attributes.
     * @param {object|string} value The value to set.
     * @memberof Utils.dom
     */
    setAttribute(element, name, value) {
      if (typeof name === 'string' && name.indexOf(',') !== -1) {
        const fields = name.split(/[\s|,]+/g);
        const _t = this;
        fields.forEach(function(f) {
          _t.setAttribute(element, f, value);
        });
      } else if (value === null) {
        element.removeAttribute(name);
      } else if (element.getAttribute(name) !== value) {
        element.setAttribute(name, value);
      }
    },
    /**
     * Gets the CSS `:not` selector for the given comma-separated list of attributes with the specified value (if any).
     * @param {string} name Comma separated list of attributes.
     * @param {string} value The value to match.
     * @return {QuerySelectors} The query selectors.
     * @memberof Utils.dom
     */
    cssNot(name, value) {
      const fields = name.split(',');
      let selector = '';
      fields.forEach(function(v, i) {
        if (v.startsWith('.')) {
          selector += ':not(' + v + ')';
        } else if (value != null) {
          selector += ':not([' + v + '="' + value + '"])';
        } else {
          selector += ':not([' + v + '])';
        }
        if (i < fields.length - 1) selector += ',';
      });
      return (function(s) {
        /** @type {QuerySelectors} */
        return {
          get(i) {
            const selectors = s.split(',');
            return (i >= selectors.length || i == null) ? selectors[0] : selectors[i];
          },
          // eslint-disable-next-line no-unused-vars
          getAll() {
            const selectors = s.split(',');
            return selectors.join('');
          }
        };
      })(selector);
    },
    /**
     * Return the ShadowRoot node containing the given element, or false if not in a shadow DOM.
     * @param {Node} node The node element.
     * @return {ShadowRoot|boolean} The ShadowRoot or false.
     * @memberof Utils.dom
     */
    getShadowRoot(node) {
      for (; node; node = node.parentNode) {
        if (node instanceof ShadowRoot) {
          return node;
        }
      }
      return false;
    }

  }

};

module.exports = Utils;
