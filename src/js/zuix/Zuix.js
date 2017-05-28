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

var _log =
    require('../helpers/Logger')('Zuix.js');
var util =
    require('../helpers/Util');
var z$ =
    require('../helpers/ZxQuery');
var TaskQueue =
    require('../helpers/TaskQueue');
var ComponentContext =
    require('./ComponentContext');
var ContextController =
    require('./ContextController');
var _componentizer =
    require('./Componentizer')();

/**
 * @const
 */
var ZUIX_FIELD_ATTRIBUTE = 'data-ui-field';

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
var resourceLoadTask = [];

/** @private */
var _hooksCallbacks = [];

/** @private */
var _globalHandlers = {};

/** @private */
var _enableHttpCaching = true;

/** @private **/
var _componentTask = [];
/** @private **/
var taskQueue = function(tid) {
    if (util.isNoU(_componentTask[tid])) {
        _componentTask[tid] = new TaskQueue(function (tq, eventPath, eventValue) {
            trigger(tq, eventPath, eventValue);
        });
    }
    return _componentTask[tid];
};
/** @private **/
var _pendingResourceTask = {};

/**
 *  ZUIX, Javascript library for component-based development.
 *
 * @class Zuix
 * @constructor
 * @returns {Zuix}
 */
function Zuix() {
    _componentizer.setHost(this);
    /**
     * @private
     * @type {!Array.<ZxQuery>}
     **/
    this._fieldCache = [];
    return this;
}

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
 * @param {!Element|!ZxQuery} [container] Starting DOM element for this search (**default:** *document*)
 * @param {object} [context] The context
 * @return {ZxQuery}
 */
function field(fieldName, container, context) {
    if (util.isNoU(context))
        context = this;
    if (context._fieldCache == null)
        context._fieldCache = {};

    var el = null;
    if (typeof context._fieldCache[fieldName] === 'undefined') {
        el = z$(container).find('[' + ZUIX_FIELD_ATTRIBUTE + '="' + fieldName + '"]');
        if (el != null)
            context._fieldCache[fieldName] = el;
    } else el = context._fieldCache[fieldName];

    return el;
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
            if (options === false)
                options = {};
            // generate contextId (this is a bit buggy, but it's quick)
            options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
            ctx = createContext(options);
        }
    } else {
        // TODO: check if this case is of any use
        // empty context
        options = {};
        ctx = new ComponentContext(options, trigger);
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

    if (util.isFunction(options.ready))
        ctx.ready = options.ready;
    if (util.isFunction(options.error))
        ctx.error = options.error;

    // if component is lazy-loaded, then defer associated resources loading
    if (options.lazyLoad)
        return ctx;

    if (resourceLoadTask[componentId] == null) {
        resourceLoadTask[componentId] = true;
        return loadResources(ctx, options);
    } else {
        if (_pendingResourceTask[componentId] == null)
            _pendingResourceTask[componentId] = [];
        _pendingResourceTask[componentId].push({ c: ctx, o: options});
    }

    return ctx; //loadResources(ctx, options);
}

