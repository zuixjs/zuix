/*
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

/*
 *
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var _log =
    require('./Logger')('TaskQueue.js');
var util = require('./Util.js');


// Types definitions for JsDoc

/**
 * The `ElementPosition` object returned by the `position()` method.
 * @typedef {object} ElementPosition
 * @property {number} x X coordinate of the element in the viewport.
 * @property {number} y Y coordinate of the element in the viewport.
 * @property {boolean} visible Boolean value indicating whether the element is visible in the viewport.
 */

/**
 * The `IterationCallback` function.
 * @callback IterationCallback
 * @param {number} i Iteration count.
 * @param {object} item Current element.
 * @this {object}
 */

/**
 * The `InstanceIterationCallback` function.
 * @callback InstanceIterationCallback
 * @param {number} count Iteration count.
 * @param {Element} item Current element.
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
            _log.w('Handler already registered', el, path, handler);
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
function removeAllEventHandlers(el) {
    z$.each(_zuix_events_mapping, function () {
        if (this.element === el) {
            _log.t('Removing event handler', this.element, this.path, this.handler);
            removeEventHandler(this.element, this.path, this.handler);
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
    else if (element === window || element instanceof HTMLElement || element instanceof Node)
        this._selection = [element];
    else if (typeof element === 'string')
        this._selection = document.documentElement.querySelectorAll(element);
    else if (element !== null) { //if (typeof element === 'string') {
        _log.e('ZxQuery cannot wrap object of this type.', (typeof element), element);
        throw(new Error(), element);
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
    var selection = this._selection;
    var resultSet = selection[i];
    if (arguments.length > 1) {
        resultSet = [];
        z$.each(arguments, function (k, v) {
            if (selection[v] != null)
                resultSet.push(selection[v])
        });
    }
    return new ZxQuery(resultSet);
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
 * @param {InstanceIterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.each = function (iterationCallback) {
    z$.each(this._selection, iterationCallback);
    return this;
};
/**
 * Gets or sets the given element attribute.
 * @param {string|JSON} attr The attribute name
 * @param {string|undefined} [val] The attribute value
 * @return {string|ZxQuery} The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.attr = function (attr, val) {
    var _t = this;
    if (typeof attr === 'object') {
        z$.each(attr, function (i, v) {
            _t.each(function (k, el) {
                el.setAttribute(i, v);
            });
        });
    } else if (typeof val == 'undefined')
        return this._selection[0].getAttribute(attr);
    else if (val === null)
        this._selection[0].removeAttribute(attr);
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
 * Un-register all event handlers registered for selected elements.
 * @return {ZxQuery}
 */
