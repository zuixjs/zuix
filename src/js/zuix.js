/**
 * @license
 * Copyright 2015-2016 G-Labs. All Rights Reserved.
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
 * Javascript UI components enhancer. A lite MVC library.
 * Find more details about zuix here:
 *   https://github.com/genielabs/zuix-mvc-js
 *
 * @author Generoso Martello <generoso@martello.com>
 */

/** @class */
(function Zuix(scope) {
    "use strict";

    /**
     * Component Cache object.
     * @typedef {{
     *      componentId: string The id of the cached component,
     *      view: ContextView The view,
     *      controller: ContextControllerCallback The function of the controller controller.
     * }} ComponentCache
     */

    /**
     * @protected
     * @type {!Array<ComponentCache>}
     */
    var _componentCache = [];

    /**
     * Describes the types of objects used in a ComponentContext.
     *
     * @callback ContextReadyCallback
     * @param {ComponentContext} context
     *
     * @callback ContextErrorCallback
     * @param {ComponentContext} context
     * @param {Object} error
     *
     * @typedef {{
     *    data: Object,
     *    locales: Object
     * }} ContextModel
     *
     * @typedef {jQuery|HTMLElement|string} ContextView
     *
     * @typedef {jQuery|HTMLElement|string} ViewContainer
     *
     * @typedef {{
     *    cid: Object,
     *    container: jQuery,
     *    componentId: string,
     *    model: ContextModel,
     *    view: ContextView,
     *    controller: ContextControllerCallback,
     *    auto: Object,
     *    ready: ContextReadyCallback,
     *    error: ContextErrorCallback
     * }} ContextOptions
     */

    /**
     * @protected
     * @type {!Array<ComponentContext>}
     */
    var _contextRoot = [];

    /***
     * TODO: describe this class...
     *
     * @param {ContextOptions} options The context options.
     * @returns {ComponentContext} The component context instance.
     * @constructor
     */
    function ComponentContext(options) {
        var self = this;
        this.options = options;
        this.cid = util.isNoU(options) || util.isNoU(options.cid) ? null : options.cid;
        this.componentId = util.isNoU(options) || util.isNoU(options.componentId) ? null : options.componentId;
        /**
         * @event ComponentContext#ready
         * @param {ComponentContext} context The component context instance.
         */
        this.ready = null;
        /**
         * @event ComponentContext#error
         * @param {ComponentContext} context The component context instance.
         * @param {Object} error The error object
         */
        this.error = null;

        /** @protected */
        this._container = util.isNoU(options) || util.isNoU(options.container) ? null : options.container;
        /** @protected */
        this._model = util.isNoU(options) || util.isNoU(options.model) ? null : options.model;
        /** @protected */
        this._view = util.isNoU(options) || util.isNoU(options.view) ? null : options.view;
        /**
         * @protected
         * @type {ContextController}
         */
        this._controller = util.isNoU(options) || util.isNoU(options.controller) ? null : options.controller;
        /** @protected */
        this._c = null;
        this.invoke = function(a,b) {
            // TODO: throw error if _c (controller instance) is not yet ready
            return self._c.invoke(a,b)
        };
        this.on = function(a,b) {
            // TODO: throw error if _view (view) is not yet ready
            return self.view().on(a,b);
        };
        /** @type {function} */
        this.expose = null;
        return this;

    }

    /***
     *
     * @param {ContextModel} [model]
     * @returns {ComponentContext|Object}
     */
    ComponentContext.prototype.model = function (model) {
        if (util.isNoU(model)) return this._model;
        else this._model = model;
        return this;
    };
    /***
     *
     * @param {ContextView} [view]
     * @returns {ComponentContext|ContextView}
     */
    ComponentContext.prototype.view = function (view) {
        if (typeof view === 'undefined') return this._view;
        if (typeof view === 'string') {
            if (this.options.markdown === true && !util.isNoU(showdown))
                view = new showdown.Converter().makeHtml(view);
            this._view = $('<div/>').append(view);
            // TODO: move this code to "zuix.preprocessors"
            this._view.find('code').each(function(i, block) {
                $(block).addClass('language-javascript');
                //hljs.highlightBlock(block);
                Prism.highlightElement(block);
            });
        } else this._view = view;
        return this;
    };
    /***
     *
     * @param {ContextControllerCallback} [controller]
     * @returns {ComponentContext|ContextControllerCallback}
     */
    ComponentContext.prototype.controller = function (controller) {
        if (util.isNoU(controller)) return this._controller;
        else this._controller = controller;
        return this;
    };
    /***
     *
     * @param {ViewContainer} [container]
     * @returns {ComponentContext|jQuery}
     */
    ComponentContext.prototype.container = function (container) {
        if (util.isNoU(container)) return this._container;
        else this._container = $(container);
        return this;
    };

    /**
     * TODO: complete JSDoc
     *
     * @returns {ContextController}
     * @constructor
     */
    function ContextController() {
        var self = this;
        /** @protected */
        this._fieldCache = [];
        /** @type {string} */
        this.componentId = {};
        /** @type {ContextView} */
        this.view = {};
        /** @type {ContextModel} */
        this.model = {};
        /** @type {function} */
        this.create = null;
        /** @type {function} */
        this.resume = null;
        /** @type {function} */
        this.pause = null;
        /** @type {function} */
        this.destroy = null;
        /** @type {function} */
        this.refresh = null;
        /** @type {function} */
        this.event = null; // UI event stream handler (eventPath,eventValue)
        /** @type {function} */
        this.trigger = function(eventPath,eventData){
            // TODO: ...
            self.view.trigger(eventPath,eventData);
        };
        /** @type {function} */
        this.on = function(eventPath,handler_fn){
            // TODO: implement automatic event unbinding (off) in super().destroy()
            self.view.on(eventPath, handler_fn);
        };
        /** @type {function} */
        this.api = null; // handler for component API (command,options)
        /** @type {function} */
        this.invoke = function(command,options){
            // used by consumers to invoke a component API command
            if (util.isFunction(self.api))
                self.api(command,options);
        };
        /** @type {function} */
        this.expose = null;
        return this;
    }

    /***
     * Search and cache this view elements.
     *
     * @param {!string} field Name of the `data-ui-field` to search
     * @param {boolean} [globalSearch] Search a generic field attribute
     * @returns {Element|jQuery}
     */
    ContextController.prototype.field = function (field, globalSearch) {
        var f = globalSearch ? '@' + field : field;
        var el = null;
        if (typeof this._fieldCache[f] === 'undefined') {
            el = globalSearch ? $(field) : this.view.find('[data-ui-field=' + field + ']');
            if (el.length)
                this._fieldCache[f] = el;
        } else {
            el = this._fieldCache[f];
        }
        return el;
    };
    ContextController.prototype.clearCache = function () {
        this._fieldCache.length = 0;
    };



    // TODO: implement Config object for zuix
    /** @protected
     * @const
     */
    var _zuixFieldAttribute = 'data-ui-field';
    // work-around for lint eval error
    /** @protected
     * @const
     */
    var _eval = eval;
    //
    /** @protected */
    var _contextSeqNum = 0;



    /**
     * TODO: describe
     *
     * @callback ContextControllerCallback
     * @param {ContextController} ctx
     */
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
     * Returns jQuery elements with `_zuixFieldAttribute` attribute matching `fieldName` .
     *
     * @param {!string} fieldName The class to check for.
     * @param {!Element|!jQuery|!HTMLElement|!HTMLDocument} [container] Starting DOM element for this search.
     * @returns {jQuery}
     */
    function field(fieldName, container) {
        if (util.isNoU(container))
            container = document;
        return $(container).find('[' + _zuixFieldAttribute + '="' + fieldName + '"]');
    }

    /**
     * TODO: describe
     *
     * @param resource
     * @param container
     * @param callback
     */
    function include(resource, container, callback) {
        if (container === null) {
            var fieldName = 'zuix-include-'+(++_contextSeqNum);
            document.write('<div data-ui-include="'+(resource)+'" data-ui-field="'+fieldName+'" />');
            container = zuix.field(fieldName);
        }
        // TODO: add js markdown support
        load(resource, {
            auto: false,
            markdown: true,
            ready: function(/** @type {ComponentContext} */ ctx) {
                $(container).append(ctx.view().html());
                if (util.isFunction(callback))
                    callback(ctx);
            },
            error: function(ctx, err) {
                // TODO: report error
                $(container).append($('<p>').append('ERROR zuix.include'));
                $(container).append($('<p>').append(data));
                if (util.isFunction(callback))
                    callback(ctx, err);
            }
        });
    }

    /**
     * Load a component context with the given options.
     *
     * @param {!string} componentId The id/name of the component we want to load.
     * @param {ContextOptions} [options] context options used to initialize the component context
     * @returns {ComponentContext}
     */
    function load(componentId, options) {

        // TODO: throw error on argument mismatch

        /** @type {ComponentContext} */
        var context = null;
        if (!util.isNoU(options)) {
            // check if context has its unique id assigned
            if (!util.isNoU(options.cid)) {
                var cachedContext = getContext(options.cid);
                if (cachedContext !== null) {
                    if (!util.isNoU(options.view))
                        cachedContext.view(options.view);
                    if (!util.isNoU(options.model))
                        cachedContext.model(options.model);
                    if (!util.isNoU(options.controller))
                        cachedContext.controller(options.controller);
                    context = cachedContext;
                } else {
                    context = new ComponentContext(options);
                    _contextRoot.push(context);
                }
            } else {
                if (options === false) {
                    options = {};
                    options.auto = false;
                }
                // generate cid (this is a bit buggy, but it's quick)
                options.cid = 'zuix-ctx-' + (++_contextSeqNum);
                context = new ComponentContext(options);
                _contextRoot.push(context);
            }
        } else {
            // empty context
            options = {};
            context = new ComponentContext(options);
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
                // TODO: replace $(document) with $(options.container)
                var inlineView = $(document).find('[data-ui-view="' + context.componentId + '"]');
                if (inlineView.length >= 1)
                    context.view(inlineView.eq(0));
            }

            // if not able to inherit the view from the base cachedComponent
            // or from an inline element, then load the view from web
            if (util.isNoU(context.view())) {
                $.ajax({
                    url: context.componentId + ".html?" + new Date().getTime(),
                    dataType: 'text',
                    type: 'GET',
                    success: function (viewHtml) {
                        context.view(viewHtml);
                        loadController(context);
                    },
                    error: function (err) {
                        console.log(err);
                        if (util.isFunction(options.error))
                            context.error(context, err);
                    }
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

    /***
     *
     * @param {Object} cid
     * @returns {ComponentContext}
     */
    function getContext(cid) {
        var context = null;
        $.each(_contextRoot, function (k, v) {
            if (util.objectEquals(v.cid, cid)) {
                context = v;
                return false;
            }
        });
        return context;
    }

    /***
     *
     * @param {Object} cid
     * @returns {ComponentCache}
     */
    function getCachedComponent(cid) {
        var cached = null;
        $.each(_componentCache, function (k, v) {
            if (util.objectEquals(v.componentId, cid)) {
                cached = v;
                return false;
            }
        });
        return cached;
    }

    /***
     *
     * @param {ComponentContext} context
     */
    function loadController(context) {
        if (context.controller() === null && context.options.auto !== false) {
            $.ajax({
                url: context.componentId + ".js?" + new Date().getTime(),
                dataType: 'text',
                type: 'GET',
                success: function (ctrlJs) {
                    try {
                        var il = ctrlJs.indexOf('.load');
                        if (il > 1)
                            ctrlJs = ctrlJs.substring(0, il-4);
                        var ih = ctrlJs.indexOf('.controller');
                        if (ih > 1)
                            ctrlJs = ctrlJs.substring(ih+11);
                        context.controller(getController(ctrlJs));
                    } catch (e) {
                        console.log(ctrlJs);
                        console.log(e);
                        if (util.isFunction(context.error))
                            context.error(context, e);
                        return;
                    }
                    createComponent(context);
                },
                error: function (err) {
                    console.log(err);
                    if (util.isFunction(context.error))
                        context.error(context, err);
                }
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
            if (cached === null)
                _componentCache.push({
                    componentId: context.componentId,
                    view: $('<div>').append(context.view().clone()).html(),
                    controller: context.controller()
                });

            if (!util.isNoU(context.container())) {
                context.view().detach();
                context.container().append(context.view());
            }

            context.view().one('create', function () {
                // Material Design Light  DOM upgrade
                if (componentHandler)
                    componentHandler.upgradeElements(context.view()[0]);
                context.view().show();
                initComponent(context);
            });

            context.view().trigger('create');
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
            var c = context._c = new ContextController();
            c.componentId = context.componentId;
            c.view = context.view();
            c.model = context.model();
            c.expose = function(methodName, handler) {
                context[methodName] = handler;
            };
            context.controller()(context._c);
            if (!util.isNoU(context._c)) {
                if (util.isFunction(context._c.create)) context._c.create();
                //if (util.isFunction(context._c.bind)) context._c.bind();
                if (util.isFunction(context._c.resume)) context._c.resume();
                if (util.isFunction(context._c.refresh)) context._c.refresh();
            }
        }
        if (util.isFunction(context.ready))
            context.ready(context);
    }

    /***
     *
     * @param javascriptCode string
     * @returns {ContextControllerCallback}
     */
    // TODO: refactor this method name
    function getController(javascriptCode) {
        var instance = function (ctx){};
        if (typeof javascriptCode === 'string')
            instance = _eval(javascriptCode);
        return instance;
    }

    // Generic utility methods class
    var util = {

        isNoU: function (obj) {
            return (typeof obj === 'undefined' || obj === null);
        },

        isFunction: function (f) {
            return typeof f === 'function';
        },

        objectEquals: function (x, y) {
            if (x === null || x === undefined || y === null || y === undefined) {
                return x === y;
            }
            // after this just checking type of one would be enough
            if (x.constructor !== y.constructor) {
                return false;
            }
            // if they are functions, they should exactly refer to same one (because of closures)
            if (x instanceof Function) {
                return x === y;
            }
            // if they are regexps, they should exactly refer to same one (it is hard to better equality check on current ES)
            if (x instanceof RegExp) {
                return x === y;
            }
            if (x === y || x.valueOf() === y.valueOf()) {
                return true;
            }
            if (Array.isArray(x) && x.length !== y.length) {
                return false;
            }

            // if they are dates, they must had equal valueOf
            if (x instanceof Date) {
                return false;
            }

            // if they are strictly equal, they both need to be object at least
            if (!(x instanceof Object)) {
                return false;
            }
            if (!(y instanceof Object)) {
                return false;
            }

            // recursive object equality check
            var p = Object.keys(x);
            return Object.keys(y).every(function (i) {
                    return p.indexOf(i) !== -1;
                }) &&
                p.every(function (i) {
                    return util.objectEquals(x[i], y[i]);
                });
        }

    };

    // Public API

    scope.zuix = scope.zuix || {
            field: field,
            include: include,
            controller: controller,
            load: load
        };

    return scope;
}(this));

// jQuery helpers
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
            if (typeof callback === 'function') {
                callback.this = this;
                callback(animationName);
            }
        });
        return this;
    }
});