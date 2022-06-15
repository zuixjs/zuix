/* zuix.js v1.1.13 22.06.16 00:19:35 */

/******/ var __webpack_modules__ = ({

/***/ 381:
/***/ (function(module) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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
/* eslint-disable camelcase */



const _bc = 'background-color:rgba(200,200,200,0.2);';
const _bt = 'background-color:transparent;';
const _c1 = 'color:#8a53ff;';
const _c2 = 'color:#777777';
const _c3 = 'color:#888888;';
const _c_start = 'color:#999900;';
const _c_end = 'color:#00aa00;';
const _c_end_very_slow = 'color:#ff0000;';
const _c_end_slow = 'color:#ff7700;';

let _console = null;
let _global = null;
let _callback = null;

/**
 * Simple Logging Helper
 *
 * @example
```js
// same as log.info (...)
log.i('Component view', ctx.view());
// same as log.error(...)
log.e('Error loading data', dataUrl);
// other methods are:
// log.w(...) / log.warn (...)
// log.d(...) / log.debug(...)
// log.t(...) / log.trace(...)
```
 * @class Logger
 * @constructor
 */
function Logger(ctx) {
  _console = window ? window.console : {};
  _global = window ? window : {};
  this._timers = {};
  this.args = function(context, level, args) {
    let logHeader = '%c '+level+' %c'+(new Date().toISOString())+' %c'+context;
    const colors = [_bc+_c1, _bc+_c2, _bc+_c3];
    for (let i = 0; i < args.length; i++) {
      if (typeof args[i] == 'string' && args[i].indexOf('timer:') === 0) {
        const t = args[i].split(':');
        if (t.length === 3) {
          let elapsed;
          switch (t[2]) {
            case 'start':
              this._timers[t[1]] = new Date().getTime();
              logHeader += ' %cSTART '+t[1];
              colors.push(_bc+_c_start);
              break;
            case 'stop':
              elapsed = (new Date().getTime() - this._timers[t[1]]);
              logHeader += ' %cSTOP '+t[1]+' '+elapsed+' ms';
              if (elapsed > 200) {
                colors.push(_bc+_c_end_very_slow);
              } else if (elapsed > 100) {
                colors.push(_bc+_c_end_slow);
              } else {
                colors.push(_bc+_c_end);
              }
              break;
          }
        }
      }
    }
    logHeader += ' \n%c '; colors.push(_bt+'color:inherit;');
    // if (typeof args[0] == 'string') {
    //     logHeader += ' %c' + args[0];
    //     Array.prototype.shift.call(args);
    // }
    for (let c = colors.length-1; c >= 0; c--) {
      Array.prototype.unshift.call(args, colors[c]);
    }
    Array.prototype.unshift.call(args, logHeader);
    Array.prototype.push.call(args, '\n\n');
  };
  this.log = function(level, args) {
    if (_callback) {
      _callback.call(ctx, level, args);
    }
    // route event
    if (_global.__zuix__debug || level === 'ERROR' || level === 'WARN') {
      this.args(ctx, level, args);
      _console.log(...args);
    }
  };
}

/**
 * Callback function for monitoring all log messages.
 *
 * @callback LoggerMonitorCallback
 * @param {Object} ctx
 * @param {string} level
 * @param {Object[]} ...args
 * @this {object}
 */

/**
 * Sets a callback function for monitoring all log messages.
 *
 * @param {LoggerMonitorCallback} callback
 * @return undefined
 */
Logger.prototype.monitor = function(callback) {
  // global callback for debugging purpose
  _callback = callback;
};

/**
 * Logs information messages.
 *
 * @param {Object[]} args
 * @return {Logger}
 */
Logger.prototype.info = function(...args) {
  this.log('INFO', args);
  return this;
};
Logger.prototype.i = Logger.prototype.l = Logger.prototype.log = Logger.prototype.info;
/**
 * Logs warning messages.
 *
 * @param {Object[]} args
 * @return {Logger}
 */
Logger.prototype.warn = function(...args) {
  this.log('WARN', args);
  return this;
};
Logger.prototype.w = Logger.prototype.warn;
/**
 * Logs error messages.
 *
 * @param {Object[]} args
 * @return {Logger}
 */
Logger.prototype.error = function(...args) {
  this.log('ERROR', args);
  return this;
};
Logger.prototype.e = Logger.prototype.error;
/**
 * Logs debug messages.
 *
 * @param {Object[]} args
 * @return {Logger}
 */
Logger.prototype.debug = function(...args) {
  this.log('DEBUG', args);
  return this;
};
Logger.prototype.d = Logger.prototype.debug;
/**
 * Logs trace messages.
 *
 * @param {Object[]} args
 * @return {Logger}
 */
Logger.prototype.trace = function(...args) {
  this.log('TRACE', args);
  return this;
};
Logger.prototype.t = Logger.prototype.trace;

/**
 * Simple logger.
 * @param ctx
 * @return {Logger}
 */
module.exports = function(ctx) {
  return new Logger(ctx);
};


/***/ }),

/***/ 65:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const _log =
    __webpack_require__(381)('TaskQueue.js');

/**
 * Task Queue Manager
 *
 * @class TaskQueue
 * @constructor
 */
function TaskQueue(listener) {
  const _t = this;
  _t._worker = null;
  _t._taskList = [];
  _t._requests = [];
  if (listener == null) {
    listener = function() { };
  }
  _t.taskQueue = function(tid, fn, pri) {
    _t._taskList.push({
      tid: tid,
      fn: fn,
      status: 0,
      priority: pri,
      step: function(tid) {
        // var _h = this;
        // _h.tid = tid;
        _log.t(tid, 'load:step');
        listener(_t, 'load:step', {
          task: tid
        });
      },
      end: function() {
        this.status = 2;
        const _h = this;
        _log.t(_h.tid, 'load:next', 'timer:task:stop');
        listener(_t, 'load:next', {
          task: _h.tid
        });
        _t._taskList.splice(this.index, 1);
        _t.taskCheck();
        if (this._callback != null) {
          this._callback.call(this);
        }
      },
      callback: function(callback) {
        this._callback = callback;
      }
    });
    _log.t(tid, 'task added', pri, 'priority');
    _t._taskList.sort(function(a, b) {
      return (a.priority > b.priority) ?
                1 :
                ((b.priority > a.priority) ?
                    -1 : 0);
    } );
    _t.taskCheck();
  };
  _t.taskCheck = function() {
    for (let i = 0; i < _t._taskList.length; i++) {
      if (_t._taskList[i].status === 0) {
        _t._taskList[i].status = 1;
        _log.t(_t._taskList[i].tid, 'load:begin', 'timer:task:start');
        listener(_t, 'load:begin', {
          task: _t._taskList[i].tid
        });
        _t._taskList[i].index = i;
        (_t._taskList[i].fn).call(_t._taskList[i]);
        return;
      } else if (_t._taskList[i].status === 1) {
        // currently running
        return;
      } else if (_t._taskList[i].status === 2) {
        // TODO: _!!!-!
        return;
      }
    }
    _log.t('load:end');
    listener(_t, 'load:end');
  };
}

/**
 *
 * @param handler {function}
 */
// eslint-disable-next-line no-unused-vars
TaskQueue.prototype.callback = function(handler) { };
TaskQueue.prototype.queue = function(tid, fn, pri) {
  return this.taskQueue(tid, fn, pri);
};

module.exports = TaskQueue;


/***/ }),

