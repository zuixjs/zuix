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
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello  -  https://github.com/genemars
 *
 */

'use strict';

const _log =
    require('../helpers/Logger')('Zuix.js');
const util =
    require('../helpers/Util');
const z$ =
    require('../helpers/ZxQuery');
const TaskQueue =
    require('../helpers/TaskQueue');
const ObjectObserver =
    require('../observable/ObjectObserver');
const ComponentContext =
    require('./ComponentContext');
const ContextController =
    require('./ContextController');
const ControllerInstance =
    require('./ControllerInstance');
const ActiveRefresh =
    require('./ActiveRefresh');
const _componentizer =
    require('./Componentizer')();
const _optionAttributes =
    require('./OptionAttributes');

require('./ComponentCache');

// Custom objects definition used to generate JsDoc

/**
 * This object can be supplied when loading a component. It can be either passed as argument for the
 * `zuix.load(...) / zuix.loadComponent(...) ` methods, in the javascript code, or with the `z-options` attribute in the HTML code
 * of the component's host element.
 *
 * @typedef {object} ContextOptions
 * @property {Object|undefined} contextId The context id. HTML attribute equivalent: *z-context*. If not specified it will be randomly generated.
 * @property {Element|undefined} container The container element.
 * @property {JSON|undefined} model The data model.  HTML attribute equivalent: *z-model*.
 * @property {Element|undefined} view The view element. HTML attribute equivalent: *z-view*.
 * @property {ContextControllerHandler|undefined} controller The controller handler.
 * @property {Object.<string, EventCallback>|Object.<string, string>|undefined} on The map of event handlers for standard and component's events. An event can also be simply routed to another component's event by specifying the mapped event name string.
 * @property {Object.<string, EventCallback>|Object.<string, string>|undefined} behavior The map of event handlers for behaviors. An event can also be simply routed to another component's event by specifying the mapped event name string.
 * @property {HTMLStyleElement|string|boolean|undefined} css Custom stylesheet to apply to the component's view.
 * @property {boolean|undefined} encapsulation Whether to use style encapsulation or not (**default:** false).
 * @property {boolean|undefined} resetCss Whether to reset view style to prevent inheriting from parent containers (**default:** false).
 * @property {string|undefined} cext When loading content of the view, appends the specified extension instead of *.html*.
 * @property {boolean|undefined} html Enables or disables HTML template loading (**default:** true).
 * @property {boolean|undefined} lazyLoad Enables or disables lazy-loading (**default:** false).
 * @property {number|undefined} priority Loading priority (**default:** 0).
 * @property {ContextLoadedCallback|undefined} ready The loaded callback, triggered once the component is successfully loaded.
 * @property {ContextReadyCallback|undefined} ready The ready callback, triggered once all component's dependencies have been loaded.
 * @property {ContextErrorCallback|undefined} error The error callback, triggered when an error occurs.
 */

/**
 * Callback function triggered if an error occurs when loading a component.
 *
 * @callback ContextErrorCallback
 * @param {Object} error
 * @param {ComponentContext} ctx The component context object (same as `this`).
 * @this {ComponentContext}
 */

/**
 * Callback function triggered when a component is created, after all of its dependencies have been loaded.
 *
 *
 * @callback ContextLoadedCallback
 * @param {ComponentContext} ctx The component context (same as `this`).
 * @this {ComponentContext}
 */

/**
 * Callback function triggered when a component has been successfully loaded.
 *
 * @callback ContextReadyCallback
 * @param {ComponentContext} ctx The component context (same as `this`).
 * @this {ComponentContext}
 */

/**
 * Callback in response to a `zuix.using` request.
 *
 * @callback ResourceUsingCallback
 * @param {string} resourcePath
 * @param {string|object} hashIdOrContext
 */


/**
 * @private
 * @type {!Array.<ComponentContext>}
 */
const _contextRoot = [];
/** @private */
const _hooksCallbacks = [];
/** @private */
const _globalControllerHandlers = {};
/** @private **/
const _componentTask = [];
/** @private **/
const _pendingResourceTask = {};
/** @private */
const resourceLoadTask = [];
/**
 * @private
 * @param {String} tid Task id
 * @return {TaskQueue}
 */
const taskQueue = function(tid) {
  if (util.isNoU(_componentTask[tid])) {
    _componentTask[tid] = new TaskQueue(function(tq, eventPath, eventValue) {
      trigger(tq, eventPath, eventValue);
    });
  }
  return _componentTask[tid];
};

/**
 * @private
 * @type {!Array.<ComponentCache>}
 */
let _componentCache = [];
/** @private */
let _contextSeqNum = 0;
/** @private */
let _disableComponentize = false;
/** @private */
let _enableHttpCaching = true;
/** @private */
const _objectObserver = new ObjectObserver();

/** @private */
const _implicitLoadDefaultList = [
  util.dom.queryAttribute(_optionAttributes.zContext),
//  util.dom.queryAttribute(_optionAttributes.zComponent),
  util.dom.queryAttribute(_optionAttributes.zOptions),
  util.dom.queryAttribute(_optionAttributes.zModel),
  util.dom.queryAttribute(_optionAttributes.zOn),
  util.dom.queryAttribute(_optionAttributes.zBehavior),
  util.dom.queryAttribute(_optionAttributes.zReady)
];

/**
 *  Allocates a new instance of *zuix.js*, JavaScript library for
 *  component-based development.
 *  A *zuix.js* instance is automatically allocated on page load,
 *  and always available in the global scope as `zuix`.
 *
 * @class Zuix
 * @property {ZxQueryStatic} $ Helper function for manipulating the DOM.
 *
 * @constructor
 * @return {Zuix}
 */
