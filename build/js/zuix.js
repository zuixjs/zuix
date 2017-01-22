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
 * ZxQuery, a very small subset of jQuery-like functions
 * internally used in Zuix
 * @class ZxQuery
 * @param element {ZxQuery|Array<Node>|Node|NodeList|string|undefined}
 * @return {ZxQuery}
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
        console.log(typeof element);
        throw(element);
    }
    return this;
}

ZxQuery.prototype.length = function () {
    return this._selection.length;
};

ZxQuery.prototype.parent = function (filter) {
    if (!util.isNoU(filter))
        return new ZxQuery(z$.getClosest(this._selection[0], filter));
    return new ZxQuery(this._selection[0].parentNode);
};
ZxQuery.prototype.children = function (filter) {
    // TODO: implement filtering
    if (!util.isNoU(filter))
        return new ZxQuery(this._selection[0].querySelectorAll(filter));
    return new ZxQuery(this._selection[0].children);
};
ZxQuery.prototype.reverse = function () {
    var elements = (Array.prototype.slice).call(this._selection, 0);
    this._selection = elements.reverse();
    return this;
};
ZxQuery.prototype.get = function (i) {
    if (util.isNoU(i))
        i = 0;
    return this._selection[i];
};
ZxQuery.prototype.eq = function (i) {
    return new ZxQuery(this._selection[i]);
};
ZxQuery.prototype.find = function (selector) {
    return new ZxQuery(this._selection[0].querySelectorAll(selector));
};
ZxQuery.prototype.each = function (iterationCallback) {
    z$.each(this._selection, iterationCallback);
    return this;
};
ZxQuery.prototype.css = function (attr, val) {
    if (util.isNoU(val))
        return this._selection[0].style[attr];
    else
        this.each(function (k, v) {
            this.style[attr] = val;
        });
    return this;
};
ZxQuery.prototype.attr = function (attr, val) {
    if (util.isNoU(val))
        return this._selection[0].getAttribute(attr);
    else
        this.each(function (k, v) {
            this.setAttribute(attr, val);
        });
    return this;
};
ZxQuery.prototype.trigger = function (eventPath, eventData) {
    var event;
    if (window.CustomEvent) {
        event = new CustomEvent(eventPath, {detail: eventData});
    } else {
        event = document.createEvent('CustomEvent');
        event.initCustomEvent(eventPath, true, true, eventData);
    }
    this.each(function (k, v) {
        this.dispatchEvent(event);
    });
    return this;
};
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
ZxQuery.prototype.on = function (eventPath, eventHandler) {
    var events = eventPath.match(/\S+/g) || [];
    this.each(function (k, v) {
        var _t = this;
        z$.each(events, function (k, v) {
            _t.addEventListener(v, eventHandler, false);
        });
    });
    return this;
};
ZxQuery.prototype.off = function (eventPath, eventHandler) {
    var events = eventPath.match(/\S+/g) || [];
    this.each(function (k, v) {
        var _t = this;
        z$.each(events, function (k, v) {
            _t.removeEventListener(v, eventHandler);
        });
    });
    return this;
};
ZxQuery.prototype.isEmpty = function () {
    return (this._selection[0].innerHTML.replace(/\s/g, '').length === 0);
};
// TODO: the following methods could be deprecated
ZxQuery.prototype.css = function (attr, val) {
    if (util.isNoU(val))
        return this._selection[0].style[attr];
    else
        this.each(function (k, v) {
            this.style[attr] = val;
        });
    return this;
};
ZxQuery.prototype.addClass = function (className) {
    var classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function (k, v) {
        if (this.classList) {
            var _t = this;
            z$.each(classes, function (k, v) {
                _t.classList.add(v);
            });
        } else this.className += ' ' + className;
    });
    return this;
};
ZxQuery.prototype.hasClass = function (className) {
    return z$.hasClass(this._selection[0], className);
};
ZxQuery.prototype.removeClass = function (className) {
    var classes = className.match(/\S+/g) || [];
    z$.each(this._selection, function (k, v) {
        if (this.classList) {
            var _t = this;
            z$.each(classes, function (k, v) {
                _t.classList.remove(v);
            });
        } else this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    });
    return this;
};
ZxQuery.prototype.prev = function () {
    return new ZxQuery(this._selection[0].previousElementSibling);
};
ZxQuery.prototype.next = function () {
    return new ZxQuery(this._selection[0].nextElementSibling);
};
ZxQuery.prototype.html = function (htmlText) {
    if (util.isNoU(htmlText))
        return this._selection[0].innerHTML;
    this.each(function (k, v) {
        this.innerHTML = htmlText;
    });
    return this;
};
ZxQuery.prototype.display = function (mode) {
    if (util.isNoU(mode))
        return this._selection[0].style.display;
    z$.each(this._selection, function (k, v) {
        this.style.display = mode;
    });
    return this;
};
ZxQuery.prototype.show = function () {
    return this.display('');
};
ZxQuery.prototype.hide = function () {
    return this.display('none');
};