/***/ 826:
/***/ (function(module) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



// Generic utility class
module.exports = {

  isNoU: function(obj) {
    return (typeof obj === 'undefined' || obj === null);
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
    // Give temp the original object's constructor
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
    return typeof s === 'string' ? s.replace(/--/g, ':').replace(/-([a-z0-9_$-])/g, function(g) {
      return '_$-'.indexOf(g[1]) > -1 || (+g[1]).toString() === g[1] ?
          '_' + g[1].replace('-', '_') : g[1].toUpperCase();
    }).replace(/:/g, '-') : s;
  },

  camelCaseToHyphens: function(s) {
    if (typeof s !== 'string') return s;
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
      if (fnc >= 0 && (fnc < fni || fni === -1) && (fnc < fnz || fnz === -1)) {
        code = javascriptCode.substring(0, fnc) + 'return ' + javascriptCode.substring(fnc);
      } else if (fni >= 0 && (fni < fnz || fnz === -1)) {
        code = javascriptCode.substring(0, fni) + 'return ' + javascriptCode.substring(fni);
      } else if (fnz !== -1) {
        code = javascriptCode.substring(0, fnz) + 'return ' + javascriptCode.substring(fnz + 15);
      }
      return code;
    }
  },

  dom: {

    queryAttribute: function(name, value, appendValue) {
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
    getAttribute: function(element, name) {
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
    setAttribute: function(element, name, value) {
      if (typeof name === 'string' && name.indexOf(',') !== -1) {
        const fields = name.split(/[\s|,]+/g);
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
    },
    getShadowRoot: function(node) {
      for (; node; node = node.parentNode) {
        if (node instanceof ShadowRoot) {
          return node;
        }
      }
      return false;
    }

  }

};


/***/ }),

/***/ 917:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const _log =
    __webpack_require__(381)('TaskQueue.js');
const util = __webpack_require__(826);


// Types definitions for JsDoc

/**
 * Callback function used with the `each(..)` method.
 *
 * @callback ElementsIterationCallback
 * @param {number} count Iteration count.
 * @param {Element} item Current element.
 * @param {ZxQuery} $item ZxQuery wrapped element (same as 'this').
 * @this {ZxQuery}
 */

/**
 * Relative position.
 *
 * @typedef {object} Position
 * @property {number} dx
 * @property {number} dy
 */

/**
 * The `ElementPosition` object returned by the `position()` method.
 *
 * @typedef {object} ElementPosition
 * @property {number} x X coordinate of the element in the viewport
 * @property {number} y Y coordinate of the element in the viewport
 * @property {Position} frame Position of the element relative to the viewport
 * @property {string} event Current state change event description (*enter*, *exit*, *scroll*, *off-scroll*)
 * @property {boolean} visible Boolean value indicating whether the element is visible in the viewport
 */

/**
 * The `IterationCallback` function.
 *
 * @callback IterationCallback
 * @param {number|object} k Iteration count / item key.
 * @param {object} item Current element (same as `this`).
 * @this {object}
 */

/**
 * The `ZxQueryHttpBeforeSendCallback` function.
 *
 * @callback ZxQueryHttpBeforeSendCallback
 * @param {XMLHttpRequest} xhr
 * @this {undefined}
 */

/**
 * The `ZxQueryHttpSuccessCallback` function.
 *
 * @callback ZxQueryHttpSuccessCallback
 * @param {string} responseText
 * @this {undefined}
 */

/**
 * The `ZxQueryHttpErrorCallback` function.
 *
 * @callback ZxQueryHttpErrorCallback
 * @param {XMLHttpRequest} xhr
 * @param {string} statusText
 * @param {number} statusCode
 * @this {undefined}
 */

/**
 * The `ZxQueryHttpThenCallback` function.
 *
 * @callback ZxQueryHttpThenCallback
 * @param {XMLHttpRequest} xhr
 * @this {undefined}
 */

/**
 * zuix.$.http options object.
 *
 * @typedef {object} ZxQueryHttpOptions
 * @property {string} url
 * @property {ZxQueryHttpBeforeSendCallback|undefined} beforeSend
 * @property {ZxQueryHttpSuccessCallback|undefined} success
 * @property {ZxQueryHttpErrorCallback|undefined} error
 * @property {ZxQueryHttpThenCallback|undefined} then
 */

/**
 * Configuration object for `playFx`, `playTransition`, `playAnimation` utility methods.
 *
 * @typedef {object} PlayFxConfig
 * @property {'transition'|'animation'} type The type of effect to play.
 * @property {Element|ZxQuery} target Target element.
 * @property {Array<string>|string} classes List of transition or animation classes to play.
 * @property {object} [options] Transition/animation options ('delay', 'duration', etc..).
 * @property {boolean} [holdState] Hold last transition/animation class.
 * @property {PlayFxCallback} [onStep] Since class list can contain more than just two classes, this callback will be called after each pair of transition/animation ended.
 * @property {PlayFxCallback} [onEnd] Called when all transitions/animations ended.
 */

/**
 * Callback function used with the `each(..)` method.
 *
 * @callback PlayFxCallback
 * @param {ZxQuery} $element Target element (same as 'this').
 * @param {Array<string>} classQueue Transition/animation class queue left to play, `null` if the animation ended.
 * @this {ZxQuery}
 */

/** @private */
const supportsPassive = util.hasPassiveEvents();

/**
 * @private
 */
const _zuix_events_mapping = [];
function routeEvent(e) {
  triggerEventHandlers(this, e.type, e);
}
function addEventHandler(el, path, handler, options) {
  let found = false;
  z$.each(_zuix_events_mapping, function() {
    if (this.element === el && this.path === path && this.handler === handler) {
      _log.w('Handler already registered', el, path, handler);
      found = true;
      return false;
    }
  });
  if (!found) {
    _zuix_events_mapping.push({element: el, path, handler, options});
    el.addEventListener(path, routeEvent, supportsPassive && (options == null || options.passive !== false) ? {passive: true} : false);
  }
}
function removeEventHandler(el, path, handler) {
  let left = 1;
  let index = -1;
  z$.each(_zuix_events_mapping, function(i) {
    if (this.element === el && this.path === path) {
      left--;
      if (this.handler === handler) index = i;
    }
  });
  if (index !== -1) {
    _zuix_events_mapping.splice(index, 1);
  }
  // unregister event handler since it was the last one
  if (left === 0) {
    el.removeEventListener(path, routeEvent);
  }
}
function triggerEventHandlers(el, path, evt) {
  const element = z$(el);
  z$.each(_zuix_events_mapping, function() {
    if (this.element === el && this.path === path) {
      this.handler.call(element, evt, element);
    }
  });
}
function removeAllEventHandlers(el) {
  z$.each(_zuix_events_mapping.slice(), function() {
    if (this.element === el) {
      _log.t('Removing event handler', this.element, this.path, this.handler);
      removeEventHandler(this.element, this.path, this.handler);
    }
  });
}
function getPlayFxConfig(type, target, options) {
  let classes = options.classes;
  if (typeof options === 'string') {
    classes = options.split(/[\s|,]+/g);
    options = {};
  } else if (Array.isArray(options)) {
    classes = options;
    options = {};
  }
  return Object.assign({
    type,
    classes,
    target
  }, options);
}

/**
 * The constructor takes one optional argument that can be
 * a DOM element, a node list or a valid DOM query selector string expression.
 * If no parameter is given, the resulting ZxQuery object will wrap the
 * root *document* element.
 *
 * @class ZxQuery
 * @constructor
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined} [element] Element or list of elements to include in the ZxQuery object or any valid DOM query selector string
 * @return {ZxQuery} The *ZxQuery* object containing the given element(s).
 */
function ZxQuery(element) {
  /** @protected */
  this._selection = [];

  if (typeof element === 'undefined') {
    element = document.documentElement;
  }

  if (element instanceof ZxQuery) {
    return element;
  } else if (element instanceof HTMLCollection || element instanceof NodeList) {
    const list = this._selection = [];
    z$.each(element, function(i, el) {
      list.push(el);
    });
  } else if (Array.isArray(element)) {
    this._selection = element;
  } else if (element === window || element instanceof HTMLElement || element instanceof Node) {
    this._selection = [element];
  } else if (typeof element === 'string') {
    this._selection = document.documentElement.querySelectorAll(element);
  } else if (element !== null) { // if (typeof element === 'string') {
    const msg = 'ZxQuery cannot wrap object of this type.';
    _log.e(msg, (typeof element), element);
    throw new Error(msg);
  }
  return this;
}


/**
 * Gets the number of elements in the ZxQuery object.
 *
 * @return {Number} Number of DOM elements.
 */
ZxQuery.prototype.length = function() {
  return this._selection.length;
};
/**
 * Gets the closest parent matching the given selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} [filter] A valid DOM query selector filter (**default:** *first parent*).
 * @return {ZxQuery} A new *ZxQuery* object containing the matching parent element.
 */
ZxQuery.prototype.parent = function(filter) {
  if (filter) {
    return new ZxQuery(z$.getClosest(this._selection[0], filter));
  }
  return new ZxQuery(this._selection[0].parentNode);
};
/**
 * Gets the children matching the given selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} [filter] A valid DOM query selector filter (**default:** *all children*).
 * @return {ZxQuery}  A new *ZxQuery* object containing the selected *children*.
 */
ZxQuery.prototype.children = function(filter) {
  // TODO: implement filtering
  if (filter) {
    return new ZxQuery(this._selection[0].querySelectorAll(filter));
  }
  return new ZxQuery(this._selection[0].children);
};
/**
 * Reverses order of the elements in the current set.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.reverse = function() {
  const elements = (Array.prototype.slice).call(this._selection, 0);
  this._selection = elements.reverse();
  return this;
};
/**
 * Gets the DOM Element located at the given position in the ZxQuery object.
 * If no index is provided, the default element will be returned.
 *
 * @param {number} [i] Position of element (**default:** 0).
 * @return {Node|Element|HTMLElement} The *DOM* element.
 */
ZxQuery.prototype.get = function(i) {
  if (!i) i = 0;
  return this._selection[i];
};
/**
 * Gets a new ZxQuery object containing the element
 * located at the given position in the current ZxQuery object.
 *
 * @param {number} i Position of element.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected element.
 */
ZxQuery.prototype.eq = function(i) {
  const selection = this._selection;
  let resultSet = selection[i];
  if (arguments.length > 1) {
    resultSet = [];
    z$.each(arguments, function(k, v) {
      if (selection[v] != null) {
        resultSet.push(selection[v]);
      }
    });
  }
  return new ZxQuery(resultSet);
};
/**
 * Moves to the previous sibling in the DOM.
 * This only applies to the first element in the ZxQuery object.
 *
 * @return {ZxQuery} A new *ZxQuery* object containing the previous sibling element.
 */
ZxQuery.prototype.prev = function() {
  return new ZxQuery(this._selection[0].previousElementSibling);
};
/**
 * Moves to the next sibling in the DOM.
 * This only applies to the first element in the ZxQuery object.
 *
 * @return {ZxQuery} A new *ZxQuery* object containing the next sibling element.
 */
ZxQuery.prototype.next = function() {
  return new ZxQuery(this._selection[0].nextElementSibling);
};
/**
 * If no `el` is given, returns the position of the first element in the ZxQuery object
 * relative to its parent's children list, otherwise the position of the given `el` in the
 * ZxQuery object selection.
 *
 * @param {ZxQuery} [el]
 * @returns {number}
 */
ZxQuery.prototype.index = function(el) {
  const target = this._selection[0];
  if (this.length() === 1 && el == null) {
    const elements = Array.from(this.parent().children()._selection);
    return elements.indexOf(target);
  } else if (this.length() && el != null) {
    return this._selection.indexOf(el.get());
  }
  return -1;
};
/**
 * Selects all descendants matching the given *DOM* query selector filter.
 * This only applies to the first element in the ZxQuery object.
 *
 * @param {string} selector A valid *DOM* query selector.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected elements.
 */
ZxQuery.prototype.find = function(selector) {
  const q = this._selection[0];
  return q ? new ZxQuery(this._selection[0].querySelectorAll(selector)) : new ZxQuery();
};
/**
 * Iterates through all *DOM* elements in the selection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)` function, will be the
 * *DOM* element corresponding the current iteration.
 * `index` will be the iteration count, and `item`
 * the current Element. The function context `this` will be a
 * `{ZxQuery}` instance containing the current `item`.
 * To interrupt the iteration loop, return `false` in the callback
 * function or return `true` to continue to the next iteration.
 *
 * @param {ElementsIterationCallback} iterationCallback The callback function to call for each element in the ZxQuery object.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.each = function(iterationCallback) {
  z$.each(this._selection, iterationCallback);
  return this;
};
/**
 * Gets the value of an attribute for the first element in the ZxQuery object,
 * or sets one or more attributes for all elements in the ZxQuery object.
 *
 * @param {string|JSON} attr The attribute name.
 * @param {string|undefined} [val] The attribute value.
 * @return {string|ZxQuery} The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.attr = function(attr, val) {
  const _t = this;
  if (typeof attr === 'object') {
    z$.each(attr, (i, v) => {
      _t.each((k, el) =>
        util.dom.setAttribute(el, i, v)
      );
    });
  } else if (typeof val == 'undefined') {
    return util.dom.getAttribute(this._selection[0], attr);
  } else {
    this.each((i, el) =>
      util.dom.setAttribute(el, attr, val)
    );
  }
  return this;
};
/**
 * Triggers the given event for all elements in the ZxQuery object.
 *
 * @param {string} eventPath Path of the event to trigger.
 * @param {object} eventData Value of the event.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.trigger = function(eventPath, eventData) {
  const event = new CustomEvent(eventPath, {detail: eventData});
  this.each(function(k, el) {
    el.dispatchEvent(event);
  });
  return this;
};
/**
 * Listens once to the given event for all elements in the ZxQuery object.
 *
 * @param {string|Array<Object>|JSON} eventPath Event path or object with event/handler pairs.
 * @param {function} [eventHandler] Event handler. Not used if eventPath is an object with event/handler pairs.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.one = function(eventPath, eventHandler) {
  const _t = this;
  if (typeof eventPath === 'object' && eventHandler == null) {
    z$.each(eventPath, (evt, handler) => {
      _t.one(evt, handler);
    });
    return this;
  }
  const HandleOnce = function(e, h) {
    let fired = false;
    return function(a, b) {
      if (fired) {
        // TODO: this should not occur (verify why "once" handlers are not removed)
        return;
      }
      fired = true;
      z$(_t).off(e, this);
      (h).call(_t, a, b, _t);
    };
  };
  this.on(eventPath, new HandleOnce(eventPath, eventHandler));
  return this;
};
/**
 * Listens to the given event for all elements in the ZxQuery object.
 *
 * @param {string|Array<Object>|JSON} eventPath Event path or object with event/handler pairs.
 * @param {function} [eventHandler] Event handler. Not used if eventPath is an object with event/handler pairs.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.on = function(eventPath, eventHandler) {
  if (typeof eventPath === 'object' && eventHandler == null) {
    const _t = this;
    z$.each(eventPath, (evt, handler) => _t.on(evt, handler));
    return this;
  }
  const events = eventPath.split(/[\s|,]+/g) || [];
  let options;
  if (typeof eventHandler !== 'function') {
    options = eventHandler;
    eventHandler = options.handler;
  }
  this.each((k, el) =>
    events.map((ev) =>
      addEventHandler(el, ev, eventHandler, options)
    ));
  return this;
};
/**
 * Stops listening for the given event.
 *
 * @param {string|Array<Object>|JSON} eventPath Event path or object with event/handler pairs.
 * @param {function} [eventHandler] Event handler. Not used if eventPath is an object with event/handler pairs.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.off = function(eventPath, eventHandler) {
  if (typeof eventPath === 'object' && eventHandler == null) {
    const _t = this;
    z$.each(eventPath, (evt, handler) => _t.off(evt, handler));
    return this;
  }
  const events = eventPath.split(/[\s|,]+/g) || [];
  this.each((k, el) =>
    events.map((ev) =>
      removeEventHandler(el, ev, eventHandler)
    ));
  return this;
};
/**
 * De-registers all event handlers of all elements in the ZxQuery object.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.reset = function() {
  this.each((k, el) => removeAllEventHandlers(el));
  return this;
};
/**
 * Returns *true* if the first element markup code is empty.
 *
 * @return {boolean} *true* if the element is empty, *false* otherwise.
 */
ZxQuery.prototype.isEmpty = function() {
  return (this._selection[0].innerHTML.replace(/\s/g, '').length === 0);
};
/**
 * Gets coordinates and visibility status of the first element.
 *
 * @return {ElementPosition}
 */
ZxQuery.prototype.position = function() {
  return z$.getPosition(this._selection[0]);
};

/**
 * Gets the value of a CSS property for the first element in the ZxQuery object,
 * or sets one or more CSS property for all elements in the ZxQuery object.
 *
 * @param {string|JSON} prop The CSS property name or JSON list of property/value pairs.
 * @param {string|undefined} [val] The CSS property value.
 * @return {string|ZxQuery} The CSS property value when no *val* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.css = function(prop, val) {
  if (typeof prop === 'object') {
    z$.each(prop, (i, v) =>
      this.each((k, el) =>
        el.style[i] = v
      ));
  } else if (util.isNoU(val)) {
    return this._selection[0].style[prop];
  } else {
    this.each((k, el) => el.style[prop] = val);
  }
  return this;
};
/**
 * Adds the given CSS class to the class list of all elements in the ZxQuery object.
 *
 * @param {string} className The CSS class name.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.addClass = function(className) {
  const classes = className.split(/[\s|,]+/g) || [];
  z$.each(this._selection, (k, el) =>
    classes.map((cl) => el.classList.add(cl))
  );
  return this;
};
/**
 * Returns *true* if the first element in the ZxQuery object contains the given CSS class.
 *
 * @param {string} className The CSS class name.
 * @return {boolean} *true* if the element contains the given CSS class, *false* otherwise.
 */
ZxQuery.prototype.hasClass = function(className) {
  return z$.hasClass(this._selection[0], className);
};
/**
 * Removes the given CSS class from all elements in the ZxQuery object.
 *
 * @param {string} className The CSS class name.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.removeClass = function(className) {
  const classes = className.split(/[\s|,]+/g) || [];
  z$.each(this._selection, (k, el) =>
    classes.map((cl) =>
      el.classList.remove(cl)
    ));
  return this;
};
/**
 * Gets the HTML string of the first element in the ZxQuery object,
 * or sets the HTML string for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [htmlText] HTML text.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.html = function(htmlText) {
  if (util.isNoU(htmlText)) {
    return this._selection[0].innerHTML;
  }
  this.each((k, el) => el.innerHTML = htmlText);
  return this;
};
/**
 * Gets the `checked` attribute of the first element in the ZxQuery object,
 * or sets the `checked` attribute value for all elements in the ZxQuery object.
 *
 * @param {boolean|undefined} [check] Value to assign to the 'checked' attribute.
 * @return {ZxQuery|boolean}
 */
ZxQuery.prototype.checked = function(check) {
  if (util.isNoU(check)) {
    const checked = this._selection[0].checked;
    return (checked != null && checked != 'false' && (checked || checked == 'checked'));
  }
  this.each((k, el) => el.checked = check);
  return this;
};
/**
 * Gets the `value` attribute of the first element in the ZxQuery object,
 * or sets the `value` attribute value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [value] Value to assign to the 'value' attribute.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.value = function(value) {
  if (util.isNoU(value)) {
    return this._selection[0].value;
  }
  this.each((k, el) => el.value = value);
  return this;
};
/**
 * Appends the given element or HTML string to the first element in the ZxQuery object.
 *
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element or HTML to append.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.append = function(el) {
  if (typeof el === 'string') {
    this._selection[0].innerHTML += el;
  } else {
    this._selection[0].appendChild((el instanceof ZxQuery) ? el.get() : el);
  }
  return this;
};
/**
 * Inserts the given child element before the one located at the specified index
 * to the first element in the ZxQuery object.
 *
 * @param {number} index Position where to insert `el` Element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList} el Element to insert.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.insert = function(index, el) {
  el = (el instanceof ZxQuery) ? el.get() : el;
  const target = this.children().get(index);
  if (target !== null) {
    this._selection[0].insertBefore(el, target);
  } else {
    this._selection[0].appendChild(el);
  }
  return this;
};
/**
 * Prepends the given element or HTML string to the first element in the ZxQuery object.
 *
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element to append.
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.prepend = function(el) {
  if (typeof el === 'string') {
    this._selection[0].innerHTML = el + this._selection[0].innerHTML;
  } else {
    this._selection[0].insertBefore((el instanceof ZxQuery) ? el.get() : el, this._selection[0].firstElementChild);
  }
  return this;
};
/**
 * Detaches from its parent the first element in the ZxQuery object.
 *
 * @return {ZxQuery}
 */
ZxQuery.prototype.detach = function() {
  const el = this._selection[0];
  const parent = el.parentNode;
  if (parent != null) {
    el.__zuix_oldParent = parent;
    el.__zuix_oldIndex = Array.prototype
        .indexOf.call(parent.children, el);
    parent.removeChild(el);
    _log.t('Detached from parent', parent, el);
  }
  return this;
};
/**
 * Re-attaches to its parent the first element in the ZxQuery object.
 *
 * @return {ZxQuery}
 */
ZxQuery.prototype.attach = function() {
  const el = this._selection[0];
  if (el.parentNode != null && el.__zuix_oldParent != null) {
    el.parentNode.removeChild(el);
  }
  if (el.parentNode == null && el.__zuix_oldParent != null) {
    z$(el.__zuix_oldParent)
        .insert(el.__zuix_oldIndex, el);
    el.__zuix_oldParent = null;
    delete el.__zuix_oldParent;
    delete el.__zuix_oldIndex;
  }
  return this;
};
/**
 * Gets the CSS `display` property of the first element in the ZxQuery object,
 * or sets the `display` property value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [mode] The display value.
 * @return {string|ZxQuery} The *display* value when no *mode* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.display = function(mode) {
  if (util.isNoU(mode)) {
    return this._selection[0].style.display;
  }
  z$.each(this._selection, (k, el) =>
    el.style.display = mode
  );
  return this;
};
/**
 * Gets the CSS `visibility` property of the first element in the ZxQuery object,
 * or sets the `visibility` property value for all elements in the ZxQuery object.
 *
 * @param {string|undefined} [mode] The visibility value.
 * @return {string|ZxQuery} The *visibility* value when no *mode* specified, otherwise the *ZxQuery* object itself.
 */
ZxQuery.prototype.visibility = function(mode) {
  if (util.isNoU(mode)) {
    return this._selection[0].style.visibility;
  }
  z$.each(this._selection, (k, el) =>
    el.style.visibility = mode
  );
  return this;
};
/**
 * Sets the CSS `display` property to '' if no argument value is provided, otherwise set it to the given value.
 *
 * @param {string} [mode] Set the display mode to be used to show element (eg. block, inline, etc..).
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.show = function(mode) {
  return this.display(mode == null ? '' : mode);
};
/**
 * Sets the CSS `display` property to 'none'.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.hide = function() {
  return this.display('none');
};
/**
 * Plays the transition effect specified by the given transition class list. If no class list is provided,
 * the callback function can be used to wait for the end of any currently running animation.
 *
 * @param {Array<string>|string|PlayFxConfig} options This parameter can be either: a list of classes (Array<string>), or a string with whitespace-separated class names, or a {PlayFxConfig} object.
 * @return {ZxQuery}
 */
ZxQuery.prototype.playTransition = function(options) {
  z$.playFx(getPlayFxConfig('transition', this, options));
  return this;
};
/**
 * Plays the animation specified by the given animation class list. If no class list is provided,
 * the callback function can be used to wait for the end of any currently running animation.
 *
 * @param {Array<string>|string|PlayFxConfig} options This parameter can be either: a list of classes (Array<string>), or a string with whitespace-separated class names, or a {PlayFxConfig} object.
 * @return {ZxQuery}
 */
ZxQuery.prototype.playAnimation = function(options) {
  z$.playFx(getPlayFxConfig('animation', this, options));
  return this;
};
/**
 * Returns true if a transition or animation is running.
 * @return {boolean|*}
 */
ZxQuery.prototype.isPlaying = function() {
  return this.hasClass('--z-playing');
};

// --- ZxQuery factory members --- //

/**
 * Creates a ZxQuery wrapped element.
 *
 * @class ZxQueryStatic
 * @hideconstructor
 * @constructor
 * @static
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined} [what] Query target
 * @return {ZxQuery}
 */
function ZxQueryStatic(what) {
  return new ZxQuery(what);
}
const z$ = ZxQueryStatic;
/**
 * Selects document elements matching the given *DOM* query selector.
 *
 * @method find
 * @memberOf ZxQueryStatic
 * @alias zuix.$.find
 * @param {string} selector A valid *DOM* query selector.
 * @return {ZxQuery} A new *ZxQuery* object containing the selected elements.
 */
ZxQueryStatic.find = function(selector) {
  return z$().find(selector);
};
/**
 * Iterates through all objects in the given `items` collection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)`, will be the
 * object corresponding the current iteration and
 * the `index` passed to the callback will be the iteration count.
 *
 * If the callback returns *false*, the iteration loop will interrupt.
 *
 * @method each
 * @memberOf ZxQueryStatic
 * @alias zuix.$.each
 * @param {Array<Object>|JSON} items Enumerable objects collection.
 * @param {IterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {ZxQuery} `this`.
 */
ZxQueryStatic.each = function(items, iterationCallback) {
  const len = (items == null ? 0 : Object.keys(items).length);
  if (len > 0) {
    let count = 0;
    for (const i in items) {
      if (items.hasOwnProperty(i)) {
        let item = items[i];
        if (item instanceof Element) {
          item = z$(item);
        }
        if (iterationCallback.call(item, i, items[i], item) === false) {
          break;
        }
        count++;
        if (count >= len) {
          break;
        }
      }
    }
  }
  return this;
};
/**
 * Checks if an element has got the specified CSS class.
 *
 * @method hasClass
 * @memberOf ZxQueryStatic
 * @alias zuix.$.hasClass
 * @param {Element|HTMLElement} el
 * @param {string} className
 * @return {boolean}
 */
ZxQueryStatic.hasClass = function(el, className) {
  const classes = className.split(/[\s|,]+/g) || [];
  let success = false;
  z$.each(classes, (k, cl) => {
    success = el.classList.contains(cl);
    if (success) {
      return false; // break loop
    }
  });
  return success;
};
/**
 * Checks if a class exists by searching for it in all document stylesheets.
 *
 * @method classExists
 * @memberOf ZxQueryStatic
 * @alias zuix.$.classExists
 * @param {string} className
 * @return {boolean}
 */
ZxQueryStatic.classExists = function(className) {
  const classes = className.split(/[\s|,]+/g) || [];
  let success = false;
  z$.each(classes, (k, cl) => {
    // Perform global style check
    const docStyles = document.styleSheets;
    if (docStyles) {
      for (let sx = 0; sx < docStyles.length; sx++) {
        // the try statement is needed because on Firefox accessing CSS rules
        // loaded from a remote source will raise a security exception
        try {
          const classes = docStyles[sx].cssRules;
          if (classes != null) {
            for (let cx = 0; cx < classes.length; cx++) {
              if (classes[cx].selectorText === cl) {
                success = true;
                break;
              }
            }
          }
        } catch (e) {
          if (e.name !== 'SecurityError' && e.name !== 'InvalidAccessError') {
            throw e;
          }
        }
      }
    }
  });
  return success;
};
/**
 * Wraps an `Element` inside a container specified by a given tag name.
 *
 * @method wrapElement
 * @memberOf ZxQueryStatic
 * @alias zuix.$.wrapElement
 * @param {string} containerTag Container element tag name
 * @param {Element|HTMLElement} element
 * @return {Element|HTMLElement} The new wrapped element
 */
ZxQueryStatic.wrapElement = function(containerTag, element) {
  // $(element).wrap($('<'+containerTag+'/>'));
  // return element;
  /** @type {HTMLElement} */
  const container = document.createElement(containerTag);
  if (typeof element === 'string') {
    container.innerHTML = element;
  } else {
    // TODO: test this, it may not work
    container.appendChild(element);
  }
  return container;
};
// TODO: undocumented
ZxQueryStatic.wrapCss = function(wrapperRule, css, encapsulate) {
  const wrapReX = /(([a-zA-Z0-9\240-\377=:-_- \n,.@]+.*){([^{}]|((.*){([^}]+)[}]))*})/g;
  let wrappedCss = '';
  let ruleMatch;
  // remove comments
  css = css.replace(/\/\*[\s\S]*?\*\/|([^:]|^)\/\/.*$/g, '');
  // some more normalization to help with parsing
  css = css.replace(/(?:\r\n|\r|\n)/g, '').replace(/}/g, '}\n').replace(/\{/g, '{\n');
  do {
    ruleMatch = wrapReX.exec(css);
    if (ruleMatch && ruleMatch.length > 1) {
      let ruleParts = ruleMatch[2];
      if (ruleParts != null && ruleParts.length > 0) {
        ruleParts = ruleParts.replace(/\n/g, '');
        const classes = ruleParts.split(',');
        let isAtRule = false;
        z$.each(classes, (k, v) => {
          // TODO: deprecate the 'single dot' notation
          if (v.trim() === '.' || v.trim() === ':host') {
            // a single `.` means 'self' (the container itself)
            // so we just add the wrapperRule
            wrappedCss += '\n[z-component]' + wrapperRule + ' ';
          } else if (v.trim()[0] === '@') {
            // leave it as is if it's an animation or media rule
            wrappedCss += v + ' ';
            if (v.trim().toLowerCase().startsWith('@media') || v.trim().toLowerCase().startsWith('@supports')) {
              isAtRule = true;
            }
          } else if (encapsulate) {
            // wrap the class names (v)
            v.split(/\s+/).forEach(function(attr) {
              attr = attr.trim();
              if (attr.lastIndexOf('.') > 0) {
                attr.replace(/(?=\.)(?![^\[\]()]*(?:\[[^\[\]()]*([\])]))?([\])]))/gi, ',').split(',').forEach(function(attr2) {
                  wrappedCss += attr2 !== '' ? attr2 + wrapperRule : '\n';
                });
              } else if (attr !== '' && attr !== '>' && attr !== '*') {
                wrappedCss += '\n' + attr + wrapperRule + ' ';
              } else {
                wrappedCss += attr + ' ';
              }
            });
          } else {
            let val = v.trim();
            if (val.startsWith(':host')) {
              val = val.substring(5);
            } else {
              val = '\n' + val;
            }
            wrappedCss += '\n[z-component]' + wrapperRule + val + ' ';
          }
          if (k < classes.length - 1) {
            wrappedCss = wrappedCss.trim() + ', ';
          }
        });
        if (isAtRule) {
          const wrappedAtRule = z$.wrapCss(wrapperRule, ruleMatch[1].substring(ruleMatch[2].length).replace(/^{([^\0]*?)}$/, '$1'), encapsulate);
          wrappedCss += '{\n  ' + wrappedAtRule + '\n}\n';
        } else {
          wrappedCss += ruleMatch[1].substring(ruleMatch[2].length) + '\n';
        }
      } else {
        _log.w('z$.wrapCss was unable to parse rule.', ruleParts, ruleMatch);
      }
    }
  } while (ruleMatch);
  if (wrappedCss !== '') {
    css = wrappedCss;
  }
  return css;
};
/**
 * Appends a new stylesheet, or replaces an existing one, to the document.
 *
 * @method appendCss
 * @memberOf ZxQueryStatic
 * @alias zuix.$.appendCss
 * @param {string} css Stylesheet text
 * @param {Element|HTMLElement|null} target Existing style element to replace
 * @param {string} cssId id to assign to the stylesheet
 * @param {Node|undefined} [container] The container where to append the style element
 * @return {Element|HTMLElement} The new style element created out of the given css text.
 */
ZxQueryStatic.appendCss = function(css, target, cssId, container) {
  const head = container || document.head || document.getElementsByTagName('head')[0];
  let style = null;
  // remove old style if already defined
  if (target && head.contains(target)) {
    head.removeChild(target);
  } else {
    const oldStyle = document.getElementById(cssId);
    if (oldStyle != null) {
      head.removeChild(oldStyle);
    }
  }
  if (typeof css === 'string') {
    // output css
    style = document.createElement('style');
    style.id = cssId;
    style.appendChild(document.createTextNode(css));
  } else if (css instanceof Element) style = css;
  // Append new CSS
  if (style) {
    head.appendChild(style);
  }
  return style;
};
/**
 * Parses variables enclosed in single or double braces and calls the given callback for each parsed variable name.
 * If the callback returns a value, then the variable will be replaced with the given value.
 *
 * @method replaceBraces
 * @memberOf ZxQueryStatic
 * @alias zuix.$.replaceBraces
 * @param {string} html The source HTML template.
 * @param {function} callback A callback function with one argument (the currently parsed variable name).
 * @return {string|null} The new html code with variables replaced with values or null if no variable was replaced.
 */
ZxQueryStatic.replaceBraces = function(html, callback) {
  // TODO: add optional parameter for custom regex
  const tags = new RegExp(/{?{.*?}?}/g); // <-- single/double braces wrapper
  let outHtml = '';
  let matched = 0;
  let currentIndex = 0;
  let result;
  while (result = tags.exec(html)) {
    if (typeof result[0] === 'string' && (result[0].trim().length === 0 || result[0].indexOf('\n') >= 0)) {
      const nv = html.substring(currentIndex, result.index)+result[0];
      outHtml += nv;
      currentIndex += nv.length;
      continue;
    }
    let value = result[0];
    if (callback) {
      const r = callback(result[0]);
      if (r != null) {
        value = r;
        matched++;
      }
    }
    outHtml += html.substring(currentIndex, result.index)+value;
    currentIndex = result.index+result[0].length;
  }
  if (matched > 0) {
    outHtml += html.substring(currentIndex);
    return outHtml;
  }
  return null;
};
/**
 * Gets the closest parent matching the given query selector
 *
 * @method getClosest
 * @memberOf ZxQueryStatic
 * @alias zuix.$.getClosest
 * @param {Element|HTMLElement} elem
 * @param {string} selector A valid DOM query selector string expression.
 * @return {Element|HTMLElement|null}
 */
ZxQueryStatic.getClosest = function(elem, selector) {
  // Get closest match
  elem = elem.parentNode;
  for (; elem && elem !== document; elem = elem.parentNode) {
    if (elem.matches && elem.matches(selector)) return elem;
  }
  return null;
};
/**
 * Gets the position of an element.
 *
 * @method getPosition
 * @memberOf ZxQueryStatic
 * @alias zuix.$.getPosition
 * @param {Element|HTMLElement} el
 * @param {number} [tolerance] Distance in pixels from viewport's boundaries for the element to be considered 'visible' (this is mainly used for lazy-loading).
 * @return {ElementPosition}
 */
ZxQueryStatic.getPosition = function(el, tolerance) {
  const visibleClass = '--ui--visible';
  /** @type ElementPosition */
  const position = (function() {
    let x = 0;
    let y = 0;
    const rect = el.getBoundingClientRect();
    let parent = el;
    while (parent) {
      if (parent.tagName.toLowerCase() === 'body') {
        // deal with browser quirks with body/window/document and page scroll
        const scrollX = parent.scrollLeft || document.documentElement.scrollLeft;
        const scrollY = parent.scrollTop || document.documentElement.scrollTop;
        x += (parent.offsetLeft - scrollX + parent.clientLeft);
        y += (parent.offsetTop - scrollY + parent.clientTop);
      } else {
        // for all other non-BODY elements
        x += (parent.offsetLeft - parent.scrollLeft + parent.clientLeft);
        y += (parent.offsetTop - parent.scrollTop + parent.clientTop);
      }
      parent = parent.offsetParent;
    }
    return {
      x: x,
      y: y,
      rect: rect
    };
  })(el);
  position.visible = false;
  const getScrollParent = (el) => {
    if (!(el instanceof Element)) return document.body;
    const style = getComputedStyle(el);
    return (el.scrollHeight >= el.clientHeight || el.scrollWidth >= el.clientWidth) &&
    (!/^(visible|hidden)/.test(style.overflowY || 'visible') || !/^(visible|hidden)/.test(style.overflowX || 'visible')) ?
        el : (getScrollParent(el.parentElement) || document.body);
  };
  const scrollable = getScrollParent(el.parentNode);
  if (scrollable != null) {
    let r1 = scrollable.getBoundingClientRect();
    if (scrollable === document.body) {
      // modify from read-only object
      r1 = {
        x: r1.x,
        y: r1.y,
        width: document.documentElement.offsetWidth || document.documentElement.clientWidth,
        height: document.documentElement.offsetHeight || document.documentElement.clientHeight,
        top: 0,
        left: 0,
        right: document.documentElement.clientWidth || document.documentElement.offsetWidth,
        bottom: document.documentElement.clientHeight || document.documentElement.offsetHeight
      };
    }
    if (tolerance == null) tolerance = 0;
    const r2 = el.getBoundingClientRect();
    // visible status
    let visible = getComputedStyle(el).display !== 'none';
    if (visible) {
      visible = !(r2.left-1 > r1.right - tolerance ||
          r2.right+1 < r1.left + tolerance ||
          r2.top-1 > r1.bottom - tolerance ||
          r2.bottom+1 < r1.top + tolerance);
      if (scrollable !== document.body) {
        visible = visible && z$(scrollable).position().visible;
      }
      let parentNode = el.parentNode;
      while (parentNode && parentNode instanceof Element && visible) {
        const parentStyle = getComputedStyle(parentNode);
        visible = visible && parentStyle.display !== 'none' && parentStyle.visibility !== 'hidden';
        parentNode = parentNode.parentNode;
      }
    }
    position.visible = visible;
    // viewport-relative frame position
    position.frame = {
      dx: (r2.left + (r2.width / 2) - r1.left) / r1.width,
      dy: (r2.top + (r2.height / 2) - r1.top) / r1.height
    };
    // update status event and remove 'visibleClass'
    const $el = z$(el);
    if (!visible && $el.hasClass(visibleClass)) {
      $el.removeClass(visibleClass);
      position.event = 'exit';
    } else if (!visible) {
      position.event = 'off-scroll';
    } else if (visible) {
      if (!$el.hasClass(visibleClass)) {
        position.event = 'enter';
        $el.addClass(visibleClass);
      } else position.event = 'scroll';
    }
  }
  return position;
};
/**
 * Adds a CSS transition effect to the component stylesheet.
 *
 * @method addTransition
 * @memberOf ZxQueryStatic
 * @alias zuix.$.addTransition
 * @param cssId
 * @param scope
 * @param {string} className CSS class name to assign to this transition.
 * @param {Array<Object>|JSON} properties List of CSS properties/values to set.
 * @param {Array<Object>|JSON} options List of transition options.
 * @param {Node|undefined} [container] The container where to append the style element
 * @return {Element|HTMLElement} The new style element created out of the given css text.
 */