function Zuix() {
  _componentizer.setHost(this);
  /**
   * @type {Array}
   * @private
   */
  this._store = {
    config: {
      'title': 'zUIx.js app',
      'baseUrl': '/',
      'resourcePath': '/app/',
      'libraryPath': {
        '@lib': 'https://zuixjs.github.io/zkit/lib/1.1/',
        '@hgui': 'https://genielabs.github.io/homegenie-web-ui/app/',
        '@cdnjs': 'https://cdnjs.cloudflare.com/ajax/libs/'
      },
      // domain-specific config overrides
      'zuixjs.github.io': {
        'resourcePath': '/zuixjs/app',
        'libraryPath': {
          '@lib': 'https://zuixjs.github.io/zkit/lib/1.1/',
          '@hgui': 'https://genielabs.github.io/homegenie-web-ui/app/',
          '@cdnjs': 'https://cdnjs.cloudflare.com/ajax/libs/'
        }
      }
    },
    /** @type {Object.<string, ActiveRefreshHandler>} */
    handlers: {
      // Default component 'refresh' handler, this should be never overridden
      'sync': function($view, $el, contextData, refreshCallback) {
        const field = $el.attr('@sync') || $el.attr(_optionAttributes.zField);
        $el.on('keyup change keydown', function() {
          const el = $el.get();
          let val = $el.value();
          if ((el.type === 'checkbox' || el.type === 'radio') &&
              !el.checked && contextData[field] == val) {
            val = '';
          }
          if (contextData[field] !== val) {
            contextData[field] = val;
          }
        });
        contextData[field] = $el.value();
      },
      'on': function($view, $el, lastResult, refreshCallback, attributeName) {
        const handlerArgs = zuix.parseAttributeArgs(attributeName, $el, $view, lastResult);
        const code = $el.attr(attributeName);
        const eventName = handlerArgs.slice(1).join(':');
        $el.on(eventName, function(e) {
          const eventHandler = zuix.runScriptlet(code, $el, $view);
          if (typeof eventHandler === 'function') {
            eventHandler.call($el.get(), e, $el);
          }
        });
      },
      'get': function($view, $el, lastResult, refreshCallback) {
        let code = $el.attr('@get');
        let resultAs = 'result';
        if (code.indexOf(' as ') > 0) {
          const parts = code.split(' as ');
          code = parts[0];
          resultAs = parts[1];
        }
        const result = zuix.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          code = 'const ' + resultAs + ' = args; ' + $el.attr('@set');
          zuix.runScriptlet(code, $el, $view, result);
          lastResult = result;
        }
        refreshCallback(lastResult);
      },
      'set': function($view, $el, lastResult, refreshCallback) {
        if ($el.attr('@get')) return;
        zuix.runScriptlet($el.attr('@set'), $el, $view);
        refreshCallback(lastResult);
      },
      'disable-if': function($view, $el, lastResult, refreshCallback) {
        const code = $el.attr('@disable-if');
        const result = zuix.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          $el.attr({disabled: result ? '' : null});
          lastResult = result;
        }
        refreshCallback(lastResult);
      },
      'hide-if': function($view, $el, lastResult, refreshCallback) {
        const code = $el.attr('@hide-if');
        const result = zuix.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          result ? $el.css({visibility: 'hidden'}) : $el.css({visibility: 'visible'});
          lastResult = result;
        }
        refreshCallback(lastResult); // default 100ms delay
      },
      'if': function($view, $el, lastResult, refreshCallback) {
        const code = $el.attr('@if');
        const result = zuix.runScriptlet(code, $el, $view);
        if (result !== lastResult) {
          if (result) {
            zuix.runScriptlet($el.attr('@then'), $el, $view);
          } else {
            zuix.runScriptlet($el.attr('@else'), $el, $view);
          }
          lastResult = result;
        }
        refreshCallback(lastResult);
      }
    }
  };
  /**
   * @type {!Array.<ZxQuery>}
   * @private
   **/
  this._fieldCache = [];
  return this;
}

/**
 *
 * @private
 * @param {ContextControllerHandler} handler The context controller handler
 * @return {ContextControllerHandler}
 */
function controller(handler) {
  if (typeof handler['for'] !== 'function') {
    handler['for'] = function(componentId) {
      _globalControllerHandlers[componentId] = handler;
      return handler;
    };
  }
  return handler;
}

/**
 *
 * @private
 * @param {!string} fieldName Value to match in the `z-field` attribute.
 * @param {!Element|!ZxQuery} [container] Starting DOM element for this search (**default:** *document*)
 * @param {object} [context] The context
 * @return {ZxQuery} ZxQuery object with elements matching the given ```z-field``` attribute.
 * If the matching element is just one, then it will also have the extra method `field(fieldName)`
 * to search for fields contained in it.
 *
 */
function field(fieldName, container, context) {
  if (util.isNoU(context)) {
    context = this;
  }
  if (context._fieldCache == null) {
    context._fieldCache = {};
  }

  let el = null;
  if (typeof context._fieldCache[fieldName] === 'undefined') {
    el = z$(container)
        .find(util.dom.queryAttribute(_optionAttributes.zField, fieldName) + ',[\\#'+fieldName+']');
    if (el != null && el.length() > 0) {
      context._fieldCache[fieldName] = el;
      // extend the returned `ZxQuery` object adding the `field` method
      if (el.length() === 1 && util.isNoU(el.field)) {
        el.field = function(name) {
          return field(name, el, el);
        };
      }
    }
  } else el = context._fieldCache[fieldName];

  return el;
}

/**
 *
 * @private
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions|undefined} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
function load(componentId, options) {
  // TODO: throw error on argument mismatch
  // TODO: prevent load loops when including recursively a component
  componentId = _componentizer.resolvePath(componentId);
  /** @type {ComponentContext} */
  let ctx = null;
  if (!util.isNoU(options)) {
    // the `componentId` property is mandatory for `createContext` to work properly
    options.componentId = componentId;
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
      if (options === false) {
        options = {};
      }
      // generate contextId (this is a bit buggy, but it's quick)
      options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
      ctx = createContext(options);
    }
  } else {
    // TODO: check if this case is of any use
    // empty context
    options = {};
    ctx = new ComponentContext(zuix, options, trigger);
  }

  // assign the given component (widget) to this context
  if (ctx.componentId != componentId) {
    // mutable component, rebind to a different component
    // preserving current context data
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

  if (util.isFunction(options.ready)) {
    ctx.ready = options.ready;
  }
  if (util.isFunction(options.loaded)) {
    ctx.loaded = options.loaded;
  }
  if (util.isFunction(options.error)) {
    ctx.error = options.error;
  }

  if (resourceLoadTask[componentId] == null) {
    resourceLoadTask[componentId] = true;
    return loadResources(ctx, options);
  } else {
    if (_pendingResourceTask[componentId] == null) {
      _pendingResourceTask[componentId] = [];
    }
    _pendingResourceTask[componentId].push({c: ctx, o: options});
  }

  return ctx;
}

function getResourcePath(path) {
  let config = zuix.store('config');
  if (config != null && config[location.host] != null) {
    config = config[location.host];
  }
  path = _componentizer.resolvePath(path);
  if (!path.startsWith('/') && path.indexOf('://') < 0) {
    path = (config != null && config.resourcePath != null ? config.resourcePath : '') + path;
  }
  return path;
}

/**
 * @private
 * @param {ComponentContext} ctx Component context
 * @param {ContextOptions|JSON} options Context loading options
 * @return {ComponentContext}
 */
function loadResources(ctx, options) {
  // pick it from cache if found
  let cachedComponent = getCachedComponent(ctx.componentId);
  if (cachedComponent !== null && options.controller == null && ctx.controller() == null) {
    ctx.controller(cachedComponent.controller);
    _log.t(ctx.componentId+':js', 'component:cached:js');
  }

  const loadStyles = function(resourceLoadTask) {
    if (options.css !== false && typeof options.css !== 'string') {
      resourceLoadTask[ctx.componentId].step(ctx.componentId+':css');
      ctx.loadCss({
        caching: _enableHttpCaching,
        success: function(css) {
          cachedComponent.css = css;
        },
        error: function(err) {
          _log.e(err, ctx);
        },
        then: function() {
          loadController(ctx, resourceLoadTask[ctx.componentId]);
        }
      });
    } else {
      loadController(ctx, resourceLoadTask[ctx.componentId]);
    }
  };

  if (util.isNoU(options.view)) {
    if (cachedComponent !== null) {
      if (cachedComponent.view != null) {
        ctx.view(cachedComponent.view);
        _log.t(ctx.componentId+':html', 'component:cached:html');
      }
      /*
        TODO: CSS caching, to be tested.
      */
      if (options.css !== false && typeof options.css !== 'string') {
        options.css = false;
        if (!cachedComponent.css_applied) {
          cachedComponent.css_applied = true;
          ctx.style(cachedComponent.css);
          _log.t(ctx.componentId + ':css', 'component:cached:css');
        }
      }
    }

    // if not able to inherit the view from the base cachedComponent
    // or from an inline element, then load the view from web
    if (util.isNoU(ctx.view())) {
      // Load View
      taskQueue('resource-loader').queue(ctx.componentId+':html', function() {
        resourceLoadTask[ctx.componentId] = this;

        ctx.loadHtml({
          cext: options.cext,
          caching: _enableHttpCaching,
          success: function(html) {
            if (cachedComponent == null) {
              cachedComponent = cacheComponent(ctx);
            }
            cachedComponent.view = html;
            delete cachedComponent.controller;
            loadStyles(resourceLoadTask);
          },
          error: function(err) {
            _log.e(err, ctx);
            if (util.isFunction(options.error)) {
              (ctx.error).call(ctx, err, ctx);
            }
          }
        });
      }, options.priority);
    } else {
      taskQueue('resource-loader').queue(ctx.componentId+':css', function() {
        resourceLoadTask[ctx.componentId] = this;
        loadStyles(resourceLoadTask);
      }, options.priority);
    }
    // defer controller loading
    return ctx;
  } else {
    ctx.view(options.view);
  }

  if (ctx.controller() == null) {
    taskQueue('resource-loader').queue(ctx.componentId + ':js', function() {
      resourceLoadTask[ctx.componentId] = this;
      loadController(ctx, resourceLoadTask[ctx.componentId]);
    }, _contextRoot.length);
  } else loadController(ctx);

  return ctx;
}
/**
 *
 * @private
 * @param context {ComponentContext|ZxQuery|Element}
 */
