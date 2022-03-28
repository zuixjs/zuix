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
 * @author Generoso Martello <generoso@martello.com>
 */

'use strict';

const _log =
    require('./Logger')('TaskQueue.js');
const util = require('./Util.js');


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
 * Callback function used with the `each(..)` method.
 *
 * @callback PlayTransitionCallback
 * @param {ZxQuery} $element Target element (same as 'this').
 * @param {Array<string>} transitionQueue Transition class queue left to animate, `null` if the animation ended.
 * @this {ZxQuery}
 */

/** @private */
const supportsPassive = util.hasPassiveEvents();

/** @private */
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
    _log.e('ZxQuery cannot wrap object of this type.', (typeof element), element);
    throw new Error('ZxQuery cannot wrap object of this type.');
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
  if (!util.isNoU(filter)) {
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
  if (!util.isNoU(filter)) {
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
  if (util.isNoU(i)) i = 0;
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
  } else if (this.length() > 0 && el != null) {
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
    z$.each(attr, function(i, v) {
      _t.each(function(k, el) {
        util.dom.setAttribute(el, i, v);
      });
    });
  } else if (typeof val == 'undefined') {
    return util.dom.getAttribute(this._selection[0], attr);
  } else {
    this.each(function(k, v) {
      util.dom.setAttribute(this.get(), attr, val);
    });
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
  let event;
  if (window.CustomEvent) {
    event = new CustomEvent(eventPath, {detail: eventData});
  } else {
    event = document.createEvent('CustomEvent');
    event.initCustomEvent(eventPath, true, true, eventData);
  }
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
  if (typeof eventPath === 'object' && eventHandler == null) {
    const _t = this;
    z$.each(eventPath, function(evt, handler) {
      _t.one(evt, handler);
    });
    return this;
  }
  let fired = false;
  const _t = this;
  const h = function(a, b) {
    if (fired) return;
    fired = true;
    z$(_t).off(eventPath, h);
    (eventHandler).call(_t, a, b, _t);
  };
  this.on(eventPath, h);
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
    z$.each(eventPath, function(evt, handler) {
      _t.on(evt, handler);
    });
    return this;
  }
  const events = eventPath.match(/\S+/g) || [];
  let options;
  if (typeof eventHandler !== 'function') {
    options = eventHandler;
    eventHandler = options.handler;
  }
  this.each(function(k, el) {
    z$.each(events, function(k, ev) {
      addEventHandler(el, ev, eventHandler, options);
    });
  });
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
    z$.each(eventPath, function(evt, handler) {
      _t.off(evt, handler);
    });
    return this;
  }
  const events = eventPath.match(/\S+/g) || [];
  this.each(function(k, el) {
    z$.each(events, function(k, ev) {
      removeEventHandler(el, ev, eventHandler);
    });
  });
  return this;
};
/**
 * De-registers all event handlers of all elements in the ZxQuery object.
 *
 * @return {ZxQuery} The *ZxQuery* object itself.
 */