ZxQueryStatic.addTransition = function(cssId, scope, className, properties, options, container) {
  let cssText = '';
  let styleElement = document.getElementById(cssId);
  if (styleElement != null) {
    cssText = styleElement.innerHTML;
  } else {
    styleElement = document.createElement('style');
  }
  let props = ''; let transProps = '';
  z$.each(properties, (k, v) => {
    k = util.camelCaseToHyphens(k);
    props += '  ' + k + ': ' + v + ';\n';
    transProps += k + ', ';
  });
  let opts = '\n';
  z$.each(options, (k, v) => {
    k = util.camelCaseToHyphens(k);
    opts += '  transition-' + k + ': ' + v + ';\n';
  });
  transProps = transProps.substring(0, transProps.length - 2) + ';';
  cssText += (scope + '.' + className +
    ', ' + scope + ' .' + className +
    '{\n' + props + '  transition-property: ' + transProps + opts + '}\n');
  return this.appendCss(cssText, styleElement, cssId, container);
};
/**
 * Plays transition effects or animations on a given element inside the component.
 *
 * @method playFx
 * @memberOf ZxQueryStatic
 * @alias zuix.$.playFx
 * @param {PlayFxConfig} config Options.
 */
ZxQueryStatic.playFx = function(config) {
  const _t = this;
  const $el = z$(config.target);
  if ($el.length() === 0) {
    _log.warn('playFx: target element is undefined', config);
    return;
  }
  if (config.classes == null) {
    config.classes = [];
  } else if (typeof config.classes === 'string') {
    config.classes = config.classes.split(/[\s|,]+/g);
  }
  const classOut = config.classes.length > 1 && config.classes.shift();
  if (!$el.hasClass('--z-playing')) {
    $el.addClass('--z-playing');
    if (classOut) {
      $el.addClass(classOut).css(config.type, 'none');
    }
  }
  const style = getComputedStyle($el.get());
  const delay = (parseFloat(style[config.type + '-delay']) * 1000) || classOut ? 10 : 0;
  let expired = false;
  const animationStart = () => {
    if (expired) return;
    expired = true;
    if (config.classes.length > 1) {
      if (config.onStep) {
        config.onStep.call($el, $el, config.classes.slice(1));
      }
      _t.playFx(config);
    } else {
      if (!config.holdState && config.classes.length > 0) {
        $el.removeClass(config.classes.shift());
      }
      $el.removeClass('--z-playing');
      if (config.onEnd) {
        config.onEnd.call($el, $el);
      }
    }
  };
  const animationSetup = () => {
    if (classOut) {
      $el.css(config.type, '')
          .removeClass(classOut);
    }
    const classIn = config.classes[0];
    if (classIn) {
      $el.addClass(classIn);
    }
    if (config.options) {
      z$.each(config.options, function(k, v) {
        $el.css(config.type + '-' + k, v);
      });
    }
    // TODO: the following 'setTimeout' is a work-around to animation/transition end not firing sometimes (to be investigated)
    const iterationCount = 1 + (parseFloat(style[config.type + '-iteration-count']) || 0);
    const duration = (parseFloat(style[config.type + '-duration']) * 1000) * iterationCount;
    setTimeout(animationStart, duration);
  };
  const handler = function(e) {
    if (e.target === config.target.get()) {
      $el.off(config.type + 'end', this);
      animationStart();
    }
  };
  $el.on(config.type + 'end', handler);
  if (delay > 0) {
    setTimeout(animationSetup, delay);
  } else {
    animationSetup();
  }
};


ZxQueryStatic.ZxQuery = ZxQuery;

// String.hashCode extension
String.prototype.hashCode = function() {
  let hash = 0;
  if (this.length === 0) return hash;
  for (let i = 0; i < this.length; i++) {
    const chr = this.charCodeAt(i);
    hash = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

module.exports = ZxQueryStatic;


/***/ }),

/***/ 693:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/* eslint-disable */
/*!
 * @license
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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

/**
 *
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.org
 *
 * @author Generoso Martello  -  https://github.com/genemars
 */

/* global define */



module.exports = __webpack_require__(459)();


/***/ }),

/***/ 265:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const ObservableObject =
    __webpack_require__(349);

/**
 * Object Observer
 *
 * @class
 * @constructor
 */
function ObjectObserver() {
  /**
     * @private
     * @type {ObservableObject[]}
     */
  this.observableList = [];
}

/** @private */
function getPath(observable) {
  let path = '';
  while (observable && observable.__path__) {
    const co = observable;
    // TODO: this line is perhaps ambiguous how to resolve path if target[key] has more parents?
    observable = observable.__parents__[0];
    if (observable && observable.__path__) {
      path = '[\'' + co.__path__ + '\'].' + path;
    } else {
      path = co.__path__ + (!path.startsWith('[') ? '.' : '') + path;
    }
  }
  return path;
}
/** @private */
function getListeners(observable) {
  const listeners = [];
  observable.__parents__.forEach((po) =>
    listeners.push(...getListeners(po))
  );
  listeners.push(...observable.__listeners__);
  return listeners;
}

/** @private */
function deleteObservable(targetObservable) {
  getListeners(targetObservable).forEach(
      /** @param {ObservableListener} l */
      (l) => targetObservable.unsubscribe(l)
  );
}

/**
 * Get an observable instance of an object for detecting changes.
 *
 * @param {Object} obj The object to observe
 * @return {ObservableObject} The observable object
 */
ObjectObserver.prototype.observable = function(obj) {
  /** @type {ObservableObject} */
  let observable;
  const matches = this.observableList.filter((o) =>
    obj === o.proxy || obj === o.target);
  if (matches.length === 1) {
    observable = matches[0];
  }
  if (observable == null) {
    const handler = {
      /** @type ObjectObserver */
      context: null,
      get: function(target, key) {
        if (key === 'observableTarget') {
          return target;
        }
        if (key.toString() === 'Symbol(Symbol.toStringTag)') {
          return;
        }
        let value;
        try {
          value = target[key];
        } catch (e) {
          // TODO: proxy has been revoked
        }
        if (typeof value === 'undefined') {
          return;
        }
        /** @type {ObservableListener[]} */
        const listeners = [];
        const targetObservable = this.context.observable(target);
        if (typeof value === 'object') {
          /** @type {ObservableObject} */
          const valueObservable = this.context.observable(value);
          // link to parent
          if (valueObservable.__parents__.indexOf(targetObservable) === -1) {
            valueObservable.__parents__.push(targetObservable);
            valueObservable.__path__ = key;
          }
          listeners.push(...getListeners(valueObservable));
          // set the return value to the observable value proxy (child)
          value = valueObservable.proxy;
        } else {
          listeners.push(...getListeners(targetObservable));
        }
        const path = getPath(targetObservable) + key;
        // propagate to all listeners
        listeners.forEach((l) => {
          if (l.get) {
            l.get(target, key, value, path);
          }
        });
        return value;
      },
      set: function(target, key, value) {
        const old = JSON.parse(JSON.stringify(target));
        const oldValue = target[key];
        if (typeof oldValue === 'object') {
          deleteObservable(this.context.observable(oldValue));
        }
        target[key] = value;
        const targetObservable = this.context.observable(target);
        const path = getPath(targetObservable) + key;
        getListeners(targetObservable).forEach(
            /** @param {ObservableListener} l */
            (l) => {
              if (l.set) {
                l.set(target, key, value, path, old);
              }
              if (old[path] !== value && l.change) {
                l.change(target, key, value, path, old);
              }
            }
        );
        return true;
      },
      deleteProperty: function(target, property) {
        const value = target[property];
        if (typeof value === 'object') {
          deleteObservable(this.context.observable(value));
        }
        return delete target[property];
      }
    };
    observable = new ObservableObject(this, obj, handler);
  }
  return observable;
};
module.exports = ObjectObserver;


/***/ }),

/***/ 349:
/***/ (function(module) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



/**
 * ObservableObject class.
 *
 * @class
 * @param {Object} context The observer context
 * @param {Object} target The target object to observe
 * @param {ProxyHandler} handler Handler for get/set callbacks
 * @constructor
 */
function ObservableObject(context, target, handler) {
  Object.assign(handler, {context: context});
  Object.assign(this, Proxy.revocable(target, handler));
  /** @private */
  this.handler = handler;
  /** @private */
  this.handler.context.observableList = this.handler.context.observableList || [];
  this.handler.context.observableList.push(this);
  /** @private */
  this.target = target;
  /** @private */
  this.__parents__ = [];
  /** @private */
  this.__listeners__ = [];
}

/**
 * Subscribe a listener to this observable events
 *
 * @param {ObservableListener} observableListener
 * @returns ObservableObject
 */
ObservableObject.prototype.subscribe = function(observableListener) {
  this.handler.context.observableList.forEach((p) => {
    if (p !== this && p.__listeners__.indexOf(observableListener) !== -1) {
      throw new Error('Listener already registered.');
    }
  });
  this.__listeners__.push(observableListener);
  return this;
};

/**
 * Unsubscribe a listener
 *
 * @param {ObservableListener} observableListener
 * @returns ObservableObject
 */
ObservableObject.prototype.unsubscribe = function(observableListener) {
  const i = this.__listeners__.indexOf(observableListener);
  if (i !== -1) {
    this.__listeners__.splice(i, 1);
  }
  if (this.__listeners__.length === 0) {
    // this observable has no more direct listeners and can be removed
    this.revoke();
    // TODO: this is untested!!!
    // remove this observable and parent references to it
    this.handler.context.observableList = this.handler.context.observableList.filter((p) => {
      if (p === this) return false;
      const i = p.__parents__.indexOf(this);
      if (i !== -1) {
        p.__parents__.splice(i, 1);
        // if child has no more parents nor listeners, then remove it as well
        if (p.__parents__.length === 0 && p.__listeners__.length === 0) {
          // recursive call
          p.unsubscribe(null);
          return false;
        }
      }
      return true;
    });
  }
  return this;
};

module.exports = ObservableObject;


/***/ }),

/***/ 398:
/***/ (function(module) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.org
 *
 * @author Generoso Martello  -  https://github.com/genemars
 *
 */


/**
 * The Active-Refresh function that will be called for each refresh request.
 *
 * @callback ActiveRefreshHandler
 * @this {HTMLElement} The target element
 * @param {ZxQuery} $view The component's view
 * @param {ZxQuery} $element The target element as *ZxQuery* object
 * @param {object} data Custom data that ca be passed from call to call
 * @param {ActiveRefreshCallback} nextCallback Callback for scheduling the next refresh call
 * @param {string} [attributeName] Source attribute name if it's a '@' handler
 */

/**
 * The callback for setting data and delay of next refresh request.
 *
 * @callback ActiveRefreshCallback
 * @param {object} [data] Data to be passed to next refresh call
 * @param {number} [refreshMs] Delay in milliseconds before the next refresh call
 * @param {boolean|undefined} [forceActive] Ignore visibility, schedule anyway
 */

/** @private */
const _defaultRefreshDelay = 100;

/**
 * The active-refresh object.
 * @class ActiveRefresh
 * @param {ZxQuery} $v View element
 * @param {ZxQuery} $el Target element
 * @param {ActiveRefreshHandler} refreshCallback The refresh handler function
 * @param {object} data Custom data passed from call to call
 */
function ActiveRefresh($v, $el, data, refreshCallback) {
  this.$view = $v;
  this.$element = $el;
  this.contextData = data;
  this.refreshMs = _defaultRefreshDelay;
  this.paused = false;
  this.forceActive = false;
  let initialized = false;
  this.requestRefresh = ($v, $el, data) => {
    const isMainComponent = $v.get() === $el.get() && zuix.context($v) != null;
    const isVisible = (isMainComponent && !initialized) || $el.position().visible;
    const isActive = this.forceActive || (!this.paused && $el.parent() != null && isVisible);
    /** @type {ActiveRefreshCallback} */
    const refreshLoop = (st, ms, active) => {
      if (st != null) this.contextData = st;
      if (ms == null) ms = $el.attr('@delay') ? +$el.attr('@delay') : null;
      if (ms != null) this.refreshMs = ms;
      if (active == null) active = $el.attr('@active') != null;
      if (active != null) this.forceActive = active;
      const ctx = zuix.context($v);
      if (ctx != null && this.refreshMs > 0) {
        setTimeout(() => this.requestRefresh($v, $el, this.contextData), isActive ? this.refreshMs : 500); // 500ms for noop-loop
        initialized = true;
      } else if (ctx == null) {
        // will not request refresh, loop
        // ends if context was disposed
        // TODO: cp.log.e(cp, 'activeRefresh:error:no_context', element, field, view);
        this.stop();
      }
    };
    if (isActive) {
      if (!$el._refreshActive) {
        $el._refreshActive = true;
        $el.trigger('refresh:active');
      }
      // call the `refreshCallback` and wait for
      // its completion before next loop round
      refreshCallback(
          $v, $el, data,
          (nextData, nextMsDelay, forceActive) =>
            refreshLoop(nextData, nextMsDelay, forceActive)
      );
    } else {
      if ($el._refreshActive) {
        $el._refreshActive = false;
        $el.trigger('refresh:inactive');
      }
      // noop-loop
      refreshLoop(this.contextData);
    }
  };
}

/**
 * Disposes this "ActiveRefresh" instance
 */
ActiveRefresh.prototype.stop = function() {
  // use method stop to dispose the
  // "ActiveRefresh" loop at any time
  this.pause();
  this.refreshMs = 0;
  this.stopped = true;
};

/**
 * Starts the refresh loop.
 */
ActiveRefresh.prototype.start = function(refreshDelay) {
  this.refreshMs = refreshDelay || this.refreshMs;
  if (this.started) {
    return this.resume();
  }
  this.started = true;
  this.requestRefresh(this.$view, this.$element, this.contextData);
};

/**
 * Pauses the refresh loop.
 */
ActiveRefresh.prototype.pause = function() {
  this.paused = true;
  // TODO: call 'ActiveRefresh.onPause()' callback
};

/**
 * Resumes the refresh loop.
 */
ActiveRefresh.prototype.resume = function() {
  // TODO: call 'ActiveRefresh.onResume()' callback
  this.paused = false;
};

module.exports = ActiveRefresh;


/***/ }),

/***/ 854:
/***/ (function(module) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.org
 *
 * @author Generoso Martello  -  https://github.com/genemars
 */

/**
 * Component cache object.
 *
 * @typedef {object} ComponentCache
 * @property {string} componentId The id of the cached component.
 * @property {Element} view The view element.
 * @property {string} css The CSS style text.
 * @property {boolean} css_applied Whether the CSS style has been applied to the view or not.
 * @property {ContextControllerHandler} controller The controller handler function.
 * @property {string} using The url/path if this is a resource loaded with `zuix.using(..)` method.
 */

/**
 * Bundle item object.
 *
 * @typedef {object} BundleItem
 * @property {Element} view
 * @property {string} css
 * @property {ContextControllerHandler} controller
 */

/** */
module.exports = () => {
  // dummy module for JsDocs/Closure Compiler
};


/***/ }),

/***/ 622:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const _log =
    __webpack_require__(381)('ComponentContext.js');
const _optionAttributes =
    __webpack_require__(541);
const z$ =
    __webpack_require__(917);
const util =
    __webpack_require__(826);
const ViewObserver =
    __webpack_require__(643);

// Custom objects definition used to generate JsDoc

/**
 * This function is called after the component is loaded
 * and it is used to initialize its controller.
 *
 * @callback ContextControllerHandler
 * @param {ContextController} cp The component controller object
 * @this {ContextController}
 */

/**
 * Callback function triggered when an event registered
 * with the `on` method occurs.
 *
 * @callback EventCallback
 * @param {string} event Event name
 * @param {Object} data Event data
 * @param {ZxQuery} $el ZxQuery wrapped element that sourced the event (same as `this`)
 * @this {ZxQuery}
 */

/**
 * Binding adapter callback.
 *
 * @callback BindingAdapterCallback
 * @param {ZxQuery} $element The view's element bound to the data model's *fieldName*
 * @param {string} fieldName The element's bound field name
 * @param {ZxQuery} $view The view
 * @param {BindingAdapterRefreshCallback} [refreshCallback] Refresh loop callback
 */

/**
 * Binding adapter refresh callback
 *
 * @callback BindingAdapterRefreshCallback
 * @param {number} [refreshMs] Milliseconds to wait before refresh (**default**: *500ms*)
 */

// private 'static' fields and methods

/** @type {Zuix} **/
let zuix = null;

const _componentIndex = [];
const _queryAdapterRefreshTimeout = [];

/**
 * @private
 * @param {ComponentContext} context
 * @returns {number}
 */
const getComponentIndex = (context) =>
  _componentIndex[context.componentId];

/**
 * Bind provided data by automatically mapping it to the given element.
 *
 * @param {Element} el The element to bind data to
 * @param {Object} boundData Data object to map data from
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
const dataBind = (el, boundData) => {
  boundData = boundData.observableTarget || boundData;
  const value = (!util.isNoU(boundData.value) ? boundData.value :
      (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
  // try to guess target property
  switch (el.tagName.toLowerCase()) {
    // TODO: complete binding cases
    case 'img':
      el.src = (!util.isNoU(boundData.src) ? boundData.src :
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      break;
    case 'a':
      el.href = (!util.isNoU(boundData.href) ? boundData.getAttribute('href'):
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      if (!util.isNoU(boundData.href) && !util.isNoU(boundData.innerHTML) && boundData.innerHTML.trim() !== '') {
        // won't replace innerHTML if it contains inner bound fields
        const t = z$(boundData);
        if (t.find(util.dom.queryAttribute(_optionAttributes.zField)).length() === 0) {
          z$(el).html('').append(document.createTextNode(boundData.innerHTML));
        }
      }
      break;
    case 'input':
      switch (el.type) {
        case 'checkbox':
        case 'radio':
          if (el.value == value) {
            el.checked = true;
          }
          break;
        default:
          el.value = value;
      }
      break;
    case 'select':
      z$.each(el.options, (i, opt) => {
        if (opt.value == value) {
          el.selectedIndex = i;
          return false;
        }
      });
      break;
    default:
      const v = (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : document.createTextNode(boundData));
      z$(el).html('').append(v);
  }
};
/**
 * Query binding adapter for resolving `boundField`->$el mapping
 * @param {ComponentContext} _t
 * @param {ZxQuery} $view
 * @param {ZxQuery} $el
 * @param {BindingAdapterCallback} fn The binding adapter callback
 * @param {string} field Bound field name
 */
const queryAdapter = (_t, $view, $el, fn, field) => {
  if (fn && !_t._disposed) {
    (fn).call($view, $el, field, $view, /** @type {BindingAdapterRefreshCallback} */ function(retryMs) {
      // data adapter is not ready, retry after 1s
      if (!_t._disposed) {
        const timeoutId = $el.get().dataset.__zuix_refreshTimeout;
        if (timeoutId && _queryAdapterRefreshTimeout[timeoutId]) {
          clearTimeout(_queryAdapterRefreshTimeout[timeoutId]);
        }
        $el.get().dataset.__zuix_refreshTimeout =
            setTimeout(function() {
              queryAdapter(_t, $view, $el, fn, field);
            }, retryMs ? retryMs : 500);
      }
    });
  }
};

/**
 * The component context object represents the component instance itself, and it holds
 * all of its data such as the view template, the style, the controller, the data model.
 *
 * @class
 * @property {string} componentId The component identifier "`[<path>/]<name>`".
 * @property {string} path Gets the base path of this component.
 * @property {string} name Gets the name of this component (last part of the path).
 * @property {ZxQuery} $ Access the view of this component. Use this to register event handlers for elements in this view to take advantage of automatic event unsubscription and view fields caching.
 * @property {Object.<string, ActiveRefreshHandler>} handlers List component-local `@` handlers.
 *
 * @constructor
 * @param {Zuix} zuixInstance
 * @param {ContextOptions} options Options to create this component context
 * @param {function} [eventCallback] Event routing callback
 * @return {ComponentContext} The component context instance.
 */
function ComponentContext(zuixInstance, options, eventCallback) {
  zuix = zuixInstance;
  this._options = null;
  this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
  this.componentId = null;
  this.handlers = {refresh: function($view, $el, contextData, refreshCallback) {}};
  this.trigger = (context, eventPath, eventValue) => {
    if (eventCallback) {
      eventCallback(context, eventPath, eventValue);
    }
  };

  /** @protected */
  this._container = null;

  /** @protected */
  this._model = null;
  /** @protected */
  this._view = null;
  /** @protected */
  this._css = null;
  /** @protected */
  this._style = null;
  /**
     * @protected
     * @type {ContextControllerHandler}
     */
  this._controller = null;

  /**
     * Define the local behavior handler for this context instance only.
     * Any global behavior matching the same `componentId` will be overridden.
     *
     * @function behavior
     * @param handler_fn {function}
     */
  this.behavior = null;

  /** @package */
  this._eventMap = [];
  /** @package */
  this._behaviorMap = [];

  /**
   * @package
   * @type {!Array.<ZxQuery>}
   **/
  this._fieldCache = [];

  /**
     * @protected
     * @type {ContextController}
     */
  this._c = null;

  /**
     * @protected
     * @type {ObservableListener}
     */
  this._modelListener = Object.assign({
    /** @type {ComponentContext} */
    context: null,
    get: function(target, key, value, path) {
      // TODO: maybe implement a {ContextController} callback for this too
    },
    set: function(target, key, value, path, old) {
      const view = this.context.$;
      if (target instanceof Element) {
        //  use the first part of the "path" as field name (eg. 'text.innerHTML' --> 'text')
        //  for binding data to view element
        path = path.split('.')[0];
        value = target;
      }
      if (typeof value === 'function') {
        let field = view.find(util.dom.queryAttribute(_optionAttributes.zBind, path));
        if (field.get() == null) {
          field = view.find(util.dom.queryAttribute(_optionAttributes.zField, path));
        }
        queryAdapter(this.context, view, field, value, key)
        return;
      }
      // update bound field if found in the view
      const bindFields = (fld) => {
        if (fld.get() != null) {
          fld.each((i, f) => dataBind(f, value));
        }
      };
      if (view.get()) {
        bindFields(view.find(util.dom.queryAttribute(_optionAttributes.zBind, path)));
        bindFields(view.find(util.dom.queryAttribute(_optionAttributes.zField, path)));
        // call controller's 'update' method
        if (this.context._c && this.context._c.update) {
          this.context._c.update(target, key, value, path, old);
        }
      }
    }
  }, {context: this});

  /**
     * @type {ViewObserver}
     * @private
     */
  this._viewObserver = new ViewObserver(this);
  /**
   * @type {boolean}
   * @private
   */
  this._disposed = false;

  this.options(options);

  return this;
}

/**
 * Disposes the component context and all of its allocated resources.
 */
