/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
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
 * @param {ContextController} cp The component controller object.
 * @this {ContextController}
 */

/**
 * Callback function triggered when an event registered with the `on` method occurs.
 *
 * @callback EventCallback
 * @param {string} event Event name.
 * @param {Object} data Event data.
 * @param {ZxQuery} $el ZxQuery wrapped element that sourced the event (same as `this`).
 * @this {ZxQuery}
 */

// private 'static' fields and methods

/** @type {Zuix} **/
let zuix = null;

const _componentIndex = [];
function getComponentIndex(context) {
  return _componentIndex[context.componentId];
}

/**
 * Bind provided data by automatically mapping it to the given element.
 *
 * @param {Element} el The element to bind data to.
 * @param {Object} boundData Data object to map data from.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
function dataBind(el, boundData) {
  boundData = boundData.observableTarget || boundData;
  // try to guess target property
  switch (el.tagName.toLowerCase()) {
    // TODO: complete binding cases
    case 'img':
      el.src = (!util.isNoU(boundData.src) ? boundData.src :
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      if (boundData.alt) el.alt = boundData.alt;
      break;
    case 'a':
      el.href = (!util.isNoU(boundData.href) ? boundData.getAttribute('href'):
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      if (boundData.title) el.title = boundData.title;
      if (!util.isNoU(boundData.href) && !util.isNoU(boundData.innerHTML) && boundData.innerHTML.trim() !== '') {
        el.innerHTML = boundData.innerHTML;
      }
      break;
    case 'input':
      el.value = (!util.isNoU(boundData.value) ? boundData.value :
                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
      break;
    default:
      el.innerHTML = (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData);
      if (boundData.attributes != null) {
        for (let i = 0; i < boundData.attributes.length; i++) {
          const attr = boundData.attributes[i];
          if (attr.specified && attr.name !== _optionAttributes.dataUiField) {
            if (attr.value[0] === '+' && el.hasAttribute(attr.name)) {
              attr.value = el.getAttribute(attr.name) + ' ' + attr.value.substring(1);
            }
            util.dom.setAttribute(el, attr.name, attr.value);
          }
        }
      }
  }
}

/**
 * The component context object.
 *
 * @param {Zuix} zuixInstance
 * @param {ContextOptions} options The context options.
 * @param {function} [eventCallback] Event routing callback.
 * @return {ComponentContext} The component context instance.
 * @constructor
 */
