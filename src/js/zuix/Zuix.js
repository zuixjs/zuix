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
    require('../helpers/Util');
var z$ =
    require('../helpers/ZxQuery');
var TaskQueue =
    require('../helpers/TaskQueue');
var ComponentContext =
    require('./ComponentContext');
var ContextController =
    require('./ContextController');

/**
 * @const
 */
var ZUIX_FIELD_ATTRIBUTE = 'data-ui-field';

/**
 *  ZUIX, Javascript library for component-based development.
 *
 * @class Zuix
 * @constructor
 * @returns {Zuix}
 */
function Zuix() {
    return this;
}

/**
 * @private
 * @type {!Array<ComponentCache>}
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
var _hooksCallbacks = [];

/** @private */
var _globalHandlers = {};

/** @private */
var _lazyQueued = []; // Lazy loading - queued elements
/** @private */
var _lazyLoaders = []; // "data-ui-lazyload" elements

/** @private **/
var tasker = new TaskQueue(function (tq, eventPath, eventValue) {
    trigger(tq, eventPath, eventValue);
});

/**
 * Initializes a controller ```handler```.
 *
 * @private
 * @param handler {ContextControllerCallback}
 * @return {ContextControllerCallback}
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
 * Searches and returns elements with `data-ui-field`
 * attribute matching the given `fieldName`.
 *
 * @private
 * @param {!string} fieldName The class to check for.
 * @param {!Node} [container] Starting DOM element for this search (**default:** ```document```)
 * @return {ZxQuery}
 */
function field(fieldName, container) {
    // TODO: implement caching ?
    return z$(container).find('[' + ZUIX_FIELD_ATTRIBUTE + '="' + fieldName + '"]');
}

/**
 * Searches inside the given element ```element```
 * for all ```data-ui-include``` and ```data-ui-load```
 * directives and process them.
 *
 * @private
 * @param [element] {Node} Optional container to use as starting node for the search.
 */