ComponentContext.prototype.dispose = function() {
  if (this._disposed) {
    return;
  }
  this._disposed = true;
  // TODO: ... check out for more resources that could be freed
  this._viewObserver.stop();
  if (this._c) {
    if (this._c.view()) {
      this._c.trigger('component:dispose', this._c.view(), true);
      // TODO: restore all attributes state to the original state (before component creation)
      this._c.view()
          .attr(_optionAttributes.zComponent, null)
          .attr(_optionAttributes.zContext, null)
          .attr(_optionAttributes.zLoad, null)
          .attr(_optionAttributes.zLoaded, null)
          .attr(_optionAttributes.zReady, null)
          .attr(_optionAttributes.resourceType.view, null)
          .attr(_optionAttributes.resourceType.controller, null)
          .attr(_optionAttributes.resourceType.file, null) // not implemented yet
          .attr(this.getCssId(), null);
      // un-register event handlers associated to the view
      this._c.view().reset();
      // un-register event handlers for all cached fields accessed through cp.field(...) method
      if (this._c._fieldCache) {
        z$.each(this._c._fieldCache, /** @param {ZxQuery} v */ function(k, v) {
          v.reset();
        });
      }
    }
    if (this._c.dispose) {
      this._c.dispose.call(this, this);
    }
  }
  // un-register model observable
  this.model(null);
  // detach component view from its container (parent element)
  if (this._c && this._c._childNodes.length > 0) {
    this._c.view().html('');
    this._c.restoreView();
    //if (this._c.view()) {
    //  // detach from parent
    //  this._c.view().detach();
    //}
  }
  // detach the container from the DOM as well
  //const cel = this._container;
  //if (cel != null && cel.parentNode != null) {
  //  cel.parentNode.removeChild(cel);
  //}
  // TODO: provide a better way to do this
  //       maybe a callback or something
  // remove contexts from zuix contexts list
  const contexts = zuix.dumpContexts();
  const idx = contexts.indexOf(this);
  contexts.splice(idx, 1);
};

/**
 * Gets/Sets the container element of the component.
 * Returns the current container element if no
 * argument is passed, the `ComponentContext` itself
 * otherwise.
 *
 * @param {Element} [container] The container element.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.container = function(container) {
  // TODO: should automatically re-attach view to the new parent?
  if (container == null) return this._container;
  else if (container instanceof z$.ZxQuery) {
    container = container.get();
  }
  this._container = container;
  return this;
};

/**
 * Gets/Sets the view element of the component.
 * If an *HTML* string is passed, then the view element
 * will be a new `div` wrapping the given markup.
 * Returns the current view element if no
 * argument is passed, the *ComponentContext* itself otherwise.
 *
 * @param {Element|string|undefined} [view] The *HTML* string or element of the view.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.view = function(view) {
  if (typeof view === 'undefined') {
    return this._view;
  } else if (view === null) {
    // TODO: add more consistency check on methods parameters in the whole library
    throw new Error('View cannot be set to null.');
  } else if (view instanceof z$.ZxQuery) {
    view = view.get();
  }
  if (view === this._view) return this;
  this._viewObserver.stop();

  // clean custom attributes added to the old view
  const cssId = this.getCssId();
  if (this._view != null) {
    // view style encapsulation
    const q = '*' +
            util.dom.cssNot(_optionAttributes.zLoad).getAll();
    // mark all elements with a css identifier attribute
    z$(this._view).attr(cssId, null).find(q).each(function(i, v) {
      this.attr(cssId, null);
    });
  }

  const initializeTemplateFields = (v) => {
    v.find('*').each((i, el, $el) => {
      //if (!zuix.isDirectComponentElement(v, $el)) return;
      // add `z-field` from '#<field_name>' attributes
      for (let j = 0; j < el.attributes.length; j++) {
        const a = el.attributes.item(j);
        const v = a.value;
        if (a.name.length > 1 && a.name.startsWith('#')) {
          const attributeName = util.hyphensToCamelCase(a.name.substring(1));
          if ($el.attr(_optionAttributes.zField) == null) {
            $el.attr(_optionAttributes.zField, attributeName);
          }
          if ($el.attr(_optionAttributes.zBind) == null && v != null && v.length > 0) {
            $el.attr(_optionAttributes.zBind, v);
          }
        }
      }
    });
  };

  _log.t(this.componentId, 'view:attach', 'timer:view:start');
  if (typeof view === 'string') {
    // load view from HTML source

    // trigger `html:parse` hook before assigning content to the view
    const hookData = {content: view};
    this.trigger(this, 'html:parse', hookData);
    view = hookData.content;

    const viewDiv = z$.wrapElement('div', view);
    if (viewDiv.firstElementChild != null) {
      // remove z-view attribute from template if present on root node
      if (util.dom.getAttribute(viewDiv.firstElementChild, _optionAttributes.zView) != null) {
        if (viewDiv.children.length === 1) {
          view = viewDiv.firstElementChild.innerHTML;
        }
      } else view = viewDiv.innerHTML;
    }
    if (this._container != null) {
      // append view content to the container
      this._view = this._container;
      this._view.innerHTML += view;
    } else {
      if (this._view != null) {
        this._view.innerHTML = view;
      } else this._view = viewDiv;
    }

    const v = z$(this._view);
    // Run embedded scripts
    v.find('script:not([type=jscript])').each((i, el, $el) => {
      if ($el.attr(_optionAttributes.zuixLoaded) !== 'true') {
        $el.attr(_optionAttributes.zuixLoaded, 'true');
        /* if (el.src != null && el.src.length > 0) {
          var clonedScript = document.createElement('script');
          setAttribute(clonedScript, _optionAttributes.zuixLoaded, 'true');
          clonedScript.onload = function () {
              // TODO: ...
          };
          if (this.type && this.type.length > 0)
              clonedScript.type = this.type;
          if (this.text && this.text.length > 0)
              clonedScript.text = this.text;
          if (this.src && this.src.length > 0)
              clonedScript.src = this.src;
          this.get().parentNode.insertBefore(clonedScript, this.get());
        } else */
        Function(el.innerHTML).call(window);
      }
    });

    initializeTemplateFields(v);

    // trigger `view:process` hook when the view is ready to be processed
    this.trigger(this, 'view:process', v);
  } else {
    // load inline view
    if (this._container != null && this.componentId !== 'default') {
      this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
      // remove z-view attribute if present on root node
      util.dom.setAttribute(this._view, _optionAttributes.zView, null);
      this._container.appendChild(this._view);
      this._view = this._container;
    } else {
      this._view = view;
    }
  }

  const v = z$(this._view);

  initializeTemplateFields(v);

  // Disable loading of nested components until the component is ready
  v.find(util.dom.queryAttribute(_optionAttributes.zLoad, null, util.dom.cssNot(_optionAttributes.zLoaded)))
      .each((i, el, $el) => $el.attr(_optionAttributes.zLoaded, 'false'));

  // View style encapsulation
  this.checkEncapsulation();

  this.modelToView();

  _log.t(this.componentId, 'view:attach', 'timer:view:stop');
  return this;
};

/**
 * Gets, within the component's view, elements with `#` (same as `z-field`)
 * attribute matching the given `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
```html
<div z-load="default" z-context="field-test">
  <h1 #title>Loading context...</h1>
</div>

<script>
zuix.context('field-test', (ctx) => {
  ctx.field('title')
     .html('Context ready.');
});
</script>
```
<h5>Result</h5>
<div z-load="default" z-context="field-test">
  <h6 #title>Loading context...</h6>
</div>
<script>
zuix.context('field-test', (ctx) => {
  ctx.field('title')
     .html('Context ready.');
});
</script>
 *
 * @param {!string} fieldName Value to match in the *z-field* attribute
 * @return {ZxQuery} A `{ZxQuery}` object wrapping the matching element(s).
 */
ComponentContext.prototype.field = function(fieldName) {
  const $el = zuix.field(fieldName, this._view, this);
  $el.on = (eventPath, eventHandler, eventData, isHook) => {
    // route to another event (-> linked to another event)
    if (typeof eventHandler === 'string') {
      const eh = eventHandler;
      eventHandler = () => {
        if (this._c) {
          this._c.trigger(eh, eventData, isHook);
        }
      };
    }
    return z$.ZxQuery.prototype.on.call($el, eventPath, eventHandler);
  };
  return $el;
};

/**
 * View style encapsulation
 * @private
 */
ComponentContext.prototype.checkEncapsulation = function() {
  const v = z$(this._view);
  const cssId = this.getCssId();
  if (v.length() && this._options.css !== false) {
    v.attr(cssId, ''); // this will also tell when multiple controllers are handling the same view
    // if both the container and the style are null
    // then this is just a controller attached to a pre-existent view
    if (this._container != null || this._style != null) {
      // view style encapsulation
      const q = '*' +
          util.dom.cssNot(_optionAttributes.zLoad).getAll();
      // mark all elements with a css identifier attribute
      v.find(q).each((i, el, $el) => $el.attr(cssId, ''));
      // start view observer for dynamically adding the css identifier
      // attribute to elements added after view creation
      this._viewObserver.start();
      // since this is a component, remove the 'controller only' flag
      v.attr(_optionAttributes.resourceType.controller, null);
    } else {
      // this is a controller only instance, add the 'controller only' flag
      // so that this instance view will inherit styles from the parent component
      v.attr(_optionAttributes.resourceType.controller, '');
    }
  }
};

/**
 * Gets/Sets the style of the component's view.
 * The `css` argument can be a string containing all
 * styles definitions or a reference to a style
 * element.
 * If no argument is given, then the current style
 * element is returned.
 *
 * @example
```js
ctx.style("p { font-size: 120%; } .hidden { display: 'none'; }");
```
 *
 * @param {string|Element|undefined} [css] The CSS string or style element
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.style = function(css) {
  if (typeof css === 'undefined') return this._style;
  const cssId = this.getCssId();
  _log.t(this.componentId, 'view:style', 'timer:view:start', cssId);
  const shadowRoot = util.dom.getShadowRoot(this._view);
  if (css == null || css instanceof Element) {
    this._css = (css instanceof Element) ? css.innerText : css;
    this._style = z$.appendCss(css, this._style, this.componentId + '@' + cssId, shadowRoot);
  } else if (typeof css === 'string') {
    // store original unparsed css (might be useful for debugging)
    this._css = css;

    // trigger `css:parse` hook before assigning content to the view
    const hookData = {content: css};
    this.trigger(this, 'css:parse', hookData);
    css = hookData.content;

    // reset css
    let resetCss = '';
    if (this.options().resetCss === true) {
      resetCss = ':host { all: initial; }';
    }

    // nest the CSS inside [z-component='<componentId>']
    // so that the style is only applied to this component type
    const cssIdAttr = '[' + cssId + ']';
    if (!shadowRoot) {
      css = z$.wrapCss(
          cssIdAttr,
          resetCss + '\n' + css,
          this.options().encapsulation === true
      );
    }

    // output css
    this._style = z$.appendCss(css, this._style, this.componentId + '@' + cssId, shadowRoot);
  }
  if (!shadowRoot) {
    this.checkEncapsulation();
  }
  // TODO: should throw error if ```css``` is not a valid type
  _log.t(this.componentId, 'view:style', 'timer:view:stop', cssId);
  return this;
};
/**
 * Gets/Sets the data model of the component. When getting `model()`,
 * the returned object is an *observable* wrapped instance of the
 * originally provided `model`, that will automatically trigger
 * the update of any bound field when a property in the model's
 * changes.
 *
 * @example
```html
<div z-load="default" z-context="model-test">
  <h1 z-field="title"></h1>
  <label>Update title</label>
  <input type="text" z-field="title-input" />
</div>

<script>
zuix.context('model-test', (ctx) => {
  const model = ctx.model({
    title: 'Test title'
  });
  ctx.field('title-input')
     .value(model.title)
     .on('input', (e, input) =>
        { model.title = input.value(); });
});
</script>
```

In this example, when the text in the input box is changed, the
new value is assigned to *model.title* property, and this will
automatically trigger the update of the *h1* element's content
in the view, because it is bound to the *title*'s field (`z-field="title"`).
For further info, see [Data binding](../../../view/#data_binding) in the View's chapter.

<h5>Result</h5>
<div z-load="default" z-context="model-test">
  <h6 z-field="title" style="min-height:24px"></h6>
  <label for="title_input">Update title</label>
  <input type="text" id="title_input" z-field="title-input" maxlength="30" />
</div>
<script>
zuix.context('model-test', (ctx) => {
  const model = ctx.model({
    title: 'Test title'
  });
  ctx.field('title-input')
     .value(model.title)
     .on('input', (e, input) => {
        model.title = input.value().replace(/[\u00A0-\u9999<>\&]/g, function(i) {
           return '&#'+i.charCodeAt(0)+';';
        });
     });
});
</script>
 *
 * @param {object|undefined} [model] The model object
 * @return {object}
 */
ComponentContext.prototype.model = function(model) {
  if (typeof model === 'undefined' || this._model === model) {
    return this._model;
  }
  // unsubscribe previous model observable
  if (this._model !== null && typeof this._model !== 'function') {
    zuix.observable(this._model)
        .unsubscribe(this._modelListener);
  }
  this._model = model;
  if (model != null) {
    // subscribe to new model observable
    if (typeof model !== 'function') {
      this._model = zuix.observable(model)
          .subscribe(this._modelListener)
          .proxy;
    }
    this.modelToView();
    // call controller `update` method when whole model is updated
    if (this._c != null && this._c.update) {
      this._c.update.call(this._c, null, null, null, null, this._c);
    }
  }
  return this._model;
};
/**
 * Gets/Sets the component's controller handler.
 *
 * @param {ContextControllerHandler|undefined} [controller] The controller's handler function
 * @return {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function(controller) {
  if (typeof controller === 'undefined') return this._controller;
  // TODO: should dispose previous context controller first,
  // TODO: alternatively should not allow _controller reassignment and throw an error
  else this._controller = controller; // can be null
  return this;
};

/**
 * Gets/Sets the component's options.
 *
 * @param {ContextOptions|undefined} [options] The JSON options object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.options = function(options) {
  if (options == null) {
    return this._options;
  }
  const o = this._options = this._options || {};
  Object.assign(o, options);
  this.componentId = o.componentId || this.componentId;
  // store index for this component type if not already in
  if (_componentIndex[this.componentId] == null) {
    _componentIndex[this.componentId] = _componentIndex.length;
    _componentIndex.length++;
  }
  this.container(o.container);
  this.view(o.view);
  if (typeof o.css === 'string') {
    this.style(o.css);
  }
  this.controller(o.controller);
  this.model(o.model);
  return this;
};

/**
 * Listens for a component event.
 *
 * @param {string|Array<Object>|JSON} eventPath The event path or object with event name/handler pairs.
 * @param {EventCallback} [eventHandler] The event handler function. Not used if eventPath is an object with event name/handler pairs.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.on = function(eventPath, eventHandler) {
  // TODO: throw error if _c (controller instance) is not yet ready
  this._c.on(eventPath, eventHandler);
  return this;
};
/**
 * Loads the `.css` file and replace the view style of the component.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * ctx.loadCss();
 * // or loads the view css with options
 * ctx.loadCss({
 *     path: 'url/of/style/file.css',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @private
 * @param {object} [options] The options object.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadCss = function(options) {
  const context = this;
  if (!options) options = {};
  let cssPath = context.componentId;
  if (options.path) {
    // path override with explicit option
    cssPath = options.path;
  }

  // lookup for inline cached css
  let inlineStyles = zuix.store('zuix.inlineStyles');
  if (inlineStyles == null) {
    inlineStyles = [];
    zuix.store('zuix.inlineStyles', inlineStyles);
  }
  if (inlineStyles[cssPath] != null) {
    context.style(inlineStyles[cssPath]);
    if (options.success) {
      (options.success).call(context, inlineStyles[cssPath], context);
    }
    if (options.then) {
      (options.then).call(context, context);
    }
  } else {
    const inlineStyle = z$().find('style[media="#' + cssPath + '"],style[media="' + cssPath + '"]');
    if (inlineStyle.length()) {
      const styleElement = inlineStyle.get(0);
      const viewCss = styleElement.innerText;
      context.style(viewCss);
      inlineStyle.detach();
      inlineStyles[cssPath] = viewCss;
      if (options.success) {
        (options.success).call(context, viewCss, context);
      }
      if (options.then) {
        (options.then).call(context, context);
      }
    } else {
      if (cssPath == context.componentId) {
        cssPath += '.css';
      }
      fetch(zuix.getResourcePath(cssPath))
          .then((response) => response.text())
          .then((viewCss) => {
            context.style(viewCss);
            if (options.success) {
              (options.success).call(context, viewCss, context);
            }
          }).catch((e) => {
            _log.e(e, context);
            if (options.error) {
              (options.error).call(context, e, context);
            }
          }).finally(() => {
            if (options.then) {
              (options.then).call(context, context);
            }
          });
    }
  }
  return this;
};
/**
 * Loads the `.html` file and replace the view markup code of the component.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * ctx.loadHtml();
 * // or loads the view html with options
 * ctx.loadHtml({
 *     path: 'url/of/view/file.html',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @private
 * @param {object} [options] The options object.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadHtml = function(options) {
  const context = this;
  let htmlPath = context.componentId;
  if (!options) options = {};
  if (options.path) {
    // path override with explicit option
    htmlPath = options.path;
  }
  // cache inline "z-view" html
  let inlineViews = zuix.store('zuix.inlineViews');
  if (inlineViews == null) {
    inlineViews = [];
    zuix.store('zuix.inlineViews', inlineViews);
  }
  if (inlineViews[htmlPath] != null) {
    context.view(inlineViews[htmlPath]);
    if (options.success) {
      (options.success).call(context, inlineViews[htmlPath], context);
    }
    if (options.then) {
      (options.then).call(context, context);
    }
  } else {
    // TODO: check if view caching is working in this case too
    const inlineView = z$().find(util.dom.queryAttribute(
        _optionAttributes.zView,
        htmlPath,
        util.dom.cssNot(_optionAttributes.zComponent)
    ));
    if (inlineView.length()) {
      let styles;
      let inlineElement = inlineView.get(0);
      if (inlineElement.tagName.toLowerCase() === 'template') {
        inlineElement = inlineElement.cloneNode(true);
        styles = inlineElement.content.querySelectorAll('style');
      } else {
        styles = inlineElement.querySelectorAll('style[media="#"]');
      }
      if (styles) {
        for (const s of styles) {
          s.setAttribute('media', '#' + context.componentId);
        }
      }
      inlineViews[htmlPath] = inlineElement.innerHTML;
      if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement))) {
        // TODO: test this case better (or finally integrate some unit testing =))
        // TODO: "html:parse" will not fire in this case (and this is the wanted behavior)
        inlineView.attr(_optionAttributes.zView, null);
        context._view = inlineElement;
        // trigger `view:process` hook
        this.trigger(this, 'view:process', z$(context.view()));
      } else {
        context.view(inlineElement.innerHTML);
      }
      if (options.success) {
        (options.success).call(context, inlineElement.innerHTML, context);
      }
      if (options.then) {
        (options.then).call(context, context);
      }
    } else {
      const cext = options.cext ? options.cext : '.html';
      if (htmlPath == context.componentId) {
        htmlPath += cext;
      }
      fetch(zuix.getResourcePath(htmlPath))
          .then((response) => response.text())
          .then((viewHtml) => {
            context.view(viewHtml);
            if (options.success) {
              (options.success).call(context, viewHtml, context);
            }
          }).catch((e) => {
            _log.e(e, context);
            if (options.error) {
              (options.error).call(context, e, context);
            }
          }).finally(() => {
            if (options.then) {
              (options.then).call(context, context);
            }
          });
    }
  }
  return this;
};
/**
 * Creates the data model out of all `z-field` elements
 * declared in the component's view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.viewToModel = function() {
  _log.t(this.componentId, 'view:model', 'timer:vm:start');
  const model = {};
  const $view = z$(this._view);
  // create data model from inline view fields
  $view.find(util.dom.queryAttribute(_optionAttributes.zField))
      .each((i, el, $el) => {
        if (!zuix.isDirectComponentElement($view, $el)) {
          return true;
        }
        const name = $el.attr(_optionAttributes.zField);
        // TODO: the following code is disabled because
        //       causes "proxy revoked" exception when unloading and reloading a component
        // dotted field path to nested objects
        /*
        if (name.indexOf('.')>0) {
          const path = name.split('.');
          let cur = model;
          for (let p = 0; p < path.length - 1; p++) {
            if (typeof cur[path[p]] === 'undefined') {
              cur[path[p]] = {};
            }
            cur = cur[path[p]];
          }
          cur[path[path.length - 1]] = value;
        } else*/ model[name] = el;
      });
  this._model = zuix.observable(model)
      .subscribe(this._modelListener)
      .proxy;
  // TODO: should call this._c.update(....)
  _log.t(this.componentId, 'view:model', 'timer:vm:stop');
  return this;
};
/**
 * Triggers the update of all `z-field` elements in the view
 * that are bound to the model's fields. If the `inherits="true"` attribute
 * is present on a field, data can be inherited from parent component.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.modelToView = function() {
  _log.t(this.componentId, 'model:view', 'timer:mv:start');
  if (this._view != null) {
    // the '#' member contains all `z-field` mapped as a context['#'] property (ZxQuery object)
    this['#'] = {};
    const $view = z$(this._view);
    $view.find(util.dom.queryAttribute(_optionAttributes.zField)).each((i, el, $el) => {
      if (!zuix.isDirectComponentElement($view, $el) && $el.attr('inherits') !== 'true') {
        return true;
      }
      let boundField = $el.attr(_optionAttributes.zBind);
      if (boundField == null) {
        boundField = $el.attr(_optionAttributes.zField);
      }
      if (typeof this._model === 'function') {
        // use a data model binding adapter
        // to resolve all model fields' values
        queryAdapter(this, $view, $el, this._model, boundField);
      } else {
        let boundData = util.propertyFromPath(this._model, boundField);
        const altField = util.hyphensToCamelCase(boundField);
        const altData = util.propertyFromPath(this._model, altField);
        if (boundData == null && altData != null) {
          boundField = altField;
          boundData = util.propertyFromPath(this._model, boundData);
        }
        if (typeof boundData === 'function') {
          // use data model's field binding adapter
          // to resolve boundField's value
          queryAdapter(this, $view, $el, boundData, boundField);
        } else if (boundData != null) {
          // use default binding method
          // to resolve boundField's value
          dataBind(el, boundData);
        }
      }
    });
    // new fields might been have added after data-binding
    $view.find(util.dom.queryAttribute(_optionAttributes.zField)).each((i, el, $el) => {
      if (!zuix.isDirectComponentElement($view, $el) && $el.attr('inherits') !== 'true') {
        return true;
      }
      let boundField = $el.attr(_optionAttributes.zBind);
      if (boundField == null) {
        boundField = $el.attr(_optionAttributes.zField);
      }
      // map `z-field`s as properties of the context's member '#' if the variable name is valid
      try {
        const f = util.hyphensToCamelCase(boundField);
        Function('function testName(){ const ' + f + ' = "test"; }');
        this['#'][f] = this.field(boundField);
      } catch (e) {
        // TODO: should at least log a 'Warning: unscriptable field name'
        //console.log('ERROR', e);
      }
    });
  }
  _log.t(this.componentId, 'model:view', 'timer:mv:stop');
  return this;
};

/**
 * Gets the CSS identifier of this component's style.
 *
 * @return {string} The css-id attribute of this component.
 */