function unload(context) {
  const dispose = function(ctx) {
    if (ctx instanceof Element) {
      const el = ctx;
      ctx = zuix.context(el);
      // remove element from componentizer queue if
      // it's a lazy-loadable element not yet loaded
      _componentizer.dequeue(el);
    }
    if (!util.isNoU(ctx) && ctx.dispose) {
      ctx.dispose();
    }
  };
  if (context && context.each) {
    context.each(function(i, el) {
      dispose(el);
    });
  } else {
    dispose(context);
  }
}

/** @private */
function loadComponent(elements, componentId, type, options) {
  elements = z$(elements);
  unload(elements);
  /**
   * @param {ZxQuery} container
   */
  const load = function(container) {
    container.attr(_optionAttributes.zLoad, componentId);
    if (type) {
      container.attr(type, '');
    }
    if ((options && options.lazyLoad && options.lazyLoad.toString() === 'true') || container.attr(_optionAttributes.zLazy) === 'true') {
      if (options) {
        container.get().__zuix_loadOptions = options;
      }
      return false;
    }
    return _componentizer.loadInline(container, options);
  };
  elements.each(function(i, el, $el) {
    load($el);
  });
}

/** @private */
function createContext(options) {
  const context = new ComponentContext(zuix, options, trigger);
  _contextRoot.push(context);
  return context;
}

/**
 *
 * @private
 * @param {Element|ZxQuery|object} contextId The `contextId` or the component's host element.
 * @param {ContextReadyCallback} [callback] The callback function that will pass the component's context object once loaded and ready.
 * @return {ComponentContext} The matching component's context or `null` if the context does not exist or not yet loaded.
 */
function context(contextId, callback) {
  let context = null;
  if (contextId instanceof z$.ZxQuery) {
    contextId = contextId.get();
  } else if (typeof contextId === 'string') {
    const ctx = z$.find(util.dom.queryAttribute(_optionAttributes.zContext, contextId));
    if (ctx.length() > 0) contextId = ctx.get();
  }
  z$.each(_contextRoot, function(k, v) {
    if ((contextId instanceof Element && (v.view() === contextId || v.container() === contextId)) ||
            util.objectEquals(v.contextId, contextId)) {
      context = v;
      return false;
    }
  });
  if (typeof callback === 'function' && (contextId instanceof Element || contextId instanceof z$.ZxQuery)) {
    if (context == null || !context.isReady) {
      z$(contextId).one('component:loaded', function() {
        context = zuix.context(this);
        setTimeout(function() {
          callback.call(context, context);
        }, 10);
      });
    } else callback.call(context, context);
  }
  return context;
}

/**
 *
 * @private
 * @param {string} path
 * @param {function|undefined} [handler]
 */
function hook(path, handler) {
  if (util.isNoU(handler)) {
    delete _hooksCallbacks[path];
  } else {
    if (_hooksCallbacks[path]) {
      _log.w('Overwritten an already registered hook for', '"' + path + '"', 'OLD HANDLER', _hooksCallbacks[path], 'REPLACED BY', handler);
    }
    _hooksCallbacks[path] = handler;
  }
}

/**
 * Fires a zUIx hook.
 *
 * @private
 * @param {object} context
 * @param {string} path
 * @param {object|undefined} [data]
 */
function trigger(context, path, data) {
  if (util.isFunction(_hooksCallbacks[path])) {
    _hooksCallbacks[path].call(context, data, context);
  }
}

/**
 * Enable/Disable HTTP caching
 *
 * @private
 * @param {boolean} [enable]
 * @return {boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
function httpCaching(enable) {
  if (enable != null) {
    _enableHttpCaching = enable;
  }
  return _enableHttpCaching;
}

// *********************** private members ************************* //

/** @private */
function setComponentCache(cache) {
  _componentCache = cache;
}

/** @private */
function removeCachedComponent(componentId) {
  // TODO: removeCachedComponent
  // TODO: should this be called when last instance of a component type is disposed?
}

/**
 * @private
 * @param {Object} componentId
 * @return {ComponentCache | null}
 */
