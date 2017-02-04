!function(e){if("object"==typeof exports)module.exports=e();else if("function"==typeof define&&define.amd)define(e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.zuix=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
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
                //listener(_t, 'load:step', {
                //    task: _t._taskList[i].tid
                //});
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
},{}],2:[function(_dereq_,module,exports){
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

// Generic utility class
module.exports = {

    isNoU: function (obj) {
        return (typeof obj === 'undefined' || obj === null);
    },

    isFunction: function (f) {
        return typeof f === 'function';
    },

    objectEquals: function (x, y) {
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
        var p = Object.keys(x);
        return Object.keys(y).every(function (i) {
                return p.indexOf(i) !== -1;
            }) &&
            p.every(function (i) {
                return util.objectEquals(x[i], y[i]);
            });
    },

    propertyFromPath: function (o, s) {
        if (typeof s !== 'string') return;
        s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
        s = s.replace(/^\./, '');           // strip a leading dot
        var a = s.split('.');
        var ref = o;
        for (var i = 0, n = a.length; i < n; ++i) {
            var k = a[i];
            if (typeof ref[k] !== 'undefined') {
                ref = ref[k];
            } else {
                return;
            }
        }
        return ref;
    },

    cloneObject: function cloneObject(obj) {
        if (obj === null || typeof obj !== 'object') {
            return obj;
        }
        // give temp the original obj's constructor
        var temp = obj.constructor();
        for (var key in obj)
            temp[key] = cloneObject(obj[key]);
        return temp;
    },

    // work-around for lint eval error
    evalJs: eval

};
},{}],3:[function(_dereq_,module,exports){
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

var util = _dereq_('./Util.js');

/**
 *
 * @callback ZxQuery~iterationCallback
 * @param {number} i Iteration count
 * @param {object} item Current element
 * @this {object}
 */

/**
 *
 * @callback ZxQuery~instanceIterationCallback
 * @param {number} count Iteration count
 * @param {Element} item Current element
 * @this {ZxQuery}
 */


/** @private */
var _zuix_events_mapping = [];
function routeEvent(e) {
    triggerEventHandlers(this, e.type, e);

}
function addEventHandler(el, path, handler) {
    var found = false;
    z$.each(_zuix_events_mapping, function () {
        if (this.element === el && this.path === path && this.handler == handler) {
            console.log('handler already registered', el, path, handler);
            found = true;
            return false;
        }
    });
    if (!found) {
        _zuix_events_mapping.push({ element: el, path: path, handler: handler });
        el.addEventListener(path, routeEvent, false);
    }
}
function removeEventHandler(el, path, handler) {
    var left = 1, index = -1;
    z$.each(_zuix_events_mapping, function (i) {
        if (this.element === el && this.path === path && this.handler == handler) {
            left--;
            index = i;
        }
    });
    if (index !== -1)
        _zuix_events_mapping.splice(index, 1);
    // unregister event handler since it was the last one
    if (left == 0)
        el.removeEventListener(path, routeEvent);
}
function triggerEventHandlers(el, path, evt) {
    var element = z$(el);
    z$.each(_zuix_events_mapping, function () {
        if (this.element === el && this.path === path) {
            this.handler.call(element, evt);
        }
    });
}


/**
 * ZxQuery, a very lite subset of jQuery-like functions
 * internally used in Zuix.
 *
 * The constructor takes one optional argument that can be
 * a DOM element, a node list or a valid DOM query selector string expression.
 * If no parameter is given, the ZxQuery will wrap the root *document* element.
 *
 * @class ZxQuery
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined} [element]
 * @return {ZxQuery} The *ZxQuery* instance object.
 * @constructor
 */
function ZxQuery(element) {
    /** @protected */
    this._selection = [];

    if (typeof element === 'undefined')
        element = document.documentElement;

    if (element instanceof ZxQuery)
        return element;
    else if (element instanceof HTMLCollection || element instanceof NodeList || Array.isArray(element))
        this._selection = element;
    else if (element instanceof HTMLElement || element instanceof Node)
        this._selection = [element];
    else if (typeof element === 'string')
        this._selection = document.documentElement.querySelectorAll(element);
    else if (element !== null) { //if (typeof element === 'string') {
        console.log('ZxQuery cannot wrap object of this type.', (typeof element), element);
        throw(element);
    }
    return this;
}


/**
 * Number of elements in current DOM selection.
 * @return {Number} Number of DOM elements in the current selection.
 */
ZxQuery.prototype.length = function () {
    return this._selection.length;
};
/**
 * Get the closest parent matching the selector filter.
 * @param {string} [filter] A valid DOM query selector filter (**default:** *first parent*).
 * @return {ZxQuery} A new *ZxQuery* object with the *parent* selection.
 */
ZxQuery.prototype.parent = function (filter) {
    if (!util.isNoU(filter))
        return new ZxQuery(z$.getClosest(this._selection[0], filter));
    return new ZxQuery(this._selection[0].parentNode);
};
/**
 * Get the children matching the given selector filter.
 * @param {string} [filter] A valid DOM query selector filter (**default:** *all children*).
 * @return {ZxQuery}  A new *ZxQuery* object with the *children* selection.
 */
ZxQuery.prototype.children = function (filter) {
    // TODO: implement filtering
    if (!util.isNoU(filter))
        return new ZxQuery(this._selection[0].querySelectorAll(filter));
    return new ZxQuery(this._selection[0].children);
};
/**
 * Reverse the order of elements in current selection.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.reverse = function () {
    var elements = (Array.prototype.slice).call(this._selection, 0);
    this._selection = elements.reverse();
    return this;
};
/**
 * Get the DOM element at given position in the current selection.
 * If no index is provided, the default element will be returned.
 *
 * @param {number} [i] Position of element (**default:** 0)
 * @return {Node|Element} The *DOM* element
 */
ZxQuery.prototype.get = function (i) {
    if (util.isNoU(i)) i = 0;
    return this._selection[i];
};
/**
 * Get the ZxQuery object for then element at the given
 * position in the current selection.
 * @param {number} i Position of element
 * @return {ZxQuery} A new *ZxQuery* object
 */
ZxQuery.prototype.eq = function (i) {
    return new ZxQuery(this._selection[i]);
};
/**
 * Select all descendants matching the given *DOM* query selector filter.
 * @param {string} selector A valid *DOM* query selector
 * @return {ZxQuery} A new *ZxQuery* object
 */
ZxQuery.prototype.find = function (selector) {
    return new ZxQuery(this._selection[0].querySelectorAll(selector));
};
/**
 * Iterate through all *DOM* elements in the selection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)`, will be the
 * *DOM* element corresponding the current iteration.
 * `index` will be the iteration count, and `item`
 * the current Element. The context `this` will be a `{ZxQuery}`
 * instance wrapping the current `item`.
 *
 * If the callback returns *false*, the iteration loop will interrupt.
 * @param {ZxQuery~instanceIterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.each = function (iterationCallback) {
    z$.each(this._selection, iterationCallback);
    return this;
};
/**
 * Gets or sets the given element attribute.
 * @param {string} attr The attribute name
 * @param {string|undefined} [val] The attribute value
 * @return {string|ZxQuery} The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.attr = function (attr, val) {
    if (util.isNoU(val))
        return this._selection[0].getAttribute(attr);
    else
        this.each(function (k, v) {
            this.get().setAttribute(attr, val);
        });
    return this;
};
/**
 * Trigger a component event.
 * @param {string} eventPath Path of the event to trigger.
 * @param {object} eventData Value of the event.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.trigger = function (eventPath, eventData) {
    var event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventPath, {detail: eventData});
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventPath, true, true, eventData);
    }
    this.each(function (k, el) {
        el.dispatchEvent(event);
    });
    return this;
};
/**
 * Listen once for the given event.
 * @param {string} eventPath Event path
 * @param {function} eventHandler Event handler
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.one = function (eventPath, eventHandler) {
    var fired = false;
    this.on(eventPath, function (a, b) {
        if (fired) return;
        fired = true;
        z$(this).off(eventPath, eventHandler);
        (eventHandler).call(this, a, b);
    });
    return this;
};
/**
 * Listen for the given event.
 * @param {string} eventPath Event path
 * @param {function} eventHandler Event handler
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.on = function (eventPath, eventHandler) {
    var events = eventPath.match(/\S+/g) || [];
    this.each(function (k, el) {
        z$.each(events, function (k, ev) {
            addEventHandler(el, ev, eventHandler);
        });
    });
    return this;
};
/**
 * Stop listening for the given event.
 * @param {string} eventPath Event path
 * @param {function} eventHandler Event handler
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.off = function (eventPath, eventHandler) {
    var events = eventPath.match(/\S+/g) || [];
    this.each(function (k, el) {
        z$.each(events, function (k, ev) {
            removeEventHandler(el, ev, eventHandler);
        });
    });
    return this;
};
/**
 * Returns *true* if the element is empty.
 * @return {boolean} *true* if the element is empty, *false* otherwise
 */
ZxQuery.prototype.isEmpty = function () {
    return (this._selection[0].innerHTML.replace(/\s/g, '').length === 0);
};
/**
 * Gets coordinates and visibility status of the element.
 *
 * @return {{x, y, visible}}
 */
ZxQuery.prototype.position = function () {
    if (this._selection[0] != null)
        return z$.getPosition(this._selection[0])
    else // TODO: check this out; should prevent this from happening
        return { x: -1, y: -1, visible: false };
};

/**
 * Sets or gets the given css property.
 * @param {string} attr The CSS property name
 * @param {string|undefined} [val] The attribute value.
 * @return {string|ZxQuery} The *attr* css value when no *val* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.css = function (attr, val) {
    if (util.isNoU(val))
        return this._selection[0].style[attr];
    else
        this.each(function (k, el) {
            el.style[attr] = val;
        });
    return this;
};
/**
 * Adds the given css class to the element class list.
 * @param {string} className The css class name.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.addClass = function (className) {
    var classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function (k, el) {
        if (el.classList) {
            z$.each(classes, function (k, cl) {
                el.classList.add(cl);
            });
        } else el.className += ' ' + className;
    });
    return this;
};
/**
 * Returns *true* if the element contains the given css class.
 * @param {string} className The css class name.
 * @return {boolean} *true* if the element has the *className* css class, *false* otherwise
 */
ZxQuery.prototype.hasClass = function (className) {
    return z$.hasClass(this._selection[0], className);
};
/**
 * Removes the given css class to the element class list.
 * @param {string} className The css class name.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.removeClass = function (className) {
    var classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function (k, el) {
        if (el.classList) {
            z$.each(classes, function (k, cl) {
                el.classList.remove(cl);
            });
        } else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });
    return this;
};
/**
 * Moves to the previous sibling in the DOM.
 * @return {ZxQuery} A new *ZxQuery* object with the previous sibling element.
 */
ZxQuery.prototype.prev = function () {
    return new ZxQuery(this._selection[0].previousElementSibling);
};
/**
 * Moves to the next sibling in the DOM.
 * @return {ZxQuery} A new *ZxQuery* object with the next sibling element.
 */
ZxQuery.prototype.next = function () {
    return new ZxQuery(this._selection[0].nextElementSibling);
};
/**
 * Gets or sets the HTML markup.
 * @param {string|undefined} [htmlText] HTML markup text.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.html = function (htmlText) {
    if (util.isNoU(htmlText))
        return this._selection[0].innerHTML;
    this.each(function (k, el) {
        el.innerHTML = htmlText;
    });
    return this;
};
/**
 * Appends the given element/markup to the current element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element to append.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.append = function (el) {
    if (typeof el === 'string')
        this._selection[0].innerHTML += el;
    else
        this._selection[0].appendChild(el);
    return this;
};
/**
 * Prepends the given element/markup to the current element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList|string} el Element to append.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.prepend = function (el) {
    if (typeof el === 'string')
        this._selection[0].innerHTML = el + this._selection[0].innerHTML;
    else
        this._selection[0].insertBefore(el, this._selection[0].innerHTML.firstElementChild);
    return this;
};
/**
 * Gets or sets the css `display` property.
 * @param {string|undefined} [mode] The display value.
 * @return {string|ZxQuery} The *display* css value when no *mode* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.display = function (mode) {
    if (util.isNoU(mode))
        return this._selection[0].style.display;
    z$.each(this._selection, function (k, el) {
        el.style.display = mode;
    });
    return this;
};
/**
 * Gets or sets the css `visibility` property.
 * @param {string|undefined} [mode] The visibility value.
 * @return {string|ZxQuery} The *visibility* css value when no *mode* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.visibility = function (mode) {
    if (util.isNoU(mode))
        return this._selection[0].style.visibility;
    z$.each(this._selection, function (k, el) {
        el.style.visibility = mode;
    });
    return this;
};
/**
 * Sets the css `display` property to ''.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.show = function () {
    return this.display('');
};
/**
 * Sets the css `display` property to 'none'.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.hide = function () {
    return this.display('none');
};


/**
 * Exported ZxQuery interface.
 *
 * @param [what] {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined}
 * @returns {ZxQuery}
 */
var z$ = function (what) {
    return new ZxQuery(what);
};
z$.find = function (filter) {
    return z$().find(filter);
};
/**
 * Iterate through all objects in the given `items` collection.
 * The context object *this*, passed to the
 * *iterationCallback*`(index, item)`, will be the
 * object corresponding the current iteration and
 * the `index` passed to the callback will be the iteration count.
 *
 * If the callback returns *false*, the iteration loop will interrupt.
 *
 * @param {Array<Object>} items Enumerable objects collection.
 * @param {ZxQuery~iterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {z$} `this`.
 */
z$.each = function (items, iterationCallback) {
    if (items != null)
        for (var i = 0, len = items.length; i < len; i++) {
            var item = items[i];
            if (item instanceof Element)
                item = z$(item);
            if (iterationCallback.call(item, i, items[i]) === false)
                break;
        }
    return this;
};
z$.hasClass = function(el, className) {
    var classes = className.match(/\S+/g) || [];
    var success = false;
    z$.each(classes, function (k, cl) {
        if (el.classList)
            success = el.classList.contains(cl);
        else
            success = (new RegExp('(^| )' + cl + '( |$)', 'gi').test(el.className));
        if (success) return false;
    });
    return success;
};
z$.ajax = function ajax(opt) {
    var url;
    if (!util.isNoU(opt) && !util.isNoU(opt.url))
        url = opt.url;
    else
        url = opt;
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url);
    xhr.onload = function () {
        if (xhr.status === 200) {
            if (util.isFunction(opt.success)) opt.success(xhr.responseText);
        }
        else {
            if (util.isFunction(opt.error)) opt.error(xhr);
        }
        if (util.isFunction(opt.then)) opt.then(xhr);
    };
    xhr.send();
    return this;
};
z$.wrapElement = function (containerTag, element) {
    //$(element).wrap($('<'+containerTag+'/>'));
    //return element;
    /** @type Element */
    var container = document.createElement(containerTag);
    if (typeof element === 'string')
        container.innerHTML = element;
    else
    // TODO: test this, it may not work
        container.appendChild(element);
    return container;
};
z$.wrapCss = function (wrapperRule, css) {
    var wrapReX = /([.,\w])([^/{};]+)({)/g;
    var r, result = null, wrappedCss = '';
    while (r = wrapReX.exec(css)) {
        if (result != null) {
            var rule = css.substring(result.index, r.index);
            var splitReX = /(.*)[^s]\{([^\}]+)[\}]/g; // [^{]
            var ruleParts = splitReX.exec(rule);
            if (ruleParts != null && ruleParts.length > 1) {
                var classes = ruleParts[1].split(',');
                z$.each(classes, function (k, v) {
                    wrappedCss += '\n' + wrapperRule + '\n' + v;
                    if (k < classes.length - 1)
                        wrappedCss += ', ';
                });
                wrappedCss += ' {' + ruleParts[2] + '}\n';
            } else {
                console.log('ZUIX WARNING: z$.wrapCss was unable to parse rule.', ruleParts, rule);
            }
        }
        result = r;
    }
    if (result != null)
        wrappedCss += wrapperRule + ' ' + css.substring(result.index);
    if (wrappedCss != '') {
        css = wrappedCss;
    }
    return css;
};
z$.appendCss = function (css, target) {
    var style = null, head;
    if (typeof css === 'string') {
        // output css
        head = document.head || document.getElementsByTagName('head')[0];
        style = document.createElement('style');
        style.type = 'text/css';
        if (style.styleSheet)
            style.styleSheet.cssText = css;
        else
            style.appendChild(document.createTextNode(css));
    } else if (css instanceof Element) style = css;
    // remove previous style node
    if (!util.isNoU(target))
        head.removeChild(target);
    if (!util.isNoU(style))
        head.appendChild(style);
    return style;
};
z$.getClosest = function (elem, selector) {
    // Get closest match
    for (; elem && elem !== document; elem = elem.parentNode) {
        if (elem.matches(selector)) return elem;
    }
    return null;
};
z$.getPosition = function (el) {
    var visible = z$.isInView(el);
    var x = 0, y = 0;
    while (el) {
        if (el.tagName == "BODY") {
            // deal with browser quirks with body/window/document and page scroll
            var scrollX = el.scrollLeft || document.documentElement.scrollLeft;
            var scrollY = el.scrollTop || document.documentElement.scrollTop;
            x += (el.offsetLeft - scrollX + el.clientLeft);
            y += (el.offsetTop - scrollY + el.clientTop);
        } else {
            // for all other non-BODY elements
            x += (el.offsetLeft - el.scrollLeft + el.clientLeft);
            y += (el.offsetTop - el.scrollTop + el.clientTop);
        }
        el = el.offsetParent;
    }
    return {
        x: x,
        y: y,
        visible: visible
    };
};
z$.isInView = function (el) {
    if (el.offsetParent === null)
        return false;
    var rect = el.getBoundingClientRect();
    return rect.bottom > 0 && rect.right > 0
        && rect.left < (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
        && rect.top < (window.innerHeight || document.documentElement.clientHeight);
    /* or $(window).height() */
};
z$.ZxQuery = ZxQuery;

// Element.matches() polyfill
if (!Element.prototype.matches) {
    Element.prototype.matches =
        Element.prototype.matchesSelector ||
        Element.prototype.mozMatchesSelector ||
        Element.prototype.msMatchesSelector ||
        Element.prototype.oMatchesSelector ||
        Element.prototype.webkitMatchesSelector ||
        function (s) {
            var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                i = matches.length;
            while (--i >= 0 && matches.item(i) !== this) {
            }
            return i > -1;
        };
}
// window.CustomEvent polyfill for IE>=9
(function () {
    if ( typeof window.CustomEvent === "function" ) return false;
    function CustomEvent ( event, params ) {
        params = params || { bubbles: false, cancelable: false, detail: undefined };
        var evt = document.createEvent( 'CustomEvent' );
        evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
        return evt;
    }
    CustomEvent.prototype = window.Event.prototype;
    window.CustomEvent = CustomEvent;
})();

module.exports =  z$;

},{"./Util.js":2}],4:[function(_dereq_,module,exports){
/**
 * @license
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
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('zuix', function () {
            return (root.zuix = (factory).call(root));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node
        module.exports = (factory).call(root);
    } else {
        // Browser globals
        root.zuix = (factory).call(root);
    }
}(this, _dereq_('./zuix/Zuix.js')));
},{"./zuix/Zuix.js":7}],5:[function(_dereq_,module,exports){
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

var z$ =
    _dereq_('../helpers/ZxQuery');
var util =
    _dereq_('../helpers/Util');

/***
 * TODO: describe this class...
 *
 * @param {ContextOptions} options The context options.
 * @returns {ComponentContext} The component context instance.
 * @constructor
 */

function ComponentContext(options, eventCallback) {

    this._options = null;
    this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
    this.componentId = null;
    this.trigger = function(context, eventPath, eventValue) {
        if (typeof eventCallback === 'function')
            eventCallback(context, eventPath, eventValue);
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

    /** @protected */
    this._eventMap = [];
    /** @protected */
    this._behaviorMap = [];

    /**
     * --@-protected
     * @type {ContextController}
     */
    this._c = null;

    this.options(options);

    return this;
}
/**
 * Gets/Sets the component's container element.
 * Returns the current component element if no
 * argument is passed, the {ComponentContext} itself
 * otherwise.
 *
 * @param {Element} [container] The container element.
 * @returns {ComponentContext|Element}
 */
ComponentContext.prototype.container = function (container) {
    // TODO: should automatically re-attach view to the new parent?
    if (container == null) return this._container;
    else this._container = container;
    return this;
};

/**
 * Gets/Sets the component's view element.
 * If an *HTML* string is passed, the the view element
 * will be a new `div` wrapping the given markup.
 * Returns the current view element if no
 * argument is passed, the {ComponentContext} itself otherwise.
 *
 * @param {Element|string|undefined} [view] The view *HTML* string or element.
 * @returns {ComponentContext|Element}
 */
ComponentContext.prototype.view = function (view) {
    if (typeof view === 'undefined') return this._view;
    if (typeof view === 'string') {
        // load view from HTML source

        // trigger `html:parse` hook before assigning content to the view
        var hookData = {content: view};
        this.trigger(this, 'html:parse', hookData);
        view = hookData.content;

        if (this._container != null) {
            // append view content to the container
            this._view = this._container;
            this._view.innerHTML += view;
        } else {
            var viewDiv = z$.wrapElement('div', view);
            if (this._view != null)
                this._view.innerHTML = viewDiv.innerHTML;
            else this._view = viewDiv;
        }

        z$(this._view).find('script').each(function (i, el) {
            if (this.attr('zuix-loaded') !== 'true') {
                this.attr('zuix-loaded', 'true');
                (eval).call(window, el.innerHTML);
                /*
                 var clonedScript = document.createElement('script');
                 clonedScript.setAttribute('zuix-loaded', 'true');
                 clonedScript.onload = function () {
                 // TODO: ...
                 };
                 if (!util.isNoU(this.type) && this.type.length > 0)
                 clonedScript.type = this.type;
                 if (!util.isNoU(this.text) && this.text.length > 0)
                 clonedScript.text = this.text;
                 if (!util.isNoU(this.src) && this.src.length > 0)
                 clonedScript.src = this.src;
                 this.parentNode.insertBefore(clonedScript, this);
                 */
            }
        });

        // trigger `view:process` hook when the view is ready to be processed
        this.trigger(this, 'view:process', z$(this._view));

    } else {
        // load inline view
        if (this._container != null) {
            this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
            this._view.removeAttribute('data-ui-view');
            this._container.appendChild(this._view);
            this._view = this._container;
        } else this._view = view;
    }

    var v = z$(this._view);
    if (this._options.css === false)
    // disable local css styling for this instance
        v.addClass('zuix-css-ignore');
    else
    // enable local css styling
        v.removeClass('zuix-css-ignore');

    this.modelToView();

    return this;
};

/**
 * Gets/Sets the component's view style.
 * The `css` argument can be a string containing all
 * styles definitions or a reference to a style
 * element. When a string is passed the css
 * is linked to the `componentId` attribute so that
 * its styles will be only applied to the component
 * container.
 * If no argument is given, then the current style
 * element is returned.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.style("p { font-size: 120%; } .hidden { display: 'none'; }");
 * </code></pre>
 *
 * @param {string|Element|undefined} [css] The CSS string or element.
 * @returns {ComponentContext|Element}
 */
ComponentContext.prototype.style = function (css) {
    if (typeof css === 'undefined') return this._style;
    if (css == null || css instanceof Element) {

        this._css = (css instanceof Element) ? css.innerText : css;
        this._style = z$.appendCss(css, this._style);

    } else if (typeof css === 'string') {

        // store original unparsed css (might be useful for debugging)
        this._css = css;

        // nest the CSS inside [data-ui-component='<componentId>']
        // so that the style is only applied to this component type
        css = z$.wrapCss('[data-ui-component="' + this.componentId + '"]:not(.zuix-css-ignore)', css);

        // trigger `css:parse` hook before assigning content to the view
        var hookData = { content: css };
        this.trigger(this, 'css:parse', hookData);
        css = hookData.content;

        // output css
        this._style = z$.appendCss(css, this._style);

    }
    // TODO: should throw error if ```css``` is not a valid type
    return this;
};
/**
 * Gets/Sets the component's data model.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.model({
 *      title: 'Thoughts',
 *      message: 'She stared through the window at the stars.'
 *  });
 * </code></pre>
 *
 * @param {object|undefined} [model] The model object.
 * @returns {ComponentContext|object}
 */
ComponentContext.prototype.model = function (model) {
    if (typeof model === 'undefined') return this._model;
    else this._model = model; // model can be set to null
    this.modelToView();
    return this;
};
/**
 * Gets/Sets the controller handler function.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.controller(function(cp) {
 *      cp.create = function() {
 *           cp.view().html('Hello World!');
 *      };
 *      // ...
 *  });
 * </code></pre>
 *
 * @param {ContextControllerHandler|undefined} [controller] The controller handler function.
 * @returns {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function (controller) {
    if (typeof controller === 'undefined') return this._controller;
    // TODO: should dispose previous context controller first
    else this._controller = controller; // can be null
    return this;
};

/**
 * Gets/Sets the component options.
 *
 * @param {ContextOptions|undefined} options The JSON options object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.options = function (options) {
    if (options == null)
        return this._options;
    this._options = options;
    if (options.componentId != null)
        this.componentId = options.componentId;
    this.container(options.container);
    this.view(options.view);
    if (typeof options.css !== 'undefined')
        this.style(options.css);
    this.controller(options.controller);
    this.model(options.model);
    return this;
};

/**
 * Listen for a component event.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.on('item:share', function(evt, data) { ... });
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {EventCallback} eventHandler The event handler function.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.on = function (eventPath, eventHandler) {
    // TODO: throw error if _c (controller instance) is not yet ready
    this._c.on(eventPath, eventHandler);
    return this;
};
/**
 * Load the `.css` file and replace the component's view style.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * ctx.loadCss();
 * // or loads the view's css with options
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
ComponentContext.prototype.loadCss = function (options) {
    var context = this;
    var cssPath = context.componentId + ".css?" + new Date().getTime();
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.path))
        cssPath = options.path;
    z$.ajax({
        url: cssPath,
        success: function (viewCss) {
            context.style(viewCss);
            if (util.isFunction(options.success))
                (options.success).call(context);
        },
        error: function (err) {
            console.log(err, context);
            if (util.isFunction(options.error))
                (options.error).call(context, err);
        },
        then: function () {
            if (util.isFunction(options.then))
                (options.then).call(context);
        }
    });
    return this;
};
/**
 * Load the `.html` file and replace the component's view markup.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * ctx.loadHtml();
 * // or loads the view's html with options
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
    var context = this;
    var htmlPath = context.componentId;
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.path))
        htmlPath = options.path;
    // TODO: check if view caching is working in this case too
    var inlineView = z$().find('[data-ui-view="' + htmlPath + '"]:not([data-ui-component*=""])');
    if (inlineView.length() > 0) {
        var inlineElement = inlineView.get(0);
        if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement)))
            // TODO: test this case
            context.view(inlineElement);
        else
            context.view(inlineElement.outerHTML);
        if (util.isFunction(options.success))
            (options.success).call(context);
        if (util.isFunction(options.then))
            (options.then).call(context);
    } else {
        if (htmlPath == context.componentId)
            htmlPath +=  '.html?' + new Date().getTime();
        z$.ajax({
            url: htmlPath,
            success: function (viewHtml) {
                context.view(viewHtml);
                if (util.isFunction(options.success))
                    (options.success).call(context);
            },
            error: function (err) {
                console.log(err, context);
                if (util.isFunction(options.error))
                    (options.error).call(context, err);
            },
            then: function () {
                if (util.isFunction(options.then))
                    (options.then).call(context);
            }
        });
    }
    return this;
};
/**
 * Create the data model starting from ```data-ui-field```
 * elements declared in the component's view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.viewToModel = function() {
    var _t = this;
    this._model = {};
    // create data model from inline view fields
    z$(this._view).find('[data-ui-field]').each(function(i, el) {
        if (this.parent('pre,code').length() > 0)
            return true;
        var name = this.attr('data-ui-field');
        var value = '';
        switch(el.tagName.toLowerCase()) {
            // TODO: complete binding cases
            case 'img':
                value = el.src;
                break;
            case 'input':
                value = el.value;
                break;
            default:
                value = el.innerHTML;
        }
        // dotted field path
        if (name.indexOf('.')>0) {
            var path = name.split('.');
            var cur = _t._model;
            for (var p = 0; p < path.length - 1; p++) {
                if (typeof cur[path[p]] === 'undefined')
                    cur[path[p]] = {};
                cur = cur[path[p]];
            }
            cur[path[path.length - 1]] = value;
        } else _t._model[name] = value;
    });
    return this;
};
/**
 * Copy values from the data model to the ```data-ui-field``
 * elements declared in the component's view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.modelToView = function () {
    if (this._view != null && this._model != null) {
        var _t = this;
        z$(this._view).find('[data-ui-field]').each(function(i, el) {
            if (this.parent('pre,code').length() > 0)
                return true;
            var boundField = this.attr('data-bind-to');
            if (boundField == null)
                boundField = this.attr('data-ui-field');
            if (typeof _t._model === 'function')
                (_t._model).call(z$(_t._view), this, boundField);
            else {
                var boundData = util.propertyFromPath(_t._model, boundField);
                if (typeof boundData === 'function') {
                    (boundData).call(z$(_t._view), this, boundField);
                } else if (boundData != null) {
                    // try to guess target property
                    switch (el.tagName.toLowerCase()) {
                        // TODO: complete binding cases
                        case 'img':
                            el.src = boundData;
                            break;
                        case 'input':
                            el.value = boundData;
                            break;
                        default:
                            el.innerHTML = boundData;
                    }
                }
            }
        });
    }
    return this;
};

module.exports = ComponentContext;
},{"../helpers/Util":2,"../helpers/ZxQuery":3}],6:[function(_dereq_,module,exports){
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

var z$ =
    _dereq_('../helpers/ZxQuery');

/**
 * TODO: complete JSDoc
 *
 * @param {ComponentContext} context
 * @returns {ContextController}
 * @constructor
 */
function ContextController(context) {
    var _t = this;

    this._view = null;

    this.context = context;
    /** @type {function} */
/*    this.behavior = function () {
        return context.behavior;
    };*/

    /** @protected */
    this._fieldCache = [];

    /** @type {function} */
    this.create = null;
    /** @type {function} */
    this.destroy = null;

    /** @protected */
    this._childNodes = [];
    /** @type {function} */
    this.saveView = function () {
        this.restoreView();
        this.view().children().each(function (i, el) {
            _t._childNodes.push(el);
        });
    };
    this.restoreView = function() {
        if (this._childNodes.length > 0) {
            _t.view().html('');
            z$.each(_t._childNodes, function (i, el) {
                _t.view().append(el);
            });
            this._childNodes.length = 0;
        }
    };

    this.on = function (eventPath, handler_fn) {
        this.addEvent(this.view(), eventPath, handler_fn);
        // TODO: implement automatic event unbinding (off) in super().destroy()
        return this;
    };
    /** @protected */
    this.mapEvent = function (eventMap, target, eventPath, handler_fn) {
        if (target != null) {
            target.off(eventPath, this.eventRouter);
            eventMap[eventPath] = handler_fn;
            target.on(eventPath, this.eventRouter);
        } else {
            // TODO: should report missing target
        }
    };
    /** @protected */
    this.eventRouter = function (e) {
        if (typeof context._behaviorMap[e.type] === 'function')
            context._behaviorMap[e.type].call(_t.view(), e, e.detail);
        if (typeof context._eventMap[e.type] === 'function')
            context._eventMap[e.type].call(_t.view(), e, e.detail);
        // TODO: else-> should report anomaly
    };

    // create event map from context options
    var options = context.options(), handler = null;
    if (options.on != null) {
        for (var ep in options.on) {
            handler = options.on[ep];
            // TODO: should log.warn if k already exists
            _t.addEvent(_t.view(), ep, handler);
        }
    }
    // create behavior map from context options
    if (options.behavior != null) {
        for (var bp in options.behavior) {
            handler = options.behavior[bp];
            // TODO: should log.warn if k already exists
            _t.addBehavior(_t.view(), bp, handler);
        }
    }

    context.controller().call(this, this);

    return this;
}

// TODO: add jsDoc
ContextController.prototype.addEvent = function (target, eventPath, handler_fn) {
    this.mapEvent(this.context._eventMap, target, eventPath, handler_fn);
    return this;
};

// TODO: add jsDoc
ContextController.prototype.addBehavior = function (target, eventPath, handler_fn) {
    this.mapEvent(this.context._behaviorMap, target, eventPath, handler_fn);
    return this;
};

/**
 * Gets elements in the component's view with `data-ui-field`
 * matching the given `fieldName`.
 *
 * @example
 *
<small>**Example - View's HTML**</small>
```html
<h1 data-ui-field="title">...</h1>
<p data-ui-field="description">...</p>
```

<small>**Example - JavaScript**</small>
```js
cp.field('title')
  .html('Hello World!');
var desc = cp.field('description');
desc.html('The spectacle before us was indeed sublime.');
```
 *
 *
 * @param {!string} fieldName Value to match in the `data-ui-field` attribute.
 * @returns {ZxQuery} A `{ZxQuery}` object wrapping the matching element.
 */
ContextController.prototype.field = function (fieldName) {
    var _t = this, el = null;
    if (typeof this._fieldCache[fieldName] === 'undefined') {
        el = this.view().find('[data-ui-field=' + fieldName + ']');
        if (el != null) {
            // TODO: add this override to API docs
            // ZxQuery base methods override
            el.on = function (eventPath, eventHandler, eventData, isHook) {
                if (typeof eventHandler === 'string') {
                    var eh = eventHandler;
                    eventHandler = function () { _t.trigger(eh, eventData, isHook); }
                }
                z$.ZxQuery.prototype.on.call(el, eventPath, eventHandler);
            };
            this._fieldCache[fieldName] = el;
        }
    } else {
        el = this._fieldCache[fieldName];
    }
    return el;
};
ContextController.prototype.clearCache = function () {
    this._fieldCache.length = 0;
};
/**
 * Gets the component's view or the view elements matching
 * the given `filter` in which case acts as a shorthand for
 * `cp.view().find(filter)`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // get all `checkbox` elements with `.checked` class.
 * var choices = cp.view('input[type="checkbox"].checked');
 * choices.removeClass('.checked');
 * // hide the component's view
 * cp.view().hide();
 * </code></pre>
 *
 * @param {(string|undefined)} [filter]
 * @return {ZxQuery}
 */
ContextController.prototype.view = function (filter) {
    if (this.context.view() != null || this._view !== this.context.view())
        this._view = z$(this.context.view());
    if (filter != null)
        return this._view.find(filter);
    else if (this._view !== null)
        return this._view;
    else
        throw({
            message: 'Not attacched to a view yet.',
            source: this
        });
};
/**
 * Gets/Sets the component's data model.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * var m = {
 *      title: 'Thoughts',
 *      message: 'She stared through the window at the stars.'
 *  };
 * cp.model(m);
 * cp.model().title = 'Changes';
 * console.log(cp.model().title);
 * </code></pre>
 *
 * @param {object|undefined} [model] The model object.
 * @return {ContextController|object}
 */
ContextController.prototype.model = function (model) {
    if (model == null)
        return this.context.model();
    else this.context.model(model);
    return this;
};
/**
 * Gets the component options.
 *
 * @return {object} The component options.
 */
ContextController.prototype.options = function () {
    return this.context.options();
};
/**
 * Triggers the component event `eventPath` with the given
 * `eventData` object. To listen to a component event use the
 * `{ComponentContext}.on(eventPath, handler)` method or
 * in case `isHook` is set to true, use the
 * `zuix.hook(eventPath, handler)` method.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
// somewhere inside the slide-show component controller
cp.trigger('slide:change', slideIndex);

// somewhere in a page hosting the slide-show component
// set component's event listeners
zuix.context('my-slide-show')
  .on('slide:change', function(slideIndex) { ... })
  .on(...);
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {object} eventData The event data.
 * @param {boolean} [isHook] Trigger as global hook event.
 * @return {ContextController}
 */
ContextController.prototype.trigger = function (eventPath, eventData, isHook) {
    if (this.context._eventMap[eventPath] == null && isHook !== true)
        this.addEvent(this.view(), eventPath, null);
    // TODO: ...
    if (isHook === true)
        this.context.trigger(this.context, eventPath, eventData);
    else
        this.view().trigger(eventPath, eventData);
    return this;
};
/**
 *  Expose in the component context a property or method
 *  defined in the controller.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre data-line="5"><code class="language-js">
 * // somewhere in the `create` method of the {ContextController}
 * zuix.controller(function(cp){
 *   cp.create = function() {
 *     // ....
 *     cp.expose('setSlide', slide);
 *   }
 *   // ...
 *   function slide(slideIndex) { ... }
 *   // ...
 * });
 * // ...
 * // calling the exposed method from the instance of
 * // the component.
 * var ctx = zuix.context('my-slide-show');
 * ctx.setSlide(2);
 * </code></pre>
 *
 *
 * @param {string} methodName Name of the exposed function.
 * @param {function} handler Reference to the controller member to expose.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.expose = function (methodName, handler) {
    this.context[methodName] = handler;
    return this;
};
/**
 * Load the `.css` file and replace the component's view style.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * cp.loadCss();
 * // or loads the view's css with options
 * cp.loadCss({
 *     path: 'url/of/style/file.css',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadCss = function(options) {
    this.context.loadCss(options);
    return this;
};
/**
 * Load the `.html` file and replace the component's view markup.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * cp.loadHtml();
 * // or loads the view's html with options
 * cp.loadHtml({
 *     path: 'url/of/view/file.html',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadHtml = function(options) {
    this.saveView();
    this.context.loadHtml(options);
    return this;
};
/**
 * Register as default controller for the given component type.
 *
 * @example
<small>**Example - JavaScript**</small>
<pre data-line="6"><code class="language-js">
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
</pre></code>
 *
 * @param {!string} componentId Component identifier.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.for = function (componentId) { return this; };


module.exports = ContextController;
},{"../helpers/ZxQuery":3}],7:[function(_dereq_,module,exports){
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
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var util =
    _dereq_('../helpers/Util');
var z$ =
    _dereq_('../helpers/ZxQuery');
var TaskQueue =
    _dereq_('../helpers/TaskQueue');
var ComponentContext =
    _dereq_('./ComponentContext');
var ContextController =
    _dereq_('./ContextController');

/**
 * @const
 */
var ZUIX_FIELD_ATTRIBUTE = 'data-ui-field';

/**
 *  ZUIX, Javascript library for component-based development.
 *
 * @class Zuix
 * @constructor
 * @returns {Zuix}
 */
function Zuix() {
    return this;
}

/**
 * @private
 * @type {!Array.<ComponentCache>}
 */
var _componentCache = [];

/** @private */
var _contextSeqNum = 0;
/**
 * @private
 * @type {!Array<ComponentContext>}
 */
var _contextRoot = [];

/** @private */
var _hooksCallbacks = [];

/** @private */
var _globalHandlers = {};

/** @private */
var _lazyQueued = []; // Lazy loading - queued elements
/** @private */
var _lazyLoaders = []; // "data-ui-lazyload" elements

/** @private **/
var tasker = new TaskQueue(function (tq, eventPath, eventValue) {
    trigger(tq, eventPath, eventValue);
});

/**
 * Initializes a controller ```handler```.
 *
 * @private
 * @param handler {ContextControllerHandler}
 * @return {ContextControllerHandler}
 */
function controller(handler) {
    if (typeof handler['for'] !== 'function')
        handler['for'] = function (componentId) {
            _globalHandlers[componentId] = handler;
            return handler;
        };
    return handler;
}

/**
 * Gets elements with `data-ui-field`
 * attribute matching the given `fieldName`.
 *
 * @private
 * @param {!string} fieldName Value to match in the `data-ui-field` attribute.
 * @param {!Element} [container] Starting DOM element for this search (**default:** *document*)
 * @return {ZxQuery}
 */
function field(fieldName, container) {
    // TODO: implement caching ?
    return z$(container).find('[' + ZUIX_FIELD_ATTRIBUTE + '="' + fieldName + '"]');
}

/**
 * Searches inside the given element ```element```
 * for all ```data-ui-include``` and ```data-ui-load```
 * directives and process them.
 *
 * @private
 * @param [element] {Element} Optional container to use as starting node for the search.
 */
function componentize(element) {
    // Throttle method
    if (tasker.requestLock(componentize)) {
        z$(element).find('[data-ui-load]:not([data-ui-loaded=true]),[data-ui-include]:not([data-ui-loaded=true])').each(function (i, el) {
            this.visibility('hidden');
            // defer element loading if lazy loading is enabled and the element is not in view
            var lazyContainer = el.lazyContainer || z$.getClosest(el, '[data-ui-lazyload=true],[data-ui-lazyload=force]');
            el.lazyContainer = lazyContainer;
            // override lazy loading if 'lazyload' is set to 'false' for the current element
            if (!(lazyContainer != null && lazyContainer.getAttribute('data-ui-lazyload') == 'force')
                &&
                (!lazyLoad() || this.attr('data-ui-lazyload') == 'false')) {
                loadInline(el);
                return true;
            }
            if (lazyContainer !== null) {
                if (_lazyLoaders.indexOf(lazyContainer) == -1) {
                    _lazyLoaders.push(lazyContainer);
                    z$(lazyContainer).on('scroll', function () {
                        componentize(lazyContainer);
                    });
                }
                var position = z$.getPosition(el);
                if (!position.visible) {
                    if (_lazyQueued.indexOf(el) == -1) {
                        _lazyQueued.push(el);
                    }
                    // Not in view: defer element loading and
                    // process next inline element
                    return true;
                }
            }
            // proceed loading inline element
            var queued = _lazyQueued.indexOf(el);
            if (queued > -1)
                _lazyQueued.splice(queued, 1);
            loadInline(el);
        });
        tasker.releaseLock(componentize);
    } else tasker.lockLater(componentize, function () {
        componentize(element);
    }, 200);
}

/** @protected */
function loadInline(element) {
    var v = z$(element);
    if (v.attr('data-ui-loaded') === 'true' || v.parent('pre,code').length() > 0) {
        console.log("ZUIX", "WARN", "Skipped", element);
        return;
    }
    v.attr('data-ui-loaded', 'true');
    /** @type {ContextOptions} */
    var options = v.attr('data-ui-options');
    if (!util.isNoU(options)) {
        options = util.propertyFromPath(window, options);
        // copy passed options
        options = util.cloneObject(options) || {};
    } else options = {};

    // Automatic view/container selection
    if (util.isNoU(options.view) && !v.isEmpty()) {
        options.view = element;
        options.viewDeferred = true;
    } else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty())
        options.container = element;

    var componentId = v.attr('data-ui-load');
    if (util.isNoU(componentId)) {
        // Static include should not have any controller
        componentId = v.attr('data-ui-include');
        v.attr('data-ui-component', componentId);
        // disable controller auto-loading
        if (util.isNoU(options.controller))
            options.controller = function () {
            }; // null
    }

    // inline attributes have precedence over ```options```

    var model = v.attr('data-bind-model');
    if (!util.isNoU(model) && model.length > 0)
        options.model = util.propertyFromPath(window, model);

    var contextId = v.attr('data-ui-context');
    if (!util.isNoU(contextId))
        options.contextId = contextId;

    // TODO: Behavior are also definable in "data-ui-behavior" attribute
    // TODO: Events are also definable in "data-ui-on" attribute
    // TODO: perhaps "data-ui-ready" and "data-ui-error" too
    // util.propertyFromPath( ... )

    load(componentId, options);
}

/**
 * Loads a component with the given options.
 *
 * @private
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions|undefined} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
function load(componentId, options) {
    // TODO: throw error on argument mismatch
    // TODO: prevent load loops when including recursively a component

    /** @type {ComponentContext} */
    var ctx = null;
    if (!util.isNoU(options)) {
        // check if context has its unique id assigned
        if (!util.isNoU(options.contextId)) {
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
            if (options === false)
                options = {};
            // generate contextId (this is a bit buggy, but it's quick)
            options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
            ctx = createContext(options);
        }
    } else {
        // empty context
        options = {};
        ctx = new ComponentContext(options, trigger);
    }

    // assign the given component (widget) to this context
    if (ctx.componentId != componentId) {
        ctx.componentId = componentId;
        /*
         TODO: to be fixed
         if (!util.isNoU(context.view())) {
         // TODO: implement this code in a context.detach() method
         //context.controller().pause()
         context.view().detach();
         context.view(null);
         }*/
    }

    if (util.isFunction(options.ready))
        ctx.ready = options.ready;
    if (util.isFunction(options.error))
        ctx.error = options.error;

    if (util.isNoU(options.view)) {

        // pick it from cache if found
        var cachedComponent = getCachedComponent(ctx.componentId);
        if (cachedComponent !== null && util.isNoU(ctx.controller()))
            ctx.controller(cachedComponent.controller);

        if (cachedComponent !== null && cachedComponent.view != null) {
            ctx.view(cachedComponent.view);
            // TODO: implement CSS caching as well
            if (options.css !== false)
                ctx.loadCss({
                    error: function (err) {
                        console.log(err, ctx);
                    },
                    then: function () {
                        loadController(ctx);
                    }
                });
        } else {
            // if not able to inherit the view from the base cachedComponent
            // or from an inline element, then load the view from web
            if (util.isNoU(ctx.view())) {
                // Load View
                tasker.queue('html:' + ctx.componentId, function () {
                    var task = this;

                    ctx.loadHtml({
                        success: function () {
                            if (options.css !== false)
                                ctx.loadCss({
                                    error: function (err) {
                                        console.log(err, ctx);
                                        task.end();
                                    },
                                    then: function () {
                                        loadController(ctx);
                                        task.end();
                                    }
                                });
                            else {
                                loadController(ctx);
                                task.end();
                            }
                        },
                        error: function (err) {
                            console.log(err, ctx);
                            if (util.isFunction(options.error))
                                (ctx.error).call(ctx, err);
                        }
                    });

                });
                // defer controller loading
                return ctx;
            }
        }
    } else {
        ctx.view(options.view);
    }
    loadController(ctx);
    return ctx;
}

/**
 * Unload and dispose the component.
 *
 * @private
 * @param context {ComponentContext}
 */
function unload(context) {
    if (!util.isNoU(context) && !util.isNoU(context._c)) {
        if (!util.isNoU(context._c.view()))
            context._c.view().attr('data-ui-component', null);

        //context.unregisterEvents();
        // TODO: unregister events and local context behavior
        // TODO: detach view from parent if context.container is not null

        if (util.isFunction(context._c.destroy))
            context._c.destroy();
    }
}

/** @private */
function createContext(options) {
    var context = new ComponentContext(options, trigger);
    _contextRoot.push(context);
    return context;
}

/**
 * TODO: desc
 *
 * @private
 * @param {Element|ZxQuery|object} contextId
 * @return {ComponentContext}
 */
function context(contextId) {
    var context = null;
    if (contextId instanceof z$.ZxQuery)
        contextId = contextId.get();
    z$.each(_contextRoot, function (k, v) {
        if ((contextId instanceof Element && (v.view() === contextId || v.container() === contextId))
            || util.objectEquals(v.contextId, contextId)) {
            context = v;
            return false;
        }
    });
    return context;
}

/** @private */
function removeContext(contextId) {
    // TODO: removeContext
}

/**
 * TODO: desc
 *
 * @private
 * @param path
 * @param handler
 */
function hook(path, handler) {
    if (util.isNoU(handler))
        return _hooksCallbacks[path];
    _hooksCallbacks[path] = handler;
}

/**
 * TODO: desc
 *
 * @private
 * @param context
 * @param path
 * @param data
 */
function trigger(context, path, data) {

    // TODO: call all registered callback
    if (util.isFunction(_hooksCallbacks[path]))
        _hooksCallbacks[path].call(context, data);

    // ZUIX Componentizer is the last executed hook (built-in)
    if (path == 'view:process')
        componentize(data);
}

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @private
 * @param {boolean} [enable]
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
function lazyLoad(enable) {
    if (enable != null)
        _disableLazyLoading = !enable;
    return !_isCrawlerBotClient && !_disableLazyLoading;
}


/*********************** private members *************************/


/** @private */
function removeCachedComponent(componentId) {
    // TODO: removeCachedComponent
}

/***
 * @private
 * @param {Object} componentId
 * @return {ComponentCache}
 */
function getCachedComponent(componentId) {
    /** @type {ComponentCache} */
    var cached = null;
    z$.each(_componentCache, function (k, v) {
        if (util.objectEquals(v.componentId, componentId)) {
            cached = v;
            return false;
        }
    });
    return cached;
}

/***
 * @private
 * @param {ComponentContext} context
 */
function loadController(context) {
    if (typeof context.options().controller === 'undefined' && context.controller() === null) {
        if (util.isFunction(_globalHandlers[context.componentId])) {
            context.controller(_globalHandlers[context.componentId]);
            createComponent(context);
        } else
            tasker.queue('js:' + context.componentId, function () {
                var task = this;
                z$.ajax({
                    url: context.componentId + ".js?" + new Date().getTime(),
                    success: function (ctrlJs) {
                        // TODO: improve js parsing!
                        try {
                            var fn = ctrlJs.indexOf('function');
                            var il = ctrlJs.indexOf('.load');
                            if (il > 1 && il < fn)
                                ctrlJs = ctrlJs.substring(0, il - 4);
                            var ih = ctrlJs.indexOf('.controller');
                            if (ih > 1 && ih < fn)
                                ctrlJs = ctrlJs.substring(ih + 11);
                            var ec = ctrlJs.indexOf('//<--controller');
                            if (ec > 0)
                                ctrlJs = ctrlJs.substring(0, ec);
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            console.log(e, ctrlJs, context);
                            if (util.isFunction(context.error))
                                (context.error).call(context, e);
                        }
                    },
                    error: function (err) {
                        console.log(err, context);
                        if (util.isFunction(context.error))
                            (context.error).call(context, err);
                    },
                    then: function () {
                        task.end();
                        createComponent(context);
                    }
                });
            });
    } else {
        createComponent(context);
    }
}

/***
 * @private
 * @param context {ComponentContext}
 */
function createComponent(context) {
    if (!util.isNoU(context.view())) {
        if (!context.options().viewDeferred) {
            var cached = getCachedComponent(context.componentId);
            if (cached === null) {
                var html = (context.view() === context.container() ? context.view().innerHTML : context.view().outerHTML);
                var c = z$.wrapElement('div', html);
                _componentCache.push({
                    componentId: context.componentId,
                    view: c.innerHTML,
                    controller: context.controller()
                });
            }
        }
        initComponent(context);
    } else {
        // TODO: report error
    }
}

/***
 * @private
 * @param {ComponentContext} context
 */
function initComponent(context) {
    if (util.isFunction(context.controller())) {
        /** @type {ContextController} */
        var c = context._c = new ContextController(context);
        if (!util.isNoU(c.view())) {
            c.view().attr('data-ui-component', context.componentId);
            // if no model is supplied, try auto-create from view fields
            if (util.isNoU(context.model()) && !util.isNoU(context.view()))
                context.viewToModel();
            c.trigger('view:apply');
            if (context.options().viewDeferred) {
                context.options().viewDeferred = false;
                // save the original inline view
                // before loading the view template
                // it can be then restored with c.restoreView()
                c.saveView();
                if (context.options().css !== false)
                    context.loadCss();
                if (context.options().html !== false)
                    context.loadHtml();
            }
            c.view().css('visibility', '');
        }
        if (util.isFunction(c.create)) c.create();
        c.trigger('view:create');
    }
    if (util.isFunction(context.ready))
        (context.ready).call(context);
}

/***
 * @private
 * @param javascriptCode string
 * @returns {ContextControllerHandler}
 */
// TODO: refactor this method name
function getController(javascriptCode) {
    var instance = function (ctx) {
    };
    if (typeof javascriptCode === 'string') {
        try {
            instance = (eval).call(this, javascriptCode);
        } catch (e) {
            // TODO: should trigger a global hook
            // eg. 'controller:error'
            console.log(this, e, javascriptCode);
        }
    }
    return instance;
}

// Browser Agent / Bot detection
/** @private */
/** @private */
var _isCrawlerBotClient = false, _disableLazyLoading = false;
if (navigator && navigator.userAgent)
    _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
        .test(navigator.userAgent);
if (_isCrawlerBotClient)
    console.log(navigator.userAgent, "is a bot, ignoring 'data-ui-lazyload' option.");


/******************* proto ********************/


/**
 * Initializes a controller ```handler```.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
<pre data-line="2"><code class="language-js">
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
</code></pre>
 *
 * @param {ContextControllerHandler} handler The controller handler
 * function ```function(cp){ ... } ```,
 * where `cp` is the [`{ContextController}`](#ZUIX_API--ContextController)
 * object that is passed to the handler once the component
 * is created.
 * @return {ContextControllerHandler} The initialized controller handler.
 */
Zuix.prototype.controller = controller;
/**
 * Searches and returns elements with `data-ui-field`
 * attribute matching the given `fieldName`.
 *
 * @example
 *
<small>**Example - HTML**</small>
```html
<div data-ui-field="container-div">
   <!-- container HTML -->
</div>
```

<small>**Example - JavaScript**</small>
```js
var containerDiv = zuix.field('container-div');
containerDiv.html('Hello World!');
```
 *
 * @param {!string} fieldName The class to check for.
 * @param {!Element} [container] Starting DOM element for this search (**default:** *document*)
 * @return {ZxQuery} The `{ZxQuery}`-wrapped elements with matching ```data-ui-field``` attribute.
 */
Zuix.prototype.field = field;
/**
 * Searches inside the given element ```element```
 * for all ```data-ui-include``` and ```data-ui-load```
 * directives and process them.
 * This is to be called if adding dynamically content
 * with elements that declare the above attributes.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
zuix.componentize(document);
```
 *
 * @param {Element} [element] Container to use as starting node for the search (**default:** *document*).
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.componentize = function (element) {
    componentize(element);
    return this;
};
/**
 * Loads a component with the given options.
 * This is the programmatic equivalent of
 * `data-ui-include` or `data-ui-load`.
 * All available options are described in the
 * `ContextOptions` object documentation.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
var exampleController = zuix.controller(function(cp){
    cp.create = function() {
        cp.expose('test', testMethod);
        cp.view().html('Helllo World!');
    }
    function testMethod() {
        console.log('Test method exposing');
        cp.view().html('A simple test.');
    }
});
var componentOptions = {
    container: zuix.field('container-div');
    controller: exampleController,
    ready: function () {
        console.log('Loading complete.');
        console.log('Component context instance', this);
    },
    error: function(error) {
        console.log('Loading error!', error);
    }
};
var ctx = zuix.load('path/to/component_name', componentOptions);
ctx.test();
```
 *
 * @param {!string} componentId The identifier name of the component to be loaded.
 * @param {ContextOptions} [options] Options used to initialize the loaded component.
 * @return {ComponentContext} The component instance context.
 */
Zuix.prototype.load = load;
/**
 * Unload and dispose the component.
 *
 * @example
 *
<small>**Example - JavaScript**</small>
```js
zuix.unload(ctx);
```
 *
 * @param {ComponentContext} context The `ComponentContext` instance of the component to be unloaded.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.unload = function (context) {
    unload(context);
    return this;
};
/**
 * Get the `ComponentContext`, given its `contextId`
 * or component's container/view element.
 * HTML attribute equivalent: `data-ui-context`.
 *
 * @example
<small>**Example - HTML**</small>
```html
<div data-ui-load="site/components/slideshow"
     data-ui-context="my-slide-show">...</div>
```
<small>**Example - JavaScript**</small>
```js
var slideShowDiv = zuix.$.find('[data-ui-context="my-slide-show"]');
var ctx = zuix.context(slideShowDiv);
// or
var ctx = zuix.context('my-slide-show');
// call component's exposed methods
ctx.setSlide(1);
```
 *
 * @param {Element|ZxQuery|object} contextId The `contextId` object
 * (usually a string) or the component's container/view element.
 * @return {ComponentContext} The matching component context.
 */
Zuix.prototype.context = context;
/**
 * Triggers the event specified by `eventPath`.
 *
 * @param {Object} context Context (`this`) for the event handler
 * @param {string} eventPath The path of the event to fire.
 * @param {object} [eventData] The data object of the event.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.trigger = function (context, eventPath, eventData) {
    trigger(context, eventPath, eventData);
    return this;
};
/**
 * Set handlers for global events hooks.
 *
<small>**Example - JavaScript**</small>
```js
// The context `this` in the event handlers will be
// the {ComponentContext} object that sourced the event.
// The `data` parameter passed to the handlers, is of
// variant type, depending on the type of the occurring event.
zuix
  .hook('load:begin', function(data){
    loaderMessage.html('Loading "'+data.task+'" ...');
    loaderMessage.show();

}).hook('load:next', function(data){
    loaderMessage.html('"'+data.task+'" done, loading next..');

}).hook('load:end', function(){
    loaderMessage.hide();

}).hook('html:parse', function (data) {
    // ShowDown - MarkDown syntax compiler
    if (this.options().markdown === true && typeof showdown !== 'undefined')
        data.content = new showdown.Converter()
            .makeHtml(data.content);

}).hook('css:parse', function (data) {
    // process css, eg. run a CSS pre-processor
    // eg. Sass, Less, ...

}).hook('view:process', function (view) {
    // The view DOM is now fully loaded and ready

    // Prism code syntax highlighter
    view.find('code').each(function (i, block) {
        this.addClass('language-javascript');
        Prism.highlightElement(block);
    });

    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]').attr('target','_blank');

    // Material Design Light auto-detection
    // Call DOM upgrade on newly added view elements
    if (componentHandler)
        componentHandler.upgradeElements(view.get());

});
```
 *
 * @param {string} eventPath The event path.
 * @param {function} eventHandler The handler function.
 * @return {Zuix} The ```{Zuix}``` object itself.
 */
Zuix.prototype.hook = function (eventPath, eventHandler) {
    hook(eventPath, eventHandler);
    return this;
};
/**
 * Enable/Disable lazy-loading, or get current setting.
 *
 * @param {boolean} [enable] Set lazy-load option.
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = lazyLoad;

Zuix.prototype.$ = z$;
Zuix.prototype.TaskQueue = TaskQueue;
Zuix.prototype.ZxQuery = z$.ZxQuery;

Zuix.prototype.dumpCache = function () {
    console.log("ZUIX", "Component Cache", _componentCache);
};
Zuix.prototype.dumpContexts = function () {
    console.log("ZUIX", "Loaded Component Instances", _contextRoot);
};

// TODO: add zuix.options to configure stuff like
// TODO: the css/html/js lookup base path (each individually own prop)

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function (root) {
    var zuix = new Zuix();
    document.addEventListener("DOMContentLoaded", function(event) {
        zuix.componentize();
    });
    return zuix;
};



},{"../helpers/TaskQueue":1,"../helpers/Util":2,"../helpers/ZxQuery":3,"./ComponentContext":5,"./ContextController":6}]},{},[4])
(4)
});