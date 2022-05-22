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
 * @author Generoso Martello  -  https://github.com/genemars
 */

'use strict';

// Generic utility class
module.exports = {

  isNoU: function(obj) {
    return (typeof obj === 'undefined' || obj === null);
  },

  isFunction: function(f) {
    return typeof f === 'function';
  },

  objectEquals: function(x, y) {
    if (x === null || x === undefined || y === null || y === undefined) {
      return x === y;
    }
    // after this just checking type of one would be enough
    if (x.constructor !== y.constructor) {
      return false;
    }
    // if they are functions, they should exactly refer to same one (because of closures)
    if (x instanceof Function) {
      return x === y;
    }
    // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
    if (x instanceof RegExp) {
      return x === y;
    }
    if (x === y || x.valueOf() === y.valueOf()) {
      return true;
    }
    if (Array.isArray(x) && x.length !== y.length) {
      return false;
    }

    // if they are dates, they must had equal valueOf
    if (x instanceof Date) {
      return false;
    }

    // if they are strictly equal, they both need to be object at least
    if (!(x instanceof Object)) {
      return false;
    }
    if (!(y instanceof Object)) {
      return false;
    }

    // recursive object equality check
    const p = Object.keys(x);
    return Object.keys(y).every(function(i) {
      return p.indexOf(i) !== -1;
    }) &&
            p.every(function(i) {
              return util.objectEquals(x[i], y[i]);
            });
  },

  propertyFromPath: function(o, s) {
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

  cloneObject: function cloneObject(obj) {
    if (obj === null || typeof obj !== 'object') {
      return obj;
    }
    // Give temp the original obj's constructor
    // var temp = obj.constructor();
    // for (var key in obj)
    //    temp[key] = cloneObject(obj[key]);
    let temp = obj;
    try {
      temp = obj.constructor();
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          temp[key] = cloneObject(obj[key]);
        }
      }
    } catch (e) {
      // TODO: should warn when clone is not possible
    }
    return temp;
  },

  hasPassiveEvents: function hasPassiveEvents() {
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

  hyphensToCamelCase: function(s) {
    return s.replace(/-([a-z0-9_$-])/g, function(g) {
      return '_$-'.indexOf(g[1]) > -1 || (+g[1]).toString() === g[1] ?
          '_' + g[1].replace('-', '_') : g[1].toUpperCase();
    });
  },

  camelCaseToHyphens: function(s) {
    s = s.replace(/(^\w)|(\s+\w)/g, function(letter) {
      return letter.toUpperCase();
    }).replace(/\s/g, '');
    return s.split(/(?=[A-Z])/).join('-').toLowerCase();
  },

  normalizeControllerCode: function(javascriptCode) {
    if (javascriptCode.indexOf('module.exports') >= 0) {
      return '\'use strict\'; let module = {}; ' + javascriptCode + ';\nreturn module.exports;';
    } else {
      // TODO: improve code parsing
      let code = javascriptCode;
      const fni = javascriptCode.indexOf('function ');
      const fnz = javascriptCode.indexOf('zuix.controller');
      const fnc = javascriptCode.indexOf('class ');
      if (fnc > 0 && (fnc < fni || fni === -1) && (fnc < fnz || fnz === -1)) {
        code = javascriptCode.substring(0, fnc) + 'return ' + javascriptCode.substring(fnc);
      } else if (fni > 0 && (fni < fnz || fnz === -1)) {
        code = javascriptCode.substring(0, fni) + 'return ' + javascriptCode.substring(fni);
      } else if (fnz !== -1) {
        code = javascriptCode.substring(0, fnz) + 'return ' + javascriptCode.substring(fnz + 15);
      }
      return code;
    }
  },

  dom: {

    queryAttribute: function(name, value, appendValue) {
      const fields = name.split(',');
      let selector = '';
      fields.forEach(function(v, i) {
        if (value != null) {
          selector += '[' + v + '="' + value + '"]';
        } else {
          selector += '[' + v + ']';
        }
        if (appendValue) {
          selector += appendValue.get(i);
        }
        if (i < fields.length - 1) selector += ',';
      });
      return selector;
    },
    getAttribute: function(element, name) {
      let value;
      if (typeof name === 'string' && name.indexOf(',') !== -1) {
        const fields = name.split(',');
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
    setAttribute: function(element, name, value) {
      if (typeof name === 'string' && name.indexOf(',') !== -1) {
        const fields = name.split(',');
        const _t = this;
        fields.forEach(function(f) {
          _t.setAttribute(element, f, value);
        });
      } else if (value === null) {
        element.removeAttribute(name, value);
      } else {
        element.setAttribute(name, value);
      }
    },
    cssNot: function(name, value) {
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
        return {
          get: function(i) {
            const selectors = s.split(',');
            return (i >= selectors.length || i == null) ? selectors[0] : selectors[i];
          },
          // eslint-disable-next-line no-unused-vars
          getAll: function(i) {
            const selectors = s.split(',');
            return selectors.join('');
          }
        };
      })(selector);
    }

  }

};
