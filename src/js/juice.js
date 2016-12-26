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
 * Javascript UI components enhancer. A tiny MVC framework.
 * Find more details about jUIce here:
 *   https://github.com/genielabs/js-juice-mvc
 *
 * @author Generoso Martello.
 */

(function (scope) {
    "use strict";

    /**
     * Describes the type of component cache object.
     *
     * @typedef {{
     *      componentId: string The id of the cached component,
     *      view: ContextView The view,
     *      controller: ContextControllerCallback The function of the controller handler.
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
     * @param {ContextOptions} options
     * @return {ComponentContext}
     * @constructor
     */
    function ComponentContext(options) {

        this.options = options;
        this.cid = util.isNoU(options) || util.isNoU(options.cid) ? null : options.cid;
        this.componentId = util.isNoU(options) || util.isNoU(options.componentId) ? null : options.componentId;
        /** @type {function} */
        this.ready = null;
        /** @type {function} */
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

        return this;

    }

    /***
     *
     * @param {ContextModel} [model]
     * @return {ComponentContext|Object}
     */
    ComponentContext.prototype.model = function (model) {
        if (util.isNoU(model)) return this._model;
        else this._model = model;
        return this;
    };
    /***
     *
     * @param {ContextView} [view]
     * @return {ComponentContext|ContextView}
     */
    ComponentContext.prototype.view = function (view) {
        if (typeof view === 'undefined') return this._view;
        else this._view = view !== null ? $(view) : null;
        return this;
    };
    /***
     *
     * @param {ContextControllerCallback} [controller]
     * @return {ComponentContext|ContextControllerCallback}
     */
    ComponentContext.prototype.controller = function (controller) {
        if (util.isNoU(controller)) return this._controller;
        else this._controller = controller;
        return this;
    };
    /***
     *
     * @param {ViewContainer} [container]
     * @return {ComponentContext|jQuery}
     */
    ComponentContext.prototype.container = function (container) {
        if (util.isNoU(container)) return this._container;
        else this._container = $(container);
        return this;
    };

    /**
     * TODO: complete JSDoc
     *
     * @return {ContextController}
     * @constructor
     */
    function ContextController() {
        /** @protected */
        this._fieldCache = [];
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
        this.event = null;
        /** @type {function} */
        this.fire = null;
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



    // TODO: implement Config object for juice
    /** @protected */
    var _juiceFieldAttribute = 'data-ui-field';
    // work-around for lint eval error
    /** @protected */
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
    function handler(callback) {
        return callback;
    }

    /**
     * Returns jQuery elements with `_juiceFieldAttribute` attribute matching `fieldName` .
     *
     * @param {!Element|!jQuery} container Starting DOM element for this search.
     * @param {!string} fieldName The class to check for.
     * @returns {jQuery}
     */
    function field(container, fieldName) {
        return $(container).find('[' + _juiceFieldAttribute + '="' + fieldName + '"]');
    }

    /**
     * Load a component context with the given context options.
     * // TODO: describe how component MVC is loaded inline or from url
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
                options.cid = 'juice-ctx-' + (++_contextSeqNum);
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
            if (!util.isNoU(context.view())) {
                // TODO: implement this code in a context.detach() method
                //context.controller().pause()
                context.view().detach();
                context.view(null);
            }
        }

        // pick it from cache if found
        var cachedComponent = getCachedComponent(context.componentId);
        if (cachedComponent !== null && util.isNoU(context.controller()))
            context.controller(cachedComponent.controller);

        if (typeof options.ready === 'function')
            context.ready = options.ready;
        if (typeof options.error === 'function')
            context.error = options.error;

        if (util.isNoU(options.view)) {

            if (cachedComponent !== null) {
                context.view(cachedComponent.view);
            } else {
                // TODO: replace $(document) with $(options.container)
                var inlineView = $(document).find('[data-juice-view="' + context.componentId + '"]');
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
                    error: function (data) {
                        console.log(data);
                        if (typeof options.error === 'function')
                            context.error(options, data);
                    }
                });
                // defer handler loading
                return context;
            }
        }
        loadController(context);
        return context;
    }

    /***
     *
     * @param {Object} cid
     * @return {ComponentContext}
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
     * @return {ComponentCache}
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
                        var il = ctrlJs.indexOf('juice.load');
                        if (il > 1)
                            ctrlJs = ctrlJs.substring(0, il-1);
                        var ih = ctrlJs.indexOf('juice.handler');
                        if (ih > 1)
                            ctrlJs = ctrlJs.substring(ih+13);
                        context.controller(getController(ctrlJs));
                    } catch (e) {
                        console.log(e);
                        if (util.isFunction(context.error))
                            context.error(context, e);
                        return;
                    }
                    createComponent(context);
                },
                error: function (data) {
                    console.log(data);
                    if (util.isFunction(context.error))
                        context.error(context, data);
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
        var cached = getCachedComponent(context.componentId);
        if (cached === null)
            _componentCache.push({
                componentId: context.componentId,
                view: $('<div>').append(context.view().clone()).html(),
                controller: context.controller()
            });

        if (!util.isNoU(context.container())) {
            var wrapperDiv = $('<div class="juice-ui-wrapper"/>');
            wrapperDiv.hide();
            context.view().detach();
            wrapperDiv.append(context.view());
            context.container().append(wrapperDiv);
            context.view(wrapperDiv);
        }

        context.view().one('create', function () {
            // Material Design Light  DOM upgrade
            if (componentHandler)
                componentHandler.upgradeElements(context.view()[0]);
            context.view().show();
            initComponent(context);
        });

        context.view().trigger('create');
    }

    /***
     *
     * @param {ComponentContext} context
     */
    function initComponent(context) {
        if (util.isFunction(context.controller())) {
            context._c = new ContextController();
            context._c.view = context.view();
            context._c.model = context.model();
            context.controller()(context._c);
            if (!util.isNoU(context._c)) {
                if (util.isFunction(context._c.create)) context._c.create();
                //if (util.isFunction(context._c.bind)) context._c.bind();
                if (util.isFunction(context._c.resume)) context._c.resume();
                if (util.isFunction(context._c.refresh)) context._c.refresh();
            }
        }
        if (typeof context.ready === 'function')
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

    scope.juice = scope.juice || {
            handler: handler,
            field: field,
            load: load
        };

    return scope;
}(this));
// jQuery helpers
$.fn.extend({
    animateCss: function (animationName) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        this.addClass('animated ' + animationName).one(animationEnd, function() {
            $(this).removeClass('animated ' + animationName);
        });
    }
});