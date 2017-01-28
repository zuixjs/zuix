/**
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *         https://genielabs.github.io/zuix
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
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

/**
 * Task Queue Manager
 *
 * @class TaskQueue
 * @constructor
 */
function TaskQueue(listener) {
    var _t = this;
    _t._worker = null;
    _t._taskList = [];
    _t._requests = [];
    if (listener == null)
        listener = function () { };
    _t.taskQueue = function (tid, fn) {
        _t._taskList.push({
            tid: tid,
            fn: fn,
            status: 0,
            end: function () {
                this.status = 2;
            }
        });
        _t.check();
    };
    _t.check = function () {
        if (_t._worker != null)
            clearTimeout(_t._worker);
        _t._worker = setTimeout(function () {
            _t.taskCheck();
        }, 10);
    };
    _t.taskCheck = function () {
        var next = -1;
        for (var i = 0; i < _t._taskList.length; i++) {
            if (next != -2 && _t._taskList[i].status == 0) {
                next = i;
            }
            else if (_t._taskList[i].status == 1) {
                next = -2;
                _t.check();
                listener(_t, 'load:step', {
                    task: _t._taskList[i].tid
                });
                return;
            }
            else if (_t._taskList[i].status == 2) {
                listener(this, 'load:next', {
                    task: _t._taskList[i].tid
                });
                _t._taskList.splice(i, 1);
                _t.check();
                return;
            }
        }
        if (next >= 0) {
            _t._taskList[next].status = 1;
            (_t._taskList[next].fn).call(_t._taskList[next]);
            _t.check();
            listener(_t, 'load:begin', {
                task: _t._taskList[next].tid
            });
        } else {
            listener(_t, 'load:end');
        }
    }
}
TaskQueue.prototype.queue = function(tid, fn) {
    return this.taskQueue(tid, fn);
};
/**
 * Request a lock for throttle invocation
 *
 * @param {function} handlerFn
 * @returns {boolean}
 */
TaskQueue.prototype.requestLock = function(handlerFn) {
    if (handlerFn._taskerLock != null)
        return false;
    handlerFn._taskerLock = true;
    return true;
};
TaskQueue.prototype.releaseLock = function(handlerFn) {
    // Throttle rate 100ms (+ execution time)
    setTimeout(function () {
        delete handlerFn._taskerLock;
    }, 100);
};
/**
 * Debounce. The calling function must also call 'requestLock'.
 *
 * @param {function} handlerFn
 * @param {function} callback
 * @param {number} delay
 * @returns {boolean}
 */
TaskQueue.prototype.lockLater = function(handlerFn, callback, delay) {
    var _t = this;
    if (handlerFn._taskerLock == null)
        callback();
    else {
        if (handlerFn._taskerTimeout == null) {
            handlerFn._taskerTimeout = true;
            handlerFn._taskerTimeout = setTimeout(function () {
                delete handlerFn._taskerTimeout;
                _t.lockLater(handlerFn, callback, delay);
            }, delay);
        }
    }
    return true;
};

module.exports = TaskQueue;