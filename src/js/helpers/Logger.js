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
/* eslint-disable camelcase */

'use strict';

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