ComponentContext.prototype.getCssId = function() {
  let override = '';
  if (typeof this._options.css === 'string') {
    override = '_' + this.contextId;
  }
  return _optionAttributes.cssIdPrefix + getComponentIndex(this) + override;
};

/**
 * Gets the base path of this component.
 * @property ComponentContext.prototype.path
 * @type {string}
 */
Object.defineProperty(ComponentContext.prototype, 'path', {
  get: function path() {
    const cid = this.componentId;
    const pathIndex = cid.lastIndexOf('/');
    if (pathIndex < 0) {
      return cid;
    }
    return cid.substring(0, pathIndex + 1);
  }
});
/**
 * Gets the name of this component (last part of the path).
 * @property ComponentContext.prototype.name
 * @type {string}
 */
Object.defineProperty(ComponentContext.prototype, 'name', {
  get: function name() {
    const cid = this.componentId;
    const pathIndex = cid.lastIndexOf('/');
    if (pathIndex < 0) {
      return cid;
    }
    return cid.substring(pathIndex + 1);
  }
});

/**
 * Access the view of this component. Use this property to register event handlers for elements in this view to take advantage of automatic event unsubscription and view fields caching.
 * @property ComponentContext.prototype.$
 * @type {ZxQuery}
 */
Object.defineProperty(ComponentContext.prototype, '$', {
  get: function $() {
    return this._c && this._c.view();
  }
});

module.exports = ComponentContext;


/***/ }),

/***/ 211:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const _optionAttributes =
    __webpack_require__(541);

const LIBRARY_PATH_DEFAULT = 'https://zuixjs.github.io/zkit/lib/1.2/';

/**
 * TODO: describe this...
 *
 * @param {Element|ZxQuery|undefined} [element] Scan and process loadable elements inside `element`.
 * @return {Componentizer}
 */
Componentizer.prototype.componentize = function(element) {
  if (isBusy) {
    z$().one('componentize:step', () =>
      requestAnimationFrame(() => {
        isBusy = false;
        zuix.componentize(element);
      })
    );
    return this;
  }
  isBusy = true;
  zuix.trigger(this, 'componentize:begin');
  zuix.$().trigger('componentize:begin');
  zuix.resolveImplicitLoad(element);
  addRequest(element);
  loadNext(element);
  return this;
};

Componentizer.prototype.applyOptions = function(element, options) {
  applyOptions(element, options);
  return this;
};

Componentizer.prototype.loadInline = function(element, options) {
  loadInline(element, options);
  return this;
};

Componentizer.prototype.resolvePath = function(path) {
  return resolvePath(path);
};

/**
 *
 * @return {boolean}
 */
Componentizer.prototype.willLoadMore = function() {
  return _componentizeQueue.length > 0 || _componentizeRequests.length > 0;
};

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Componentizer.prototype.lazyLoad = function(enable, threshold) {
  return lazyLoad(enable, threshold);
};


Componentizer.prototype.dequeue = function(element) {
  for (let i = 0; i < _componentizeQueue.length; i++) {
    const item = _componentizeQueue[i];
    if (item.element === element) {
      _componentizeQueue.splice(i, 1);
      break;
    }
  }
  return this;
};


/**
 *
 * @param {Zuix} zuixInstance
 * @return {Componentizer}
 */
Componentizer.prototype.setHost = function(zuixInstance) {
  zuix = zuixInstance;
  return this;
};

module.exports = function() {
  return new Componentizer();
};


// ---------------------------------------------


const _log =
    __webpack_require__(381)('ComponentContext.js');
const util =
    __webpack_require__(826);
const z$ =
    __webpack_require__(917);

/** @private */
const _componentizeRequests = [];
/** @private */
const _componentizeQueue = [];
/** @private */
const _componentizeStats = {};
/** @private */
const _lazyElements = [];
/** @private */
const _lazyContainers = [];

/** @private */
const TaskItem = function() {
  return {
    /** @type {Element} */
    element: null,
    /** @type {number} */
    priority: 0,
    /** @type {boolean} */
    visible: true,
    /** @type {boolean} */
    lazy: false
  };
};

/** @private */
const _lazyUpdateScrollRefresh = 150;

/** @private */
let _disableLazyLoading = false;
/** @private */
let _lazyLoadingThreshold = 1;

/** @type {Zuix} **/
let zuix = null;

let isBusy = false;

/**
 *
 * @class
 * @constructor
 */
function Componentizer() {
  // ...
}
/**
 * Lazy Loading settings.
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Read ahead tolerance (default is 1.0 => 100% of view size).
 * @return {boolean}
 */
function lazyLoad(enable, threshold) {
  if (enable != null) {
    _disableLazyLoading = !enable;
  }
  if (threshold != null) {
    _lazyLoadingThreshold = threshold;
  }
  return !_disableLazyLoading;
}
/** @private */
function addRequest(element) {
  if (element == null) {
    element = document;
  }
  if (!_componentizeRequests.indexOf(element)) {
    _componentizeRequests.push(element);
  }
}

/** @private */
function queueLoadables(element) {
  if (element == null && _componentizeRequests.length > 0) {
    element = _componentizeRequests.unshift();
  }
  if (element instanceof z$.ZxQuery) {
    element = element.get();
  }
  // Select all loadable elements
  const q = util.dom.queryAttribute(_optionAttributes.zLoad, null, util.dom.cssNot(_optionAttributes.zLoaded));
  let waitingLoad = z$(element).find(q);
  waitingLoad = Array.prototype.slice.call(waitingLoad._selection);
  // Process elements options
  const waitingTasks = [];
  for (let w = 0; w < waitingLoad.length; w++) {
    const el = waitingLoad[w];
    let pri = +(util.dom.getAttribute(el, _optionAttributes.zPriority));
    if (isNaN(pri)) pri = 0;
    // adjust priority by element level
    let level = 0;
    let parent = el.parentNode;
    let ignore = false;
    while (parent != null && parent !== document) {
      level++;
      if (util.dom.getAttribute(parent, _optionAttributes.zView) != null) {
        ignore = true;
        break;
      }
      parent = parent.parentNode;
    }
    if (!ignore) {
      const task = new TaskItem();
      task.element = el;
      task.priority = pri + (level * 1000);
      waitingTasks.push(task);
    } else {
      // _log.w("Element belongs to a template: process only when attached to a context instance.", el);
    }
  }
  let added = 0;
  // add selected elements to the requests queue
  for (let i = 0; i < waitingTasks.length; i++) {
    let alreadyAdded = false;
    for (let j = 0; j < _componentizeQueue.length; j++) {
      if (waitingTasks[i].element === _componentizeQueue[j].element) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      // Add attributes to element if z-options was provided
      const el = waitingTasks[i].element;
      const options = util.dom.getAttribute(el, _optionAttributes.zOptions);
      applyOptions(el, options);
      // Add task to the queue
      _componentizeQueue.push(waitingTasks[i]);
      added++;
    }
  }

  if (_componentizeStats.queued !== _componentizeQueue.length || _componentizeStats.added !== added) {
    _log.t('componentize:count', _componentizeQueue.length, added);
    _componentizeStats.queued = _componentizeQueue.length;
    _componentizeStats.added = added;
  }

  if (added === 0 || (_componentizeRequests.length === 0 && _componentizeQueue.length === 0)) {
    zuix.trigger(this, 'componentize:end');
    zuix.$().trigger('componentize:end');
  } else {
    zuix.$().trigger('componentize:step');
  }

  isBusy = false;
}

/** @private */
function getNextLoadable() {
  // sort by priority (elements with lower pri number get processed first)
  _componentizeQueue.sort(function(a, b) {
    return a.priority - b.priority;
  });
  let job = null;
  let item = _componentizeQueue.length > 0 ? _componentizeQueue.shift() : null;
  while (item != null && item.element != null) {
    const el = item.element;
    // defer element loading if lazy loading is enabled and the element is not in view
    const isLazy = lazyElementCheck(el);
    if (lazyLoad() && isLazy) {
      item.lazy = true;
      item.visible = z$.getPosition(el, _lazyLoadingThreshold).visible;
    } else {
      item.lazy = false;
      item.visible = true;
    }
    if (el != null && item.visible) {
      job = {
        item: item,
        cancelable: item.lazy
      };
      break;
    }
    if (_componentizeQueue.length > 0) {
      item = _componentizeQueue.shift();
    } else break;
  }
  return job;
}

/** @private */
function loadNext(element) {
  queueLoadables(element);
  const job = getNextLoadable();
  if (job != null && job.item != null && job.item.element != null) {
    const el = job.item.element;
    z$(el).one('component:loaded', () => zuix.componentize(el));
    loadInline(el);
  }
}

/** @protected */
function loadInline(element, opts) {
  const v = z$(element);
  if (v.attr(_optionAttributes.zLoaded) != null || v.parent('pre,code').length()) {
    //_log.w('Skipped', element);
    return false;
  }
  v.attr(_optionAttributes.zLoaded, 'true');

  /** @type {ContextOptions} */
  let options = v.attr(_optionAttributes.zOptions);
  if (options) {
    options = parseOptions(element, options);
    // copy passed options
    options = util.cloneObject(options) || {};
  } else if (v.get().__zuix_loadOptions != null) {
    options = v.get().__zuix_loadOptions;
  } else {
    options = {};
  }

  if (opts) {
    Object.assign(options, opts);
  }

  const contextId = v.attr(_optionAttributes.zContext);
  if (contextId) {
    // inherit options from context if already exists
    const ctx = zuix.context(contextId);
    if (ctx !== null) {
      options = ctx.options();
    }
    options.contextId = contextId;
  }

  // Automatic view/container selection
  if (!options.view && !v.isEmpty()) {
    options.view = element;
    options.viewDeferred = true;
  } else if (!options.view && !options.container && v.isEmpty() && v.attr(_optionAttributes.resourceType.controller) == null) {
    options.container = element;
  }

  const setAsTemplate = function() {
    v.attr(_optionAttributes.zComponent, null);
    // View-only templates have no controller
    if (!options.controller) {
      options.controller = function() {};
    }
  };
  let componentId = v.attr(_optionAttributes.zLoad);
  if (!componentId) {
    return false;
  } else {
    componentId = resolvePath(componentId);
    v.attr(_optionAttributes.zLoad, componentId);
    // check for `view` and `ctrl` type attributes
    if (componentId !== 'default' && v.attr(_optionAttributes.resourceType.view) !== null) {
      setAsTemplate();
    } else if (componentId === 'default' || v.attr(_optionAttributes.resourceType.controller) !== null) {
      options.view = options.view || element;
      options.viewDeferred = true;
      options.html = options.html || false;
      options.css = options.css || false;
      // custom inline view style
      const styleElement = v.children('[media="#"]');
      if (styleElement.length() && styleElement.parent().get() === v.get()) {
        if (options.css === false) {
          options.css = '';
        }
        styleElement.each((i, el, $el) =>
          options.css += '\n' + options.css + $el.html()
        );
      }
      if (componentId === 'default') {
        options.controller = options.controller || function() {};
      }
    }
  }

  // inline attributes have precedence over ```options```

  const exclusionList = [':on', ':model', ':behavior', ':ready']; // these are evaluated after component is created
  const optionAttributes = Array.from(v.get().attributes)
      .filter((a) => a.nodeName.startsWith(':') && !exclusionList.find((t) => a.nodeName.startsWith(t)));
  optionAttributes.forEach((attribute) => {
    const attr = attribute.nodeName;
    const path = attr.match(/[^:]+/g);
    let co = options;
    path.forEach((p, i) => {
      p = util.hyphensToCamelCase(p);
      if (i === path.length - 1) {
        let val;
        try {
          val = Function('return ' + attribute.nodeValue + ';')();
        } catch (e) {
          _log.warn(path.join(':'), p, attribute.nodeValue, e);
        }
        return co[p] = val;
      }
      co = co[p] = co[p] || {};
    });
  });

  const on = v.attr(_optionAttributes.zOn);
  if (on) {
    options.on = parseOptions(element, on);
  }

  const behavior = v.attr(_optionAttributes.zBehavior);
  if (behavior) {
    options.behavior = parseOptions(element, behavior);
  }

  const model = v.attr(_optionAttributes.zModel);
  if (model) {
    options.model = parseOptions(element, model);
  }

  const using = v.attr(_optionAttributes.zUsing);
  if (using) {
    options.using = using;
  }

  const priority = v.attr(_optionAttributes.zPriority);
  if (priority) {
    options.priority = +(priority);
  }

  zuix.load(componentId, options);

  return true;
}

/** @private */
function resolvePath(path) {
  if (path[0] === '@') {
    let config = zuix.store('config');
    let libraryPath = LIBRARY_PATH_DEFAULT;
    if (config != null && config[location.host] != null) {
      config = config[location.host];
    }
    if (config != null) {
      switch (typeof config.libraryPath) {
        case 'object':
          z$.each(config.libraryPath, (k, v) => {
            if (path.startsWith(k + '/')) {
              libraryPath = v;
              return false;
            }
            return true;
          });
          break;
        case 'string':
          libraryPath = config.libraryPath;
          break;
      }
    }
    path = libraryPath + path.substring(path.indexOf('/') + 1);
  }
  return path;
}

/** @private */
function parseOptions(element, attributeValue) {
  if (typeof attributeValue === 'string') {
    const parentComponent = z$(element).parent(util.dom.queryAttribute(_optionAttributes.zLoad));
    if (parentComponent.get()) {
      // parent component context should be already loaded
      const context = zuix.context(parentComponent);
      try {
        return context._refreshHandler
            .runScriptlet(element, `[${attributeValue}][0]`);
      } catch (e) { }
    }
    if (attributeValue.trim().startsWith('{') && attributeValue.trim().endsWith('}')) {
      attributeValue = Function('return ' + attributeValue)();
    } else {
      attributeValue = util.propertyFromPath(window, attributeValue);
    }
  }
  return attributeValue;
}

/** @private */
function applyOptions(element, options) {
  options = parseOptions(element, options);
  // TODO: should check if options object is valid
  if (element && options) {
    if (options.componentId) {
      util.dom.setAttribute(element, _optionAttributes.zLoad, options.componentId.toString().toLowerCase());
    }
    if (options.contextId) {
      util.dom.setAttribute(element, _optionAttributes.zContext, options.contextId.toString().toLowerCase());
    }
    if (options.lazyLoad) {
      util.dom.setAttribute(element, _optionAttributes.zLazy, options.lazyLoad.toString().toLowerCase());
    }
    // TODO: eventually map other attributes from options
  }
}

// ------------ Lazy Loading

/** @private */
function getLazyElement(el) {
  for (let l = 0; l < _lazyElements.length; l++) {
    const le = _lazyElements[l];
    if (le.element === el) {
      return le;
    }
  }
  return null;
}

/** @private */
function addLazyElement(el) {
  const le = {
    element: el
  };
  _lazyElements.push(le);
  return le;
}

/** @private */
function getLazyContainer(el) {
  for (let l = 0; l < _lazyContainers.length; l++) {
    const ls = _lazyContainers[l];
    if (ls.element === el) {
      return ls;
    }
  }
  return null;
}

/** @private */
function addLazyContainer(el) {
  const lc = {
    element: el
  };
  _lazyContainers.push(lc);
  return lc;
}

/** @private */
function lazyElementCheck(element) {
  // Check if element has explicit lazyLoad=false flag set
  const $el = z$(element);
  const lazyParent = $el.parent(`[${_optionAttributes.zLazy}]`);
  if ($el.attr(_optionAttributes.zLazy) === 'false' ||
      (lazyParent.length() && lazyParent.attr(_optionAttributes.zLazy) === 'false') ) {
    return false;
  }
  // Check if element is already added to Lazy-Element list
  if (!getLazyElement(element)) {
    // Check if element inherits lazy-loading from a parent lazy container/scroll
    const q = util.dom.queryAttribute(_optionAttributes.zLazy, 'scroll') + ',' +
            util.dom.queryAttribute(_optionAttributes.zLazy, 'true');
    const p = $el.parent();
    const lazyContainer = p.length() ? p.parent(q).get() : null;
    if (lazyContainer) {
      addLazyElement(element);
      // Check if the lazy container is already added to the lazy container list
      let lc = getLazyContainer(lazyContainer);
      if (!lc) {
        lc = addLazyContainer(lazyContainer);
        // if it's of type 'scroll' attach 'scroll' event handler
        if (util.dom.getAttribute(lazyContainer, _optionAttributes.zLazy) === 'scroll') {
          (function(instance, lc) {
            let lastScroll = new Date().getTime();
            let timeout;
            z$(lc === document.body ? window : lc).on('scroll', () => {
              const now = new Date().getTime();
              if (now - lastScroll > _lazyUpdateScrollRefresh) {
                lastScroll = now;
                loadNext(lc);
              } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => loadNext(lc), 100);
              }
            });
          })(this, lazyContainer);
        }
      }
      return true;
    } else if ($el.attr(_optionAttributes.zLazy) === 'true') {
      // element has explicit lazyLoad=true flag set
      addLazyElement(element);
      return true;
    }
  } else return true;
  return false;
}


/***/ }),

/***/ 561:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const z$ =
    __webpack_require__(917);
const util =
    __webpack_require__(826);

/**
 * Function called when the data model of the component is updated
 *
 * @callback ContextControllerUpdateCallback
 * @param {Object} target The target object.
 * @param {string} key The name of the property.
 * @param {Object} value The value of the property.
 * @param {string} path The full property path (dotted notation).
 * @param {Object} old The target object before the update.
 * @return undefined
 */

/**
 * Function that gets called after loading and before the component is created.
 *
 * @callback ContextControllerInitCallback
 */

/**
 * Function that gets called after loading, when the component is actually created and ready.
 *
 * @callback ContextControllerCreateCallback
 */

/**
 * Function called when the component is about to be disposed.
 *
 * @callback ContextControllerDisposeCallback
 */

/**
 * ContextController constructor.
 *
 * @class
 * @property {Logger} log The component's built-in logger.
 * @property {ContextControllerInitCallback} init If set, this function gets called before component is created and before applying context options.
 * @property {ContextControllerCreateCallback} create If set, this function gets called after loading, when the component is created and its view (if provided) is loaded.
 * @property {ContextControllerUpdateCallback} update If set, this function gets called each time the data model is updated.
 * @property {ContextControllerDisposeCallback} dispose If set, this function gets called when the component is about to be disposed.
 *
 * @constructor
 * @param {ComponentContext} context
 * @return {ContextController}
 */
function ContextController(context) {
  const _t = this;
  _t._view = null;
  _t.context = context;

  /**
     * @protected
     * @type {!Array.<Element>}
     * */
  _t._childNodes = [];
  /**
   * @type {function}
   * @ignore
   */
  _t.saveView = () => {
    _t.restoreView();
    _t.view()
        .children()
        .each((i, el) => _t._childNodes.push(el));
  };
  _t.restoreView = () => {
    if (_t._childNodes.length > 0) {
      _t.view().html('');
      z$.each(_t._childNodes, (i, el) =>
        _t.view().append(el));
      _t._childNodes.length = 0;
    }
  };

  _t.on = (eventPath, handler) => {
    if (typeof eventPath === 'object' && handler == null) {
      z$.each(eventPath, (evt, hnd) =>
        _t.on(evt, hnd));
      return _t;
    }
    _t.addEvent(eventPath, handler);
    return _t;
  };
  /**
   * @protected
   * @ignore
   */
  _t.mapEvent = (eventMap, target, eventPath, handler) => {
    if (target != null) {
      target.off(eventPath, _t.eventRouter);
      eventMap.push({target, eventPath, handler});
      target.on(eventPath, _t.eventRouter);
    } else {
      // TODO: should report missing target
    }
  };
  /**
   * @protected
   * @ignore
   */
  _t.eventRouter = (e) => {
    const v = _t.view();
    context._behaviorMap.concat(context._eventMap).forEach((em) => {
      if (em.eventPath === e.type && em.handler) {
        em.handler.call(v, e, e.detail, v);
      }
    });
  };

  // create event map from context options
  const options = context.options();
  let handler = null;
  if (options.on != null) {
    z$.each(options.on, (ep, handler) =>
      ep.split(/[\s|,]+/g).map((evt) => _t.addEvent(evt, handler)));
  }
  // create behavior map from context options
  if (options.behavior != null) {
    for (const bp in options.behavior) {
      if (options.behavior.hasOwnProperty(bp)) {
        handler = options.behavior[bp];
        bp.split(/[\s|,]+/g).map((evt) => _t.addEvent(evt, handler));
      }
    }
  }

  const isClass = (v) =>
    typeof v === 'function' && /^\s*class\s+/.test(v.toString());
  if (isClass(context.controller())) {
    // >= ES6
    const ctrl = new ((context.controller()).bind(_t, _t))();
    context.controller(ctrl);
  } else {
    // <= ES5
    context.controller().call(_t, _t);
  }

  return _t;
}

/**
 * Adds an event handler.
 *
 * @param {string} eventPath Event path.
 * @param {EventCallback} handler Event hanler.
 * @return {ContextController}
 */
ContextController.prototype.addEvent = function(eventPath, handler) {
  this.mapEvent(this.context._eventMap, this.view(), eventPath, handler);
  return this;
};
/**
 * Adds a behavior handler.
 *
 * @param {string} eventPath Event path.
 * @param {EventCallback} handler Behavior handler.
 * @return {ContextController}
 */
ContextController.prototype.addBehavior = function(eventPath, handler) {
  this.mapEvent(this.context._behaviorMap, this.view(), eventPath, handler);
  return this;
};
/**
 * Adds a CSS transition effect to the component stylesheet.
 *
 * @param {string} className CSS class name to assign to this transition.
 * @param {Array<Object>|JSON} properties List of CSS properties/values to set.
 * @param {Array<Object>|JSON} options List of transition options.
 */
ContextController.prototype.addTransition = function(className, properties, options) {
  const cssId = this.context.getCssId();
  this.context.$.attr(cssId, '');
  const scope = '[z-component][' + cssId + ']';
  z$.addTransition(
      this.context.componentId + '@' + cssId,
      scope,
      className,
      properties,
      options,
      util.dom.getShadowRoot(this.context.view())
  );
  return this;
};
/**
 * Gets view's field(s) with the specified name.
 * Same as [ComponentContext&ndash;field](../ComponentContext/#field).
 *
 * @param {!string} fieldName Value to match in the *z-field* attribute
 * @return {ZxQuery} A `{ZxQuery}` object wrapping the matching element(s).
 */
ContextController.prototype.field = function(fieldName) {
  return this.context.field(fieldName);
};
/**
 * Clears the fields cache.
 */
ContextController.prototype.clearCache = function() {
  this.context._fieldCache = {};
};
/**
 * Gets the component view or if `filter` argument is passed,
 * gets the view elements matching the given `filter`
 * (shorthand for `cp.view().find(filter)`).
 *
 * @example
```js
 * // get all `checkbox` elements with `.checked` class.
 * var choices = cp.view('input[type="checkbox"].checked');
 * choices.removeClass('.checked');
 * // ...
 * // hide the component's view
 * cp.view().hide();
```
 *
 * @param {(string|undefined)} [filter]
 * @return {ZxQuery}
 */
