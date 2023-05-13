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

const z$ =
    require('../helpers/ZxQuery');
const util =
    require('../helpers/Util');

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
  Object.defineProperty(_t, 'context', {
    enumerable: true, writable: true,
    value: context
  });
  Object.defineProperty(_t, '_view', {
    enumerable: false, writable: true,
    value: null
  });

  /**
   * @protected
   * @type {!Array.<Element>}
   **/
  Object.defineProperty(_t, '_childNodes', {
    enumerable: false, writable: true,
    value: []
  });
  /**
   * @type {function}
   * @ignore
   */
  Object.defineProperty(_t, 'saveView', {enumerable: false, writable: true, value: () => {
    _t.restoreView();
    _t.view()
        .children()
        .each((i, el) => _t._childNodes.push(el));
  }});
  Object.defineProperty(_t, 'restoreView', {enumerable: false, writable: true, value: () => {
    if (_t._childNodes.length > 0) {
      let v = _t.view();
      if ((v.get().parentNode instanceof ShadowRoot)) {
        v = _t.options().__shadowRoot;
      }
      if (v) {
        v.html('');
        z$.each(_t._childNodes, (i, el) =>
          v.append(el));
      }
      _t._childNodes.length = 0;
    }
  }});

  Object.defineProperty(_t, 'on', {enumerable: false, writable: true});
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
  Object.defineProperty(_t, 'mapEvent', {enumerable: false, writable: true});
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
  Object.defineProperty(_t, 'eventRouter', {enumerable: false, writable: true});
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

  try {
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
  } catch (e) {
    console.log(e);
  }

  // add members to this controller instance
  Object.assign(context.controller(), options.controllerMembers);

  return _t;
}

/**
 * Loads a CSS, script or a singleton component. Resources loaded
 * with this method are available in the global scope and can also be
 * included in the application bundle.
 * If the component is a custom element, styles will be loaded as a component-local
 * stylesheets and placed inside its ShadowDOM.
 *
 * @example
```js
 this.using('script', 'https://some.cdn.js/moment.min.js', function(){
  // can start using moment.js
});
```
 * @param {string} resourceType Either *'style'*, *'script'* or *'component'*
 * @param {string} resourcePath Relative or absolute resource url path
 * @param {ResourceUsingCallback} [callback] Callback function to call once resource is loaded
 * @return {ContextController} The `{ContextController}` object itself.
 */
ContextController.prototype.using = function(resourceType, resourcePath, callback) {
  zuix.using(resourceType, resourcePath, callback, this.context);
  return this;
};
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
      util.dom.getShadowRoot(this.context.container() || this.context.view())
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
    const sv = this.options().__shadowRoot;
    if (sv) sv.trigger(eventPath, eventData);
    this.view().trigger(eventPath, eventData);
  }
  return this;
};
/**
 * Declare fields that are available as public members of the
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
      if (h === undefined) {
        delete this.context[m];
      } else {
        this.context[m] = h;
      }
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
 * Declare fields that are available in the view's scripting scope.
 *
 * @param {string|JSON} name Name of the declared method/property, or list of name/value pairs
 * @param {function} [handler] Function or property descriptor.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.declare = function(name, handler) {
  const declare = (m, h) => {
    if (h && (h.get || h.set)) {
      Object.defineProperty(this.context['_'], m, h);
    } else {
      if (h === undefined) {
        delete this.context['_'][m];
      } else {
        this.context['_'][m] = h;
      }
    }
  };
  if (typeof name === 'object') {
    z$.each(name, (k, v) => declare(k, v));
  } else {
    declare(name, handler);
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