ZxQuery.prototype.reset = function() {
  this.each(function(k, el) {
    removeAllEventHandlers(el);
  });
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
  if (this._selection[0] != null) {
    return z$.getPosition(this._selection[0]);
  } else {
    // TODO: check this out; should prevent this from happening
    return {x: -1, y: -1, visible: false};
  }
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
  const _t = this;
  if (typeof prop === 'object') {
    z$.each(prop, function(i, v) {
      _t.each(function(k, el) {
        el.style[i] = v;
      });
    });
  } else if (util.isNoU(val)) {
    return this._selection[0].style[prop];
  } else {
    _t.each(function(k, el) {
      el.style[prop] = val;
    });
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
  const classes = className.match(/\S+/g) || [];
  z$.each(this._selection, function(k, el) {
    if (el.classList) {
      z$.each(classes, function(k, cl) {
        el.classList.add(cl);
      });
    } else el.className += ' ' + className;
  });
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
  const classes = className.match(/\S+/g) || [];
  z$.each(this._selection, function(k, el) {
    if (el.classList) {
      z$.each(classes, function(k, cl) {
        el.classList.remove(cl);
      });
    } else el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
  });
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
  this.each(function(k, el) {
    el.innerHTML = htmlText;
  });
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
  this.each(function(k, el) {
    el.checked = check;
  });
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
  this.each(function(k, el) {
    el.value = value;
  });
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
    el.__zuix_oldIndex = Array.prototype.indexOf.call(parent.children, el);
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
    z$(el.__zuix_oldParent).insert(el.__zuix_oldIndex, el);
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
  z$.each(this._selection, function(k, el) {
    el.style.display = mode;
  });
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
  z$.each(this._selection, function(k, el) {
    el.style.visibility = mode;
  });
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
ZxQueryStatic.ajax =
    /**
     * Makes an HTTP request.
     * @method http
     * @memberOf ZxQueryStatic
     * @alias zuix.$.http
     * @param {ZxQueryHttpOptions} options
     * @return {ZxQueryStatic}
     */
    ZxQueryStatic.http = function(options) {
      let url;
      if (!util.isNoU(options) && !util.isNoU(options.url)) {
        url = options.url;
      } else {
        url = options;
      }
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        if (xhr.status === 200) {
          if (util.isFunction(options.success)) options.success(xhr.responseText);
        } else {
          if (util.isFunction(options.error)) options.error(xhr, xhr.statusText, xhr.status);
        }
        if (util.isFunction(options.then)) options.then(xhr);
      };
      xhr.onerror = function(xhr, textStatus, errorThrown) {
        if (util.isFunction(options.error)) options.error(xhr, textStatus, errorThrown);
      };
      if (typeof options.beforeSend == 'function') {
        options.beforeSend(xhr);
      }
      try {
        xhr.open('GET', url);
        xhr.send();
      } catch (e) {
        if (util.isFunction(options.error)) options.error(xhr, xhr.statusText, xhr.status, e);
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
  const classes = className.match(/\S+/g) || [];
  let success = false;
  z$.each(classes, function(k, cl) {
    if (el.classList) {
      success = el.classList.contains(cl);
    } else {
      success = (new RegExp('(^| )' + cl + '( |$)', 'gi').test(el.className));
    }
    if (success) return false;
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
  const classes = className.match(/\S+/g) || [];
  let success = false;
  z$.each(classes, function(k, cl) {
    // Perform global style check
    const docStyles = document.styleSheets;
    if (docStyles != null) {
      for (let sx = 0; sx < docStyles.length; sx++) {
        // the try statement is needed because on Firefox accessing CSS rules
        // loaded from a remote source will raise a security exception
        try {
          const classes = docStyles[sx].rules || docStyles[sx].cssRules;
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
        let isMediaQuery = false;
        z$.each(classes, function(k, v) {
          // TODO: deprecate the 'single dot' notation
          if (v.trim() === '.' || v.trim() === ':host') {
            // a single `.` means 'self' (the container itself)
            // so we just add the wrapperRule
            wrappedCss += '\n[z-component]' + wrapperRule + ' ';
          } else if (v.trim()[0] === '@') {
            // leave it as is if it's an animation or media rule
            wrappedCss += v + ' ';
            if (v.trim().toLowerCase().startsWith('@media')) {
              isMediaQuery = true;
            }
          } else if (encapsulate) {
            // wrap the class names (v)
            v.split(/\s+/).forEach(function(attr) {
              attr = attr.trim();
              if (attr.lastIndexOf('.') > 0) {
                attr.replace(/(?=[.])/gi, ',').split(',').forEach(function(attr2) {
                  if (attr2 !== '') {
                    wrappedCss += '\n' + attr2 + wrapperRule;
                  }
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
        if (isMediaQuery) {
          const wrappedMediaQuery = z$.wrapCss(wrapperRule, ruleMatch[1].substring(ruleMatch[2].length).replace(/^{([^\0]*?)}$/, '$1'), encapsulate);
          wrappedCss += '{\n  '+wrappedMediaQuery+'\n}';
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
 * @return {Element|HTMLElement} The new style element created out of the given css text.
 */
ZxQueryStatic.appendCss = function(css, target, cssId) {
  const head = document.head || document.getElementsByTagName('head')[0];
  let style = null;
  // remove old style if already defined
  if (!util.isNoU(target) && head.contains(target)) {
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
    style.type = 'text/css';
    style.id = cssId;
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(document.createTextNode(css));
    }
  } else if (css instanceof Element) style = css;
  // Append new CSS
  if (!util.isNoU(style)) {
    head.appendChild(style);
  }
  return style;
};
/**
 * Replaces CSS variables with provided values.
 *
 * @method replaceCssVars
 * @memberOf ZxQueryStatic
 * @alias zuix.$.replaceCssVars
 * @param {string} css Stylesheet text
 * @param {object} model Object containing variables fields and values.
 * @return {string} The new stylesheet text with variables replaced with values
 */
ZxQueryStatic.replaceCssVars = function(css, model) {
  const vars = new RegExp(/\B\$var\[(.*[^\[\]])]/g);
  let outCss = '';
  let matched = 0;
  let currentIndex = 0;
  let result;
  while (result = vars.exec(css)) {
    let value = result[0];
    if (result.length > 1) {
      const name = result[1];
      // resolve dotted field path
      let cur = model;
      if (name.indexOf('.') > 0) {
        const path = name.split('.');
        for (let p = 0; p < path.length - 1; p++) {
          cur = cur[path[p]];
          if (typeof cur === 'undefined') {
            break;
          }
        }
        if (typeof cur !== 'undefined') {
          value = cur[path[path.length - 1]];
          matched++;
        }
      } else if (typeof cur[name] !== 'undefined') {
        value = cur[name];
        matched++;
      }
    }
    outCss += css.substring(currentIndex, result.index)+value;
    currentIndex = result.index+result[0].length;
  }
  if (matched > 0) {
    outCss += css.substring(currentIndex);
    css = outCss;
  }
  return css;
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
    if (typeof callback === 'function') {
      const r = callback(result[0]);
      if (!util.isNoU(r)) {
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
 * Gets the closest parent mathing the given query selector
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
    if (elem.matches(selector)) return elem;
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
 * @param {number} [tolerance] Distance from viewport's boundaries for the element to be considered 'visible' (this is mainly used for lazy-loading).
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
  let scrollable = el.offsetParent;
  if (scrollable == null && (getComputedStyle(el).position === 'fixed' || getComputedStyle(el).position === 'absolute')) {
    scrollable = document.body;
  }
  if (scrollable != null) {
    if (scrollable !== document.body) {
      // find the scrollable container
      let s = scrollable.offsetParent;
      while (s != null && s.offsetParent !== null && s.offsetHeight === s.scrollHeight) {
        s = s.offsetParent;
      }
      if (s != null) scrollable = s;
    }
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
    let visible = !(r2.left-1 > r1.right - tolerance ||
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
 * @param cssId
 * @param scope
 * @param {string} className CSS class name to assign to this transition.
 * @param {Array<Object>|JSON} properties List of CSS properties/values to set.
 * @param {Array<Object>|JSON} options List of transition options.
 */
ZxQueryStatic.addTransition = function(cssId, scope, className, properties, options) {
  let cssText = '';
  let styleElement = document.getElementById(cssId);
  if (styleElement != null) {
    cssText = styleElement.innerHTML;
  } else {
    styleElement = document.createElement('style');
  }
  let props = ''; let transProps = '';
  zuix.$.each(properties, function(k, v) {
    k = util.camelCaseToHyphens(k);
    props += '  ' + k + ': ' + v + ';\n';
    transProps += k + ', ';
  });
  let opts = '\n';
  zuix.$.each(options, function(k, v) {
    k = util.camelCaseToHyphens(k);
    opts += '  transition-' + k + ': ' + v + ';\n';
  });
  transProps = transProps.substring(0, transProps.length - 2) + ';';
  cssText += (scope + '.' + className +
    ', ' + scope + ' .' + className +
    '{\n' + props + '  transition-property: ' + transProps + opts + '}\n');
  this.appendCss(cssText, styleElement, cssId);
  return cssText;
};
/**
 * Plays transition effects or animations on a given element inside the component.
 *
 * @param {Element|ZxQuery} element The target element.
 * @param {Array<string>} classNames List of transition/animation classes to apply.
 * @param {PlayTransitionCallback} [callback] Callback function to call when all transitions/animations ended.
 */
ZxQueryStatic.playTransition = function(element, classNames, callback) {
  const _t = this;
  const $el = z$(element).show();
  if (typeof classNames === 'string') {
    classNames = classNames.split(' ');
  }
  $el.addClass(classNames.join(' ')).show();
  const transitionOutClass = classNames.shift();
  const style = getComputedStyle($el.get());
  const delay = (parseFloat(style.transitionDelay) * 1000) || 10;
  setTimeout(function() {
    if (transitionOutClass) {
      $el.removeClass(transitionOutClass);
    }
    const duration = 10 + parseFloat(style.transitionDuration) * 1000;
    setTimeout(function() {
      if (classNames.length > 1) {
        callback.call($el, $el, classNames.slice(1));
        _t.playTransition(element, classNames, callback);
      } else if (callback) {
        callback.call($el, $el);
      }
    }, duration);
  }, delay);
};

ZxQueryStatic.ZxQuery = ZxQuery;

// Element.matches() polyfill
if (!Element.prototype.matches) {
  Element.prototype.matches =
      Element.prototype.matchesSelector ||
      Element.prototype.mozMatchesSelector ||
      Element.prototype.msMatchesSelector ||
      Element.prototype.oMatchesSelector ||
      Element.prototype.webkitMatchesSelector ||
      function(s) {
        const matches = (this.document || this.ownerDocument).querySelectorAll(s);
        let i = matches.length;
        while (--i >= 0 && matches.item(i) !== this) {
        }
        return i > -1;
      };
}
// window.CustomEvent polyfill for IE>=9
(function() {
  if (typeof window.CustomEvent === 'function') return false;
  function CustomEvent(event, params) {
    params = params || {bubbles: false, cancelable: false, detail: undefined};
    const evt = document.createEvent( 'CustomEvent' );
    evt.initCustomEvent( event, params.bubbles, params.cancelable, params.detail );
    return evt;
  }
  CustomEvent.prototype = window.Event.prototype;
  window.CustomEvent = CustomEvent;
})();
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
// String.startsWith polyfill
if (!String.prototype.startsWith) {
  String.prototype.startsWith = function(search, pos) {
    const startIndex = !pos || pos < 0 ? 0 : +pos;
    return this.substring(startIndex, search.length + startIndex) === search;
  };
}

module.exports = ZxQueryStatic;