ZxQuery.prototype.reset = function () {
    this.each(function (k, el) {
        removeAllEventHandlers(el);
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
 * @return {ElementPosition}
 */
ZxQuery.prototype.position = function () {
    if (this._selection[0] != null)
        return z$.getPosition(this._selection[0]);
    else // TODO: check this out; should prevent this from happening
        return { x: -1, y: -1, visible: false };
};

/**
 * Sets or gets the given css property.
 * @param {string|JSON} attr The CSS property name or JSON list of properties/values.
 * @param {string|undefined} [val] The attribute value.
 * @return {string|ZxQuery} The *attr* css value when no *val* specified, otherwise the *ZxQuery* object itself
 */
ZxQuery.prototype.css = function (attr, val) {
    var _t = this;
    if (typeof attr === 'object') {
        z$.each(attr, function (i, v) {
            _t.each(function (k, el) {
                el.style[i] = v;
            });
        });
    } else if (util.isNoU(val))
        return this._selection[0].style[attr];
    else
        _t.each(function (k, el) {
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
 * Gets or sets the checked attribute.
 * @param {boolean|undefined} [check] Value to assign to the 'checked' attribute.
 * @return {ZxQuery|boolean}
 */
ZxQuery.prototype.checked = function(check) {
    if (util.isNoU(check)) {
        var checked = this._selection[0].checked;
        return (checked != null && checked != 'false' && (checked || checked == 'checked'));
    }
    this.each(function (k, el) {
        el.checked = check;
    });
    return this;

};
/**
 * Gets or sets the 'value' attribute.
 * @param {string|undefined} [value] Value to assign to the 'value' attribute.
 * @return {ZxQuery|string}
 */
ZxQuery.prototype.value = function(value) {
    if (util.isNoU(value))
        return this._selection[0].value;
    this.each(function (k, el) {
        el.value = value;
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
 * Insert the given child element before the one at the
 * specified index.
 *
 * @param {number} index Position where to insert `el` Element.
 * @param {Object|ZxQuery|Array<Node>|Node|NodeList} el Element to insert.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.insert = function (index, el) {
    var target = this.children().get(index);
    if (target !== null)
        this._selection[0].insertBefore(el, target);
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
        this._selection[0].insertBefore(el, this._selection[0].firstElementChild);
    return this;
};
/**
 * Re-attach element to its parent.
 * @return {ZxQuery}
 */
ZxQuery.prototype.attach = function () {
    var el = this._selection[0];
    if (el.parentNode == null && el.__zuix_oldParent != null) {
        z$(el.__zuix_oldParent).insert(el.__zuix_oldIndex, el);
        el.__zuix_oldParent = null;
        delete el.__zuix_oldParent;
        delete el.__zuix_oldIndex;
    }
    return this;
};
/**
 * Detach element from its parent.
 * @return {ZxQuery}
 */
ZxQuery.prototype.detach = function () {
    var el = this._selection[0];
    var parent = el.parentNode;
    if (parent != null) {
        el.__zuix_oldParent = parent;
        el.__zuix_oldIndex = Array.prototype.indexOf.call(parent.children, el);
        parent.removeChild(el);
        _log.t('Detached from parent', parent, el);
    }
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
 * @param {string} [mode] Set the display mode to be used to show element (eg. block, inline, etc..)
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.show = function (mode) {
    return this.display(mode == null ? '' : mode);
};
/**
 * Sets the css `display` property to 'none'.
 * @return {ZxQuery} The *ZxQuery* object itself
 */
ZxQuery.prototype.hide = function () {
    return this.display('none');
};

// --- ZxQuery factory members --- //

/**
 * Exported ZxQuery interface.
 *
 * @param [what] {Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined}
 * @return {ZxQuery}
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
 * @param {Array<Object>|JSON} items Enumerable objects collection.
 * @param {IterationCallback} iterationCallback The callback *fn* to call at each iteration
 * @return {z$} `this`.
 */
z$.each = function (items, iterationCallback) {
    var len = (items == null ? 0 : Object.keys(items).length);
    if (len > 0) {
        var count = 0;
        for (var i in items) {
            var item = items[i];
            if (item instanceof Element)
                item = z$(item);
            if (iterationCallback.call(item, i, items[i]) === false)
                break;
            count++;
            if (count >= len)
                break;
        }
    }
    return this;
};
z$.ajax = function (opt) {
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
        } else {
            if (util.isFunction(opt.error)) opt.error(xhr);
        }
        if (util.isFunction(opt.then)) opt.then(xhr);
    };
    xhr.send();
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
z$.classExists = function (className) {
    var classes = className.match(/\S+/g) || [];
    var success = false;
    z$.each(classes, function (k, cl) {
        // Perform global style check
        var docStyles = document.styleSheets;
        if (docStyles != null) {
            for (var sx = 0; sx < docStyles.length; sx++) {
                // the try statement is needed because on Firefox accessing CSS rules
                // loaded from a remote source will raise a security exception
                try {
                    var classes = docStyles[sx].rules || docStyles[sx].cssRules;
                    if (classes != null) {
                        for (var cx = 0; cx < classes.length; cx++) {
                            if (classes[cx].selectorText === cl) {
                                success = true;
                                break;
                            }
                        }
                    }
                } catch(e) {
                    if(e.name !== "SecurityError")
                        throw e;
                }
            }
        }
    });
    return success;
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
    var wrapReX = /((.*){([^{}]|((.*){([^}]+)[}]))*})/g;
    var wrappedCss = '';
    var ruleMatch;
    do {
        ruleMatch = wrapReX.exec(css);
        if (ruleMatch && ruleMatch.length > 1) {
            var ruleParts = ruleMatch[2];
            if (ruleParts != null && ruleParts.length > 0) {
                var classes = ruleParts.split(',');
                var isMediaQuery = false;
                z$.each(classes, function (k, v) {
                    if (v.replace(' ', '') === '.') {
                        // a single `.` means 'self' (the container itself)
                        // so we just add the wrapperRule
                        wrappedCss += '\n' + wrapperRule + ' '
                    } else if (v.trim()[0] === '@') {
                        // leave it as is if it's an animation or media rule
                        wrappedCss += v + ' ';
                        if (v.trim().toLowerCase().startsWith('@media'))
                            isMediaQuery = true;
                    } else {
                        // wrap the class name (v)
                        wrappedCss += '\n' + wrapperRule + '\n' + v + ' ';
                    }
                    if (k < classes.length - 1)
                        wrappedCss += ', ';
                });
                if (isMediaQuery) {
                    var wrappedMediaQuery = z$.wrapCss(wrapperRule, ruleMatch[1].substring(ruleMatch[2].length).replace(/^{([^\0]*?)}$/,'$1'));
                    wrappedCss += '{\n  '+wrappedMediaQuery+'\n}';
                } else {
                    wrappedCss += ruleMatch[1].substring(ruleMatch[2].length) + '\n';
                }
            } else {
                _log.w('z$.wrapCss was unable to parse rule.', ruleParts, ruleMatch);
            }
        }
    } while (ruleMatch);
    if (wrappedCss !== '')
        css = wrappedCss;
    return css;
};
z$.appendCss = function (css, target, cssId) {
    var style = null;
    var head = document.head || document.getElementsByTagName('head')[0];
    // remove old style if already defined
    if (!util.isNoU(target)) {
        head.removeChild(target);
    } else {
        var oldStyle = document.getElementById(cssId);
        if (oldStyle != null) {
            head.removeChild(oldStyle);
        }
    }
    if (typeof css === 'string') {
        // output css
        style = document.createElement('style');
        style.type = 'text/css';
        style.id = cssId;
        if (style.styleSheet)
            style.styleSheet.cssText = css;
        else
            style.appendChild(document.createTextNode(css));
    } else if (css instanceof Element) style = css;
    // Append new CSS
    if (!util.isNoU(style))
        head.appendChild(style);
    return style;
};
z$.replaceBraces = function (html, callback) {
    var outHtml = '', matched = 0, currentIndex = 0;
    var tags = new RegExp(/[^{}]+(?=})/g),
        result;
    while (result = tags.exec(html)) {
        var value = '{'+result[0]+'}';
        if (typeof callback === 'function') {
            var r = callback(result[0]);
            if (!util.isNoU(r)) {
                value = r;
                matched++;
            }
        }
        outHtml += html.substr(currentIndex, result.index-currentIndex-1)+value;
        currentIndex = result.index+result[0].length+1;
    }
    if (matched > 0) {
        outHtml += html.substr(currentIndex);
        return outHtml;
    }
    return null;
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
        if (el.tagName.toLowerCase() === "body") {
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
z$.isInView = function (el, tolerance) {
    if (el.offsetParent === null)
        return false;
    var rect = el.getBoundingClientRect();
    var area = {
        width: (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */,
        height: (window.innerHeight || document.documentElement.clientHeight) /* or $(window).height() */
    };
    var xt = 0; var yt = 0;
    if (!isNaN(tolerance)) {
        xt = (area.width * tolerance) - area.width;
        yt = (area.height * tolerance) - area.height;
    }
    return rect.bottom > -yt && rect.right > -xt
        && rect.left < area.width + xt
        && rect.top < area.height + yt;
};
z$.scrollTo = function(el, targetY, duration) {
    if (targetY === 0 || targetY == null)
        return;
    if (duration == null) duration = 500;
    var scrollParent = z$.getScrollParent(el);
    var scrollTop = scrollParent.scrollTop+targetY;
    var scrollOffset = el.scrollTop-targetY;
    scrollParent.style.transition = 'transform '+duration+'ms ease';
    if (typeof scrollParent.style.WebkitTransform !== 'undefined')
        scrollParent.style.WebkitTransform = "translate(0, " + (scrollOffset) + "px)";
    else if (typeof scrollParent.style.MozTransform !== 'undefined')
        scrollParent.style.MozTransform= "translate(0, " + (scrollOffset) + "px)";
    else
        scrollParent.style.transform = "translate(0, " + (scrollOffset) + "px)";
    window.setTimeout(function () {
        // TODO: should backup and restore old value
        if (typeof scrollParent.style.WebkitTransform !== 'undefined')
            scrollParent.style.WebkitTransform = "";
        else if (typeof scrollParent.style.MozTransform !== 'undefined')
            scrollParent.style.MozTransform= "";
        else
            scrollParent.style.transform = "";
        scrollParent.style.transition = '';
        scrollParent.scrollTop = scrollTop;
    }, duration);
    return this;
};
z$.getScrollParent = function(node) {
    if (node == null)
        return null;
    if (node.scrollHeight > node.clientHeight)
        return node;
    else
        return z$.getScrollParent(node.parentNode);
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
// String.hashCode extension
String.prototype.hashCode = function() {
    var hash = 0, i, chr;
    if (this.length === 0) return hash;
    for (i = 0; i < this.length; i++) {
        chr   = this.charCodeAt(i);
        hash  = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};
// String.startsWith polyfill
if (!String.prototype.startsWith) {
    String.prototype.startsWith = function(search, pos) {
        return this.substr(!pos || pos < 0 ? 0 : +pos, search.length) === search;
    };
}

module.exports =  z$;