/** @private */
function loadResources(ctx, options) {
    // pick it from cache if found
    var cachedComponent = getCachedComponent(ctx.componentId);
    if (cachedComponent !== null && options.controller == null && ctx.controller() == null) {
        ctx.controller(cachedComponent.controller);
        _log.t(ctx.componentId+':js', 'component:cached:js');
    }

    if (util.isNoU(options.view)) {

        if (cachedComponent !== null && cachedComponent.view != null) {
            ctx.view(cachedComponent.view);
            _log.t(ctx.componentId+':html', 'component:cached:html');
            /*
             TODO: CSS caching, to be tested.
             */
             if (cachedComponent.view != null && util.isNoU(options.css)) {
                 options.css = false;
                 if (!cachedComponent.css_applied) {
                     cachedComponent.css_applied = true;
                     ctx.style(cachedComponent.css);
                     _log.t(ctx.componentId+':css', 'component:cached:css');
                 }
             }
        }

        // if not able to inherit the view from the base cachedComponent
        // or from an inline element, then load the view from web
        if (util.isNoU(ctx.view())) {
            // Load View
            taskQueue('resource-loader').queue(ctx.componentId+':html', function () {
                resourceLoadTask[ctx.componentId] = this;

                ctx.loadHtml({
                    cext: options.cext,
                    caching: _enableHttpCaching,
                    success: function (html) {
                        if (cachedComponent == null)
                            cachedComponent = cacheComponent(ctx);
                        cachedComponent.view = html;
                        delete cachedComponent.controller;
                        if (options.css !== false) {
                            resourceLoadTask[ctx.componentId].step(ctx.componentId+':css');
                            ctx.loadCss({
                                caching: _enableHttpCaching,
                                success: function (css) {
                                    cachedComponent.css = css;
                                },
                                error: function (err) {
                                    _log.e(err, ctx);
                                },
                                then: function () {
                                    loadController(ctx, resourceLoadTask[ctx.componentId]);
                                }
                            });
                        } else {
                            loadController(ctx, resourceLoadTask[ctx.componentId]);
                        }
                    },
                    error: function (err) {
                        _log.e(err, ctx);
                        if (util.isFunction(options.error))
                            (ctx.error).call(ctx, err);
                    }
                });

            }, options.priority);
            // defer controller loading
            return ctx;
        }
    } else {
        ctx.view(options.view);
    }
    if (ctx.controller() == null) {
        taskQueue('resource-loader').queue(ctx.componentId + ':js', function () {
            resourceLoadTask[ctx.componentId] = this;
            loadController(ctx, resourceLoadTask[ctx.componentId]);
        }, _contextRoot.length);
    } else loadController(ctx);

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
        if (!util.isNoU(context._c.view())) {
            context._c.view().attr('data-ui-component', null);
            // un-register event handlers associated to the view
            context._c.view().reset();
            // un-register event handlers for all cached fields accessed through cp.field(...) method
            if (!util.isNoU(context._c._fieldCache)) {
                z$.each(context._c._fieldCache, function (k, v) {
                    v.reset();
                });
            }
            // detach from parent
            context._c.view().detach();
        }
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
//    if (path == 'view:process')
//        _componentizer.componentize(data);
}

/**
 * Enable/Disable HTTP caching
 *
 * @private
 * @param {boolean} [enable]
 * @return {boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
function httpCaching(enable) {
    if (enable != null)
        _enableHttpCaching = enable;
    return _enableHttpCaching;
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
 * @param {TaskQueue} [task]
 */
function loadController(context, task) {
    if (typeof context.options().controller === 'undefined' && context.controller() === null) {
        _log.d(context.componentId, 'controller:load');
        if (!util.isNoU(task))
            task.step(context.componentId+':js');
        if (util.isFunction(_globalHandlers[context.componentId])) {
            context.controller(_globalHandlers[context.componentId]);
            createComponent(context, task);
        } else {
            var job = function(t) {
                z$.ajax({
                    url: context.componentId + ".js" + (_enableHttpCaching ? '' : '?'+new Date().getTime()),
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
                            ctrlJs += '\n//# sourceURL="'+context.componentId + '.js"\n';
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            _log.e(new Error(), e, ctrlJs, context);
                            if (util.isFunction(context.error))
                                (context.error).call(context, e);
                        }
                    },
                    error: function (err) {
                        _log.e(err, new Error(), context);
                        if (util.isFunction(context.error))
                            (context.error).call(context, err);
                    },
                    then: function () {
                        createComponent(context, t);
                    }
                });
            };
            if (util.isNoU(task)) {
                taskQueue('resource-loader').queue(context.componentId+':js', function () {
                    job(resourceLoadTask[context.componentId] = this);
                }, context.options().priority);
            } else job(task);
        }
    } else {
        createComponent(context, task);
    }
}

