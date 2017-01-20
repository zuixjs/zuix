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
var TaskQueue =
    require('../helpers/TaskQueue');
var z$ =
    require('../helpers/ZxQuery');

/**
 * @class Zuix
 * @constructor
 */
function Zuix() {

    var ComponentContext = require('./ComponentContext');
    var ContextController = require('./ContextController');

    var tasker = new TaskQueue(function(tq, eventPath, eventValue){
        triggerHook(tq, eventPath, eventValue);
    });

    /**
     * @protected
     * @type {!Array<ComponentCache>}
     */
    var _componentCache = [];

    /**
     * @protected
     * @type {!Array<ComponentContext>}
     */
    var _contextRoot = [];


    // TODO: implement Config object for zuix
    /** @protected
     * @const
     */
    var ZUIX_FIELD_ATTRIBUTE = 'data-ui-field';


    /** @protected */
    var _contextSeqNum = 0;

    /** @protected */
    var _lazyQueued = []; // Lazy loading - queued elements
    /** @protected */
    var _lazyLoaders = []; // "data-ui-lazyload" elements


    /**
     * TODO: describe
     *
     * @param callback {ContextControllerCallback}
     * @returns {ContextControllerCallback}
     */
    function controller(callback) {
        return callback;
    }

    /**
     * Returns Node with `ZUIX_FIELD_ATTRIBUTE` attribute matching `fieldName` .
     *
     * @param {!string} fieldName The class to check for.
     * @param {!Node} [container] Starting DOM element for this search.
     * @returns {Node}
     */
    function field(fieldName, container) {
        return z$(container).find('[' + ZUIX_FIELD_ATTRIBUTE + '="' + fieldName + '"]').get(0);
    }

    /**
     * TODO: describe
     *
     * @param [element] {Node}
     */
    function componentize(element) {
        // Throttle method
        if (tasker.requestLock(componentize)) {
            z$(element).find('[data-ui-load]:not([data-ui-loaded=true]),[data-ui-include]:not([data-ui-loaded=true])').each(function () {
                // override lazy loading if 'lazyload' is set to 'false' for the current element
                if (!lazyLoadEnabled() || this.getAttribute('data-ui-lazyload') == 'false') {
                    loadInline(this);
                    return true;
                }
                // defer element loading if lazy loading is enabled and the element is not in view
                var lazyLoad = z$.getClosest(this, '[data-ui-lazyload=true]');
                if (lazyLoad !== null) {
                    if (_lazyLoaders.indexOf(lazyLoad) == -1) {
                        _lazyLoaders.push(lazyLoad);
                        z$(lazyLoad).on('scroll', function () {
                            componentize(lazyLoad);
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
        } else tasker.lockLater(componentize, function() {
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
        if (util.isNoU(options.view) && !v.isEmpty())
            options.view = element;
        else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty())
            options.container = element;

        var componentId = v.attr('data-ui-load');
        if (util.isNoU(componentId)) {
            // Static include should not have any controller
            componentId = v.attr('data-ui-include');
            v.attr('data-ui-component', componentId);
            // disable controller auto-loading
            if (util.isNoU(options.controller))
                options.controller = function(){}; // null
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
     * @param {!string} componentId The id/name of the component we want to load.
     * @param {ContextOptions} [options] context options used to initialize the loaded component
     * @returns {ComponentContext}
     */
    function load(componentId, options) {
        // TODO: throw error on argument mismatch
        // TODO: prevent load loops when including recursively a component

        /** @type {ComponentContext} */
        var context = null;
        if (!util.isNoU(options)) {
            // check if context has its unique id assigned
            if (!util.isNoU(options.contextId)) {
                // if it does, try to pick it from allocated contexts list
                context = getContext(options.contextId);
                if (context !== null) {
                    context.options(options);
                } else {
                    // if no context is already allocated
                    // with that id, then add a new one
                    context = createContext(options);
                }
            } else {
                if (options === false)
                    options = {};
                // generate contextId (this is a bit buggy, but it's quick)
                options.contextId = 'zuix-ctx-' + (++_contextSeqNum);
                context = createContext(options);
            }
        } else {
            // empty context
            options = {};
            context = new ComponentContext(options, triggerHook);
        }

        // assign the given component (widget) to this context
        if (context.componentId != componentId) {
            context.componentId = componentId;
            /*
             TODO: to be fixed
             if (!util.isNoU(context.view())) {
             // TODO: implement this code in a context.detach() method
             //context.controller().pause()
             context.view().detach();
             context.view(null);
             }*/
        }

        // pick it from cache if found
        var cachedComponent = getCachedComponent(context.componentId);
        if (cachedComponent !== null && util.isNoU(context.controller()))
            context.controller(cachedComponent.controller);

        if (util.isFunction(options.ready))
            context.ready = options.ready;
        if (util.isFunction(options.error))
            context.error = options.error;

        if (util.isNoU(options.view)) {

            if (cachedComponent !== null) {
                context.view(cachedComponent.view);
            } else {
                // TODO: replace z$() with z$(options.container)
                var inlineView = z$().find('[data-ui-view="' + context.componentId + '"]');
                if (inlineView.length() > 0)
                    context.view(inlineView.get(0));
            }

            // if not able to inherit the view from the base cachedComponent
            // or from an inline element, then load the view from web
            if (util.isNoU(context.view())) {
                // Load View
                tasker.queue('html:' + context.componentId, function () {
                    var task = this;
                    z$.ajax({
                        url: context.componentId + ".html?" + new Date().getTime(),
                        success: function (viewHtml) {
                            context.view(viewHtml);
                            task.end();
                            // View CSS loading
                            if (options.css !== false)
                                loadViewCss(context, function () {
                                    // Controller loading
                                    loadController(context);
                                });
                            else loadController(context);
                        },
                        error: function (err) {
                            task.end();
                            console.log(err, context);
                            if (util.isFunction(options.error))
                                (context.error).call(context, err);
                        }
                    });

                });
                // defer controller loading
                return context;
            }
        } else {
            context.view(options.view);
        }
        loadController(context);
        return context;
    }

    /**
     *
     * @param context {ComponentContext}
     */
    function unload(context) {
        if (!util.isNoU(context) && !util.isNoU(context._c)) {
            if (!util.isNoU(context._c.view()))
                context._c.view().removeAttribute('data-ui-component');

            //context.unregisterEvents();
            // TODO: unregister events and local context behavior
            // TODO: detach view from parent if context.container is not null

            if (util.isFunction(context._c.destroy))
                context._c.destroy();
        }
    }

    /***
     *
     * @param {Node|Object} contextId
     * @returns {ComponentContext}
     */
    function getContext(contextId) {
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

    function createContext(options) {
        var context = new ComponentContext(options, triggerHook);
        _contextRoot.push(context);
        return context;
    }

    function removeContext(contextId) {
        // TODO: removeContext
    }

    function removeCachedComponent(componentId) {
        // TODO: removeCachedComponent
    }

    /***
     *
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


    function loadViewCss(context, callback) {
        // CSS is optional, so no error is thrown on load error
        tasker.queue('css:' + context.componentId, function () {
            var task = this;
            context.loadCss(function () {
               task.end();
            });
        });
    }

    /***
     *
     * @param {ComponentContext} context
     */
    function loadController(context) {
        if (typeof context.options().controller === 'undefined' && context.controller() === null) {
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
                            if (ih > 1 && il < fn)
                                ctrlJs = ctrlJs.substring(ih + 11);
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            console.log(e, ctrlJs, context);
                            if (util.isFunction(context.error))
                                (context.error).call(context, e);
                            return;
                        }
                        createComponent(context);
                        task.end();
                    },
                    error: function (err) {
                        task.end();
                        createComponent(context);
                        console.log(err, context);
                        if (util.isFunction(context.error))
                            (context.error).call(context, err);
                    }
                });
            });
        } else {
            createComponent(context);
        }
    }

    /***
     *
     * @param context {ComponentContext}
     */
    function createComponent(context) {
        if (!util.isNoU(context.view())) {
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
            initComponent(context);
        } else {
            // TODO: report error
        }
    }

    /***
     *
     * @param {ComponentContext} context
     */
    function initComponent(context) {
        if (util.isFunction(context.controller())) {
            /** @type {ContextController} */
            var c = context._c = new ContextController(context);

            if (!util.isNoU(c.view()))
                c.view().setAttribute('data-ui-component', c.componentId);

            // TODO: review/improve life-cycle

            if (util.isFunction(c.create)) c.create();
            c.trigger('view:create');

            //if (util.isFunction(c.bind)) c.bind();
            context.updateModelView();
            //if (util.isFunction(c.refresh)) c.refresh();

            if (util.isFunction(c.resume)) c.resume();
        }
        if (util.isFunction(context.ready))
            (context.ready).call(context);
    }

    /***
     *
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
            } catch(e) {
                // TODO: should trigger a global hook
                // eg. 'controller:error'
                console.log(this, e, javascriptCode);
            }
        }
        return instance;
    }


    // TODO: following code to be sorted/re-arranged


    function triggerHook(context, path, data) {

        // TODO: call all registered callback
        if (util.isFunction(_hooksCallbacks[path]))
            _hooksCallbacks[path].call(context, path, data);

        // ZUIX Componentizer is the last executed hook (built-in)
        if (path == 'view:process')
            componentize(data);

    }

    var _hooksCallbacks = [];

    function hooks(path, handler) {
        if (util.isNoU(handler))
            return _hooksCallbacks[path];
        _hooksCallbacks[path] = handler;
        return this;
    }

    function lazyLoadEnabled(enable) {
        if (enable != null)
            _disableLazyLoading = !enable;
        return !_isCrawlerBotClient && !_disableLazyLoading;
    }

    // Browser Agent / Bot detection
    var _isCrawlerBotClient = false, _disableLazyLoading = false;
    if (navigator && navigator.userAgent)
        _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
            .test(navigator.userAgent);
    if (_isCrawlerBotClient)
        console.log(navigator.userAgent, "is a bot, ignoring 'data-ui-lazyload' option.");

    // Public ```zuix``` interface

    /** @global */
    var zuix = {

        /* Component loading methods */
        controller: controller,
        load: load,
        unload: unload,
        componentize: componentize,
        context: getContext,
        lazyLoad: lazyLoadEnabled,

        /* Zuix hooks */
        hook: function (p, v) {
            hooks(p, v);
            return this;
        },

        /* Utility methods */
        $: z$,
        field: field,

        /* Access to classes proto */
        TaskQueue: TaskQueue,
        ZxQuery: z$.ZxQuery,

        /* Dev utility methods */
        dumpCache: function () {
            console.log("ZUIX", "Component Cache", _componentCache);
        },
        dumpContexts: function () {
            console.log("ZUIX", "Loaded Component Instances", _contextRoot);
        }

    };

    // TODO: add zuix.options to configure stuff like
    // TODO: the css/html/js lookup base path (each individually own prop)

    return zuix;
}

module.exports = Zuix;