function getCachedComponent(componentId) {
  /** @type {ComponentCache | null} */
  let cached = null;
  z$.each(_componentCache, function(k, v) {
    if (util.objectEquals(v.componentId, componentId)) {
      cached = v;
      return false;
    }
  });
  return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function loadController(context, task) {
  if (typeof context.options().controller === 'undefined' && context.controller() === null) {
    _log.d(context.componentId, 'controller:load');
    if (!util.isNoU(task)) {
      task.step(context.componentId+':js');
    }
    if (util.isFunction(_globalControllerHandlers[context.componentId])) {
      context.controller(_globalControllerHandlers[context.componentId]);
      createComponent(context, task);
    } else {
      const job = function(t) {
        const jsPath = context.componentId + '.js' + (_enableHttpCaching ? '' : '?'+new Date().getTime());
        z$.ajax({
          url: getResourcePath(jsPath),
          success: function(ctrlJs) {
            // TODO: improve js parsing!
            try {
              const fn = ctrlJs.indexOf('function');
              const il = ctrlJs.indexOf('.load');
              if (il > 1 && il < fn) {
                ctrlJs = ctrlJs.substring(0, il - 4);
              }
              const ih = ctrlJs.indexOf('.controller');
              if (ih > 1 && ih < fn) {
                ctrlJs = ctrlJs.substring(ih + 11);
              }
              const ec = ctrlJs.indexOf('//<--controller');
              if (ec > 0) {
                ctrlJs = ctrlJs.substring(0, ec);
              }
              ctrlJs += '\n//# sourceURL="'+context.componentId + '.js"\n';
              context.controller(getController(ctrlJs));
            } catch (e) {
              _log.e(new Error(), e, ctrlJs, context);
              if (util.isFunction(context.error)) {
                (context.error).call(context, e, context);
              }
            }
          },
          error: function(err) {
            _log.e(err, new Error(), context);
            if (util.isFunction(context.error)) {
              (context.error).call(context, err, context);
            }
          },
          then: function() {
            createComponent(context, t);
          }
        });
      };
      if (util.isNoU(task)) {
        taskQueue('resource-loader').queue(context.componentId+':js', function() {
          job(resourceLoadTask[context.componentId] = this);
        }, context.options().priority);
      } else job(task);
    }
  } else {
    createComponent(context, task);
  }
}

function cacheComponent(context) {
  const html = context.view().innerHTML; // (context.view() === context.container() ? context.view().innerHTML : context.view().outerHTML);
  const c = z$.wrapElement('div', html);
  /** @type {ComponentCache} */
  const cached = {
    componentId: context.componentId,
    view: c.innerHTML,
    css: typeof context.options().css === 'string' ? null : context._css,
    controller: context.controller()
  };
  _componentCache.push(cached);
  _log.t(context.componentId, 'bundle:added');
  return cached;
}

/**
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function createComponent(context, task) {
  resourceLoadTask[context.componentId] = null;
  if (!util.isNoU(context.view())) {
    let cached = getCachedComponent(context.componentId);
    if (!context.options().viewDeferred) {
      if (cached === null) {
        cached = cacheComponent(context);
      } else if (cached.controller == null) {
        cached.controller = context.controller();
      }
    } else {
      _log.d(context.componentId, 'component:deferred:load');
    }

    const v = z$(context.view());
    // if zContext it's not null, a main controller was already loaded
    // on this view, so we preserve the main controller's context id
    if (v.attr(_optionAttributes.zContext) == null) {
      v.attr(_optionAttributes.zContext, context.contextId);
    }

    _log.d(context.componentId, 'component:initializing');
    if (util.isFunction(context.controller())) {
      // TODO: should use 'require' instead of 'new Controller' ... ?
      /** @type {ContextController} */
      const c = context._c = new ContextController(context);
      c.log = require('../helpers/Logger')(context.contextId);
      if (typeof c.init === 'function') {
        c.init();
      }
      const endTask = function() {
        task && _log.d(context.componentId, 'controller:create:deferred');
        initController(c);
        task && task.end();
        v.attr(_optionAttributes.zReady, 'true');
      };
      // TODO: when loading multiple controllers perhaps some code paths can be skipped -- check/optimize this!
      if (!util.isNoU(c.view()) && c.view().attr(_optionAttributes.zComponent) == null) {
        // add the `zComponent` attribute
        c.view().attr(_optionAttributes.zComponent, '');
      }
      // if no model is supplied, try auto-create from view fields
      if (util.isNoU(context.model()) && !util.isNoU(context.view())) {
        context.viewToModel();
      }

      if (context.options().viewDeferred) {
        context.options().viewDeferred = false;
        // save the original inline view
        // before loading the view template
        // it can be then restored with c.restoreView()
        c.saveView();

        if (cached === null) {
          cached = {
            componentId: context.componentId,
            controller: context.controller()
          };
          _componentCache.push(cached);
          _log.t(context.componentId, 'bundle:added');
          _log.d(context.componentId, 'component:deferred:load');
        }

        const loadViewTask = function() {
          if (context.options().html !== false) {
            if (cached.view == null) {
              context.loadHtml({
                cext: context.options().cext,
                caching: _enableHttpCaching,
                success: function(html) {
                  cached.view = html;
                  _log.d(context.componentId, 'component:deferred:html');
                },
                error: function(err) {
                  _log.e(err, context);
                  if (util.isFunction(context.options().error)) {
                    (context.options().error).call(context, err, context);
                  }
                },
                then: function() {
                  _log.d(context.componentId, 'controller:create:2');
                  endTask();
                }
              });
            } else {
              context.view(cached.view);
              endTask();
            }
          } else {
            _log.d(context.componentId, 'controller:create:3');
            endTask();
          }
        };

        if (context.options().css !== false && typeof context.options().css !== 'string') {
          if (cached.css == null) {
            context.loadCss({
              caching: _enableHttpCaching,
              success: function(css) {
                cached.css = css;
                _log.d(context.componentId, 'component:deferred:css');
              },
              then: function() {
                loadViewTask();
              }
            });
          } else {
            context.style(cached.css);
            loadViewTask();
          }
        } else {
          if (typeof context.options().css === 'string') {
            context.style(context.options().css);
          }
          loadViewTask();
        }
      } else {
        _log.d(context.componentId, 'controller:create:1');
        endTask();
      }
    } else {
      _log.w(context.componentId, 'component:controller:undefined');
    }
  } else {
    // TODO: should report error or throw an exception
    _log.e(context.componentId, 'component:view:undefined');
  }
}

/** @private */
function isDirectComponentElement($view, $el) {
  const exclusionList = [
    ..._implicitLoadDefaultList,
    util.dom.queryAttribute(_optionAttributes.zLoad),
    util.dom.queryAttribute(_optionAttributes.zInclude)
  ].join(',');
  const $cv = $el.parent('pre,code,' + exclusionList);
  return $cv.get() === $view.get();
}

/**
 * @private
 * @param {ContextController} ctrl
 */