ContextController.prototype.view = function(filter) {
  const _t = this;
  // context view changed, dispose cached fields from previous attached view
  if (_t.context.view() || _t._view !== _t.context.view()) {
    _t.clearCache();
    // TODO: !!!!
    // TODO: dispose also events on view change (!!!)
    // TODO: !!!!
    _t._view = z$(_t.context.view());
    _t._view.field = (fieldName) =>
      _t.context.field(fieldName);
  }
  if (filter) {
    return _t._view.find(filter);
  } else if (_t._view) {
    return _t._view;
  } else {
    throw new Error('Not attached to a view yet.');
  }
};
/**
 * Gets/Sets the data model of the component.
 * Same as [ComponentContext&ndash;model](../ComponentContext/#model).
 *
 * @param {object|undefined} [model] The model object
 * @return {ContextController|object}
 */
ContextController.prototype.model = function(model) {
  if (!model) {
    return this.context.model();
  } else this.context.model(model);
  return this;
};
/**
 * Gets the component options.
 * Same as [ComponentContext&ndash;options](../ComponentContext/#options).
 *
 * @return {ContextOptions|any} The component options.
 */
ContextController.prototype.options = function() {
  return this.context.options();
};
/**
 * Triggers the component event `eventPath` with the given
 * `eventData` object. To listen to a component event use the
 * `{ComponentContext}.on(eventPath, handler)` method or
 * in case `isHook` is set to true, use the
 * `zuix.hook(eventPath, handler)` method (global hook event).
 *
 * @example
```js
// somewhere inside the slide-show component controller
cp.trigger('slide:change', slideIndex);

// somewhere in a page hosting the slide-show component
// set component event listeners
zuix.context('my-slide-show')
  .on('slide:change', function(slideIndex) { ... })
  .on(...);
```
 *
 * @param {string} eventPath The event path
 * @param {object} eventData The event data
 * @param {boolean} [isHook] Trigger as global hook event
 * @return {ContextController}
 */
ContextController.prototype.trigger = function(eventPath, eventData, isHook) {
  if (isHook) {
    let target = this.context.container();
    if (!target) {
      target = this.context.view();
    }
    if (target) {
      z$(target)
          .trigger(eventPath, eventData);
    }
    this.context
        .trigger(this.context, eventPath, eventData);
  } else {
    this.view()
        .trigger(eventPath, eventData);
  }
  return this;
};
/**
 * Exposes a method or property declared in the private
 * scope of the controller, as a public member of the
 * component context object.
 *
 * @param {string|JSON} name Name of the exposed method/property, or list of name/value pairs
 * @param {function} [handler] Function or property descriptor.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.expose = function(name, handler) {
  const expose = (m, h) => {
    if (h && (h.get || h.set)) {
      Object.defineProperty(this.context, m, h);
    } else {
      this.context[m] = h;
    }
  };
  if (typeof name === 'object') {
    z$.each(name, (k, v) => expose(k, v));
  } else {
    expose(name, handler);
  }
  return this;
};
/**
 * Loads the `.css` file and replace the current view style of the component.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
```js
// loads 'path/to/component_name.css' by default
cp.loadCss();
// or loads the view css with provided options
cp.loadCss({
    path: 'url/of/style/file.css',
    success: function() { ... },
    error: function(err) { ... },
    then: function() { ... }
});
```
 *
 * @param {object} [options] The options object
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadCss = function(options) {
  this.context
      .loadCss(options);
  return this;
};
/**
 * Loads the `.html` file and replace the view markup of the component.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
```js
// loads 'path/to/component_name.html' by default
cp.loadHtml();
// or loads the view html with provided options
cp.loadHtml({
    path: 'url/of/view/file.html',
    success: function() { ... },
    error: function(err) { ... },
    then: function() { ... }
});
```
 *
 * @param {object} [options] The options object
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadHtml = function(options) {
  this.saveView();
  this.context
      .loadHtml(options);
  return this;
};
/**
 * The component's built-in logger.
 *
 * @type {Logger}
 */
ContextController.prototype.log = /** @type {Logger} */ {};
/**
 * Registers this one as the default controller
 * for the given component type.
 *
 * @example
 *
```js
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.dispose = function() { ... }
}).for('path/to/component_name');
```
 *
 * @param {!string} componentId Component identifier
 * @return {ContextController} The `{ContextController}` itself.
 */
// eslint-disable-next-line no-unused-vars
ContextController.prototype.for = function(componentId) {
  // this method is "attached" from Zuix.js on controller initialization
  return this;
};

module.exports = ContextController;


/***/ }),

/***/ 871:
/***/ (function(module) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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


// noinspection JSClosureCompilerSyntax
/**
 * @class ControllerInstance
 * @param {ContextController} controller The controller instance.
 * @extends {ContextController}
 * @constructor
 */
function ControllerInstance(controller) {
  controller.init = this.onInit.bind(this);
  controller.create = this.onCreate.bind(this);
  controller.dispose = this.onDispose.bind(this);
  controller.update = (target, key, value, path, old) => {
    return this.onUpdate.call(this, target, key, value, path, old);
  };
  Object.assign(this, controller);
  Object.assign(this, Object.getPrototypeOf(controller));
}
/**
 * @type {ContextControllerInitCallback}
 */
ControllerInstance.prototype.onInit = function() {
};
/**
 * @type {ContextControllerCreateCallback}
 */
ControllerInstance.prototype.onCreate = function() {
};
/**
 * @type {ContextControllerDisposeCallback}
 */
ControllerInstance.prototype.onDispose = function() {
};
/**
 * @type {ContextControllerUpdateCallback}
 */
// eslint-disable-next-line no-unused-vars
ControllerInstance.prototype.onUpdate = function(target, key, value, path, old) {
};

module.exports = ControllerInstance;


/***/ }),

/***/ 541:
/***/ (function(module) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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

const OptionAttributes = Object.freeze({
  zModel:
        'z-model',
  zBind:
        'z-bind',
  zBehavior:
        'z-behavior',
  zOn:
        'z-on',
  zComponent:
        'z-component',
  zContext:
        'z-context',
  zField:
        'z-field',
  zLazy:
        'z-lazy',
  zLoad:
        'z-load',
  zLoaded:
        'z-loaded',
  zOptions:
        'z-options',
  zUsing:
        'z-using',
  zPriority:
        'z-priority',
  zView:
        'z-view',
  zuixLoaded:
        'zuix-loaded',
  zReady:
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


/***/ }),

/***/ 643:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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



const _optionAttributes =
    __webpack_require__(541);
const util =
    __webpack_require__(826);

/**
 *
 * @param {ComponentContext} context
 * @constructor
 */
function ViewObserver(context) {
  const _t = this._context = context;
  /**
     *
     * @type {MutationObserver|null}
     * @private
     */
  this._mutationObserver = null;
  /**
     * @private
     * @type {MutationCallback}
     */
  this._mutationCallback =
        /**
         * @param mutationsList
         * @param observer
         * @private
         */
        // eslint-disable-next-line no-unused-vars
        (mutationsList, observer) => {
          const zc = util.dom.queryAttribute(_optionAttributes.zComponent);
          const findNode = (node) => {
            for (let i = 0; i < node.attributes.length; i++) {
              if (node.attributes[i].name.startsWith(_optionAttributes.cssIdPrefix)) {
                return true;
              }
            }
          };
          for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
              mutation.addedNodes.forEach((node) => {
                if (node instanceof Element) {
                  let parent = zuix.$(node).parent(zc);
                  if (parent.get() == null) return;
                  if (_t.options().css !== false && parent.attr(_optionAttributes.resourceType.controller) == null) {
                    if ((parent.get() === _t._container || parent.get() === _t._view)) {
                      if (!findNode(node)) {
                        util.dom.setAttribute(node, _t.getCssId(), '');
                      }
                    }
                  } else {
                    let c = 0;
                    do {
                      c++;
                      parent = parent.parent(zc);
                    } while (c < 10 && parent.get() != null && parent.attr(_optionAttributes.resourceType.controller) != null);
                    if (parent.get()) {
                      parent = zuix.context(parent);
                      if (!findNode(node)) {
                        util.dom.setAttribute(node, parent.getCssId(), '');
                        zuix.$(node).find('*').each(function() {
                          this.attr(parent.getCssId(), '');
                        });
                      }
                    }
                  }
                }
              });
            }
            // TODO: this might be used for improving data binding
            // else if (mutation.type === 'attributes') {
            //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
            // }
          }
        };
}
ViewObserver.prototype.start = function() {
  this.stop();
  const config = {attributes: false, childList: true, subtree: true};
  this._mutationObserver = new MutationObserver(this._mutationCallback);
  this._mutationObserver.observe(this._context._view, config);
};
ViewObserver.prototype.stop = function() {
  if (this._mutationObserver != null) {
    this._mutationObserver.disconnect();
    this._mutationObserver = null;
  }
};

module.exports = ViewObserver;


/***/ }),

/***/ 459:
/***/ (function(module, __unused_webpack_exports, __webpack_require__) {

/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.org
 *
 * @author Generoso Martello  -  https://github.com/genemars
 *
 */



const _log =
    __webpack_require__(381)('Zuix.js');
const util =
    __webpack_require__(826);
const z$ =
    __webpack_require__(917);
const TaskQueue =
    __webpack_require__(65);
const ObjectObserver =
    __webpack_require__(265);
const ComponentContext =
    __webpack_require__(622);
const ContextController =
    __webpack_require__(561);
const ControllerInstance =
    __webpack_require__(871);
const ActiveRefresh =
    __webpack_require__(398);
const _componentizer =
    __webpack_require__(211)();
const _optionAttributes =
    __webpack_require__(541);

__webpack_require__(854);

// Custom objects definition used to generate JsDoc

/**
 * This object can be supplied when loading a component. It can be either passed as argument for the
 * `zuix.load(...) / zuix.loadComponent(...) ` methods, in the javascript code, or with the `z-options` attribute in the HTML code
 * of the component's host element.
 *
 * @typedef {object} ContextOptions
 * @property {Object|undefined} contextId The context id. HTML attribute equivalent: *z-context*. If not specified it will be randomly generated.  HTML attribute equivalent: *z-context*.
 * @property {Element|undefined} container The container element.
 * @property {JSON|undefined} model The data model. HTML attribute equivalent: *z-model*.
 * @property {Element|undefined} view The view element.
 * @property {ContextControllerHandler|undefined} controller The controller handler.
 * @property {Object.<string, EventCallback>|Object.<string, string>|undefined} on The map of event handlers for standard and component's events. An event can also be simply routed to another component's event by specifying the mapped event name string. HTML attribute equivalent: *z-on*.
 * @property {Object.<string, EventCallback>|Object.<string, string>|undefined} behavior The map of event handlers for behaviors. An event can also be simply routed to another component's event by specifying the mapped event name string. HTML attribute equivalent: *z-behavior*.
 * @property {HTMLStyleElement|string|boolean|undefined} css Custom stylesheet to apply to the component's view.
 * @property {boolean|undefined} encapsulation Whether to use style encapsulation or not (**default:** false).
 * @property {boolean|undefined} resetCss Whether to reset view style to prevent inheriting from parent containers (**default:** false).
 * @property {string|undefined} cext When loading content of the view, appends the specified extension instead of *.html*.
 * @property {boolean|string|undefined} html It can be set to `false`, to disable HTML template loading, or it can be set to a string containing the inline HTML template code.
 * @property {boolean|undefined} lazyLoad Enables or disables lazy-loading (**default:** false). HTML attribute equivalent: *z-lazy*.
 * @property {number|undefined} priority Loading priority (**default:** 0). HTML attribute equivalent: *z-priority*.
 * @property {string|undefined} using Comma separated contexts' id list of components used in this context. A variable with camel-case converted name for each referenced context, will be available in the local scripting scope.
 * @property {ContextLoadedCallback|undefined} loaded The loaded callback, triggered once the component is successfully loaded.
 * @property {ContextReadyCallback|undefined} ready The ready callback, triggered once all component's dependencies have been loaded.
 * @property {ContextErrorCallback|undefined} error The error callback, triggered when an error occurs.
 */

/**
 * Callback function triggered if an error occurs when loading a component.
 *
 * @callback ContextErrorCallback
 * @param {Object} error
 * @param {ComponentContext} ctx The component context object (same as `this`).
 * @this {ComponentContext}
 */

/**
 * Callback function triggered when a component is created, after all of its dependencies have been loaded.
 *
 *
 * @callback ContextLoadedCallback
 * @param {ComponentContext} ctx The component context (same as `this`).
 * @this {ComponentContext}
 */

/**
 * Callback function triggered when a component has been successfully loaded.
 *
 * @callback ContextReadyCallback
 * @param {ComponentContext} ctx The component context (same as `this`).
 * @this {ComponentContext}
 */

/**
 * Callback in response to a `zuix.using` request.
 *
 * @callback ResourceUsingCallback
 * @param {string} resourcePath
 * @param {string|object} hashIdOrContext
 */

// TODO: move _contextRoot and _componentCache to a WeakMap

/**
 * @private
 * @type {!Array.<ComponentContext>}
 */
const _contextRoot = [];
/** @private */
const _hooksCallbacks = [];
/** @private */
const _globalControllerHandlers = {};
/** @private **/
const _componentTask = [];
/** @private **/
const _pendingResourceTask = {};
/** @private */
const resourceLoadTask = [];
/**
 * @private
 * @param {String} tid Task id
 * @return {TaskQueue}
 */
const taskQueue = function(tid) {
  if (!_componentTask[tid]) {
    _componentTask[tid] = new TaskQueue(function(tq, eventPath, eventValue) {
      trigger(tq, eventPath, eventValue);
    });
  }
  return _componentTask[tid];
};

/**
 * @private
 * @type {!Array.<ComponentCache>}
 */
let _componentCache = [];
/** @private */
let _contextSeqNum = 0;
/** @private */
let _disableComponentize = false;
/** @private */
const _objectObserver = new ObjectObserver();
/** @private */
const _componentReadyCallbackDelay = 10;

/** @private */
const _implicitLoadDefaultList = [
  util.dom.queryAttribute(_optionAttributes.zContext),
  //  util.dom.queryAttribute(_optionAttributes.zComponent),
  util.dom.queryAttribute(_optionAttributes.zOptions),
  util.dom.queryAttribute(_optionAttributes.zModel + ',:model'),
  util.dom.queryAttribute(_optionAttributes.zOn + ',:on'),
  util.dom.queryAttribute(_optionAttributes.zBehavior + ',:behavior'),
  util.dom.queryAttribute(_optionAttributes.zUsing + ',:using'),
  util.dom.queryAttribute(_optionAttributes.zReady)
];

/**
 *  Allocates a new instance of *zuix.js*, JavaScript library for
 *  component-based development.
 *  A *zuix.js* instance is automatically allocated on page load,
 *  and always available in the global scope as `zuix`.
 *
 * @class Zuix
 * @property {ZxQueryStatic} $ Helper function for manipulating the DOM.
 *
 * @constructor
 * @return {Zuix}
 */
function Zuix() {
  const _t = this;
  _componentizer.setHost(_t);
  /**
   * @type {Array}
   * @private
   */
  this._store = {
    config: {
      'title': 'zUIx.js app',
      'baseUrl': '/',
      'resourcePath': '/app/',
      'libraryPath': {
        '@lib': 'https://zuixjs.github.io/zkit/lib/1.2/',
        '@hgui': 'https://genielabs.github.io/homegenie-web-ui/app/',
        '@cdnjs': 'https://cdnjs.cloudflare.com/ajax/libs/'
      },
      // domain-specific config overrides
      'zuixjs.github.io': {
        'resourcePath': '/zuixjs/app',
        'libraryPath': {
          '@lib': 'https://zuixjs.github.io/zkit/lib/1.2/',
          '@hgui': 'https://genielabs.github.io/homegenie-web-ui/app/',
          '@cdnjs': 'https://cdnjs.cloudflare.com/ajax/libs/'
        }
      }
    },
    /** @type {Object.<string, ActiveRefreshHandler>} */
    handlers: {
      // Default component 'refresh' handler, this should be never overridden
      'sync': function($view, $el, contextData, refreshCallback) {
        const field = $el.attr('@sync') || $el.attr(_optionAttributes.zField);
        $el.on('keyup change keydown', function() {
          const el = $el.get();
          let val = $el.value();
          if ((el.type === 'checkbox' || el.type === 'radio') &&
              !el.checked && contextData[field] == val) {
            val = '';
          }
          if (contextData[field] !== val) {
            contextData[field] = val;
          }
        });
        contextData[field] = $el.value();
      },
      'get': function($view, $el, lastResult, refreshCallback) {
        let code = $el.attr('@get');
        const parts = code.split(' as ');
        code = parts[0];
        const resultAs = parts[1] || 'result';
        const result = _t.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          code = 'const ' + resultAs + ' = args; ' + $el.attr('@set');
          _t.runScriptlet(code, $el, $view, result);
          lastResult = result;
        }
        refreshCallback(lastResult);
      },
      'set': function($view, $el, lastResult, refreshCallback) {
        if ($el.attr('@get')) return;
        _t.runScriptlet($el.attr('@set'), $el, $view);
        refreshCallback(lastResult);
      },
      'disable-if': function($view, $el, lastResult, refreshCallback) {
        const code = $el.attr('@disable-if');
        const result = _t.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          $el.attr({disabled: result ? '' : null});
          lastResult = result;
        }
        refreshCallback(lastResult);
      },
      'hide-if': function($view, $el, lastResult, refreshCallback) {
        const code = $el.attr('@hide-if');
        const result = _t.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          result ? $el.css({visibility: 'hidden'}) : $el.css({visibility: 'visible'});
          lastResult = result;
        }
        refreshCallback(lastResult); // default 100ms delay
      },
      'if': function($view, $el, lastResult, refreshCallback) {
        const code = $el.attr('@if');
        const result = _t.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          if (result) {
            _t.runScriptlet($el.attr('@then'), $el, $view);
          } else {
            _t.runScriptlet($el.attr('@else'), $el, $view);
          }
          lastResult = result;
        }
        refreshCallback(lastResult);
      }
    }
  };
  /**
   * @type {!Array.<ZxQuery>}
   * @private
   **/
  this._fieldCache = [];
  return this;
}

/**
 *
 * @private
 * @param {ContextControllerHandler} handler The context controller handler
 * @return {ContextControllerHandler}
 */
function controller(handler) {
  if (typeof handler['for'] !== 'function') {
    handler['for'] = function(componentId) {
      _globalControllerHandlers[componentId] = handler;
      return handler;
    };
  }
  return handler;
}

/**
 *
 * @private
 * @param {!string} fieldName Value to match in the `z-field` attribute.
 * @param {!Element|!ZxQuery} [container] Starting DOM element for this search (**default:** *document*)
 * @param {object} [context] The context
 * @return {ZxQuery} ZxQuery object with elements matching the given ```z-field``` attribute.
 * If the matching element is just one, then it will also have the extra method `field(fieldName)`
 * to search for fields contained in it.
 *
 */
function field(fieldName, container, context) {
  if (!context) {
    context = this;
  }
  if (context._fieldCache == null) {
    context._fieldCache = {};
  }
  let el = null;
  if (typeof context._fieldCache[fieldName] === 'undefined') {
    el = z$(container)
        .find(util.dom.queryAttribute(_optionAttributes.zField, fieldName) + ',[' + CSS.escape('#' + fieldName) + ']');
    if (el.length()) {
      context._fieldCache[fieldName] = el;
      // extend the returned `ZxQuery` object adding the `field` method
      if (el.length() === 1 && !el.field) {
        el.field = (name) => field(name, el, el);
      }
    }
  } else {
    el = context._fieldCache[fieldName];
  }
  return el;
}

/**
 *
 * @private
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions|undefined} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
function load(componentId, options) {
  // TODO: throw error on argument mismatch
  // TODO: prevent load loops when including recursively a component
  componentId = _componentizer.resolvePath(componentId);
  /** @type {ComponentContext} */
  let ctx = null;
  if (options) {
    // the `componentId` property is mandatory for `createContext` to work properly
    options.componentId = componentId;
    // check if context has its unique id assigned
    if (options.contextId) {
      // if it does, try to pick it from allocated contexts list
      ctx = context(options.contextId);
      if (ctx !== null) {
        ctx.options(options);
      } else {
        // if no context is already allocated
        // with that id, then add a new one
        ctx = createContext(options);
      }
    } else {
      if (options === false) {
        options = {};
      }
      // generate contextId (this is a bit buggy, but it's quick)
      options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
      ctx = createContext(options);
    }
  } else {
    // TODO: check if this case is of any use
    // empty context
    options = {};
    ctx = new ComponentContext(zuix, options, trigger);
  }

  // assign the given component (widget) to this context
  if (ctx.componentId != componentId) {
    // mutable component, rebind to a different component
    // preserving current context data
    ctx.componentId = componentId;
    /*
         TODO: to be fixed
         if (context.view()) {
         // TODO: implement this code in a context.detach() method
         //context.controller().pause()
         context.view().detach();
         context.view(null);
         }*/
  }

  if (options.ready) {
    ctx.ready = options.ready;
  }
  if (options.loaded) {
    ctx.loaded = options.loaded;
  }
  if (options.error) {
    ctx.error = options.error;
  }

  if (resourceLoadTask[componentId] == null) {
    resourceLoadTask[componentId] = true;
    return loadResources(ctx, options);
  } else {
    if (_pendingResourceTask[componentId] == null) {
      _pendingResourceTask[componentId] = [];
    }
    _pendingResourceTask[componentId].push({c: ctx, o: options});
  }

  return ctx;
}

function getResourcePath(path) {
  let config = zuix.store('config');
  if (config != null && config[location.host] != null) {
    config = config[location.host];
  }
  path = _componentizer.resolvePath(path);
  if (!path.startsWith('/') && path.indexOf('://') < 0) {
    path = (config != null && config.resourcePath != null ? config.resourcePath : '') + path;
  }
  return path;
}

/**
 * @private
 * @param {ComponentContext} ctx Component context
 * @param {ContextOptions|JSON} options Context loading options
 * @return {ComponentContext}
 */