function cacheComponent(context) {
    var html = context.view().innerHTML; //(context.view() === context.container() ? context.view().innerHTML : context.view().outerHTML);
    var c = z$.wrapElement('div', html);
    var cached = {
        componentId: context.componentId,
        view: c.innerHTML,
        css: context._css,
        controller: context.controller()
    };
    _componentCache.push(cached);
    _log.t(context.componentId, 'bundle:added');
    return cached;
}

/***
 * @private
 * @param {ComponentContext} context
 * @param {TaskQueue} [task]
 */
function createComponent(context, task) {
    resourceLoadTask[context.componentId] = null;
    if (!util.isNoU(context.view())) {
        var cached = getCachedComponent(context.componentId);
        if (!context.options().viewDeferred)
            if (cached === null)
                cached = cacheComponent(context);
            else if (cached.controller == null)
                cached.controller = context.controller();
        else
            _log.w(context.componentId, 'component:deferred:load');

        if (task != null)
            task.callback(function () {
                _log.d(context.componentId, 'controller:create:deferred');
                initController(context._c);
            });

        _log.d(context.componentId, 'component:initializing');
        if (util.isFunction(context.controller())) {
            // TODO: should use 'require' instead of 'new Controller' ... ?
            /** @type {ContextController} */
            var c = context._c = new ContextController(context);
            c.log = require('../helpers/Logger')(context.contextId);
            if (typeof c.init === 'function')
                c.init();
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

                    // TODO: check if this case is still required, otherwise remove it.
                    if (cached === null) {
                        cached = {
                            componentId: context.componentId,
                            controller: context.controller()
                        };
                        _componentCache.push(cached);
                        _log.t(context.componentId, 'bundle:added');
                        _log.d(context.componentId, 'component:deferred:load');
                    }

                    var pending = -1;
                    if (context.options().css !== false)
                        if (cached.css == null) {
                            if (pending == -1) pending = 0; pending++;
                            context.loadCss({
                                caching: _enableHttpCaching,
                                success: function(css) {
                                    // TODO: this is a work-around for 'componentize' overlapping issue
                                    if (cached.css == null)
                                        cached.css = css;
                                    _log.d(context.componentId, 'component:deferred:css', pending);
                                },
                                then: function () {
                                    if (--pending === 0 && task != null)
                                        task.end();
                                }
                            });
                        } else context.style(cached.css);
                    if (context.options().html !== false)
                        if (cached.view == null) {
                            if (pending == -1) pending = 0; pending++;
                            context.loadHtml({
                                cext: context.options().cext,
                                caching: _enableHttpCaching,
                                success: function(html) {
                                    // TODO: this is a work-around for 'componentize' overlapping issue
                                    if (cached.view == null)
                                        cached.view = html;
                                    _log.d(context.componentId, 'component:deferred:html', pending);
                                },
                                then: function () {
                                    if (--pending === 0 && task != null)
                                        task.end();
                                }
                            });
                        } else context.view(cached.view);
                    if (pending == -1 && task != null)
                        task.end();
                } else if (task != null) task.end();
            }

            if (task == null) {
                _log.d(context.componentId, 'controller:create');
                initController(c);
            }

        } else {
            _log.w(context.componentId, 'component:controller:undefined');
        }

    } else {
        // TODO: report error
        _log.e(context.componentId, 'component:view:undefined');
    }
}

/***
 * @private
 * @param {ContextController} c
 */