function initController(ctrl) {
  const ctx = ctrl.context;
  _log.t(ctx.componentId, 'controller:init', 'timer:init:start');

  ctx.isReady = true;
  // isReady status can be set to false in the `create` callback
  // and later set to true when all dependencies have been loaded

  // tender lifecycle moments
  const $view = ctrl.view();
  if (util.isFunction(ctrl.create)) {
    ctrl.create();
  }
  ctrl.trigger('view:create', $view);

  const contextLoaded = function() {
    // set component loaded
    if (util.isFunction(ctx.loaded)) {
      (ctx.loaded).call(ctx, ctx);
    }

    // load pending resources
    if (_pendingResourceTask[ctx.componentId] != null) {
      const pendingRequests = _pendingResourceTask[ctx.componentId];
      _pendingResourceTask[ctx.componentId] = null;
      let context;
      while (pendingRequests != null && (context = pendingRequests.shift()) != null) {
        loadResources(context.c, context.o);
      }
    }

    // re-enable nested components loading
    z$().one('componentize:end', function() {
      setTimeout(function() {
        $view.find(util.dom.queryAttribute(_optionAttributes.zLoaded, 'false', util.dom.cssNot(_optionAttributes.zComponent)))
            .each(function(i, v) {
              this.attr(_optionAttributes.zLoaded, null);
            });
        // render nested components
        zuix.componentize($view);
      });
    });
  };
  contextLoaded();
  ctrl.trigger('component:loaded', $view, true);

  const contextReady = function() {
    // set component ready
    if (util.isFunction(ctx.ready)) {
      (ctx.ready).call(ctx, ctx);
    }
    ctrl.trigger('component:ready', $view, true);
  };

  /** @type {Object.<string, ActiveRefreshHandler>} */
  const globalHandlers = zuix.store('handlers');
  // Creates active-refresh handlers from '@' attributes
  const allocateRefreshHandlers = function($view, $el) {
    const el = $el.get();
    const allocatedHandlers = [];
    for (let j = 0; j < el.attributes.length; j++) {
      const a = el.attributes.item(j);
      const activeTagName = a.name;
      if (activeTagName.length > 1 && activeTagName.startsWith('@')) {
        const handlerName = activeTagName.substring(1).split(':')[0];
        /** @type ActiveRefreshHandler */
        let activeTagHandler = ctx.handlers ? ctx.handlers[handlerName] : null;
        // if no component-defined handler is found, try global handlers
        if (!activeTagHandler) {
          activeTagHandler = globalHandlers[handlerName];
        }
        if (typeof activeTagHandler === 'function') {
          const h = zuix.activeRefresh($view, $el, ctrl.model(), function($v, $element, data, refreshCallback) {
            // TODO: should `$v` and/or `$element` be passed here?
            const runActiveTagHandler = function() {
              activeTagHandler.call(el, $view, $el, data, refreshCallback, activeTagName);
            };
            if ($el.attr(_optionAttributes.zLoad) && $el.attr(_optionAttributes.zReady) !== 'true') {
              // if the element is a component, asynchronously wait
              // for the component to load before starting the handler
              if (zuix.context($el) == null) {
                refreshCallback(data);
              }
            } else {
              runActiveTagHandler();
            }
          });
          allocatedHandlers.push(h);
        }
      }
    }
    return allocatedHandlers;
  };


  // Setup main component's 'refresh' handler
  const contextId = ctx.contextId;
  const viewRefreshScript = $view.find(':scope > [type="jscript"]');
  viewRefreshScript._selection = viewRefreshScript._selection.concat(z$(document).find('[type="jscript"][for="' + contextId + '"]')._selection);
  ctx.handlers.refresh = function($view, $el, contextData, refreshCallback) {
    if (!ctx._disposed) {
      if (ctx._dependencyResolver && !ctx._dependencyResolver.resolved()) {
        // not all requested components are ready, retry on next refresh
        if (!ctx.$.hasClass('not-ready')) {
          ctx.$.addClass('not-ready');
        }
        return refreshCallback(contextData);
      } else if (ctx._dependencyResolver != null && ctx._dependencyResolver !== false) {
        // all components requested with the `using' attribute are ready
        ctx.$.removeClass('not-ready');
        ctx._dependencyResolver = false;
      }
      let refreshHandler = ctx._refreshHandler;
      // allocate refresh handler on the first "paint" request
      if (!refreshHandler) {
        const scriptHeader = 'return (function($this, context, args){const $ = context.$; const model = context.model(); ';
        let code = '"use strict"; expose = {}; function refresh() {}; function ready() { return true; }; ';

        // add local vars from fields
        if (ctx['#']) {
          z$.each(ctx['#'], function(k, v) {
            const f = util.hyphensToCamelCase(k);
            code += 'const $' + f + ' = context["#"].' + f + ';';
            code += 'const ' + f + ' = $' + f + '.get();';
            code += 'let _' + f + ' = null; zuix.context(' + f + ', function(c) { _' + f + ' = c; });';
          });
        }
        code += 'function runScriptlet($el, s, args) { let result; try { result = eval("const $this = $el; const _this = zuix.context(this); " + s) } catch (e) { console.error(\'SCRIPTLET ERROR\', e, s); }; return result };';

        // add custom "jscript" code / collects "using" components
        const usingComponents = []; let userCode = '';
        usingComponents.push(contextId); // map contextId to a local variable
        viewRefreshScript.each(function(i, el, $el) {
          if ($el.attr('using') != null) {
            usingComponents.push(...$el.attr('using').split(','));
          }
          if ($el.parent().get() === $view.get() || $el.attr('for') === contextId) {
            userCode += $el.html() + ';';
          }
        });

        let componentsResolve = '';
        if (usingComponents.length > 0) {
          let waitingComponents = '';
          usingComponents.forEach(function(cid) {
            const ctxVarName = util.hyphensToCamelCase(cid);
            if (ctx._dependencyResolver !== false) {
              componentsResolve += 'let ' + ctxVarName + ' = window["' + ctxVarName + '"]; if (' + ctxVarName + ' == null) { ' + ctxVarName + ' = zuix.context("' + cid + '", function(ctx) { ' + ctxVarName + ' = ctx; }); }';
            } else {
              componentsResolve += 'let ' + ctxVarName + ' = window["' + ctxVarName + '"]; if (' + ctxVarName + ' == null) { ' + ctxVarName + ' = zuix.context("' + cid + '"); }';
            }
            waitingComponents += ctxVarName + ' && ';
          });
          // if "using" components are not ready, retry on the next refresh call
          if (ctx._dependencyResolver !== false && componentsResolve.length > 0) {
            componentsResolve += 'const resolved = function() { return ' + waitingComponents + 'true; };';
            ctx._dependencyResolver = Function(scriptHeader + componentsResolve + '; return { resolved }; }).call(this.$el.get(), this.$el, this.ctx, this.args);')
                .call({$el, ctx, args: null});
            if (!ctx._dependencyResolver.resolved()) {
              // do not start the refresh handler yet,
              // wait for components requested with the "using" attribute
              return refreshCallback(contextData);
            }
          }
        }

        // setup the refresh handler code
        code += componentsResolve + userCode;

        const scriptFooter = code + '; return { refresh, runScriptlet, ready, expose }; }).call(this.$el.get(), this.$el, this.ctx, this.args);';
        // create the refresh handler
        refreshHandler = ctx._refreshHandler = Function(scriptHeader + ';' + scriptFooter)
            .call({$el, ctx, args: null});
        // expose public methods if declared
        if (refreshHandler.expose) {
          Object.assign(ctx, refreshHandler.expose);
        }
      }
      // call refresh method for the first time, if found
      if (refreshHandler.refresh) {
        refreshHandler.refresh();
      }
      // Active-Refresh callback to request a new refresh in 100ms
      if (typeof refreshCallback === 'function') {
        refreshCallback(contextData);
      }
    }
  };


  // Allocate refresh handlers
  const allocated = [];
  $view.find('*').each(function(i, el, $el) {
    if (!isDirectComponentElement($view, $el)) return;
    allocated.push(...allocateRefreshHandlers($view, $el));
  });

  // Allocate main component's 'refresh' handler
  // if there is the JScript or any '@' handler
  if (allocated.length > 0 || viewRefreshScript.length() > 0) {
    const refreshDelay = viewRefreshScript.length() > 0 ? viewRefreshScript.attr('refreshDelay') : null;
    const handlersDelay = viewRefreshScript.length() > 0 ? viewRefreshScript.attr('handlersDelay') : null;
    // init refresh handler / first paint
    ctx.handlers.refresh.call($view.get(), $view, $view, ctrl.model(), function(contextData, delay) {
      zuix.activeRefresh($view, $view, contextData, function($v, $element, data, refreshCallback) {
        if (ctx._refreshHandler && !ctx._refreshHandler.initialized) {
          let loadedNested = true;
          allocated.forEach(function(h) {
            if (h.$element.attr(_optionAttributes.zLoad) != null || h.$element.attr(_optionAttributes.zInclude) != null) {
              loadedNested = zuix.context(h.$element) != null && zuix.context(h.$element).isReady;
              return loadedNested;
            }
          });
          const canStart = ctx._refreshHandler.ready() && ctx.isReady === true && loadedNested;
          if (canStart) {
            ctx._refreshHandler.initialized = true;
            // start '@' handlers
            allocated.forEach(function(h) {
              h.start(handlersDelay);
            });
            ctx.$.removeClass('not-ready');
            contextReady();
          } else if (!ctx.$.hasClass('not-ready')) {
            ctx.$.addClass('not-ready');
          }
          refreshCallback(data);
        } else {
          ctx.handlers.refresh.call($view.get(), $view, $view, data, refreshCallback);
        }
      }).start(refreshDelay);
    });
  } else {
    ctx.handlers.refresh.call($view.get(), $view, $view);
    contextReady();
  }

  _log.t(ctx.componentId, 'controller:init', 'timer:init:stop');
  _log.i(ctx.componentId, 'component:loaded', contextId);
}

