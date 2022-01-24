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
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 *
 */
'use strict';

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
  const _t = this;
  this.requestRefresh = function($v, $el, data) {
    const isActive = _t.forceActive || (!_t.paused && $el.parent() != null && $el.position().visible);
    /** @type {ActiveRefreshCallback} */
    const refreshLoop = function(st, ms, active) {
      if (ms != null) _t.refreshMs = ms;
      if (st != null) _t.contextData = st;
      if (active != null) _t.forceActive = active;
      const ctx = zuix.context($v);
      if (ctx != null && _t.refreshMs > 0) {
        setTimeout(function() {
          _t.requestRefresh($v, $el, _t.contextData);
        }, isActive ? _t.refreshMs : 500); // 500ms for noop-loop
      } else if (ctx == null) {
        // will not request refresh, loop
        // ends if context was disposed
        // TODO: cp.log.e(cp, 'activeRefresh:error:no_context', element, field, view);
        _t.stop();
      }
    };
    if (isActive) {
      // call the `refreshCallback` and wait for
      // its completion before next loop round
      refreshCallback($v, $el, data, function(nextData, nextMsDelay, forceActive) {
        refreshLoop(nextData, nextMsDelay, forceActive);
      });
    } else {
      // noop-loop
      refreshLoop(_t.contextData);
    }
  };
  //this.requestRefresh($v, $el, data);
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