function loadResources(ctx, options) {
  // pick it from cache if found
  let cachedComponent = getCachedComponent(ctx.componentId);
  if (cachedComponent !== null && options.controller == null && ctx.controller() == null) {
    ctx.controller(cachedComponent.controller);
    _log.t(ctx.componentId+':js', 'component:cached:js');
  }

  const loadStyles = function(resourceLoadTask) {
    if (options.css !== false && typeof options.css !== 'string') {
      resourceLoadTask[ctx.componentId].step(ctx.componentId+':css');
      ctx.loadCss({
        success: (css) => cachedComponent.css = css,
        error: (err) => _log.e(err, ctx),
        then: () => loadController(ctx, resourceLoadTask[ctx.componentId])
      });
    } else {
      loadController(ctx, resourceLoadTask[ctx.componentId]);
    }
  };

  if (!options.view) {
    if (cachedComponent !== null) {
      if (cachedComponent.view != null) {
        ctx.view(cachedComponent.view);
        _log.t(ctx.componentId+':html', 'component:cached:html');
      }
      if (options.css !== false && typeof options.css !== 'string') {
        options.css = false;
        if (!cachedComponent.css_applied) {
          cachedComponent.css_applied = true;
          ctx.style(cachedComponent.css);
          _log.t(ctx.componentId + ':css', 'component:cached:css');
        }
      }
    }

    // if not able to inherit the view from the base cachedComponent
    // or from an inline element, then load the view from web
    if (!ctx.view()) {
      // Load View
      taskQueue('resource-loader').queue(ctx.componentId+':html', function() {
        resourceLoadTask[ctx.componentId] = this;

        ctx.loadHtml({
          cext: options.cext,
          success: (html) => {
            if (cachedComponent == null) {
              cachedComponent = cacheComponent(ctx);
            }
            cachedComponent.view = html;
            delete cachedComponent.controller;
            loadStyles(resourceLoadTask);
          },
          error: (err) => {
            _log.e(err, ctx);
            if (options.error) {
              (ctx.error).call(ctx, err, ctx);
            }
          }
        });
      }, options.priority);
    } else {
      taskQueue('resource-loader').queue(ctx.componentId+':css', function() {
        resourceLoadTask[ctx.componentId] = this;
        loadStyles(resourceLoadTask);
      }, options.priority);
    }
    // defer controller loading
    return ctx;
  } else {
    ctx.view(options.view);
  }

  if (ctx.controller() == null) {
    taskQueue('resource-loader').queue(ctx.componentId + ':js', function() {
      resourceLoadTask[ctx.componentId] = this;
      loadController(ctx, resourceLoadTask[ctx.componentId]);
    }, _contextRoot.length);
  } else loadController(ctx);

  return ctx;
}
/**
 *
 * @private
 * @param context {ComponentContext|ZxQuery|Element}
 */
function unload(context) {
  const dispose = (ctx) => {
    if (ctx instanceof Element) {
      const el = ctx;
      ctx = zuix.context(el);
      // remove element from componentizer queue if
      // it's a lazy-loadable element not yet loaded
      _componentizer.dequeue(el);
    }
    if (ctx && ctx.dispose) {
      ctx.dispose();
    }
  };
  if (context && context.each) {
    context.each((i, el) => dispose(el));
  } else {
    dispose(context);
  }
}