/**
 // TODO: refactor this method name
 * @private
 * @param javascriptCode string
 * @return {ContextControllerHandler}
 */
function getController(javascriptCode) {
  let instance = function(ctx) { };
  if (typeof javascriptCode === 'string') {
    let ctrl;
    try {
      if (javascriptCode.indexOf('module.exports') >= 0) {
        ctrl = Function('\'use strict\'; let ControllerInstance = arguments[0]; let module = {};\n' + javascriptCode + '; return module.exports;')(ControllerInstance);
      } else {
        ctrl = Function('return ' + javascriptCode)();
      }
      if (typeof ctrl !== 'function') {
        throw new Error('Unexpected module type: "' + (typeof ctrl) + '"');
      }
      instance = ctrl;
    } catch (e) {
      // TODO: should trigger a global hook
      // eg. 'controller:error'
      _log.e(this, e, javascriptCode);
    }
  }
  return instance;
}

/**
 * @private
 * @param c
 */
function replaceCache(c) {
  _componentCache = c;
}

// ******************* proto ******************** //


/**
 * Search the document or inside the given `container` for elements
 * with `z-field` attribute matching the provided `fieldName`.
 * This method implements a caching mechanism and automatic
 * disposal of allocated objects and events.
 *
 * @example
 *
```html
<div z-field="sample-container">
   <!-- HTML -->
</div>
<script>
container = zuix.field('sample-container');
container.html('Hello World!');
</script>
```
 *
 * @param {!string} fieldName Value of *z-field* to look for
 * @param {!Element} [container] Starting DOM element for this search (**default:** *document*)
 * @param {object} [context] The context
 * @return {ZxQuery} ZxQuery object with elements matching the given `z-field` attribute.
 * If there's just one matching element, then the returned object will also have the additional method `field(fieldName)`
 * to search for fields inside the element itself.
 *
 */
Zuix.prototype.field = function(fieldName, container, context) {
  return field.call(this, fieldName, container, context);
};

/**
 * Loads a component.
 * This is the programmatic equivalent of `z-load`
 * attribute used to load components from HTML.
 *
 * @example
```html
 <!--
 The controller will be loaded on the following host element:
 -->
<div #sample-view></div>

<script>
// Get the host element
const view = zuix.field('sample-view');

// Declares inline controller for 'my/example/component'
const exampleController = zuix.controller((cp) => {
  cp.create = onCreate;

  function onCreate() {
    // Sets the initial content of the view
    cp.view().html('Hello World!');
    // Exposes the private `testMethod`
    // as the public method `test`
    cp.expose('test', testMethod);
  }

  function testMethod() {
    cp.log.i("Method exposing test");
    cp.view().html('A simple test.');
  }
}).for('my/example/component');

// loads the controller
zuix.load('my/example/component', { view, ready: (ctx) => {
  // call the public method `test` after 1 second
  setTimeout(ctx.test, 1000);
}});
</script>
```
 *
 * @param {!string} componentId The identifier name of the component to be loaded
 * @param {ContextOptions} [options] Options used to initialize the loaded component
 * @return {ComponentContext} The component context.
 */
Zuix.prototype.load = function(componentId, options) {
  return load.call(this, componentId, options);
};
/**
 * Unloads the given component context(s) releasing all allocated resources.
 *
 * @example
```js
zuix.unload(ctx);
```
 *
 * @param {ComponentContext|ZxQuery|Element} context The instance of the component to be unloaded, a *ZxQuery* selection, or the component's host element
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.unload = function(context) {
  unload(context);
  return this;
};
/**
 * Loads a component, given the target host element(s).
 * If the target is already a component, it will be
 * unloaded and replaced by the new one.
 *
 * @example
 * ```html
<div layout="rows center-spread">

  <div class="card-component">
    <div z-field="title">Card 1</div>
  </div>

  <div class="card-component">
    <div z-field="title">Card 2</div>
  </div>

</div>
<style>
.card-component {
  margin: 8px;
  max-width: 360px;
}
</style>
<script>
  const elements = zuix.$.find('.card-component');
  zuix.loadComponent(elements, 'templates/mdl_card', 'view');
</script>
```
<div layout="rows center-spread">
  <div class="card-component">
    <div z-field="title">Card 1</div>
  </div>
  <div class="card-component">
    <div z-field="title">Card 2</div>
  </div>
</div>
<style>
.card-component {
  margin: 8px;
  max-width: 360px;
}
</style>
<script>
  const elements = zuix.$.find('.card-component');
  zuix.loadComponent(elements, 'templates/mdl_card', 'view');
</script>
 *
 * @param {ZxQuery|Element} elements The target host element(s) or component context(s)
 * @param {string|object} componentId The id of the component to load (path/component_name)
 * @param {'view'|'ctrl'|undefined} [type] The component type
 * @param {ContextOptions|undefined} [options] The component options
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.loadComponent = function(elements, componentId, type, options) {
  loadComponent(elements, componentId, type, options);
  return this;
};
/**
 * Allocates a component's controller handler. The provided `handler` function will
 * be called to initialize the component's controller instance once the component
 * has been loaded.
 *
 * @example
```js
// Allocates and assign a controller for
// the component 'path/to/component_name'
ctrl = zuix.controller(function(cp) {
  // `cp` is the {ContextController}
  // TODO: inline code of controller follows...
}).for('path/to/component_name');
```
 *
 * @param {ContextControllerHandler} handler Function called to initialize the component controller that will be passed as argument of this function
 * @return {ContextControllerHandler} The allocated controller handler.
 */
Zuix.prototype.controller = function(handler) {
  return controller.call(this, handler);
};
/**
 * Gets a `ComponentContext` object, given its `contextId` or its host element.
 * The `contextId` is the one specified in the `ContextOptions` object or by using the `z-context` attribute on the host element.
 *
 * @example
```html
<div z-load="site/components/slideshow"
     z-context="my-slide-show">...</div>
```
```js
slideShow = null;
zuix.context('my-slide-show', function(ctx) {
  slideShow = ctx;
  // call component's methods
  slideShow.setSlide(1);
});
```
 *
 * @param {Element|ZxQuery|object} contextId The `contextId` or the component's host element.
 * @param {ContextReadyCallback} [callback] The callback function that will pass the component's context object once loaded and ready.
 * @return {ComponentContext} The matching component's context or `null` if the context does not exist or not yet loaded.
 */
Zuix.prototype.context = function(contextId, callback) {
  return context.call(this, contextId, callback);
};
/**
 * Creates the component specified by `componentId` and returns its `{ComponentContext}` object.
 * The returned component it's unloaded and detached from the DOM and it must be explicitly attached.
 * After attaching it to the DOM, `zuix.componentize([<container>])` must be called in
 * order to actually load and display the component.
 *
 * @param {string} componentId Identifier name of the component to create
 * @param {ContextOptions|undefined} [options] Component context options
 * @return {ComponentContext} The `ComponentContext` instance of the created component.
 */
