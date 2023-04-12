/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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
    require('../helpers/Logger')('ComponentContext.js');
const _optionAttributes =
    require('./OptionAttributes');
const z$ =
    require('../helpers/ZxQuery');
const util =
    require('../helpers/Util');
const ViewObserver =
    require('./ViewObserver');

// Custom objects definition used to generate JsDoc

/**
 * This function is called after the component is loaded
 * and it is used to initialize its controller.
 *
 * @callback ContextControllerHandler
 * @param {ContextController} cp The component controller object
 * @this {ContextController}
 */

/**
 * Callback function triggered when an event registered
 * with the `on` method occurs.
 *
 * @callback EventCallback
 * @param {string} event Event name
 * @param {Object} data Event data
 * @param {ZxQuery} $el ZxQuery wrapped element that sourced the event (same as `this`)
 * @this {ZxQuery}
 */

/**
 * Binding adapter callback.
 *
 * @callback BindingAdapterCallback
 * @param {ZxQuery} $element The view's element bound to the data model's *fieldName*
 * @param {string} fieldName The element's bound field name
 * @param {ZxQuery} $view The view
 * @param {BindingAdapterRefreshCallback} [refreshCallback] Refresh loop callback
 */

/**
 * Binding adapter refresh callback
 *
 * @callback BindingAdapterRefreshCallback
 * @param {number} [refreshMs] Milliseconds to wait before refresh (**default**: *500ms*)
 */

// private 'static' fields and methods

/** @type {Zuix} **/
let zuix = null;

const _componentIndex = [];
const _queryAdapterRefreshTimeout = [];

/**
 * @private
 * @param {ComponentContext} context
 * @returns {number}
 */
const getComponentIndex = (context) =>
  _componentIndex[context.componentId];

/**
 * Bind provided data by automatically mapping it to the given element.
 *
 * @param {Element} el The element to bind data to
 * @param {Object} boundData Data object to map data from
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
const dataBind = (el, boundData) => {
  boundData = boundData.observableTarget || boundData;
  const value = (!util.isNoU(boundData.value) ? boundData.value :
      (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
  // try to guess target property
  switch (el.tagName.toLowerCase()) {
    // TODO: complete binding cases
    case 'img':
      el.src = (!util.isNoU(boundData.src) ? boundData.src :
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      break;
    case 'a':
      el.href = (!util.isNoU(boundData.href) ? boundData.getAttribute('href'):
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      if (!util.isNoU(boundData.href) && !util.isNoU(boundData.innerHTML) && boundData.innerHTML.trim() !== '') {
        // won't replace innerHTML if it contains inner bound fields
        const t = z$(boundData);
        if (t.find(util.dom.queryAttribute(_optionAttributes.zField)).length() === 0) {
          z$(el).html('').append(document.createTextNode(boundData.innerHTML));
        }
      }
      break;
    case 'input':
      switch (el.type) {
        case 'checkbox':
        case 'radio':
          if (el.value == value) {
            el.checked = true;
          }
          break;
        default:
          el.value = value;
      }
      break;
    case 'select':
      z$.each(el.options, (i, opt) => {
        if (opt.value == value) {
          el.selectedIndex = i;
          return false;
        }
      });
      break;
    default:
      const v = (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : document.createTextNode(boundData));
      z$(el).html('').append(v);
  }
};
/**
 * Query binding adapter for resolving `boundField`->$el mapping
 * @param {ComponentContext} _t
 * @param {ZxQuery} $view
 * @param {ZxQuery} $el
 * @param {BindingAdapterCallback} fn The binding adapter callback
 * @param {string} field Bound field name
 */
const queryAdapter = (_t, $view, $el, fn, field) => {
  if (fn && !_t._disposed) {
    (fn).call($view, $el, field, $view, /** @type {BindingAdapterRefreshCallback} */ function(retryMs) {
      // data adapter is not ready, retry after 1s
      if (!_t._disposed) {
        const timeoutId = $el.get().dataset.__zuix_refreshTimeout;
        if (timeoutId && _queryAdapterRefreshTimeout[timeoutId]) {
          clearTimeout(_queryAdapterRefreshTimeout[timeoutId]);
        }
        $el.get().dataset.__zuix_refreshTimeout =
            setTimeout(function() {
              queryAdapter(_t, $view, $el, fn, field);
            }, retryMs ? retryMs : 500);
      }
    });
  }
};