/** @private */
function loadComponent(elements, componentId, type, options) {
  elements = z$(elements);
  unload(elements);
  /**
   * @param {ZxQuery} el
   */
  const load = function(el) {
    el.attr(_optionAttributes.zLoad, componentId);
    if (type) {
      el.attr(type, '');
    }
    if ((options && options.lazyLoad && options.lazyLoad.toString() === 'true') || el.attr(_optionAttributes.zLazy) === 'true') {
      if (options) {
        el.get().__zuix_loadOptions = options;
      }
      return false;
    }
    // Shadow root check
    let sr = el.get().shadowRoot;
    if (sr == null && options && options.container instanceof ShadowRoot) {
      sr = options.container;
      delete options.container;
    } else if (sr && options) { // mode = 'open'
      delete options.container;
    }
    if (sr) {
      const shadowView = document.createElement('div');
      // move attributes to shadow view
      Array.from(el.get().attributes).forEach((attribute) => {
        if (!attribute.nodeName.match(/^[(#@)]/)) {
          shadowView.setAttribute(attribute.nodeName, attribute.nodeValue);
          el.attr(attribute.nodeName, null);
        }
      });
      setTimeout(() => {
        // move childNodes to shadow view
        while (el.get().firstChild) {
          shadowView.appendChild(el.get().firstChild);
        }
        sr.appendChild(shadowView);
        zuix.context(shadowView, (ctx) => {
          el.attr('shadow', ctx.contextId);
        });
        _componentizer.loadInline(shadowView, options);
      });
    } else {
      _componentizer.loadInline(el, options);
    }
  };
  elements.each((i, el, $el) => load($el));
}

/** @private */
function createContext(options) {
  const context = new ComponentContext(zuix, options, trigger);
  _contextRoot.push(context);
  return context;
}

/**
 *
 * @private
 * @param {Element|ZxQuery|string} contextId The `contextId` or the component's host element.
 * @param {ContextReadyCallback} [callback] The callback function that will pass the component's context object once loaded and ready.
 * @return {ComponentContext} The matching component's context or `null` if the context does not exist or not yet loaded.
 */
function context(contextId, callback) {
  let ctx = null;
  if (contextId instanceof z$.ZxQuery) {
    contextId = contextId.get();
  }
  if (contextId instanceof Element && contextId.getAttribute('shadow')) {
    contextId = contextId.getAttribute('shadow');
  }
  // lookup `contextId` in the context registry
  z$.each(_contextRoot, (k, c) => {
    if (contextId === c.contextId || (contextId instanceof Element && (c.view() === contextId || c.container() === contextId))) {
      ctx = c;
      return false; // break the loop
    }
  });
  if (callback) {
    const cb = (ctx) => setTimeout(() => {
      callback.call(ctx, ctx);
    }, _componentReadyCallbackDelay);
    if (ctx && ctx.isReady) {
      cb(ctx);
    } else if (typeof contextId === 'string') {
      const cel = z$.find(util.dom.queryAttribute(_optionAttributes.zContext, contextId));
      if (cel.length()) {
        context(cel, (ctx) =>
            ctx ? cb(ctx) : context(contextId, callback)
        );
      }
    } else if (contextId instanceof Element) {
      zuix.$(contextId).one('component:ready', function() {
        ctx = _contextRoot.find((c) => (c.view() === contextId || c.container() === contextId));
        cb(ctx);
      });
    }
  }
  return ctx;
}

/**
 *
 * @private
 * @param {string} path
 * @param {function|undefined} [handler]
 */
function hook(path, handler) {
  if (!handler) {
    delete _hooksCallbacks[path];
  } else {
    if (_hooksCallbacks[path]) {
      _log.w('Hook override', '"' + path + '"', 'OLD', _hooksCallbacks[path], 'NEW', handler);
    }
    _hooksCallbacks[path] = handler;
  }
}

/**
 * Fires a zUIx hook.
 *
 * @private
 * @param {object} context
 * @param {string} path
 * @param {object|undefined} [data]
 */
function trigger(context, path, data) {
  if (_hooksCallbacks[path]) {
    _hooksCallbacks[path].call(context, data, context);
  }
}

// *********************** private members ************************* //

/** @private */
function setComponentCache(cache) {
  _componentCache = cache;
}

///** @private */
//function removeCachedComponent(componentId) {
// TODO: removeCachedComponent
// TODO: should this be called when last instance of a component type is disposed?
//}

/**
 * @private
 * @param {Object} componentId
 * @return {ComponentCache | null}
 */
function getCachedComponent(componentId) {
  /** @type {ComponentCache | null} */
  let cached = null;
  z$.each(_componentCache, (k, c) => {
    if (c.componentId === componentId) {
      cached = c;
      return false;
    }
  });
  return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function loadController(context, task) {
  if (typeof context.options().controller === 'undefined' && context.controller() === null) {
    _log.d(context.componentId, 'controller:load');
    if (task) {
      task.step(context.componentId+':js');
    }
    if (_globalControllerHandlers[context.componentId]) {
      context.controller(_globalControllerHandlers[context.componentId]);
      createComponent(context, task);
    } else {
      const job = function(t) {
        const jsPath = context.componentId + '.js';
        fetch(zuix.getResourcePath(jsPath))
            .then((response) => response.text())
            .then((ctrlJs) => {
              ctrlJs += '\n//# sourceURL="'+context.componentId + '.js"\n';
              try {
                context.controller(getController(ctrlJs));
                let cached = getCachedComponent(context.componentId);
                if (cached == null) {
                  cached = {
                    componentId: context.componentId,
                    controller: context.controller()
                  };
                  _componentCache.push(cached);
                }
              } catch (e) {
                _log.e(new Error(), e, ctrlJs, context);
                if (context.error) {
                  (context.error).call(context, e, context);
                }
              }
            }).catch((e) => {
              _log.e(e, new Error(), context);
              if (context.error) {
                (context.error).call(context, e, context);
              }
            }).finally(() => {
              createComponent(context, t);
            });
      };
      if (!task) {
        taskQueue('resource-loader').queue(context.componentId+':js', function() {
          job(resourceLoadTask[context.componentId] = this);
        }, context.options().priority);
      } else job(task);
    }
  } else {
    createComponent(context, task);
  }
}

function cacheComponent(context) {
  const html = context.view().innerHTML; // (context.view() === context.container() ? context.view().innerHTML : context.view().outerHTML);
  const c = z$.wrapElement('div', html);
  /** @type {ComponentCache} */
  const cached = {
    componentId: context.componentId,
    view: c.innerHTML,
    css: typeof context.options().css === 'string' ? null : context._css,
    controller: context.controller()
  };
  _componentCache.push(cached);
  _log.t(context.componentId, 'bundle:added');
  return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function createComponent(context, task) {
  resourceLoadTask[context.componentId] = null;
  if (context.view()) {
    let cached = getCachedComponent(context.componentId);
    if (!context.options().viewDeferred) {
      if (cached === null) {
        cached = cacheComponent(context);
      } else if (cached.controller == null) {
        cached.controller = context.controller();
      }
    } else {
      _log.d(context.componentId, 'component:deferred:load');
    }

    const v = z$(context.view());
    // if zContext it's not null, a main controller was already loaded
    // on this view, so we preserve the main controller's context id
    if (v.attr(_optionAttributes.zContext) == null) {
      v.attr(_optionAttributes.zContext, context.contextId);
    }

    _log.d(context.componentId, 'component:initializing');
    if (context.controller()) {
      // TODO: should use 'require' instead of 'new Controller' ... ?
      /** @type {ContextController} */
      const c = context._c = new ContextController(context);
      c.log = __webpack_require__(381)(context.contextId);
      if (c.init) {
        c.init();
      }
      const endTask = () => {
        task && _log.d(context.componentId, 'controller:create:deferred');
        initController(c);
        task && task.end();
        v.attr(_optionAttributes.zReady, 'true');
      };
      // TODO: when loading multiple controllers perhaps some code paths can be skipped -- check/optimize this!
      if (c.view() && c.view().attr(_optionAttributes.zComponent) == null) {
        // add the `zComponent` attribute
        c.view().attr(_optionAttributes.zComponent, '');
      }
      // if no model is supplied, try auto-create from view fields
      if (context.model() == null && context.view()) {
        context.viewToModel();
      }

      if (context.options().viewDeferred) {
        context.options().viewDeferred = false;
        // save the original inline view
        // before loading the view template
        // it can be then restored with c.restoreView()
        c.saveView();

        if (cached === null && context.componentId !== 'default') {
          cached = {
            componentId: context.componentId,
            controller: context.controller()
          };
          _componentCache.push(cached);
          _log.t(context.componentId, 'bundle:added');
          _log.d(context.componentId, 'component:deferred:load');
        }

        const loadViewTask = () => {
          if (context.options().html !== false) {
            if (typeof context.options().html === 'string') {
              cached.view = context.options().html;
            }
            if (cached.view == null) {
              context.loadHtml({
                cext: context.options().cext,
                success: (html) => {
                  cached.view = html;
                  _log.d(context.componentId, 'component:deferred:html');
                },
                error: (err) => {
                  _log.e(err, context);
                  if (context.options().error) {
                    (context.options().error).call(context, err, context);
                  }
                },
                then: () => {
                  _log.d(context.componentId, 'controller:create:2');
                  endTask();
                }
              });
            } else {
              context.view(cached.view);
              endTask();
            }
          } else {
            _log.d(context.componentId, 'controller:create:3');
            endTask();
          }
        };

        if (context.options().css !== false && typeof context.options().css !== 'string') {
          if (cached.css == null) {
            context.loadCss({
              success: (css) => {
                cached.css = css;
                _log.d(context.componentId, 'component:deferred:css');
              },
              then: () =>loadViewTask()
            });
          } else {
            context.style(cached.css);
            loadViewTask();
          }
        } else {
          if (typeof context.options().css === 'string') {
            context.style(context.options().css);
          }
          loadViewTask();
        }
      } else {
        _log.d(context.componentId, 'controller:create:1');
        endTask();
      }
    } else {
      _log.w(context.componentId, 'component:controller:undefined');
    }
  } else {
    // TODO: should report error or throw an exception
    _log.e(context.componentId, 'component:view:undefined');
  }
}

/** @private */
function isDirectComponentElement($view, $el) {
  const exclusionList = [
    ..._implicitLoadDefaultList,
    util.dom.queryAttribute(_optionAttributes.zLoad)
  ].join(',');
  const $cv = $el.parent('pre,code,' + exclusionList);
  return $cv.get() === $view.get();
}

/**
 * @private
 * @param {ContextController} ctrl
 */
function initController(ctrl) {
  const ctx = ctrl.context;
  _log.t(ctx.componentId, 'controller:init', 'timer:init:start');

  ctx.isReady = true;
  // isReady status can be set to false in the `create` callback
  // and later set to true when all dependencies have been loaded

  // tender lifecycle moments
  const $view = ctrl.view();
  if (ctrl.create) {
    ctrl.create();
  }
  ctrl.trigger('view:create', $view);

  const contextLoaded = () => {
    // set component loaded
    if (ctx.loaded) {
      (ctx.loaded).call(ctx, ctx);
    }
    // load pending resources
    if (_pendingResourceTask[ctx.componentId] != null) {
      const pendingRequests = _pendingResourceTask[ctx.componentId];
      _pendingResourceTask[ctx.componentId] = null;
      let context;
      while (pendingRequests != null && (context = pendingRequests.shift()) != null) {
        loadResources(context.c, context.o);
      }
    }
    // re-enable nested components loading
    $view.find(util.dom.queryAttribute(_optionAttributes.zLoaded, 'false', util.dom.cssNot(_optionAttributes.zComponent)))
        .each(function(i, v) {
          this.attr(_optionAttributes.zLoaded, null);
        });
    // render nested components
    setTimeout(() => zuix.componentize($view));
  };

  contextLoaded();
  ctrl.trigger('component:loaded', $view, true);

  const contextReady = () => {
    // parse option attributes
    const attributesList = [':on', ':model', ':behavior', ':ready']; // these are evaluated after component is created
    const optionAttributes = Array.from($view.get().attributes)
        .filter((a) => attributesList.find((t) => a.nodeName.startsWith(t)));
    optionAttributes.forEach((attribute) => {
      let scriptlet = attribute.nodeValue;
      if (!scriptlet) return;
      const attr = attribute.nodeName;
      const isRootOption = attr.lastIndexOf(':') < 2;
      let val;
      if (!scriptlet.match(/^[^<>()\[\]\-+\s!?/&£"=^#@:;,.*|]+$/g)) {
        scriptlet = `(event, args) => \{ ${attribute.nodeValue} \}`;
      }
      if (attr.startsWith(':model') || isRootOption) {
        scriptlet = `(${attribute.nodeValue})`;
      }
      try {
        val = zuix.runScriptlet(scriptlet, $view, $view, null);
      } catch (e) {
        _log.warn(attr, attribute.nodeValue, e);
      }
      if (val == null) return; // TODO: should report a warning?
      if (attr === ':ready') {
        ctx.ready = val;
        return;
      }
      if (attr.startsWith(':on') || attr.startsWith(':behavior')) {
        if (isRootOption) {
          ctrl.on(val);
          return;
        }
        const eventName = attr.substring(attr.indexOf(':', 1) + 1);
        if (attr.startsWith(':behavior')) {
          ctrl.addBehavior(eventName, val);
        } else {
          ctrl.addEvent(eventName, val);
        }
      } else if (attr.startsWith(':model')) {
        if (isRootOption) {
          ctx.model(val);
          return;
        }
        const path = attr.match(/[^:]+/g).splice(1);
        let co = ctx.model();
        path.forEach((p, i) => {
          p = util.hyphensToCamelCase(p);
          if (i === path.length - 1) {
            return co[p] = val;
          }
          co = co[p] = co[p] || {};
        });
      }
    });
    // parse and allocate inline event handlers
    const allocateEventHandlers = (ctx, $el) => {
      Array.from($el.get().attributes).forEach((attribute) => {
        let scriptlet = attribute.nodeValue;
        const attr = attribute.nodeName;
        if (scriptlet && attr.startsWith('(') && attr.endsWith(')')) {
          if (!scriptlet.match(/^[^<>()\[\]\-+\s!?/&£"=^#@:;,.*|]+$/g)) {
            scriptlet = `(event, args) => \{ ${attribute.nodeValue} \}`;
          }
          const eventName = attr.substring(1, attr.length - 1);
          const handler = zuix.runScriptlet(scriptlet, $el, $view, null);
          if ($el === $view) {
            ctx.on(eventName, handler);
          } else {
            $el.on(eventName, handler);
          }
        }
      });
    };
    if (zuix.context($view) === ctx) {
      $view.find('*').each((i, el, $el) => {
        if (isDirectComponentElement($view, $el)) {
          allocateEventHandlers(ctx, $el);
        }
      });
    }
    // set component ready
    if (ctx.ready) {
      (ctx.ready).call(ctx, ctx);
    }
    ctrl.trigger('component:ready', $view, true);
  };

  /** @type {Object.<string, ActiveRefreshHandler>} */
  const globalHandlers = zuix.store('handlers');
  // Creates active-refresh handlers from '@' attributes
  const allocateRefreshHandlers = ($view, $el) => {
    const el = $el.get();
    const allocatedHandlers = [];
    for (let j = 0; j < el.attributes.length; j++) {
      const a = el.attributes.item(j);
      const activeTagName = a.name;
      if (activeTagName.length > 1 && activeTagName.startsWith('@')) {
        const handlerName = activeTagName.substring(1).split(':')[0];
        /** @type ActiveRefreshHandler */
        let activeTagHandler = ctx.handlers ? ctx.handlers[handlerName] : null;
        // if no component-defined handler is found, try global handlers
        if (!activeTagHandler) {
          activeTagHandler = globalHandlers[handlerName];
        }
        if (activeTagHandler) {
          const h = zuix.activeRefresh($view, $el, ctrl.model(), ($v, $element, data, refreshCallback) => {
            // TODO: should `$v` and/or `$element` be passed here?
            const runActiveTagHandler = () => {
              activeTagHandler.call(el, $view, $el, data, refreshCallback, activeTagName);
            };
            if ($el.attr(_optionAttributes.zLoad) && $el.attr(_optionAttributes.zReady) !== 'true') {
              // if the element is a component, asynchronously wait
              // for the component to load before starting the handler
              if (zuix.context($el) == null) {
                refreshCallback(data);
              }
            } else {
              runActiveTagHandler();
            }
          });
          allocatedHandlers.push(h);
        }
      }
    }
    return allocatedHandlers;
  };


  // Setup main component's 'refresh' handler
  const contextId = ctx.contextId;
  const viewRefreshScript = $view.find(':scope > [type="jscript"]');
  viewRefreshScript._selection = viewRefreshScript._selection.concat(z$(document).find('[type="jscript"][for="' + contextId + '"]')._selection);
  ctx.handlers.refresh = ($view, $el, contextData, refreshCallback) => {
    if (!ctx._disposed) {
      if (ctx._dependencyResolver && !ctx._dependencyResolver.resolved()) {
        // not all requested components are ready, retry on next refresh
        if (!ctx.$.hasClass('not-ready')) {
          ctx.$.addClass('not-ready');
        }
        return refreshCallback(contextData);
      } else if (ctx._dependencyResolver != null && ctx._dependencyResolver !== false) {
        // all components requested with the `using' attribute are ready
        ctx.$.removeClass('not-ready');
        ctx._dependencyResolver = false;
      }
      let refreshHandler = ctx._refreshHandler;
      // allocate refresh handler on the first "paint" request
      if (!refreshHandler) {
        const scriptHeader = 'return (function($this, context, args){const $ = context.$; const model = context.model(); ';
        let code = '"use strict"; expose = {}; function refresh() {}; function ready() { return true; }; ';

        // add local vars from fields
        if (ctx['#']) {
          z$.each(ctx['#'], (k, v) => {
            const f = util.hyphensToCamelCase(k);
            code += 'const $' + f + ' = context["#"].' + f + ';';
            code += 'const ' + f + ' = $' + f + '.get();';
            code += 'let _' + f + ' = null; zuix.context(' + f + ', function(c) { _' + f + ' = c; });';
          });
        }
        code += 'function runScriptlet($el, s, args) { let result; try { result = eval("const $this = $el; const _this = zuix.context(this); " + s) } catch (e) { console.error(\'SCRIPTLET ERROR\', e, \'\\n\', context, this, \'\\n\', s); }; return result };';

        // add custom "jscript" code / collects "using" components
        const usingComponents = []; let userCode = '';
        usingComponents.push(contextId); // map contextId to a local variable
        viewRefreshScript.each((i, el, $el) => {
          if (zuix.context($view) === ctx) {
            if ($el.attr('using') != null) {
              usingComponents.push(...$el.attr('using').split(/[;|,]+/g));
            }
            if ($el.parent().get() === $view.get() || $el.attr('for') === contextId) {
              userCode += $el.html() + ';';
              // remove script tag from document
              el.remove();
            }
          }
        });
        // using attribute on main view
        if (ctx.options().using != null) {
          usingComponents.push(...ctx.options().using.split(/[;|,]+/g));
        }

        let componentsResolve = '';
        if (usingComponents.length > 0) {
          let waitingComponents = '';
          usingComponents.forEach((cid) => {
            const asVar = cid.split(' as ');
            cid = asVar[0];
            const ctxVarName = util.hyphensToCamelCase(asVar[1]) || util.hyphensToCamelCase(cid);
            const varDeclarations = 'let ' + ctxVarName + ' = window["' + ctxVarName + '"]; if (' + ctxVarName + ' == null) { const tc = zuix.context("' + cid + '"';
            if (ctx._dependencyResolver !== false) {
              componentsResolve += varDeclarations + ', (ctx) => ' + ctxVarName + ' = ctx);';
            } else {
              componentsResolve += varDeclarations + ');';
            }
            componentsResolve += 'if (tc && tc.isReady) ' + ctxVarName + ' = tc; }';
            waitingComponents += ctxVarName + ' && ';
          });
          // if "using" components are not ready, retry on the next refresh call
          if (ctx._dependencyResolver !== false && componentsResolve.length > 0) {
            componentsResolve += 'const resolved = function() { return ' + waitingComponents + 'true; };';
            ctx._dependencyResolver = Function(scriptHeader + componentsResolve + '; return { resolved }; }).call(this.$el.get(), this.$el, this.ctx, this.args);')
                .call({$el, ctx, args: null});
            if (!ctx._dependencyResolver.resolved() && refreshCallback) {
              // do not start the refresh handler yet,
              // wait for components requested with the "using" attribute
              return refreshCallback(contextData);
            }
          }
        }

        // setup the refresh handler code
        code += componentsResolve + userCode;

        const scriptFooter = code + '; return { refresh, runScriptlet, ready, expose }; }).call(this.$el.get(), this.$el, this.ctx, this.args);';
        // create the refresh handler
        refreshHandler = ctx._refreshHandler = Function(scriptHeader + ';' + scriptFooter)
            .call({$el, ctx, args: null});
        // expose public methods if declared
        if (refreshHandler.expose) {
          Object.assign(ctx, refreshHandler.expose);
        }
      }
      // call refresh method for the first time, if found
      if (!ctx._dependencyResolver && refreshHandler.refresh) {
        ctx._refreshHandler.refresh();
      }
      // Active-Refresh callback to request a new refresh in 100ms
      if (refreshCallback) {
        refreshCallback(contextData);
      }
    }
  };


  // Allocate refresh handlers
  const allocated = [];
  $view.find('*').each((i, el, $el) => {
    if (
      !isDirectComponentElement($view, $el) ||
        (zuix.context($view) !== ctx)
    ) return;
    allocated.push(...allocateRefreshHandlers($view, $el));
  });

  // Allocate main component's 'refresh' handler
  // if there is the JScript or any '@' handler
  if (allocated.length > 0 || viewRefreshScript.length()) {
    const refreshDelay = viewRefreshScript.length() ? viewRefreshScript.attr('refreshdelay') : null;
    const handlersDelay = viewRefreshScript.length() ? viewRefreshScript.attr('handlersdelay') : null;
    // init refresh handler / first paint
    ctx.handlers.refresh.call($view.get(), $view, $view, ctrl.model(), (contextData, delay) => {
      zuix.activeRefresh($view, $view, contextData, ($v, $element, data, refreshCallback) => {
        if (ctx._refreshHandler && !ctx._refreshHandler.initialized) {
          let loadedNested = true;
          allocated.forEach((h) => {
            if (h.$element.attr(_optionAttributes.zLoad) != null) {
              loadedNested = zuix.context(h.$element) != null && zuix.context(h.$element).isReady;
              return loadedNested;
            }
          });
          const canStart = loadedNested && ctx.isReady === true && ctx._refreshHandler.ready();
          if (canStart) {
            ctx._refreshHandler.initialized = true;
            // start '@' handlers
            allocated.forEach((h) => h.start(handlersDelay));
            ctx.$.removeClass('not-ready');
            contextReady();
          } else if (!ctx.$.hasClass('not-ready')) {
            ctx.$.addClass('not-ready');
          }
          refreshCallback(data, refreshDelay, true);
        } else {
          ctx.handlers.refresh.call($view.get(), $view, $view, data, refreshCallback);
        }
      }).start(refreshDelay);
    });
  } else {
    ctx.handlers.refresh.call($view.get(), $view, $view);
    contextReady();
  }

  _log.t(ctx.componentId, 'controller:init', 'timer:init:stop');
  _log.i(ctx.componentId, 'component:loaded', contextId);
}

/**
 // TODO: refactor this method name
 * @private
 * @param javascriptCode string
 * @return {ContextControllerHandler}
 */
function getController(javascriptCode) {
  let instance = (ctx) => { };
  if (typeof javascriptCode === 'string') {
    try {
      const ctrl = Function(util.normalizeControllerCode(javascriptCode))();
      if (typeof ctrl !== 'function') {
        throw new Error('Unexpected module type: "' + (typeof ctrl) + '"');
      }
      instance = ctrl;
    } catch (e) {
      // TODO: should trigger a global hook
      // eg. 'controller:error'
      _log.e(this, e, javascriptCode);
    }
  }
  return instance;
}


// ******************* proto ******************** //


/**
 * Search the document or inside the given `container` for elements
 * with `z-field` attribute matching the provided `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
 *
```html
<div z-field="sample-container">
   <!-- HTML -->
</div>
<script>
container = zuix.field('sample-container');
container.html('Hello World!');
</script>
```
 *
 * @param {!string} fieldName Value of *z-field* to look for
 * @param {!Element} [container] Starting DOM element for this search (**default:** *document*)
 * @param {object} [context] The context
 * @return {ZxQuery} ZxQuery object with elements matching the given `z-field` attribute.
 * If there's just one matching element, then the returned object will also have the additional method `field(fieldName)`
 * to search for fields inside the element itself.
 *
 */
Zuix.prototype.field = function(fieldName, container, context) {
  return field.call(this, fieldName, container, context);
};

/**
 * Loads a component.
 * This is the programmatic equivalent of `z-load`
 * attribute used to load components from HTML.
 *
 * @example
```html
 <!--
 The controller will be loaded on the following host element:
 -->
<div #sample-view></div>

<script>
// Get the host element
const view = zuix.field('sample-view');

// Declares inline controller for 'my/example/component'
const exampleController = zuix.controller((cp) => {
  cp.create = onCreate;

  function onCreate() {
    // Sets the initial content of the view
    cp.view().html('Hello World!');
    // Exposes the private `testMethod`
    // as the public method `test`
    cp.expose('test', testMethod);
  }

  function testMethod() {
    cp.log.i("Method exposing test");
    cp.view().html('A simple test.');
  }
}).for('my/example/component');

// loads the controller
zuix.load('my/example/component', { view, ready: (ctx) => {
  // call the public method `test` after 1 second
  setTimeout(ctx.test, 1000);
}});
</script>
```
 *
 * @param {!string} componentId The identifier name of the component to be loaded
 * @param {ContextOptions} [options] Options used to initialize the loaded component
 * @return {ComponentContext} The component context.
 */
Zuix.prototype.load = function(componentId, options) {
  return load.call(this, componentId, options);
};
/**
 * Unloads the given component context(s) releasing all allocated resources.
 *
 * @example
```js
zuix.unload(ctx);
```
 *
 * @param {ComponentContext|ZxQuery|Element} context The instance of the component to be unloaded, a *ZxQuery* selection, or the component's host element
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.unload = function(context) {
  unload(context);
  return this;
};
/**
 * Loads a component, given the target host element(s).
 * If the target is already a component, it will be
 * unloaded and replaced by the new one.
 *
 * @example
 * ```html
<div layout="rows center-spread">

  <div class="card-component">
    <div z-field="title">Card 1</div>
  </div>

  <div class="card-component">
    <div z-field="title">Card 2</div>
  </div>

</div>
<style>
.card-component {
  margin: 8px;
  max-width: 360px;
}
</style>
<script>
  const elements = zuix.$.find('.card-component');
  zuix.loadComponent(elements, 'templates/mdl_card', 'view');
</script>
```
<div layout="rows center-spread">
  <div class="card-component">
    <div z-field="title">Card 1</div>
  </div>
  <div class="card-component">
    <div z-field="title">Card 2</div>
  </div>
</div>
<style>
.card-component {
  margin: 8px;
  max-width: 360px;
}
</style>
<script>
  const elements = zuix.$.find('.card-component');
  zuix.loadComponent(elements, 'templates/mdl_card', 'view');
</script>
 *
 * @param {ZxQuery|Element} elements The target host element(s) or component context(s)
 * @param {string|object} componentId The id of the component to load (path/component_name)
 * @param {'view'|'ctrl'|undefined} [type] The component type
 * @param {ContextOptions|undefined} [options] The component options
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.loadComponent = function(elements, componentId, type, options) {
  loadComponent(elements, componentId, type, options);
  return this;
};
/**
 * Allocates a component's controller handler. The provided `handler` function will
 * be called to initialize the component's controller instance once the component
 * has been loaded.
 *
 * @example
```js
// Allocates and assign a controller for
// the component 'path/to/component_name'
ctrl = zuix.controller(function(cp) {
  // `cp` is the {ContextController}
  // TODO: inline code of controller follows...
}).for('path/to/component_name');
```
 *
 * @param {ContextControllerHandler} handler Function called to initialize the component controller that will be passed as argument of this function
 * @return {ContextControllerHandler} The allocated controller handler.
 */
Zuix.prototype.controller = function(handler) {
  return controller.call(this, handler);
};
/**
 * Gets a `ComponentContext` object, given its `contextId` or its host element.
 * The `contextId` is the one specified in the `ContextOptions` object or by using the `z-context` attribute on the host element.
 *
 * @example
```html
<div z-load="site/components/slideshow"
     z-context="my-slide-show">...</div>
```
```js
slideShow = null;
zuix.context('my-slide-show', function(ctx) {
  slideShow = ctx;
  // call component's methods
  slideShow.setSlide(1);
});
```
 *
 * @param {Element|ZxQuery|string} contextId The `contextId` or the component's host element.
 * @param {ContextReadyCallback} [callback] The callback function that will pass the component's context object once loaded and ready.
 * @return {ComponentContext} The matching component's context or `null` if the context does not exist or not yet loaded.
 */
Zuix.prototype.context = function(contextId, callback) {
  return context.call(this, contextId, callback);
};
/**
 * Triggers the event specified by `eventPath`.
 *
 * @param {object} context The context object (*this*) passed to handler functions listening for this event
 * @param {string} eventPath The path of the event to fire
 * @param {object} [eventData] The data object of the event
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.trigger = function(context, eventPath, eventData) {
  trigger(context, eventPath, eventData);
  return this;
};
/**
 * Sets a callback for a global event.
 * There can be only one callback for each kind of global event.
 * Pass null as `eventHandler` to unset a previously set callback.
 *
 * @example
```js
// The context `this` in the event handlers will be
// the {ComponentContext} object that sourced the event.
// The `data` parameter passed to the handlers, is of
// variant type, depending on the type of the occurring event.
zuix.hook('load:begin', function(data) {

  loaderMessage.html('Loading "' + data.task + '" ...');
  loaderMessage.show();

}).hook('load:next', function(data) {

  loaderMessage.html('"' + data.task + '" done, loading next..');

}).hook('load:end', function() {

  loaderMessage.hide();

}).hook('html:parse', function(data) {
  // Process HTML content before it's attached to the DOM

  if (this.options().markdown === true && typeof showdown !== 'undefined') {
    // ShowDown - MarkDown syntax compiler
    let htmlMarkDown = data.content;
    htmlMarkDown = new showdown.Converter()
      .makeHtml(htmlMarkDown);
    // return the processed content
    data.content = htmlMarkDown;
  }

}).hook('css:parse', function(data) {
  // Process CSS content before it's attached to the DOM

  let css = data.content;
  // process css, eg. run a CSS pre-processor
  // eg. Sass, Less, ...
  css = run_pre_processor(css);
  // return the processed content
  data.content = css;

}).hook('view:process', function(view) {
  // The view DOM is now fully loaded and ready
  // `view` is of {ZxQuery} type

  // Prism code syntax highlighter
  view.find('code').each(function(i, block) {
    this.addClass('language-javascript');
    Prism.highlightElement(block);
  });

  // Force opening of all non-local links in a new window
  zuix.$('a[href*="://"]').attr('target', '_blank');

  // Material Design Light auto-detection
  // Call DOM upgrade on newly added view elements
  if (componentHandler)
    componentHandler.upgradeElements(view.get());

});
```
 *
 * @param {string} eventPath The event path
 * @param {function|undefined} [eventHandler] The handler function
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.hook = function(eventPath, eventHandler) {
  hook(eventPath, eventHandler);
  return this;
};
/**
 * Loads a CSS, script or singleton component. Resources loaded
 * through this method are available in the global scope and can also be
 * included in the application bundle.
 *
 * @example
```js
zuix.using('script', 'https://some.cdn.js/moment.min.js', function(){
  // can start using moment.js
});
```
 *
 * @param {string} resourceType Either *'style'*, *'script'* or *'component'*
 * @param {string} resourcePath Relative or absolute resource url path
 * @param {ResourceUsingCallback} [callback] Callback function to call once resource is loaded
 * @param {ComponentContext} [ctx] The target context.
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.using = function(resourceType, resourcePath, callback, ctx) {
  resourcePath = _componentizer.resolvePath(resourcePath);
  resourceType = resourceType.toLowerCase();
  const hashId = resourceType + '-' + resourcePath.hashCode();

  taskQueue('resource-loader').queue(hashId, function() {
    const task = resourceLoadTask[hashId] = this;
    if (resourceType === 'component') {
      const c = context(hashId);
      if (c == null) {
        zuix.load(resourcePath, {
          contextId: hashId,
          view: '',
          priority: -10,
          ready: (componentContext) => {
            task.end();
            if (callback) {
              callback(resourcePath, componentContext);
            }
          },
          error: () => {
            task.end();
            if (callback) {
              callback(resourcePath, null);
            }
          }
        });
      } else {
        // already loaded
        task.end();
        if (callback) {
          callback(resourcePath, c);
        }
      }
    } else {
      const isCss = (resourceType === 'style');
      if (z$.find(resourceType + '[id="' + hashId + '"]').length() === 0) {
        const container = isCss && ctx ? util.dom.getShadowRoot(ctx.view()) : null;
        const head = container || document.head || document.getElementsByTagName('head')[0];
        const resource = document.createElement(resourceType);
        if (isCss) {
          resource.type = 'text/css';
          resource.id = hashId;
        } else {
          resource.type = 'text/javascript';
          resource.id = hashId;
        }
        head.appendChild(resource);

        // TODO: add logging
        const addResource = (text) => {
          // TODO: add logging
          if (isCss) {
            if (resource.styleSheet) {
              resource.styleSheet.cssText = text;
            } else {
              resource.appendChild(document.createTextNode(text));
            }
          } else {
            if (resource.innerText) {
              resource.innerText = text;
            } else {
              resource.appendChild(document.createTextNode(text));
            }
          }
          task.end();
          if (callback) {
            callback(resourcePath, hashId);
          }
        };

        const cid = '_res/' + resourceType + '/' + hashId;
        const cached = getCachedComponent(cid);
        if (cached != null) {
          addResource(isCss ? cached.css : cached.controller);
        } else {
          fetch(resourcePath)
              .then((response) => response.text())
              .then((resText) => {
                // TODO: add logging
                /** @type {ComponentCache} */
                const cached = {
                  componentId: cid,
                  view: null,
                  css: isCss ? resText : null,
                  controller: !isCss ? resText : null,
                  using: resourcePath
                };
                _componentCache.push(cached);
                addResource(resText);
              }).catch(() => {
                // TODO: add logging
                head.removeChild(resource);
                task.end();
                if (callback) {
                  callback(resourcePath, null);
                }
              });
        }
      } else {
        // TODO: add logging
        // console.log('Resource already added ' + hashId + '(' + resourcePath + ')');
        task.end();
        if (callback) {
          callback(resourcePath, hashId);
        }
      }
    }
  });

  return this;
};
/**
 * Enables/Disables lazy-loading or gets the current setting.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold in pixels. When < 0, elements will be loaded before entering the viewport for the given amount of pixels. Positive values will delay loading of element until the entered the viewport for at least the given number of pixels.
 * @return {Zuix|boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = function(enable, threshold) {
  if (enable != null) {
    _componentizer.lazyLoad(enable, threshold);
  } else {
    return _componentizer.lazyLoad();
  }
  return this;
};
/**
 * Searches the document, or inside the given `element`,
 * for elements with `z-load` attribute, and loads the
 * requested components.
 * Is also possible to disable/enable the componentizer
 * by passing a boolean value as argument.
 *
 * @example
 ```js
 zuix.componentize(document);
 // Globally disable the componentizer
 zuix.compenentize(false);
 // Re-enable the componentizer
 zuix.compenentize(true);
 ```
 *
 * @param {Element|ZxQuery|boolean} [element] Container to use as starting element for the search (**default:** *document*)
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.componentize = function(element) {
  if (element === false) {
    _disableComponentize = true;
  } else if (element === true) {
    _disableComponentize = false;
    element = null;
  }
  if (!_disableComponentize) {
    _componentizer.componentize(element);
  }
  return this;
};
/**
 * Gets/Sets a global store entry.
 *
 * @example
 ```js
 // stores *myObjectData* in the store entry named *my-data*
 zuix.store('my-data', myObjectData);
 // gets data from the store entry named *my-data*
 const data = zuix.store('my-data');
 ```
 * @param {string} name Entry name
 * @param {object} [value] Entry value
 * @return {object}
 */
Zuix.prototype.store = function(name, value) {
  if (value != null) {
    this._store[name] = value;
  }
  return this._store[name];
};
/**
 * Gets the path of a loadable resource.
 *
 * @param {string} path Loadable resource *id*
 * @return {string} The resource's path.
 */
Zuix.prototype.getResourcePath = (path) => getResourcePath(path);
/**
 * Gets an observable instance of the given object. Based on
 * the browser's built-in [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy?retiredLocale=it) object.
 *
 * @param {object} obj Object to observe
 * @return {ObservableObject} The observable object.
 */
Zuix.prototype.observable = (obj) => _objectObserver.observable(obj);

/**
 * Active-Refresh factory method.
 *
 * @param {ZxQuery} $view The component's view
 * @param {ZxQuery} $element The target element
 * @param {object} contextData Custom data that ca be passed from call to call
 * @param {ActiveRefreshHandler} refreshCallback The refresh handler function
 * @return {ActiveRefresh} The ActiveRefresh object. Invoke the `start()` method on the returned object, to actually activate the refresh handler.
 */
Zuix.prototype.activeRefresh = ($view, $element, contextData, refreshCallback) =>
  new ActiveRefresh($view, $element, contextData, refreshCallback);

/**
 * Gets/Sets the application's data bundle (all components and scripts used in the page packed into a single object).
 *
 * @param {!Array.<BundleItem>|true} [bundleData] A bundle object holding in memory all components' data (cache)
 * @param {function} [callback] Called once the bundle compilation ends. Works if *bundleData* is *true*
 * @return {Zuix|Array.<BundleItem>}
 */
Zuix.prototype.bundle = function(bundleData, callback) {
  if (!bundleData) {
    return _componentCache;
  } else if (bundleData && typeof bundleData === 'boolean') {
    _log.t('bundle:start');
    const ll = _componentizer.lazyLoad();
    _componentizer.lazyLoad(false);
    _componentizer.componentize();
    if (callback) {
      const waitLoop = (w) => {
        setTimeout(() => {
          if (_componentizer.willLoadMore()) {
            _log.t('bundle:wait');
            w(w);
          } else {
            _log.t('bundle:end');
            _componentizer.lazyLoad(ll);
            callback();
          }
        }, 1000);
      };
      waitLoop(waitLoop);
    }
  } else {
    // reset css flag before importing bundle
    for (let c = 0; c < bundleData.length; c++) {
      if (bundleData[c].css_applied) {
        delete bundleData[c].css_applied;
      }
      if (typeof bundleData[c].controller === 'string') {
        bundleData[c].controller = getController(bundleData[c].controller);
      }
    }
    _componentCache = bundleData;
  }
  return this;
};

/**
 * Helper class for querying and manipulating the DOM.
 * @type {ZxQueryStatic}
 */
Zuix.prototype.$ = z$;
// private
/** @private */
Zuix.prototype.TaskQueue = TaskQueue;
/** @private */
Zuix.prototype.ObjectObserver = ObjectObserver;
/** @private */
Zuix.prototype.ZxQuery = z$.ZxQuery;
/** @private */
Zuix.prototype.setComponentCache = (componentCache) => setComponentCache(componentCache);
/**
 * Dumps content of the components cache. Mainly for debugging purpose.
 * @return {Array<ComponentCache>}
 */
Zuix.prototype.dumpCache = () => _componentCache;
/**
 * Dumps allocated component's contexts. Mainly for debugging purpose.
 * @return {Array<ComponentContext>}
 */
Zuix.prototype.dumpContexts = () => _contextRoot;


/** @package
  * @private */
Zuix.prototype.isDirectComponentElement = ($view, $el) => isDirectComponentElement($view, $el);
/** @package
  * @private */
Zuix.prototype.resolveImplicitLoad = (element) => {
  // Resolve implicit loadable component
  const notLoad = util.dom.cssNot(_optionAttributes.zLoad).get();
  const notReady = util.dom.cssNot(_optionAttributes.zReady).get();
  const implicitDefault = _implicitLoadDefaultList
      .map((a) => {
        return a + notLoad + notReady;
      }).join(',');
  z$(element)
      .find(implicitDefault)
      .each((i, el, $el) => {
        if (el.tagName.indexOf('-') === -1 && $el.attr(_optionAttributes.zLoad) == null) {
          $el.attr(_optionAttributes.zLoad, 'default')
              .attr(_optionAttributes.zLazy, 'false');
        }
      });
};


/**
 * // TODO: document method
 *
 * @param {string} scriptCode Scriptlet Js code
 * @param {ZxQuery} $el Target ZxQuery-wrapped element
 * @param {ZxQuery} $view Component's view (ZxQuery)
 * @param {object|undefined} [data] Custom data
 * @return {object|undefined}
 */
Zuix.prototype.runScriptlet = (scriptCode, $el, $view, data) => {
  const ctx = zuix.context($view);
  if (ctx && ctx._refreshHandler) {
    return ctx._refreshHandler.runScriptlet.call($el.get(), $el, scriptCode, data);
  }
};

// member to expose utility class
// TODO: document this with JSDocs
/** @package
 * @private */
Zuix.prototype.utils = util;

/**
 * @return {Zuix}
 */
module.exports = () => {
  if (window && window.zuix) {
    // console.log('WARNING zuix.js already imported!');
    return window.zuix;
  }
  const zuix = new Zuix();
  if (window && document) {
    window.zuix = zuix;
    const globalStyle = '[z-view]{display:none;}[type="jscript"],[media*="#"]{display:none;}[z-load][z-ready=true].visible-on-ready{opacity:1}[z-load]:not([z-ready=true]).visible-on-ready{opacity:0;visibility:hidden}';
    zuix.$.appendCss(globalStyle, null, 'zuix-global');
    const refreshCallback = () => zuix.componentize();
    window.ControllerInstance = ControllerInstance;
    //    window.addEventListener('DOMContentLoaded', refreshCallback);
    window.addEventListener('load', refreshCallback);
    window.addEventListener('resize', refreshCallback);
    window.addEventListener('pageshow', refreshCallback);
    if (document.readyState !== 'loading') {
      refreshCallback();
    }
  }
  // log messages monitor (one global listener)
  _log.monitor(function(level, args) {
    if (zuix.monitor) {
      zuix.monitor(level, Array.prototype.slice.call(args));
    }
  });
  return zuix;
};


/***/ })

/******/ });
/************************************************************************/
/******/ // The module cache
/******/ var __webpack_module_cache__ = {};
/******/ 
/******/ // The require function
/******/ function __webpack_require__(moduleId) {
/******/ 	// Check if module is in cache
/******/ 	var cachedModule = __webpack_module_cache__[moduleId];
/******/ 	if (cachedModule !== undefined) {
/******/ 		return cachedModule.exports;
/******/ 	}
/******/ 	// Create a new module (and put it into the cache)
/******/ 	var module = __webpack_module_cache__[moduleId] = {
/******/ 		// no module.id needed
/******/ 		// no module.loaded needed
/******/ 		exports: {}
/******/ 	};
/******/ 
/******/ 	// Execute the module function
/******/ 	__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 
/******/ 	// Return the exports of the module
/******/ 	return module.exports;
/******/ }
/******/ 
/************************************************************************/
/******/ 
/******/ // startup
/******/ // Load entry module and return exports
/******/ // This entry module is referenced by other modules so it can't be inlined
/******/ var __webpack_exports__ = __webpack_require__(693);
/******/ 