Zuix.prototype.createComponent = function(componentId, options) {
  if (options == null) options = {};
  if (util.isNoU(options.contextId)) {
    options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
  }
  if (context(options.contextId) != null) {
    throw new Error('Context arelady exists.');
  } else {
    options.container = document.createElement('div');
    options.componentId = componentId;
    _componentizer.applyOptions(options.container, options);
  }
  return createContext(options);
};
/**
 * Triggers the event specified by `eventPath`.
 *
 * @param {object} context The context object (*this*) passed to handler functions listening for this event
 * @param {string} eventPath The path of the event to fire
 * @param {object} [eventData] The data object of the event
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.trigger = function(context, eventPath, eventData) {
  trigger(context, eventPath, eventData);
  return this;
};
/**
 * Sets a callback for a global event.
 * There can be only one callback for each kind of global event.
 * Pass null as `eventHandler` to unset a previously set callback.
 *
 * @example
```js
// The context `this` in the event handlers will be
// the {ComponentContext} object that sourced the event.
// The `data` parameter passed to the handlers, is of
// variant type, depending on the type of the occurring event.
zuix.hook('load:begin', function(data) {

  loaderMessage.html('Loading "' + data.task + '" ...');
  loaderMessage.show();

}).hook('load:next', function(data) {

  loaderMessage.html('"' + data.task + '" done, loading next..');

}).hook('load:end', function() {

  loaderMessage.hide();

}).hook('html:parse', function(data) {
  // Process HTML content before it's attached to the DOM

  if (this.options().markdown === true && typeof showdown !== 'undefined') {
    // ShowDown - MarkDown syntax compiler
    let htmlMarkDown = data.content;
    htmlMarkDown = new showdown.Converter()
      .makeHtml(htmlMarkDown);
    // return the processed content
    data.content = htmlMarkDown;
  }

}).hook('css:parse', function(data) {
  // Process CSS content before it's attached to the DOM

  let css = data.content;
  // process css, eg. run a CSS pre-processor
  // eg. Sass, Less, ...
  css = run_pre_processor(css);
  // return the processed content
  data.content = css;

}).hook('view:process', function(view) {
  // The view DOM is now fully loaded and ready
  // `view` is of {ZxQuery} type

  // Prism code syntax highlighter
  view.find('code').each(function(i, block) {
    this.addClass('language-javascript');
    Prism.highlightElement(block);
  });

  // Force opening of all non-local links in a new window
  zuix.$('a[href*="://"]').attr('target', '_blank');

  // Material Design Light auto-detection
  // Call DOM upgrade on newly added view elements
  if (componentHandler)
    componentHandler.upgradeElements(view.get());

});
```
 *
 * @param {string} eventPath The event path
 * @param {function|undefined} [eventHandler] The handler function
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.hook = function(eventPath, eventHandler) {
  hook(eventPath, eventHandler);
  return this;
};
/**
 * Loads a CSS, script or singleton component. Resources loaded
 * through this method are available in the global scope and can also be
 * included in the application bundle.
 *
 * @example
```js
zuix.using('script', 'https://some.cdn.js/moment.min.js', function(){
  // can start using moment.js
});
```
 *
 * @param {string} resourceType Either *'style'*, *'script'* or *'component'*
 * @param {string} resourcePath Relative or absolute resource url path
 * @param {ResourceUsingCallback} [callback] Callback function to call once resource is loaded
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.using = function(resourceType, resourcePath, callback) {
  resourcePath = _componentizer.resolvePath(resourcePath);
  resourceType = resourceType.toLowerCase();
  const hashId = resourceType + '-' + resourcePath.hashCode();

  if (resourceType === 'component') {
    const c = context(hashId);
    if (c == null) {
      zuix.load(resourcePath, {
        contextId: hashId,
        view: '',
        priority: -10,
        ready: function(ctx) {
          if (typeof callback === 'function') {
            callback(resourcePath, ctx);
          }
        },
        error: function() {
          callback(resourcePath, null);
        }
      });
    } else if (typeof callback === 'function') {
      // already loaded
      callback(resourcePath, c);
    }
  } else {
    const isCss = (resourceType === 'style');
    if (z$.find(resourceType + '[id="' + hashId + '"]').length() === 0) {
      const head = document.head || document.getElementsByTagName('head')[0];
      const resource = document.createElement(resourceType);
      if (isCss) {
        resource.type = 'text/css';
        resource.id = hashId;
      } else {
        resource.type = 'text/javascript';
        resource.id = hashId;
      }
      head.appendChild(resource);

      // TODO: add logging
      const addResource = function(text) {
        // TODO: add logging
        if (isCss) {
          if (resource.styleSheet) {
            resource.styleSheet.cssText = text;
          } else {
            resource.appendChild(document.createTextNode(text));
          }
        } else {
          if (resource.innerText) {
            resource.innerText = text;
          } else {
            resource.appendChild(document.createTextNode(text));
          }
        }
        if (callback) {
          callback(resourcePath, hashId);
        }
      };

      const cid = '_res/' + resourceType + '/' + hashId;
      const cached = getCachedComponent(cid);
      if (cached != null) {
        addResource(isCss ? cached.css : cached.controller);
      } else {
        z$.ajax({
          url: resourcePath,
          success: function(resText) {
            // TODO: add logging
            /** @type {ComponentCache} */
            const cached = {
              componentId: cid,
              view: null,
              css: isCss ? resText : null,
              controller: !isCss ? resText : null,
              using: resourcePath
            };
            _componentCache.push(cached);
            addResource(resText);
          },
          error: function() {
            // TODO: add logging
            head.removeChild(resource);
            if (callback) {
              callback(resourcePath);
            }
          }
        });
      }
    } else {
      // TODO: add logging
      // console.log('Resource already added ' + hashId + '(' + resourcePath + ')');
      if (callback) {
        callback(resourcePath, hashId);
      }
    }
  }
  return this;
};
/**
 * Enables/Disables lazy-loading or gets the current setting.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {Zuix|boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = function(enable, threshold) {
  if (enable != null) {
    _componentizer.lazyLoad(enable, threshold);
  } else {
    return _componentizer.lazyLoad();
  }
  return this;
};
/**
 * Enables/Disables HTTP caching or gets the current settings.
 *
 * @param {boolean} [enable]
 * @return {Zuix|boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
Zuix.prototype.httpCaching = function(enable) {
  if (enable != null) {
    httpCaching(enable);
  } else {
    return httpCaching();
  }
  return this;
};
/**
 * Searches the document, or inside the given `element`,
 * for elements with `z-load` attribute, and loads the
 * requested components.
 * Is also possible to disable/enable the componentizer
 * by passing a boolean value as argument.
 *
 * @example
 ```js
 zuix.componentize(document);
 // Globally disable the componentizer
 zuix.compenentize(false);
 // Re-enable the componentizer
 zuix.compenentize(true);
 ```
 *
 * @param {Element|ZxQuery|boolean} [element] Container to use as starting element for the search (**default:** *document*)
 * @return {Zuix} The `{Zuix}` object itself.
 */