/**
 * The component context object represents the component instance itself, and it holds
 * all of its data such as the view template, the style, the controller, the data model.
 *
 * @class
 * @property {string} componentId The component identifier "`[<path>/]<name>`".
 * @property {string} path Gets the base path of this component.
 * @property {string} name Gets the name of this component (last part of the path).
 * @property {ZxQuery} $ Access the view of this component. Use this to register event handlers for elements in this view to take advantage of automatic event unsubscription and view fields caching.
 * @property {Object.<string, ActiveRefreshHandler>} handlers List component-local `@` handlers.
 *
 * @constructor
 * @param {Zuix} zuixInstance
 * @param {ContextOptions} options Options to create this component context
 * @param {function} [eventCallback] Event routing callback
 * @return {ComponentContext} The component context instance.
 */
function ComponentContext(zuixInstance, options, eventCallback) {
  zuix = zuixInstance;
  this._options = null;
  this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
  this.componentId = null;
  this.handlers = {refresh: function($view, $el, contextData, refreshCallback) {}};
  this.trigger = (context, eventPath, eventValue) => {
    if (eventCallback) {
      eventCallback(context, eventPath, eventValue);
    }
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

  /** @package */
  this._eventMap = [];
  /** @package */
  this._behaviorMap = [];

  /**
   * @package
   * @type {!Array.<ZxQuery>}
   **/
  this._fieldCache = [];

  /**
     * @protected
     * @type {ContextController}
     */
  this._c = null;

  /**
     * @protected
     * @type {ObservableListener}
     */
  this._modelListener = Object.assign({
    /** @type {ComponentContext} */
    context: null,
    get: function(target, key, value, path) {
      // TODO: maybe implement a {ContextController} callback for this too
    },
    set: function(target, key, value, path, old) {
      const view = this.context.$;
      if (target instanceof Element) {
        //  use the first part of the "path" as field name (eg. 'text.innerHTML' --> 'text')
        //  for binding data to view element
        path = path.split('.')[0];
        value = target;
      }
      if (typeof value === 'function') {
        let field = view.find(util.dom.queryAttribute(_optionAttributes.zBind, path));
        if (field.get() == null) {
          field = view.find(util.dom.queryAttribute(_optionAttributes.zField, path));
        }
        queryAdapter(this.context, view, field, value, key)
        return;
      }
      // update bound field if found in the view
      const bindFields = (fld) => {
        if (fld.get() != null) {
          fld.each((i, f) => dataBind(f, value));
        }
      };
      if (view.get()) {
        bindFields(view.find(util.dom.queryAttribute(_optionAttributes.zBind, path)));
        bindFields(view.find(util.dom.queryAttribute(_optionAttributes.zField, path)));
        // call controller's 'update' method
        if (this.context._c && this.context._c.update) {
          this.context._c.update(target, key, value, path, old);
        }
      }
    }
  }, {context: this});

  /**
     * @type {ViewObserver}
     * @private
     */
  this._viewObserver = new ViewObserver(this);
  /**
   * @type {boolean}
   * @private
   */
  this._disposed = false;

  this.options(options);

  return this;
}

/**
 * Disposes the component context and all of its allocated resources.
 */
ComponentContext.prototype.dispose = function() {
  if (this._disposed) {
    return;
  }
  this._disposed = true;
  // TODO: ... check out for more resources that could be freed
  this._viewObserver.stop();
  // remove styles
  this.style(null);
  // un-register model observable
  this.model(null);
  // reset view/event handlers
  if (this._c) {
    if (this._c.view()) {
      this._c.trigger('component:dispose', this._c.view(), true);
      // TODO: restore all attributes state to the original state (before component creation)
      this._c.view()
          .attr(_optionAttributes.zComponent, null)
          .attr(_optionAttributes.zContext, null)
          .attr(_optionAttributes.zLoad, null)
          .attr(_optionAttributes.zLoaded, null)
          .attr(_optionAttributes.zReady, null)
          .attr(_optionAttributes.resourceType.view, null)
          .attr(_optionAttributes.resourceType.controller, null)
          .attr(_optionAttributes.resourceType.file, null) // not implemented yet
          .attr(this.getCssId(), null);
      // un-register event handlers associated to the view
      this._c.view().reset();
      // un-register event handlers for all cached fields accessed through cp.field(...) method
      if (this._c._fieldCache) {
        z$.each(this._c._fieldCache, /** @param {ZxQuery} v */ function(k, v) {
          v.reset();
        });
      }
    }
    if (this._c.dispose) {
      this._c.dispose.call(this, this);
    }
  }
  // detach component view from its container (parent element)
  if (this._c && this._c._childNodes.length > 0) {
    this._c.view().html('');
    this._c.restoreView();
    //if (this._c.view()) {
    //  // detach from parent
    //  this._c.view().detach();
    //}
  }
  // detach the container from the DOM as well
  //const cel = this._container;
  //if (cel != null && cel.parentNode != null) {
  //  cel.parentNode.removeChild(cel);
  //}
  // TODO: provide a better way to do this
  //       maybe a callback or something
  // remove contexts from zuix contexts list
  const contexts = zuix.dumpContexts();
  const idx = contexts.indexOf(this);
  contexts.splice(idx, 1);
};

/**
 * Gets/Sets the container element of the component.
 * Returns the current container element if no
 * argument is passed, the `ComponentContext` itself
 * otherwise.
 *
 * @param {Element} [container] The container element.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.container = function(container) {
  // TODO: should automatically re-attach view to the new parent?
  if (container == null) return this._container;
  else if (container instanceof z$.ZxQuery) {
    container = container.get();
  }
  this._container = container;
  return this;
};

/**
 * Gets/Sets the view element of the component.
 * If an *HTML* string is passed, then the view element
 * will be a new `div` wrapping the given markup.
 * Returns the current view element if no
 * argument is passed, the *ComponentContext* itself otherwise.
 *
 * @param {Element|string|undefined} [view] The *HTML* string or element of the view.
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.view = function(view) {
  if (typeof view === 'undefined') {
    return this._view;
  } else if (view === null) {
    // TODO: add more consistency check on methods parameters in the whole library
    throw new Error('View cannot be set to null.');
  } else if (view instanceof z$.ZxQuery) {
    view = view.get();
  }
  if (view === this._view) return this;
  this._viewObserver.stop();

  // clean custom attributes added to the old view
  const cssId = this.getCssId();
  if (this._view != null) {
    // view style encapsulation
    const q = '*' +
            util.dom.cssNot(_optionAttributes.zLoad).getAll();
    // mark all elements with a css identifier attribute
    z$(this._view).attr(cssId, null).find(q).each(function(i, v) {
      this.attr(cssId, null);
    });
  }

  const initializeTemplateFields = (v) => {
    v.find('*').each((i, el, $el) => {
      //if (!zuix.isDirectComponentElement(v, $el)) return;
      // add `z-field` from '#<field_name>' attributes
      for (let j = 0; j < el.attributes.length; j++) {
        const a = el.attributes.item(j);
        const v = a.value;
        if (a.name.length > 1 && a.name.startsWith('#')) {
          const attributeName = util.hyphensToCamelCase(a.name.substring(1));
          if ($el.attr(_optionAttributes.zField) == null) {
            $el.attr(_optionAttributes.zField, attributeName);
          }
          if ($el.attr(_optionAttributes.zBind) == null && v != null && v.length > 0) {
            $el.attr(_optionAttributes.zBind, v);
          }
        }
      }
    });
  };

  _log.t(this.componentId, 'view:attach', 'timer:view:start');
  if (typeof view === 'string') {
    // load view from HTML source

    // trigger `html:parse` hook before assigning content to the view
    const hookData = {content: view};
    this.trigger(this, 'html:parse', hookData);
    view = hookData.content;

    const viewDiv = z$.wrapElement('div', view);
    if (viewDiv.firstElementChild != null) {
      // remove z-view attribute from template if present on root node
      if (util.dom.getAttribute(viewDiv.firstElementChild, _optionAttributes.zView) != null) {
        if (viewDiv.children.length === 1) {
          view = viewDiv.firstElementChild.innerHTML;
        }
      } else view = viewDiv.innerHTML;
    }
    if (this._container != null) {
      // append view content to the container
      this._view = this._container;
      this._view.innerHTML += view;
    } else {
      if (this._view != null) {
        this._view.innerHTML = view;
      } else this._view = viewDiv;
    }

    const v = z$(this._view);
    // Run embedded scripts
    v.find('script:not([type=jscript])').each((i, el, $el) => {
      if ($el.attr(_optionAttributes.zuixLoaded) !== 'true') {
        $el.attr(_optionAttributes.zuixLoaded, 'true');
        /* if (el.src != null && el.src.length > 0) {
          var clonedScript = document.createElement('script');
          setAttribute(clonedScript, _optionAttributes.zuixLoaded, 'true');
          clonedScript.onload = function () {
              // TODO: ...
          };
          if (this.type && this.type.length > 0)
              clonedScript.type = this.type;
          if (this.text && this.text.length > 0)
              clonedScript.text = this.text;
          if (this.src && this.src.length > 0)
              clonedScript.src = this.src;
          this.get().parentNode.insertBefore(clonedScript, this.get());
        } else */
        Function(el.innerHTML).call(window);
      }
    });

    initializeTemplateFields(v);

    // trigger `view:process` hook when the view is ready to be processed
    this.trigger(this, 'view:process', v);
  } else {
    // load inline view
    if (this._container != null && this.componentId !== 'default') {
      this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
      // remove z-view attribute if present on root node
      util.dom.setAttribute(this._view, _optionAttributes.zView, null);
      this._container.appendChild(this._view);
      this._view = this._container;
    } else {
      this._view = view;
    }
  }

  const v = z$(this._view);

  initializeTemplateFields(v);

  // Disable loading of nested components until the component is ready
  v.find(util.dom.queryAttribute(_optionAttributes.zLoad, null, util.dom.cssNot(_optionAttributes.zLoaded)))
      .each((i, el, $el) => $el.attr(_optionAttributes.zLoaded, 'false'));

  // View style encapsulation
  this.checkEncapsulation();

  this.modelToView();

  _log.t(this.componentId, 'view:attach', 'timer:view:stop');
  return this;
};

