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
  if (eventHandler && typeof eventHandler !== 'function') {
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
          el.style[i] !== v ? el.style[i] = v : null
      ));
  } else if (util.isNoU(val)) {
    return this._selection[0].style[prop];
  } else {
    this.each((k, el) => el.style[prop] !== val ? el.style[prop] = val : null);
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
  this.each((k, el) => el.innerHTML !== htmlText ? el.innerHTML = htmlText : null);
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
  this.each((k, el) => el.checked !== check ? el.checked = check : null);
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
  this.each((k, el) => el.value !== value ? el.value = value : null);
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
 * @param {string|Element|HTMLElement} css Stylesheet text
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
    if (oldStyle && head.contains(oldStyle)) {
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