/**
 *
 * @param what
 * @returns {ZxQuery}
 */
var z$ = function (what) {
    return new ZxQuery(what);
};
z$.find = function (filter) {
    return z$().find(filter);
};
z$.each = function (items, iterationCallback) {
    for (var i = 0, len = items.length; i < len; i++)
        if (iterationCallback.call(items[i], i, items[i]) === false)
            break;
    return this;
};
z$.hasClass = function(el, className) {
    var classes = className.match(/\S+/g) || [];
    var success = false;
    z$.each(classes, function (k, v) {
        if (el.classList)
            success = el.classList.contains(v);
        else
            success = (new RegExp('(^| )' + v + '( |$)', 'gi').test(el.className));
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
        if (result != null)
            wrappedCss += wrapperRule + ' ' + css.substring(result.index, r.index);
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
     * @type {ContextControllerCallback}
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
     * @protected
     * @type {ContextController}
     */
    this._c = null;

    this.options(options);

    return this;
}

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
 * TODO: describe
 * @event ComponentContext#ready
 * @param {ComponentContext} context The component context instance.
 */
ComponentContext.prototype.ready = function (context) {
};

/**
 * TODO: describe
 * @event ComponentContext#error
 * @param {ComponentContext} context The component context instance.
 * @param {Object} error The error object
 */
ComponentContext.prototype.error = function (context, error) {
};


/**
 * TODO: describe
 * @param a
 * @param b
 */
ComponentContext.prototype.on = function (a, b) {
    // TODO: throw error if _c (controller instance) is not yet ready
    return this._c.on(a, b);
};

/***
 *
 * @param {ContextModel|undefined} [model]
 * @returns {ComponentContext|Object}
 */
ComponentContext.prototype.model = function (model) {
    if (typeof model === 'undefined') return this._model;
    else this._model = model; // model can be set to null
    this.updateModelView();
    return this;
};

/** @protected */
ComponentContext.prototype.updateModelView = function () {
    if (this._view != null && this._model != null) {
        var _t = this;
        z$(this._view).find('[data-ui-field]').each(function () {
            var field = z$(this);
            var boundField = field.attr('data-bind-to');
            if (boundField == null)
                boundField = field.attr('data-ui-field');
            if (typeof _t._model === 'function')
                (_t._model).call(_t._view, this, boundField);
            else {
                var boundData = util.propertyFromPath(_t._model, boundField);
                if (typeof boundData === 'function') {
                    (boundData).call(_t._view, this, boundField);
                } else if (boundData != null) {
                    // try to guess target property
                    switch (this.tagName.toLowerCase()) {
                        // TODO: complete binding cases
                        case 'img':
                            this.src = boundData;
                            break;
                        case 'input':
                            this.value = boundData;
                            break;
                        default:
                            this.innerHTML = boundData;
                    }
                }
            }
        });
        if (!util.isNoU(this._c) && util.isFunction(this._c.refresh))
            this._c.refresh();
    }
};

/***
 *
 * @param {string|Element|undefined} [css]
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
        var hookData = {content: css};
        this.trigger(this, 'css:parse', hookData);
        css = hookData.content;

        // output css
        this._style = z$.appendCss(css, this._style);

    }
    // TODO: should throw error if ```css``` is not a valid type
    return this;
};
/**
 *
 * @param callback
 * @returns {ComponentContext}
 */
ComponentContext.prototype.loadCss = function (callback) {
    var context = this;
    z$.ajax({
        url: context.componentId + ".css?" + new Date().getTime(),
        success: function (viewCss) {
            context.style(viewCss);
            if (util.isFunction(callback))
                (callback).call(context);
        },
        error: function (err) {
            console.log(err, context);
            if (util.isFunction(callback))
                (callback).call(context);
        }
    });
    return this;
};
ComponentContext.prototype.loadHtml = function(callback) {
    var context = this;
    z$.ajax({
        url: context.componentId + ".html?" + new Date().getTime(),
        success: function (viewHtml) {
            context.view(viewHtml);
            if (util.isFunction(callback))
                (callback).call(context);
        },
        error: function (err) {
            console.log(err, context);
            if (util.isFunction(callback))
                (callback).call(context, err);
        }
    });
    return this;
};

/***
 *
 * @param {ContextView|string|undefined} [view]
 * @returns {ComponentContext|ContextView}
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

        z$(this._view).find('script').each(function () {
            if (this.getAttribute('zuix-loaded') !== 'true') {
                this.setAttribute('zuix-loaded', 'true');
                (eval).call(window, this.innerHTML);
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
        this.trigger(this, 'view:process', this._view);

        this.updateModelView();
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

    return this;
};
/***
 *
 * @param {ContextControllerCallback|undefined} [controller]
 * @returns {ComponentContext|ContextControllerCallback}
 */
ComponentContext.prototype.controller = function (controller) {
    if (typeof controller === 'undefined') return this._controller;
    // TODO: should dispose previous context controller first
    else this._controller = controller; // can be null
    return this;
};
/***
 *
 * @param {ViewContainer} [container]
 * @returns {ComponentContext|Node}
 */
ComponentContext.prototype.container = function (container) {
    // TODO: should automatically re-attach view to the new parent?
    if (container == null) return this._container;
    else this._container = container;
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
 * @returns {ContextController}
 * @constructor
 */
function ContextController(context) {
    var self = this;

    /** @protected */
    this.context = context;

    // TODO: should improve/deprecate this.componentId?
    this.componentId = context.componentId;
    /** @type {ContextView} */
    this.view = function () {
        return context.view()
    };
    /** @type {ContextModel} */
    this.model = function () {
        return context.model()
    };
    /** @type {function} */
    this.expose = function (methodName, handler) {
        context[methodName] = handler;
    };
    /** @type {function} */
    this.behavior = function () {
        return context.behavior;
    };
    /** @type {function} */
    this.loadCss = function(callback) {
        var _ctrl = this;
        context.loadCss(function () {
            // TODO: ?
            if (typeof callback === 'function')
                (callback).call(_ctrl);
        });
        return this;
    };
    /** @type {function} */
    this.loadHtml = function(callback) {
        var _ctrl = this;
        context.loadHtml(function () {
            // TODO: ?
            if (typeof callback === 'function')
                (callback).call(_ctrl);
        });
        return this;
    };

    /** @protected */
    this._fieldCache = [];

    /** @type {function} */
    this.create = null;
    /** @type {function} */
    this.resume = null;
    /** @type {function} */
    this.pause = null;
    /** @type {function} */
    this.destroy = null;
    /** @type {function} */
    this.refresh = null;
    /** @type {function} */
    this.event = null; // UI event stream handler (eventPath,eventValue)

    /** @type {function} */
    this.trigger = function (eventPath, eventData) {
        if (context._eventMap[eventPath] == null)
            this.addEvent(self.view(), eventPath, null);
        // TODO: ...
        z$(self.view()).trigger(eventPath, eventData);
    };
    /** @type {function} */
    this.on = function (eventPath, handler_fn) {
        this.addEvent(self.view(), eventPath, handler_fn);
        // TODO: implement automatic event unbinding (off) in super().destroy()
    };
    /** @protected */
    this.mapEvent = function (eventMap, target, eventPath, handler_fn) {
        if (target != null) {
            var t = z$(target);
            t.off(eventPath, this.eventRouter);
            eventMap[eventPath] = handler_fn;
            t.on(eventPath, this.eventRouter);
        } else {
            // TODO: should report missing target
        }
    };
    /** @protected */
    this.eventRouter = function (e) {
        //if (typeof self.behavior() === 'function')
        //    self.behavior().call(self.view(), a, b);
        if (typeof context._behaviorMap[e.type] === 'function')
            context._behaviorMap[e.type].call(self.view(), e, e.detail);
        if (typeof context._eventMap[e.type] === 'function')
            context._eventMap[e.type].call(self.view(), e, e.detail);
        // TODO: else-> should report anomaly
    };

    // create event map from context options
    var options = context.options(), handler = null;
    if (options.on != null) {
        for (var ep in options.on) {
            handler = options.on[ep];
            // TODO: should log.warn if k already exists
            self.addEvent(self.view(), ep, handler);
        }
    }
    // create behavior map from context options
    if (options.behavior != null) {
        for (var bp in options.behavior) {
            handler = options.behavior[bp];
            // TODO: should log.warn if k already exists
            self.addBehavior(self.view(), bp, handler);
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

/***
 * Search and cache this view elements.
 *
 * @param {!string} field Name of the `data-ui-field` to search
 * @param {boolean} [globalSearch] Search a generic field attribute
 * @returns {Element}
 */
ContextController.prototype.field = function (field, globalSearch) {
    var f = globalSearch ? '@' + field : field;
    var el = null;
    if (typeof this._fieldCache[f] === 'undefined') {
        el = globalSearch ? z$(field).get(0) : z$(this.view()).find('[data-ui-field=' + field + ']').get(0);
        if (el != null)
            this._fieldCache[f] = el;
    } else {
        el = this._fieldCache[f];
    }
    return el;
};
ContextController.prototype.clearCache = function () {
    this._fieldCache.length = 0;
};

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
var TaskQueue =
    _dereq_('../helpers/TaskQueue');
var z$ =
    _dereq_('../helpers/ZxQuery');

/**
 * @class Zuix
 * @constructor
 */
function Zuix() {

    var ComponentContext = _dereq_('./ComponentContext');
    var ContextController = _dereq_('./ContextController');

    var tasker = new TaskQueue(function(tq, eventPath, eventValue){
        triggerHook(tq, eventPath, eventValue);
    });

    /**
     * @protected
     * @type {!Array<ComponentCache>}
     */
    var _componentCache = [];

    /**
     * @protected
     * @type {!Array<ComponentContext>}
     */
    var _contextRoot = [];


    // TODO: implement Config object for zuix
    /** @protected
     * @const
     */
    var ZUIX_FIELD_ATTRIBUTE = 'data-ui-field';


    /** @protected */
    var _contextSeqNum = 0;

    /** @protected */
    var _lazyQueued = []; // Lazy loading - queued elements
    /** @protected */
    var _lazyLoaders = []; // "data-ui-lazyload" elements


    /**
     * TODO: describe
     *
     * @param callback {ContextControllerCallback}
     * @returns {ContextControllerCallback}
     */
    function controller(callback) {
        return callback;
    }

    /**
     * Returns Node with `ZUIX_FIELD_ATTRIBUTE` attribute matching `fieldName` .
     *
     * @param {!string} fieldName The class to check for.
     * @param {!Node} [container] Starting DOM element for this search.
     * @returns {Node}
     */
    function field(fieldName, container) {
        return z$(container).find('[' + ZUIX_FIELD_ATTRIBUTE + '="' + fieldName + '"]').get(0);
    }

    /**
     * TODO: describe
     *
     * @param [element] {Node}
     */
    function componentize(element) {
        // Throttle method
        if (tasker.requestLock(componentize)) {
            z$(element).find('[data-ui-load]:not([data-ui-loaded=true]),[data-ui-include]:not([data-ui-loaded=true])').each(function () {
                // override lazy loading if 'lazyload' is set to 'false' for the current element
                if (!lazyLoadEnabled() || this.getAttribute('data-ui-lazyload') == 'false') {
                    loadInline(this);
                    return true;
                }
                // defer element loading if lazy loading is enabled and the element is not in view
                var lazyLoad = z$.getClosest(this, '[data-ui-lazyload=true]');
                if (lazyLoad !== null) {
                    if (_lazyLoaders.indexOf(lazyLoad) == -1) {
                        _lazyLoaders.push(lazyLoad);
                        z$(lazyLoad).on('scroll', function () {
                            componentize(lazyLoad);
                        });
                    }
                    var position = z$.getPosition(this);
                    if (!position.visible) {
                        if (_lazyQueued.indexOf(this) == -1) {
                            _lazyQueued.push(this);
                        }
                        // Not in view: defer element loading and
                        // process next inline element
                        return true;
                    }
                }
                // proceed loading inline element
                var queued = _lazyQueued.indexOf(this);
                if (queued > -1)
                    _lazyQueued.splice(queued, 1);
                loadInline(this);
            });
            tasker.releaseLock(componentize);
        } else tasker.lockLater(componentize, function() {
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
        if (util.isNoU(options.view) && !v.isEmpty())
            options.view = element;
        else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty())
            options.container = element;

        var componentId = v.attr('data-ui-load');
        if (util.isNoU(componentId)) {
            // Static include should not have any controller
            componentId = v.attr('data-ui-include');
            v.attr('data-ui-component', componentId);
            // disable controller auto-loading
            if (util.isNoU(options.controller))
                options.controller = function(){}; // null
        }

        // inline attributes have precedence over ```options```

        var model = v.attr('data-bind-model');
        if (!util.isNoU(model) && model.length > 0)
            options.model = util.propertyFromPath(window, model);

        // TODO: Behavior are also definable in "data-ui-behavior" attribute
        // TODO: Events are also definable in "data-ui-on" attribute
        // TODO: perhaps "data-ui-ready" and "data-ui-error" too
        // util.propertyFromPath( ... )

        load(componentId, options);
    }

    /**
     * Loads a component with the given options.
     *
     * @param {!string} componentId The id/name of the component we want to load.
     * @param {ContextOptions} [options] context options used to initialize the loaded component
     * @returns {ComponentContext}
     */
    function load(componentId, options) {
        // TODO: throw error on argument mismatch
        // TODO: prevent load loops when including recursively a component

        /** @type {ComponentContext} */
        var context = null;
        if (!util.isNoU(options)) {
            // check if context has its unique id assigned
            if (!util.isNoU(options.contextId)) {
                // if it does, try to pick it from allocated contexts list
                context = getContext(options.contextId);
                if (context !== null) {
                    context.options(options);
                } else {
                    // if no context is already allocated
                    // with that id, then add a new one
                    context = createContext(options);
                }
            } else {
                if (options === false)
                    options = {};
                // generate contextId (this is a bit buggy, but it's quick)
                options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
                context = createContext(options);
            }
        } else {
            // empty context
            options = {};
            context = new ComponentContext(options, triggerHook);
        }

        // assign the given component (widget) to this context
        if (context.componentId != componentId) {
            context.componentId = componentId;
            /*
             TODO: to be fixed
             if (!util.isNoU(context.view())) {
             // TODO: implement this code in a context.detach() method
             //context.controller().pause()
             context.view().detach();
             context.view(null);
             }*/
        }

        // pick it from cache if found
        var cachedComponent = getCachedComponent(context.componentId);
        if (cachedComponent !== null && util.isNoU(context.controller()))
            context.controller(cachedComponent.controller);

        if (util.isFunction(options.ready))
            context.ready = options.ready;
        if (util.isFunction(options.error))
            context.error = options.error;

        if (util.isNoU(options.view)) {

            if (cachedComponent !== null) {
                context.view(cachedComponent.view);
            } else {
                // TODO: replace z$() with z$(options.container)
                var inlineView = z$().find('[data-ui-view="' + context.componentId + '"]');
                if (inlineView.length() > 0)
                    context.view(inlineView.get(0));
            }

            // if not able to inherit the view from the base cachedComponent
            // or from an inline element, then load the view from web
            if (util.isNoU(context.view())) {
                // Load View
                tasker.queue('html:' + context.componentId, function () {
                    var task = this;
                    z$.ajax({
                        url: context.componentId + ".html?" + new Date().getTime(),
                        success: function (viewHtml) {
                            context.view(viewHtml);
                            task.end();
                            // View CSS loading
                            if (options.css !== false)
                                loadViewCss(context, function () {
                                    // Controller loading
                                    loadController(context);
                                });
                            else loadController(context);
                        },
                        error: function (err) {
                            task.end();
                            console.log(err, context);
                            if (util.isFunction(options.error))
                                (context.error).call(context, err);
                        }
                    });

                });
                // defer controller loading
                return context;
            }
        } else {
            context.view(options.view);
        }
        loadController(context);
        return context;
    }

    /**
     *
     * @param context {ComponentContext}
     */
    function unload(context) {
        if (!util.isNoU(context) && !util.isNoU(context._c)) {
            if (!util.isNoU(context._c.view()))
                context._c.view().removeAttribute('data-ui-component');

            //context.unregisterEvents();
            // TODO: unregister events and local context behavior
            // TODO: detach view from parent if context.container is not null

            if (util.isFunction(context._c.destroy))
                context._c.destroy();
        }
    }

    /***
     *
     * @param {Node|Object} contextId
     * @returns {ComponentContext}
     */
    function getContext(contextId) {
        var context = null;
        z$.each(_contextRoot, function (k, v) {
            if ((contextId instanceof Node && v.view() === contextId)
                || util.objectEquals(v.contextId, contextId)) {
                context = v;
                return false;
            }
        });
        return context;
    }

    function createContext(options) {
        var context = new ComponentContext(options, triggerHook);
        _contextRoot.push(context);
        return context;
    }

    function removeContext(contextId) {
        // TODO: removeContext
    }

    function removeCachedComponent(componentId) {
        // TODO: removeCachedComponent
    }

    /***
     *
     * @param {Object} componentId
     * @returns {ComponentCache}
     */
    function getCachedComponent(componentId) {
        var cached = null;
        z$.each(_componentCache, function (k, v) {
            if (util.objectEquals(v.componentId, componentId)) {
                cached = v;
                return false;
            }
        });
        return cached;
    }


    function loadViewCss(context, callback) {
        // CSS is optional, so no error is thrown on load error
        tasker.queue('css:' + context.componentId, function () {
            var task = this;
            context.loadCss(function () {
               task.end();
            });
        });
    }

    /***
     *
     * @param {ComponentContext} context
     */
    function loadController(context) {
        if (typeof context.options().controller === 'undefined' && context.controller() === null) {
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
                            if (ih > 1 && il < fn)
                                ctrlJs = ctrlJs.substring(ih + 11);
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            console.log(e, ctrlJs, context);
                            if (util.isFunction(context.error))
                                (context.error).call(context, e);
                            return;
                        }
                        createComponent(context);
                        task.end();
                    },
                    error: function (err) {
                        task.end();
                        createComponent(context);
                        console.log(err, context);
                        if (util.isFunction(context.error))
                            (context.error).call(context, err);
                    }
                });
            });
        } else {
            createComponent(context);
        }
    }

    /***
     *
     * @param context {ComponentContext}
     */
    function createComponent(context) {
        if (!util.isNoU(context.view())) {
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
            initComponent(context);
        } else {
            // TODO: report error
        }
    }

    /***
     *
     * @param {ComponentContext} context
     */
    function initComponent(context) {
        if (util.isFunction(context.controller())) {
            /** @type {ContextController} */
            var c = context._c = new ContextController(context);

            if (!util.isNoU(c.view()))
                c.view().setAttribute('data-ui-component', c.componentId);

            // TODO: review/improve life-cycle

            if (util.isFunction(c.create)) c.create();
            c.trigger('view:create');

            context.updateModelView();

            if (util.isFunction(c.resume)) c.resume();
        }
        if (util.isFunction(context.ready))
            (context.ready).call(context);
    }

    /***
     *
     * @param javascriptCode string
     * @returns {ContextControllerCallback}
     */
    // TODO: refactor this method name
    function getController(javascriptCode) {
        var instance = function (ctx) {
        };
        if (typeof javascriptCode === 'string') {
            try {
                instance = (eval).call(this, javascriptCode);
            } catch(e) {
                // TODO: should trigger a global hook
                // eg. 'controller:error'
                console.log(this, e, javascriptCode);
            }
        }
        return instance;
    }


    // TODO: following code to be sorted/re-arranged


    function triggerHook(context, path, data) {

        // TODO: call all registered callback
        if (util.isFunction(_hooksCallbacks[path]))
            _hooksCallbacks[path].call(context, path, data);

        // ZUIX Componentizer is the last executed hook (built-in)
        if (path == 'view:process')
            componentize(data);

    }

    var _hooksCallbacks = [];

    function hooks(path, handler) {
        if (util.isNoU(handler))
            return _hooksCallbacks[path];
        _hooksCallbacks[path] = handler;
        return this;
    }

    function lazyLoadEnabled(enable) {
        if (enable != null)
            _disableLazyLoading = !enable;
        return !_isCrawlerBotClient && !_disableLazyLoading;
    }

    // Browser Agent / Bot detection
    var _isCrawlerBotClient = false, _disableLazyLoading = false;
    if (navigator && navigator.userAgent)
        _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
            .test(navigator.userAgent);
    if (_isCrawlerBotClient)
        console.log(navigator.userAgent, "is a bot, ignoring 'data-ui-lazyload' option.");

    // Public ```zuix``` interface

    /** @global */
    var zuix = {

        /* Component loading methods */
        controller: controller,
        load: load,
        unload: unload,
        componentize: componentize,
        context: getContext,
        lazyLoad: lazyLoadEnabled,

        /* Zuix hooks */
        hook: function (p, v) {
            hooks(p, v);
            return this;
        },

        /* Utility methods */
        $: z$,
        field: field,

        /* Access to classes proto */
        TaskQueue: TaskQueue,
        ZxQuery: z$.ZxQuery,

        /* Dev utility methods */
        dumpCache: function () {
            console.log("ZUIX", "Component Cache", _componentCache);
        },
        dumpContexts: function () {
            console.log("ZUIX", "Loaded Component Instances", _contextRoot);
        }

    };

    // TODO: add zuix.options to configure stuff like
    // TODO: the css/html/js lookup base path (each individually own prop)

    return zuix;
}

module.exports = Zuix;
},{"../helpers/TaskQueue":1,"../helpers/Util":2,"../helpers/ZxQuery":3,"./ComponentContext":5,"./ContextController":6}]},{},[4])
(4)
});