function componentize(element) {
    // Throttle method
    if (tasker.requestLock(componentize)) {
        z$(element).find('[data-ui-load]:not([data-ui-loaded=true]),[data-ui-include]:not([data-ui-loaded=true])').each(function () {
            this.style.visibility = 'hidden';
            // override lazy loading if 'lazyload' is set to 'false' for the current element
            if (!lazyLoad() || this.getAttribute('data-ui-lazyload') == 'false') {
                loadInline(this);
                return true;
            }
            // defer element loading if lazy loading is enabled and the element is not in view
            var lazyContainer = z$.getClosest(this, '[data-ui-lazyload=true]');
            if (lazyContainer !== null) {
                if (_lazyLoaders.indexOf(lazyContainer) == -1) {
                    _lazyLoaders.push(lazyContainer);
                    z$(lazyContainer).on('scroll', function () {
                        componentize(lazyContainer);
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
    } else tasker.lockLater(componentize, function () {
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
    if (util.isNoU(options.view) && !v.isEmpty()) {
        options.view = element;
        options.viewDeferred = true;
    } else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty())
        options.container = element;

    var componentId = v.attr('data-ui-load');
    if (util.isNoU(componentId)) {
        // Static include should not have any controller
        componentId = v.attr('data-ui-include');
        v.attr('data-ui-component', componentId);
        // disable controller auto-loading
        if (util.isNoU(options.controller))
            options.controller = function () {
            }; // null
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
 * @private
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
function load(componentId, options) {
    // TODO: throw error on argument mismatch
    // TODO: prevent load loops when including recursively a component

    /** @type {ComponentContext} */
    var ctx = null;
    if (!util.isNoU(options)) {
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
        // empty context
        options = {};
        ctx = new ComponentContext(options, trigger);
    }

    // assign the given component (widget) to this context
    if (ctx.componentId != componentId) {
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

    if (util.isNoU(options.view)) {

        // pick it from cache if found
        var cachedComponent = getCachedComponent(ctx.componentId);
        if (cachedComponent !== null && util.isNoU(ctx.controller()))
            ctx.controller(cachedComponent.controller);

        if (cachedComponent !== null && cachedComponent.view != null)
            ctx.view(cachedComponent.view);
        else {
            /*
             // TODO: replace z$() with z$(options.container)
             var inlineView = z$().find('[data-ui-view="' + context.componentId + '"]');
             if (inlineView.length() > 0)
             context.view(inlineView.get(0).outerHTML);
             */
            // if not able to inherit the view from the base cachedComponent
            // or from an inline element, then load the view from web
            if (util.isNoU(ctx.view())) {
                // Load View
                tasker.queue('html:' + ctx.componentId, function () {
                    var task = this;

                    ctx.loadHtml({
                        success: function () {
                            if (options.css !== false)
                                ctx.loadCss({
                                    error: function (err) {
                                        console.log(err, ctx);
                                    },
                                    then: function () {
                                        loadController(ctx);
                                    }
                                });
                            else {
                                loadController(ctx);
                            }
                        },
                        error: function (err) {
                            console.log(err, ctx);
                            if (util.isFunction(options.error))
                                (ctx.error).call(ctx, err);
                        },
                        then: function () {
                            task.end();
                        }
                    });

                });
                // defer controller loading
                return ctx;
            }
        }
    } else {
        ctx.view(options.view);
    }
    loadController(ctx);
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
        if (!util.isNoU(context._c.view()))
            context._c.view().attr('data-ui-component', null);

        //context.unregisterEvents();
        // TODO: unregister events and local context behavior
        // TODO: detach view from parent if context.container is not null

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
 * @param {Node|Object} contextId
 * @return {ComponentContext}
 */
function context(contextId) {
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
        _hooksCallbacks[path].call(context, path, data);

    // ZUIX Componentizer is the last executed hook (built-in)
    if (path == 'view:process')
        componentize(data);
}

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @private
 * @param {boolean} [enable]
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
function lazyLoad(enable) {
    if (enable != null)
        _disableLazyLoading = !enable;
    return !_isCrawlerBotClient && !_disableLazyLoading;
}


/*********************** private members *************************/


/** @private */
function removeCachedComponent(componentId) {
    // TODO: removeCachedComponent
}

/***
 * @private
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

/***
 * @private
 * @param {ComponentContext} context
 */
function loadController(context) {
    if (typeof context.options().controller === 'undefined' && context.controller() === null) {
        if (util.isFunction(_globalHandlers[context.componentId])) {
            context.controller(_globalHandlers[context.componentId]);
            createComponent(context);
        } else
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
                            if (ih > 1 && ih < fn)
                                ctrlJs = ctrlJs.substring(ih + 11);
                            var ec = ctrlJs.indexOf('//<--controller');
                            if (ec > 0)
                                ctrlJs = ctrlJs.substring(0, ec);
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            console.log(e, ctrlJs, context);
                            if (util.isFunction(context.error))
                                (context.error).call(context, e);
                        }
                    },
                    error: function (err) {
                        console.log(err, context);
                        if (util.isFunction(context.error))
                            (context.error).call(context, err);
                    },
                    then: function () {
                        task.end();
                        createComponent(context);
                    }
                });
            });
    } else {
        createComponent(context);
    }
}

/***
 * @private
 * @param context {ComponentContext}
 */
function createComponent(context) {
    if (!util.isNoU(context.view())) {
        if (!context.options().viewDeferred) {
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
        }
        initComponent(context);
    } else {
        // TODO: report error
    }
}

/***
 * @private
 * @param {ComponentContext} context
 */
function initComponent(context) {
    if (util.isFunction(context.controller())) {
        /** @type {ContextController} */
        var c = context._c = new ContextController(context);

        if (!util.isNoU(c.view())) {
            c.view().attr('data-ui-component', c.componentId);
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
                if (context.options().css !== false)
                    context.loadCss();
                if (context.options().html !== false)
                    context.loadHtml();
            }

            c.view().css('visibility', '');
        }

        // TODO: review/improve life-cycle

        if (util.isFunction(c.create)) c.create();
        c.trigger('view:create');

        // TODO: is this to be deprecated?
        //if (util.isFunction(c.resume)) c.resume();
    }
    if (util.isFunction(context.ready))
        (context.ready).call(context);
}

/***
 * @private
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
        } catch (e) {
            // TODO: should trigger a global hook
            // eg. 'controller:error'
            console.log(this, e, javascriptCode);
        }
    }
    return instance;
}

// Browser Agent / Bot detection
/** @private */
/** @private */
var _isCrawlerBotClient = false, _disableLazyLoading = false;
if (navigator && navigator.userAgent)
    _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
        .test(navigator.userAgent);
if (_isCrawlerBotClient)
    console.log(navigator.userAgent, "is a bot, ignoring 'data-ui-lazyload' option.");


/******************* proto ********************/


/**
 * Initializes a controller ```handler```.
 *
 * @param handler {ContextControllerCallback}
 * @return {ContextControllerCallback}
 */
Zuix.prototype.controller = controller;
/**
 * Searches and returns elements with `data-ui-field`
 * attribute matching the given `fieldName`.
 *
 * @param {!string} fieldName The class to check for.
 * @param {!Node} [container] Starting DOM element for this search (**default:** ```document```)
 * @return {ZxQuery}
 */
Zuix.prototype.field = field;
/**
 * Searches inside the given element ```element```
 * for all ```data-ui-include``` and ```data-ui-load```
 * directives and process them.
 *
 * @param [element] {Node} Optional container to use as starting node for the search.
 * @return {Zuix}
 */
Zuix.prototype.componentize = function (element) {
    componentize(element);
    return this;
};
/**
 * Loads a component with the given options.
 *
 * @param {!string} componentId The id/name of the component we want to load.
 * @param {ContextOptions} [options] context options used to initialize the loaded component
 * @return {ComponentContext}
 */
Zuix.prototype.load = load;
/**
 * Unload and dispose the component.
 *
 * @param context {ComponentContext}
 * @return {Zuix}
 */
Zuix.prototype.unload = function (context) {
    unload(context);
    return this;
};
/**
 * TODO: desc
 *
 * @private
 * @param {Node|Object} contextId
 * @return {ComponentContext}
 */
Zuix.prototype.context = context;
/**
 * TODO: desc
 *
 * @param path
 * @param handler
 * @return {Zuix}
 */
Zuix.prototype.hook = function (path, handler) {
    hook(path, handler);
    return this;
};
/**
 * TODO: desc
 *
 * @param context
 * @param path
 * @param data
 * @return {Zuix}
 */
Zuix.prototype.trigger = function (context, path, data) {
    trigger(context, path, data);
    return this;
};
/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @param {boolean} [enable]
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Zuix.prototype.lazyLoad = lazyLoad;

Zuix.prototype.$ = z$;
Zuix.prototype.TaskQueue = TaskQueue;
Zuix.prototype.ZxQuery = z$.ZxQuery;

Zuix.prototype.dumpCache = function () {
    console.log("ZUIX", "Component Cache", _componentCache);
};
Zuix.prototype.dumpContexts = function () {
    console.log("ZUIX", "Loaded Component Instances", _contextRoot);
};

// TODO: add zuix.options to configure stuff like
// TODO: the css/html/js lookup base path (each individually own prop)

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function (root) {
    return new Zuix();
};