function ComponentContext(zuixInstance, options, eventCallback) {
  zuix = zuixInstance;
  this._options = null;
  this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
  this.componentId = null;
  this.trigger = function(context, eventPath, eventValue) {
    if (typeof eventCallback === 'function') {
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
      if (target instanceof Element) {
        //  use the first part of the "path" as field name (eg. 'text.innerHTML' --> 'text')
        //  for binding data to view element
        path = path.split('.')[0];
        value = target;
      }
      // update bound field if found in the view
      const view = z$(this.context.view());
      if (view.get()) {
        let fld = view.find(util.dom.queryAttribute(_optionAttributes.dataBindTo, path));
        if (fld.get() == null) {
          fld = view.find(util.dom.queryAttribute(_optionAttributes.dataUiField, path));
        }
        if (fld.get()) {
          dataBind(fld.get(), value);
        }
        // call controller's 'update' method
        if (this.context._c && typeof this.context._c.update === 'function') {
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

  this.options(options);

  return this;
}

ComponentContext.prototype.dispose = function() {
  // TODO: ... check out for more resources that could be freed
  this._viewObserver.stop();
  if (!util.isNoU(this._c)) {
    if (!util.isNoU(this._c.view())) {
      // TODO: restore all attributes state to the original state (before component creation)
      this._c.view().attr(_optionAttributes.dataUiComponent, null);
      // un-register event handlers associated to the view
      this._c.view().reset();
      // un-register event handlers for all cached fields accessed through cp.field(...) method
      if (!util.isNoU(this._c._fieldCache)) {
        z$.each(this._c._fieldCache, /** @param {ZxQuery} v */ function(k, v) {
          v.reset();
        });
      }
    }
    if (util.isFunction(this._c.destroy)) {
      this._c.destroy.call(this, this);
    }
  }
  // un-register model observable
  this.model(null);
  // detach component view from its container (parent element)
  if (!util.isNoU(this._c)) {
    if (!util.isNoU(this._c.view())) {
      // detach from parent
      this._c.view().detach();
    }
  }
  // detach the container from the DOM as well
  const cel = this._container;
  if (cel != null && cel.parentNode != null) {
    cel.parentNode.removeChild(cel);
  }
};

/**
 * Gets/Sets the container element of the component.
 * Returns the current container element if no
 * argument is passed, the {ComponentContext} itself
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
 * argument is passed, the {ComponentContext} itself otherwise.
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
            util.dom.cssNot(_optionAttributes.dataUiLoad).getAll() +
            util.dom.cssNot(_optionAttributes.dataUiInclude).getAll();
    // mark all elements with a css identifier attribute
    z$(this._view).attr(cssId, null).find(q).each(function(i, v) {
      this.attr(cssId, null);
    });
  }

  _log.t(this.componentId, 'view:attach', 'timer:view:start');
  if (typeof view === 'string') {
    // load view from HTML source

    // trigger `html:parse` hook before assigning content to the view
    const hookData = {content: view};
    this.trigger(this, 'html:parse', hookData);
    view = hookData.content;

    const viewDiv = z$.wrapElement('div', view);
    if (viewDiv.firstElementChild != null) {
      // remove data-ui-view attribute from template if present on root node
      if (util.dom.getAttribute(viewDiv.firstElementChild, _optionAttributes.dataUiView) != null) {
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
    v.find('script').each(function(i, el) {
      if (this.attr(_optionAttributes.zuixLoaded) !== 'true') {
        this.attr(_optionAttributes.zuixLoaded, 'true');
        /* if (el.src != null && el.src.length > 0) {
                    var clonedScript = document.createElement('script');
                    setAttribute(clonedScript, _optionAttributes.zuixLoaded, 'true');
                    clonedScript.onload = function () {
                        // TODO: ...
                    };
                    if (!util.isNoU(this.type) && this.type.length > 0)
                        clonedScript.type = this.type;
                    if (!util.isNoU(this.text) && this.text.length > 0)
                        clonedScript.text = this.text;
                    if (!util.isNoU(this.src) && this.src.length > 0)
                        clonedScript.src = this.src;
                    this.get().parentNode.insertBefore(clonedScript, this.get());
                } else */
        (eval).call(window, el.innerHTML);
      }
    });

    // trigger `view:process` hook when the view is ready to be processed
    this.trigger(this, 'view:process', z$(this._view));
  } else {
    // load inline view
    if (this._container != null) {
      this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
      // remove data-ui-view attribute if present on root node
      util.dom.setAttribute(this._view, _optionAttributes.dataUiView, null);
      this._container.appendChild(this._view);
      this._view = this._container;
    } else this._view = view;
  }

  const v = z$(this._view);

  // Disable loading of nested components until the component is ready
  v.find(util.dom.queryAttribute(_optionAttributes.dataUiLoad)).each(function(i, v) {
    this.attr(_optionAttributes.dataUiLoaded, 'false');
  });

  // View style encapsulation
  if (this._options.css !== false) {
    v.attr(cssId, ''); // this will also tell when multiple controllers are handling the same view
    // if both the container and the style are null
    // then this is just a controller attached to a pre-existent view
    if (this._container != null || this._style != null) {
      // view style encapsulation
      const q = '*' +
                util.dom.cssNot(_optionAttributes.dataUiLoad).getAll() +
                util.dom.cssNot(_optionAttributes.dataUiInclude).getAll();
      // mark all elements with a css identifier attribute
      v.find(q).each(function(i, v) {
        this.attr(cssId, '');
      });
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

  this.modelToView();

  _log.t(this.componentId, 'view:attach', 'timer:view:stop');
  return this;
};

/**
 * Gets/Sets the view style of the component.
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
 * @return {ComponentContext|Element}
 */
ComponentContext.prototype.style = function(css) {
  if (typeof css === 'undefined') return this._style;
  _log.t(this.componentId, 'view:style', 'timer:view:start');
  if (css == null || css instanceof Element) {
    this._css = (css instanceof Element) ? css.innerText : css;
    this._style = z$.appendCss(css, this._style, this.componentId);
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

    // nest the CSS inside [data-ui-component='<componentId>']
    // so that the style is only applied to this component type
    const cssIdAttr = '[' + this.getCssId() + ']';
    css = z$.wrapCss(
        cssIdAttr,
        resetCss + '\n' + css,
        this.options().encapsulation === true
    );

    // output css
    this._style = z$.appendCss(css, this._style, this.componentId);
  }
  // TODO: should throw error if ```css``` is not a valid type
  _log.t(this.componentId, 'view:style', 'timer:view:stop');
  return this;
};
/**
 * Gets/Sets the data model of the component.
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
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.model = function(model) {
  if (typeof model === 'undefined') return this._model;
  else if (this._model === model) return this;
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
    if (this._c != null && util.isFunction(this._c.update)) {
      this._c.update.call(this._c, null, null, null, null, this._c);
    }
  }
  return this;
};
/**
 * Gets/Sets the handler function of the controller.
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
 * @param {ContextControllerHandler|undefined} [controller] The handler function of the controller.
 * @return {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function(controller) {
  if (typeof controller === 'undefined') return this._controller;
  // TODO: should dispose previous context controller first,
  // TODO: alternatively should not allow _controller reassignment and throw an error
  else this._controller = controller; // can be null
  return this;
};

/**
 * Gets/Sets the component options.
 *
 * @param {ContextOptions|undefined} options The JSON options object.
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
  if (typeof o.css !== 'undefined') {
    this.style(o.css);
  }
  this.controller(o.controller);
  this.model(o.model);
  return this;
};

/**
 * Listens for a component event.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.on('item:share', function(evt, data) { ... });
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {EventCallback} eventHandler The event handling function.
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
 * @param {boolean} [enableCaching] Enable HTTP
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadCss = function(options, enableCaching) {
  const context = this;
  if (util.isNoU(options)) options = {};
  if (!util.isNoU(options.caching)) {
    enableCaching = options.caching;
  }
  let cssPath = context.componentId + '.css';
  if (!util.isNoU(options.path)) {
    cssPath = options.path;
  }
  if (!enableCaching) {
    cssPath += '?'+new Date().getTime();
  }
  z$.ajax({
    url: zuix.getResourcePath(cssPath),
    success: function(viewCss) {
      context.style(viewCss);
      if (util.isFunction(options.success)) {
        (options.success).call(context, viewCss, context);
      }
    },
    error: function(err) {
      _log.e(err, context);
      if (util.isFunction(options.error)) {
        (options.error).call(context, err, context);
      }
    },
    then: function() {
      if (util.isFunction(options.then)) {
        (options.then).call(context, context);
      }
    }
  });
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
 * @param {boolean} [enableCaching] Enable HTTP caching
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.loadHtml = function(options, enableCaching) {
  const context = this;
  let htmlPath = context.componentId;
  if (util.isNoU(options)) options = {};
  if (!util.isNoU(options.caching)) {
    enableCaching = options.caching;
  }
  if (!util.isNoU(options.path)) {
    htmlPath = options.path;
  }
  // cache inline "data-ui-view" html
  let inlineViews = zuix.store('zuix.inlineViews');
  if (inlineViews == null) {
    inlineViews = [];
    zuix.store('zuix.inlineViews', inlineViews);
  }
  if (inlineViews[htmlPath] != null) {
    context.view(inlineViews[htmlPath]);
    if (util.isFunction(options.success)) {
      (options.success).call(context, inlineViews[htmlPath], context);
    }
    if (util.isFunction(options.then)) {
      (options.then).call(context, context);
    }
  } else {
    // TODO: check if view caching is working in this case too
    const inlineView = z$().find(util.dom.queryAttribute(
        _optionAttributes.dataUiView,
        htmlPath,
        util.dom.cssNot(_optionAttributes.dataUiComponent)
    ));
    if (inlineView.length() > 0) {
      const inlineElement = inlineView.get(0);
      inlineViews[htmlPath] = inlineElement.innerHTML;
      if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement))) {
        // TODO: test this case better (or finally integrate some unit testing =))
        // TODO: "html:parse" will not fire in this case (and this is the wanted behavior)
        inlineView.attr(_optionAttributes.dataUiView, null);
        context._view = inlineElement;
        // trigger `view:process` hook
        this.trigger(this, 'view:process', z$(context.view()));
      } else {
        context.view(inlineElement.innerHTML);
      }
      if (util.isFunction(options.success)) {
        (options.success).call(context, inlineElement.innerHTML, context);
      }
      if (util.isFunction(options.then)) {
        (options.then).call(context, context);
      }
    } else {
      const cext = util.isNoU(options.cext) ? '.html' : options.cext;
      if (htmlPath == context.componentId) {
        htmlPath += cext + (!enableCaching ? '?' + new Date().getTime() : '');
      }
      z$.ajax({
        url: zuix.getResourcePath(htmlPath),
        success: function(viewHtml) {
          context.view(viewHtml);
          if (util.isFunction(options.success)) {
            (options.success).call(context, viewHtml, context);
          }
        },
        error: function(err) {
          _log.e(err, context);
          if (util.isFunction(options.error)) {
            (options.error).call(context, err, context);
          }
        },
        then: function() {
          if (util.isFunction(options.then)) {
            (options.then).call(context, context);
          }
        }
      });
    }
  }
  return this;
};
/**
 * Creates the data model starting from ```data-ui-field```
 * elements declared in the component view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.viewToModel = function() {
  _log.t(this.componentId, 'view:model', 'timer:vm:start');
  const model = {};
  // create data model from inline view fields
  z$(this._view).find(util.dom.queryAttribute(_optionAttributes.dataUiField)).each(function(i, el) {
    // TODO: this is not so clean
    if (this.parent('pre,code').length() > 0) {
      return true;
    }
    const name = this.attr(_optionAttributes.dataUiField);
    const value =
            // TODO: this is a work around for IE where "el.innerHTML" is lost after view replacing
            (!util.isNoU(el.innerHTML) && util.isIE()) ?
                el.cloneNode(true) : el;
    // dotted field path
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
    } else model[name] = value;
  });
  this._model = zuix.observable(model)
      .subscribe(this._modelListener)
      .proxy;
  // TODO: should call this._c.update(....)
  _log.t(this.componentId, 'view:model', 'timer:vm:stop');
  return this;
};
/**
 * Copies values from the data model to the ```data-ui-field```
 * elements declared in the component view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.modelToView = function() {
  _log.t(this.componentId, 'model:view', 'timer:mv:start');
  if (this._view != null && this._model != null) {
    const _t = this;
    z$(this._view).find(util.dom.queryAttribute(_optionAttributes.dataUiField)).each(function(i, el) {
      if (this.parent('pre,code').length() > 0) {
        return true;
      }
      let boundField = this.attr(_optionAttributes.dataBindTo);
      if (boundField == null) {
        boundField = this.attr(_optionAttributes.dataUiField);
      }
      const v = z$(_t._view);
      if (typeof _t._model === 'function') {
        (_t._model).call(v, this, boundField, v);
      } else {
        const boundData = util.propertyFromPath(_t._model, boundField);
        if (typeof boundData === 'function') {
          (boundData).call(v, this, boundField, v);
        } else if (boundData != null) {
          dataBind(el, boundData);
        }
      }
    });
  }
  _log.t(this.componentId, 'model:view', 'timer:mv:stop');
  return this;
};

/**
 * Get the CSS identifier attribute.
 *
 * @return {string} The css-id attribute of this component
 */
ComponentContext.prototype.getCssId = function() {
  return _optionAttributes.cssIdPrefix + getComponentIndex(this);
};

module.exports = ComponentContext;