function initController(c) {

    _log.t(c.context.componentId, 'controller:init', 'timer:init:start');

    // bind {ContextController}.field method
    c.field = function(fieldName) {
        var el = field(fieldName, c.view(), c);
        el.on = function (eventPath, eventHandler, eventData, isHook) {
            if (typeof eventHandler === 'string') {
                var eh = eventHandler;
                eventHandler = function () { c.trigger(eh, eventData, isHook); }
            }
            return z$.ZxQuery.prototype.on.call(this, eventPath, eventHandler);
        };
        return el;
    };

    if (util.isFunction(c.create)) c.create();
    c.trigger('view:create');

    if (util.isFunction(c.context.ready))
        (c.context.ready).call(c.context, c.context);

    c.trigger('component:ready', c.view(), true);

    _log.t(c.context.componentId, 'controller:init', 'timer:init:stop');
    _log.i(c.context.componentId, 'component:loaded', c.context.contextId);

    if (_pendingResourceTask[c.context.componentId] != null) {
        var pendingRequests = _pendingResourceTask[c.context.componentId];
        _pendingResourceTask[c.context.componentId] = null;
        var ctx = null;
        while (pendingRequests != null && (ctx = pendingRequests.shift()) != null)
            loadResources(ctx.c, ctx.o);
    }

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
            _log.e(this, e, javascriptCode);
        }
    }
    return instance;
}

function replaceCache(c) {
    _componentCache = c;
}

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
    _componentizer.componentize(element);
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
 * Create an instance of the component `componentId`
 * loading it asynchronously and immediately returning its
 * context object with associated container element (detached).
 *
 * @param {string} componentId Identifier name of the component to create.
 * @param {ContextOptions|undefined} [options] Options.
 * @return {ComponentContext}
 */
Zuix.prototype.createComponent = function(componentId, options) {
    if (options == null) options = {};
    options.container = document.createElement('div');
    return load(componentId, options);
};
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
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {Zuix|boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = function (enable, threshold) {
    if (enable != null)
        _componentizer.lazyLoad(enable, threshold);
    else
        return _componentizer.lazyLoad();
    return this;
};
/**
 * Enable/Disable HTTP caching
 *
 * @param {boolean} [enable]
 * @return {Zuix|boolean} *true* if HTTP caching is enabled, *false* otherwise.
 */
Zuix.prototype.httpCaching = function(enable) {
    if (enable != null)
        httpCaching(enable);
    else
        return httpCaching();
    return this;
};

/**
 * Gets/Sets the components data bundle.
 *
 * @param {Array.<{ view, css, controller }>} bundleData A bundle object holding in memory all components data (cache).
 * @param {function} [callback]
 * @return {Zuix|Array.<{ view, css, controller }>}
 */
Zuix.prototype.bundle = function(bundleData, callback) {
    if (util.isNoU(bundleData))
        return _componentCache;
    else if (bundleData && typeof bundleData === 'boolean') {
        _log.t('bundle:start');
        var ll = _componentizer.lazyLoad();
        _componentizer.lazyLoad(false);
        _componentizer.componentize();
        if (typeof callback === 'function') {
            var waitLoop = function(w) {
                setTimeout(function () {
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
        for (var c = 0; c < bundleData.length; c++) {
            if (bundleData[c].css_applied)
                delete bundleData[c].css_applied;
        }
        _componentCache = bundleData;
    }
    return this;
};

Zuix.prototype.$ = z$;
Zuix.prototype.TaskQueue = TaskQueue;
Zuix.prototype.ZxQuery = z$.ZxQuery;

Zuix.prototype.dumpCache = function () {
    return _componentCache;
};
Zuix.prototype.dumpContexts = function () {
    return _contextRoot;
};

// TODO: add zuix.options to configure stuff like
// TODO: the css/html/js lookup base path (each individually own prop)

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function (root) {
    var zuix = new Zuix();
    if (document.readyState != 'loading'){
        zuix.componentize();
    } else {
        document.addEventListener('DOMContentLoaded', function () {
            zuix.componentize();
        });
    }
    // log messages monitor (one global listener)
    _log.monitor(function (level, args) {
        if (util.isFunction(zuix.monitor))
            zuix.monitor(level, Array.prototype.slice.call(args));
    });
    return zuix;
};