/**
 * Gets, within the component's view, elements with `#` (same as `z-field`)
 * attribute matching the given `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
```html
<div z-load="default" z-context="field-test">
  <h1 #title>Loading context...</h1>
</div>

<script>
zuix.context('field-test', (ctx) => {
  ctx.field('title')
     .html('Context ready.');
});
</script>
```
<h5>Result</h5>
<div z-load="default" z-context="field-test">
  <h6 #title>Loading context...</h6>
</div>
<script>
zuix.context('field-test', (ctx) => {
  ctx.field('title')
     .html('Context ready.');
});
</script>
 *
 * @param {!string} fieldName Value to match in the *z-field* attribute
 * @return {ZxQuery} A `{ZxQuery}` object wrapping the matching element(s).
 */
ComponentContext.prototype.field = function(fieldName) {
  const $el = zuix.field(fieldName, this._view, this);
  $el.on = (eventPath, eventHandler, eventData, isHook) => {
    // route to another event (-> linked to another event)
    if (typeof eventHandler === 'string') {
      const eh = eventHandler;
      eventHandler = () => {
        if (this._c) {
          this._c.trigger(eh, eventData, isHook);
        }
      };
    }
    return z$.ZxQuery.prototype.on.call($el, eventPath, eventHandler);
  };
  return $el;
};

