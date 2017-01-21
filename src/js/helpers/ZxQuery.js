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

var util = require('./Util.js');

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