Zuix.prototype.componentize = function(element) {
  if (element === false) {
    _disableComponentize = true;
  } else if (element === true) {
    _disableComponentize = false;
    element = null;
  }
  if (!_disableComponentize) {
    _componentizer.componentize(element);
  }
  return this;
};
/**
 * Gets/Sets a global store entry.
 *
 * @example
 ```js
 // stores *myObjectData* in the store entry named *my-data*
 zuix.store('my-data', myObjectData);
 // gets data from the store entry named *my-data*
 const data = zuix.store('my-data');
 ```
 * @param {string} name Entry name
 * @param {object} [value] Entry value
 * @return {object}
 */
Zuix.prototype.store = function(name, value) {
  if (value != null) {
    this._store[name] = value;
  }
  return this._store[name];
};
/**
 * Gets the path of a loadable resource.
 *
 * @param {string} path Loadable resource *id*
 * @return {string} The resource's path.
 */
Zuix.prototype.getResourcePath = function(path) {
  return getResourcePath(path);
};
/**
 * Gets an observable instance of the given object. Based on
 * the browser's built-in [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy?retiredLocale=it) object.
 *
 * @param {object} obj Object to observe
 * @return {ObservableObject} The observable object.
 */
Zuix.prototype.observable = function(obj) {
  return _objectObserver.observable(obj);
};

/**
 * Active-Refresh factory method.
 *
 * @param {ZxQuery} $view The component's view
 * @param {ZxQuery} $element The target element
 * @param {object} contextData Custom data that ca be passed from call to call
 * @param {ActiveRefreshHandler} refreshCallback The refresh handler function
 * @return {ActiveRefresh} The ActiveRefresh object. Invoke the `start()` method on the returned object, to actually activate the refresh handler.
 */
Zuix.prototype.activeRefresh = function($view, $element, contextData, refreshCallback) {
  return new ActiveRefresh($view, $element, contextData, refreshCallback);
};

/**
 * Gets/Sets the application's data bundle (all components and scripts used in the page packed into a single object).
 *
 * @param {!Array.<BundleItem>|true} [bundleData] A bundle object holding in memory all components' data (cache)
 * @param {function} [callback] Called once the bundle compilation ends. Works if *bundleData* is *true*
 * @return {Zuix|Array.<BundleItem>}
 */
Zuix.prototype.bundle = function(bundleData, callback) {
  if (util.isNoU(bundleData)) {
    return _componentCache;
  } else if (bundleData && typeof bundleData === 'boolean') {
    _log.t('bundle:start');
    const ll = _componentizer.lazyLoad();
    _componentizer.lazyLoad(false);
    _componentizer.componentize();
    if (typeof callback === 'function') {
      const waitLoop = function(w) {
        setTimeout(function() {
          if (_componentizer.willLoadMore()) {
            _log.t('bundle:wait');
            w(w);
          } else {
            _log.t('bundle:end');
            _componentizer.lazyLoad(ll);
            callback();
          }
        }, 1000);
      };
      waitLoop(waitLoop);
    }
  } else {
    // reset css flag before importing bundle
    for (let c = 0; c < bundleData.length; c++) {
      if (bundleData[c].css_applied) {
        delete bundleData[c].css_applied;
      }
      if (typeof bundleData[c].controller === 'string') {
        bundleData[c].controller = getController(bundleData[c].controller);
      }
    }
    _componentCache = bundleData;
  }
  return this;
};

/**
 * Helper class for querying and manipulating the DOM.
 * @type {ZxQueryStatic}
 */
Zuix.prototype.$ = z$;
// private
/** @private */
Zuix.prototype.TaskQueue = TaskQueue;
/** @private */
Zuix.prototype.ObjectObserver = ObjectObserver;
/** @private */
Zuix.prototype.ZxQuery = z$.ZxQuery;
/** @private */
Zuix.prototype.setComponentCache = function(componentCache) {
  setComponentCache(componentCache);
};
/**
 * Dumps content of the components cache. Mainly for debugging purpose.
 * @return {Array<ComponentCache>}
 */
Zuix.prototype.dumpCache = function() {
  return _componentCache;
};
/**
 * Dumps allocated component's contexts. Mainly for debugging purpose.
 * @return {Array<ComponentContext>}
 */
Zuix.prototype.dumpContexts = function() {
  return _contextRoot;
};


/** @package
  * @private */
Zuix.prototype.isDirectComponentElement = function($view, $el) {
  return isDirectComponentElement($view, $el);
};
/** @package
  * @private */
Zuix.prototype.resolveImplicitLoad = function(element) {
  // Resolve implicit loadable component
  const notLoad = util.dom.cssNot(_optionAttributes.zLoad).get();
  const notReady = util.dom.cssNot(_optionAttributes.zReady).get();
  const implicitDefault = _implicitLoadDefaultList.join(',')
      .split(',')
      .map(function(a) {
        return a + notLoad + notReady;
      }).join(',');
  z$(element)
      .find(implicitDefault)
      .each(function(i, el, $el) {
        $el.attr(_optionAttributes.zLoad, 'default')
            .attr(_optionAttributes.zLazy, 'false');
      });
};


/**
 * // TODO: document method
 *
 * @param {string} scriptCode Scriptlet Js code
 * @param {ZxQuery} $el Target ZxQuery-wrapped element
 * @param {ZxQuery} $view Component's view (ZxQuery)
 * @param {object|undefined} [data] Custom data
 * @return {object|undefined}
 */
Zuix.prototype.runScriptlet = function(scriptCode, $el, $view, data) {
  const ctx = zuix.context($view);
  if (ctx && ctx._refreshHandler) {
    return ctx._refreshHandler.runScriptlet.call($el.get(), $el, scriptCode, data);
  }
};
/**
 * // TODO: document method
 *
 * @param attributeName
 * @param $el
 * @param $view
 * @param contextData
 * @return {unknown[]}
 */
Zuix.prototype.parseAttributeArgs = function(attributeName, $el, $view, contextData) {
  return attributeName.split(':').map(function(a) {
    if (a.startsWith('{') && a.endsWith('}')) {
      return zuix.runScriptlet(util.hyphensToCamelCase(a), $el, $view, contextData);
    }
    return a;
  });
};

// member to expose utility class
// TODO: document this with JSDocs
/** @package
 * @private */
Zuix.prototype.utils = util;

/**
 * @return {Zuix}
 */
module.exports = function() {
  const zuix = new Zuix();
  if (window && document) {
    const globalStyle = '[z-view]{display:none;}[type="jscript"],[media*="#"]{display:none;}[z-include][z-ready=true].visible-on-ready,[z-load][z-ready=true].visible-on-ready{opacity:1}[z-include]:not([z-ready=true]).visible-on-ready,[z-load]:not([z-ready=true]).visible-on-ready{opacity:0;visibility:hidden}';
    zuix.$.appendCss(globalStyle, null, 'zuix-global');
    const refreshCallback = function() {
      zuix.componentize();
    };
    window.ControllerInstance = ControllerInstance;
//    window.addEventListener('DOMContentLoaded', refreshCallback);
    window.addEventListener('load', refreshCallback);
    window.addEventListener('resize', refreshCallback);
    window.addEventListener('pageshow', refreshCallback);
    if (document.readyState !== 'loading') {
      refreshCallback();
    }
  }
  // log messages monitor (one global listener)
  _log.monitor(function(level, args) {
    if (util.isFunction(zuix.monitor)) {
      zuix.monitor(level, Array.prototype.slice.call(args));
    }
  });
  return zuix;
};