/**
 * View style encapsulation
 * @private
 */
ComponentContext.prototype.checkEncapsulation = function() {
  const v = z$(this._view);
  const cssId = this.getCssId();
  if (v.length() && this._options.css !== false) {
    v.attr(cssId, ''); // this will also tell when multiple controllers are handling the same view
    // if both the container and the style are null
    // then this is just a controller attached to a pre-existent view
    if (this._container != null || this._style != null) {
      // view style encapsulation
      const q = '*' +
          util.dom.cssNot(_optionAttributes.zLoad).getAll();
      // mark all elements with a css identifier attribute
      v.find(q).each((i, el, $el) => $el.attr(cssId, ''));
      // start view observer for dynamically adding the css identifier
      // attribute to elements added after view creation
      this._viewObserver.start();
      // since this is a component, remove the 'controller only' flag
      v.attr(_optionAttributes.resourceType.controller, null);
    } else {
      // this is a controller only instance, add the 'controller only' flag
      // so that this instance view will inherit styles from the parent component
      v.attr(_optionAttributes.resourceType.controller, '');
    }
  }
};

/**
 * Gets/Sets the style of the component's view.
 * The `css` argument can be a string containing all
 * styles definitions or a reference to a style
 * element.
 * If no argument is given, then the current style
 * element is returned.
 *
 * @example
```js
ctx.style("p { font-size: 120%; } .hidden { display: 'none'; }");
```
 *
 * @param {string|Element|undefined} [css] The CSS string or style element
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.style = function(css) {
  if (typeof css === 'undefined') return this._style;
  const cssId = this.getCssId();
  _log.t(this.componentId, 'view:style', 'timer:view:start', cssId);
  const shadowRoot = util.dom.getShadowRoot(this._view);
  if (css == null || css instanceof Element) {
    this._css = (css instanceof Element) ? css.innerText : css;
    this._style = z$.appendCss(css, this._style, this.componentId + '@' + cssId, shadowRoot);
  } else if (typeof css === 'string') {
    // store original unparsed css (might be useful for debugging)
    this._css = css;

    // trigger `css:parse` hook before assigning content to the view
    const hookData = {content: css};
    this.trigger(this, 'css:parse', hookData);
    css = hookData.content;

    // reset css
    let resetCss = '';
    if (this.options().resetCss === true) {
      resetCss = ':host { all: initial; }';
    }

    // nest the CSS inside [z-component='<componentId>']
    // so that the style is only applied to this component type
    const cssIdAttr = '[' + cssId + ']';
    if (!shadowRoot) {
      css = z$.wrapCss(
          cssIdAttr,
          resetCss + '\n' + css,
          this.options().encapsulation === true
      );
    }

    // output css
    this._style = z$.appendCss(css, this._style, this.componentId + '@' + cssId, shadowRoot);
  }
  if (!shadowRoot) {
    this.checkEncapsulation();
  }
  // TODO: should throw error if ```css``` is not a valid type
  _log.t(this.componentId, 'view:style', 'timer:view:stop', cssId);
  return this;
};
/**
 * Gets/Sets the data model of the component. When getting `model()`,
 * the returned object is an *observable* wrapped instance of the
 * originally provided `model`, that will automatically trigger
 * the update of any bound field when a property in the model's
 * changes.
 *
 * @example
```html
<div z-load="default" z-context="model-test">
  <h1 z-field="title"></h1>
  <label>Update title</label>
  <input type="text" z-field="title-input" />
</div>

<script>
zuix.context('model-test', (ctx) => {
  const model = ctx.model({
    title: 'Test title'
  });
  ctx.field('title-input')
     .value(model.title)
     .on('input', (e, input) =>
        { model.title = input.value(); });
});
</script>
```

In this example, when the text in the input box is changed, the
new value is assigned to *model.title* property, and this will
automatically trigger the update of the *h1* element's content
in the view, because it is bound to the *title*'s field (`z-field="title"`).
For further info, see [Data binding](../../../view/#data_binding) in the View's chapter.

<h5>Result</h5>
<div z-load="default" z-context="model-test">
  <h6 z-field="title" style="min-height:24px"></h6>
  <label for="title_input">Update title</label>
  <input type="text" id="title_input" z-field="title-input" maxlength="30" />
</div>
<script>
zuix.context('model-test', (ctx) => {
  const model = ctx.model({
    title: 'Test title'
  });
  ctx.field('title-input')
     .value(model.title)
     .on('input', (e, input) => {
        model.title = input.value().replace(/[\u00A0-\u9999<>\&]/g, function(i) {
           return '&#'+i.charCodeAt(0)+';';
        });
     });
});
</script>
 *
 * @param {object|undefined} [model] The model object
 * @return {object}
 */
ComponentContext.prototype.model = function(model) {
  if (typeof model === 'undefined' || this._model === model) {
    return this._model;
  }
  // unsubscribe previous model observable
  if (this._model !== null && typeof this._model !== 'function') {
    zuix.observable(this._model)
        .unsubscribe(this._modelListener);
  }
  this._model = model;
  if (model != null) {
    // subscribe to new model observable
    if (typeof model !== 'function') {
      this._model = zuix.observable(model)
          .subscribe(this._modelListener)
          .proxy;
    }
    this.modelToView();
    // call controller `update` method when whole model is updated
    if (this._c != null && this._c.update) {
      this._c.update.call(this._c, null, null, null, null, this._c);
    }
  }
  return this._model;
};
/**
 * Gets/Sets the component's controller handler.
 *
 * @param {ContextControllerHandler|undefined} [controller] The controller's handler function
 * @return {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function(controller) {
  const componentId = this.componentId;
  if (typeof controller === 'undefined') return this._controller;
  // TODO: should dispose previous context controller first,
  // TODO: alternatively should not allow _controller reassignment and throw an error
  else this._controller = typeof controller === 'string' ? zuix.controller(controller, {componentId}) : controller; // can be null
  return this;
};

/**
 * Gets/Sets the component's options.
 *
 * @param {ContextOptions|undefined} [options] The JSON options object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.options = function(options) {
  if (options == null) {
    return this._options;
  }
  const o = this._options = this._options || {};
  Object.assign(o, options);
  this.componentId = o.componentId || this.componentId;
  // store index for this component type if not already in
  if (_componentIndex[this.componentId] == null) {
    _componentIndex[this.componentId] = _componentIndex.length;
    _componentIndex.length++;
  }
  this.container(o.container);
  this.view(o.view);
  if (typeof o.css === 'string') {
    this.style(o.css);
  }
  this.controller(o.controller);
  this.model(o.model);
  return this;
};

/**
 * Listens for a component event.
 *
 * @param {string|Array<Object>|JSON} eventPath The event path or object with event name/handler pairs.
 * @param {EventCallback} [eventHandler] The event handler function. Not used if eventPath is an object with event name/handler pairs.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.on = function(eventPath, eventHandler) {
  // TODO: throw error if _c (controller instance) is not yet ready
  this._c.on(eventPath, eventHandler);
  return this;
};
/**
 * Loads the `.css` file and replace the view style of the component.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * ctx.loadCss();
 * // or loads the view css with options
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
ComponentContext.prototype.loadCss = function(options) {
  const context = this;
  if (!options) options = {};
  let cssPath = context.componentId;
  if (options.path) {
    // path override with explicit option
    cssPath = options.path;
  }

  // lookup for inline cached css
  let inlineStyles = zuix.store('zuix.inlineStyles');
  if (inlineStyles == null) {
    inlineStyles = [];
    zuix.store('zuix.inlineStyles', inlineStyles);
  }
  if (inlineStyles[cssPath] != null) {
    context.style(inlineStyles[cssPath]);
    if (options.success) {
      (options.success).call(context, inlineStyles[cssPath], context);
    }
    if (options.then) {
      (options.then).call(context, context);
    }
  } else {
    const inlineStyle = z$().find('style[media="#' + cssPath + '"],style[media="' + cssPath + '"]');
    if (inlineStyle.length()) {
      const styleElement = inlineStyle.get(0);
      const viewCss = styleElement.innerText;
      context.style(viewCss);
      inlineStyle.detach();
      inlineStyles[cssPath] = viewCss;
      if (options.success) {
        (options.success).call(context, viewCss, context);
      }
      if (options.then) {
        (options.then).call(context, context);
      }
    } else {
      if (cssPath == context.componentId) {
        cssPath += '.css';
      }
      fetch(zuix.getResourcePath(cssPath), zuix.store('settings')?.fetchOptions)
          .then((response) => response.text())
          .then((viewCss) => {
            context.style(viewCss);
            if (options.success) {
              (options.success).call(context, viewCss, context);
            }
          }).catch((e) => {
            _log.e(e, context);
            if (options.error) {
              (options.error).call(context, e, context);
            }
          }).finally(() => {
            if (options.then) {
              (options.then).call(context, context);
            }
          });
    }
  }
  return this;
};
/**
 * Loads the `.html` file and replace the view markup code of the component.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * ctx.loadHtml();
 * // or loads the view html with options
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
  const context = this;
  let htmlPath = context.componentId;
  if (!options) options = {};
  if (options.path) {
    // path override with explicit option
    htmlPath = options.path;
  }
  // cache inline "z-view" html
  let inlineViews = zuix.store('zuix.inlineViews');
  if (inlineViews == null) {
    inlineViews = [];
    zuix.store('zuix.inlineViews', inlineViews);
  }
  if (inlineViews[htmlPath] != null) {
    context.view(inlineViews[htmlPath]);
    if (options.success) {
      (options.success).call(context, inlineViews[htmlPath], context);
    }
    if (options.then) {
      (options.then).call(context, context);
    }
  } else {
    // TODO: check if view caching is working in this case too
    const inlineView = z$().find(util.dom.queryAttribute(
        _optionAttributes.zView,
        htmlPath,
        util.dom.cssNot(_optionAttributes.zComponent)
    ));
    if (inlineView.length()) {
      let styles;
      let inlineElement = inlineView.get(0);
      if (inlineElement.tagName.toLowerCase() === 'template') {
        inlineElement = inlineElement.cloneNode(true);
        styles = inlineElement.content.querySelectorAll('style');
      } else {
        styles = inlineElement.querySelectorAll('style[media="#"]');
      }
      if (styles) {
        for (const s of styles) {
          s.setAttribute('media', '#' + context.componentId);
        }
      }
      inlineViews[htmlPath] = inlineElement.innerHTML;
      if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement))) {
        // TODO: test this case better (or finally integrate some unit testing =))
        // TODO: "html:parse" will not fire in this case (and this is the wanted behavior)
        inlineView.attr(_optionAttributes.zView, null);
        context._view = inlineElement;
        // trigger `view:process` hook
        this.trigger(this, 'view:process', z$(context.view()));
      } else {
        context.view(inlineElement.innerHTML);
      }
      if (options.success) {
        (options.success).call(context, inlineElement.innerHTML, context);
      }
      if (options.then) {
        (options.then).call(context, context);
      }
    } else {
      const cext = options.cext ? options.cext : '.html';
      if (htmlPath == context.componentId) {
        htmlPath += cext;
      }
      fetch(zuix.getResourcePath(htmlPath), zuix.store('settings')?.fetchOptions)
          .then((response) => response.text())
          .then((viewHtml) => {
            context.view(viewHtml);
            if (options.success) {
              (options.success).call(context, viewHtml, context);
            }
          }).catch((e) => {
            _log.e(e, context);
            if (options.error) {
              (options.error).call(context, e, context);
            }
          }).finally(() => {
            if (options.then) {
              (options.then).call(context, context);
            }
          });
    }
  }
  return this;
};
/**
 * Creates the data model out of all `z-field` elements
 * declared in the component's view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.viewToModel = function() {
  _log.t(this.componentId, 'view:model', 'timer:vm:start');
  const model = {};
  const $view = z$(this._view);
  // create data model from inline view fields
  $view.find(util.dom.queryAttribute(_optionAttributes.zField))
      .each((i, el, $el) => {
        if (!zuix.isDirectComponentElement($view, $el)) {
          return true;
        }
        const name = $el.attr(_optionAttributes.zField);
        // TODO: the following code is disabled because
        //       causes "proxy revoked" exception when unloading and reloading a component
        // dotted field path to nested objects
        /*
        if (name.indexOf('.')>0) {
          const path = name.split('.');
          let cur = model;
          for (let p = 0; p < path.length - 1; p++) {
            if (typeof cur[path[p]] === 'undefined') {
              cur[path[p]] = {};
            }
            cur = cur[path[p]];
          }
          cur[path[path.length - 1]] = value;
        } else*/ model[name] = el;
      });
  this._model = zuix.observable(model)
      .subscribe(this._modelListener)
      .proxy;
  // TODO: should call this._c.update(....)
  _log.t(this.componentId, 'view:model', 'timer:vm:stop');
  return this;
};
/**
 * Triggers the update of all `z-field` elements in the view
 * that are bound to the model's fields. If the `inherits="true"` attribute
 * is present on a field, data can be inherited from parent component.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.modelToView = function() {
  _log.t(this.componentId, 'model:view', 'timer:mv:start');
  if (this._view != null) {
    // the '#' member contains all `z-field` mapped as a context['#'] property (ZxQuery object)
    this['#'] = {};
    const $view = z$(this._view);
    $view.find(util.dom.queryAttribute(_optionAttributes.zField)).each((i, el, $el) => {
      if (!zuix.isDirectComponentElement($view, $el) && $el.attr('inherits') !== 'true') {
        return true;
      }
      let boundField = $el.attr(_optionAttributes.zBind);
      if (boundField == null) {
        boundField = $el.attr(_optionAttributes.zField);
      }
      if (typeof this._model === 'function') {
        // use a data model binding adapter
        // to resolve all model fields' values
        queryAdapter(this, $view, $el, this._model, boundField);
      } else {
        let boundData = util.propertyFromPath(this._model, boundField);
        const altField = util.hyphensToCamelCase(boundField);
        const altData = util.propertyFromPath(this._model, altField);
        if (boundData == null && altData != null) {
          boundField = altField;
          boundData = util.propertyFromPath(this._model, boundData);
        }
        if (typeof boundData === 'function') {
          // use data model's field binding adapter
          // to resolve boundField's value
          queryAdapter(this, $view, $el, boundData, boundField);
        } else if (boundData != null) {
          // use default binding method
          // to resolve boundField's value
          dataBind(el, boundData);
        }
      }
    });
    // new fields might been have added after data-binding
    $view.find(util.dom.queryAttribute(_optionAttributes.zField)).each((i, el, $el) => {
      if (!zuix.isDirectComponentElement($view, $el) && $el.attr('inherits') !== 'true') {
        return true;
      }
      let boundField = $el.attr(_optionAttributes.zBind);
      if (boundField == null) {
        boundField = $el.attr(_optionAttributes.zField);
      }
      // map `z-field`s as properties of the context's member '#' if the variable name is valid
      try {
        const f = util.hyphensToCamelCase(boundField);
        Function('function testName(){ const ' + f + ' = "test"; }');
        this['#'][f] = this.field(boundField);
      } catch (e) {
        // TODO: should at least log a 'Warning: unscriptable field name'
        //console.log('ERROR', e);
      }
    });
  }
  _log.t(this.componentId, 'model:view', 'timer:mv:stop');
  return this;
};

/**
 * Gets the CSS identifier of this component's style.
 *
 * @return {string} The css-id attribute of this component.
 */
ComponentContext.prototype.getCssId = function() {
  let override = '';
  if (typeof this._options.css === 'string') {
    override = '_' + this.contextId;
  }
  return _optionAttributes.cssIdPrefix + getComponentIndex(this) + override;
};

/**
 * Gets the base path of this component.
 * @property ComponentContext.prototype.path
 * @type {string}
 */
Object.defineProperty(ComponentContext.prototype, 'path', {
  get: function path() {
    const cid = this.componentId;
    const pathIndex = cid.lastIndexOf('/');
    if (pathIndex < 0) {
      return cid;
    }
    return cid.substring(0, pathIndex + 1);
  }
});
/**
 * Gets the name of this component (last part of the path).
 * @property ComponentContext.prototype.name
 * @type {string}
 */
Object.defineProperty(ComponentContext.prototype, 'name', {
  get: function name() {
    const cid = this.componentId;
    const pathIndex = cid.lastIndexOf('/');
    if (pathIndex < 0) {
      return cid;
    }
    return cid.substring(pathIndex + 1);
  }
});

/**
 * Access the view of this component. Use this property to register event handlers for elements in this view to take advantage of automatic event unsubscription and view fields caching.
 * @property ComponentContext.prototype.$
 * @type {ZxQuery}
 */
Object.defineProperty(ComponentContext.prototype, '$', {
  get: function $() {
    return this._c && this._c.view();
  }
});

module.exports = ComponentContext;
