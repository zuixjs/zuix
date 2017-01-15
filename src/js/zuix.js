/**
 * @license
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
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
 * Javascript UI components enhancer. A lite MV* library.
 * Find more details about zuix here:
 *   https://github.com/genielabs/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */


(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['zuix'], function () {
            return (root.zuix = (factory).call(root));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node
        module.exports = (factory).call(root);
    } else {
        // Browser globals
        root.zuix = (factory).call(root);
    }
}(this,

/**
 * @class Zuix
 * @constructor
 */
function Zuix() {
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
     * @callback EventCallback
     * @param {string} event path
     * @param {Object} data
     *
     * @typedef {!{string, function}} EventMapping
     *
     * @typedef {{
     *    data: Object|undefined,
     *    locales: Object|undefined
     * }} ContextModel
     *
     * @typedef {Element|string} ContextView
     *
     * @typedef {Element|string} ViewContainer
     *
     * @typedef {{
     *    contextId: Object|undefined The context id,
     *    container: Node|undefined The container element,
     *    componentId: string|undefined The component identifier,
     *    model: ContextModel|undefined The data model,
     *    view: ContextView|undefined The view element,
     *    css: Element|string|undefined,
     *    controller: ContextControllerCallback|undefined The controller handler,
     *    on: Array.<EventMapping>|EventCallback|undefined The events handling map,
     *    behavior: Array.<EventMapping>|EventCallback|undefined The behaviors handling map,
     *    ready: ContextReadyCallback|undefined The ready callback, called once the component is succesfully loaded,
     *    error: ContextErrorCallback|undefined The error callback, called when error occurs
     * }} ContextOptions
     *
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

        this._options = null;
        this.contextId = util.isNoU(options) || util.isNoU(options.contextId) ? null : options.contextId;
        this.componentId = null;

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
         * @type {ContextControllerCallback}
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

        /** @protected */
        this._eventMap = [];
        /** @protected */
        this._behaviorMap = [];

        /**
         * @protected
         * @type {ContextController}
         */
        this._c = null;

        this.options(options);

        return this;
    }

    ComponentContext.prototype.options = function (options) {
        if (util.isNoU(options))
            return this._options;
        this._options = options;
        if (!util.isNoU(options)) {
            if (!util.isNoU(options.componentId))
                this.componentId = options.componentId;
            this.container(options.container);
            this.view(options.view);
            if (typeof options.css !== 'undefined')
                this.style(options.css);
            this.controller(options.controller);
            this.model(options.model);
        }
        return this;
    };

    /**
     * TODO: describe
     * @event ComponentContext#ready
     * @param {ComponentContext} context The component context instance.
     */
    ComponentContext.prototype.ready = function (context) {
    };

    /**
     * TODO: describe
     * @event ComponentContext#error
     * @param {ComponentContext} context The component context instance.
     * @param {Object} error The error object
     */
    ComponentContext.prototype.error = function (context, error) {
    };


    /**
     * TODO: describe
     * @param a
     * @param b
     */
    ComponentContext.prototype.on = function (a, b) {
        // TODO: throw error if _c (controller instance) is not yet ready
        return this._c.on(a, b);
    };

    /**
     * TODO: describe
     * @param apiMethodName {string}
     * @param options {Object}
     */
    ComponentContext.prototype.invoke = function (apiMethodName, options) {
        // TODO: throw error if _c (controller instance) is not yet ready
        return this._c.invoke(apiMethodName, options)
    };

    /***
     *
     * @param {ContextModel|undefined} [model]
     * @returns {ComponentContext|Object}
     */
    ComponentContext.prototype.model = function (model) {
        if (typeof model === 'undefined') return this._model;
        else this._model = model;
        this.updateModelView();
        return this;
    };

    ComponentContext.prototype.updateModelView = function () {
        if (!util.isNoU(this._view) && !util.isNoU(this._model)) {
            var _t = this;
            z$(this._view).find('[data-ui-field]').each(function (a, b) {
                var field = z$(this);
                var boundField = field.attr('data-bind-to');
                if (util.isNoU(boundField))
                    boundField = field.attr('data-ui-field');
                if (util.isFunction(_t._model))
                    (_t._model).call(_t._view, this, boundField);
                else {
                    var boundData = util.propertyFromPath(_t._model, boundField);
                    if (util.isFunction(boundData)) {
                        (boundData).call(_t._view, this, boundField);
                    } else if (!util.isNoU(boundData)) {
                        // try to guess target property
                        switch (this.tagName.toLowerCase()) {
                            // TODO: complete binding cases
                            case 'img':
                                this.src = boundData;
                                break;
                            case 'input':
                                this.value = boundData;
                                break;
                            default:
                                this.innerHTML = boundData;
                        }
                    }
                }
            });
        }
    };

    /***
     *
     * @param {string|Element|undefined} [css]
     * @returns {ComponentContext|Element}
     */
    ComponentContext.prototype.style = function (css) {
        if (typeof css === 'undefined') return this._style;
        if (css == null || css instanceof Element) {

            this._css = (css instanceof Element) ? css.innerText : css;
            this._style = z$.appendCss(css, this._style);

        } else if (typeof css === 'string') {

            // store original unparsed css (might be useful for debugging)
            this._css = css;

            // nest the CSS inside [data-ui-component='<componentId>']
            // so that the style is only applied to this component type
            css = z$.wrapCss('[data-ui-component="' + this.componentId + '"]:not(.zuix-css-ignore)', css);

            // trigger `css:parse` hook before assigning content to the view
            var hookData = {content: css};
            triggerHook(this, 'css:parse', hookData);
            css = hookData.content;

            // output css
            this._style = z$.appendCss(css, this._style);

        }
        // TODO: should throw error if ```css``` is not a valid type
        return this;
    };
    /***
     *
     * @param {ContextView|string|undefined} [view]
     * @returns {ComponentContext|ContextView}
     */
    ComponentContext.prototype.view = function (view) {
        if (typeof view === 'undefined') return this._view;
        if (typeof view === 'string') {
            // load view from HTML source

            // trigger `html:parse` hook before assigning content to the view
            var hookData = {content: view};
            triggerHook(this, 'html:parse', hookData);
            view = hookData.content;

            if (!util.isNoU(this._container)) {
                // append view content to the container
                this._view = this._container;
                this._view.innerHTML += view;
            } else {
                // TODO: orphan view is of no use? should throw an error
                this._view = z$.wrapElement('div', view);
            }

            // trigger `view:process` hook when the view is ready to be processed
            triggerHook(this, 'view:process', this._view);

            // ZUIX Componentizer is the last executed hook (built-in)
            componentize(this._view);

            this.updateModelView();
        } else {
            // load inline view
            if (!util.isNoU(this._container)) {
                this._view = z$.wrapElement('div', view.outerHTML).firstElementChild;
                this._view.removeAttribute('data-ui-view');
                this._container.appendChild(this._view);
                this._view = this._container;
            } else this._view = view;
        }

        var v = z$(this._view);
        if (this._options.css === false)
        // disable local css styling for this instance
            v.addClass('zuix-css-ignore');
        else
        // enable local css styling
            v.removeClass('zuix-css-ignore');

        return this;
    };
    /***
     *
     * @param {ContextControllerCallback|undefined} [controller]
     * @returns {ComponentContext|ContextControllerCallback}
     */
    ComponentContext.prototype.controller = function (controller) {
        if (typeof controller === 'undefined') return this._controller;
        else this._controller = controller;
        return this;
    };
    /***
     *
     * @param {ViewContainer} [container]
     * @returns {ComponentContext|Node}
     */
    ComponentContext.prototype.container = function (container) {
        if (util.isNoU(container)) return this._container;
        else this._container = container;
        return this;
    };

    /**
     * TODO: complete JSDoc
     *
     * @returns {ContextController}
     * @constructor
     */
    function ContextController(context) {
        var self = this;

        this.context = context;

        // TODO: should improve/deprecate this.componentId?
        this.componentId = context.componentId;
        /** @type {ContextView} */
        this.view = function () {
            return context.view()
        };
        /** @type {ContextModel} */
        this.model = function () {
            return context.model()
        };
        /** @type {function} */
        this.expose = function (methodName, handler) {
            context[methodName] = handler;
        };
        /** @type {function} */
        this.behavior = function () {
            return context.behavior;
        };

        /** @protected */
        this.mapEvent = function (eventMap, target, eventPath, handler_fn) {
            if (!util.isNoU(target)) {
                z$(target).off(eventPath, this.eventRouter);
                eventMap[eventPath] = handler_fn;
                z$(target).on(eventPath, this.eventRouter);
            } else {
                // TODO: should report missing target
            }
        };

        /** @protected */
        this._fieldCache = [];

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
        this.api = null; // handler for component API (command,options)

        /** @type {function} */
        this.trigger = function (eventPath, eventData) {
            if (util.isNoU(context._eventMap[eventPath]))
                this.addEvent(self.view(), eventPath, null);
            // TODO: ...
            z$(self.view()).trigger(eventPath, eventData);
        };
        /** @type {function} */
        this.on = function (eventPath, handler_fn) {
            this.addEvent(self.view(), eventPath, handler_fn);
            // TODO: implement automatic event unbinding (off) in super().destroy()
        };
        /** @type {function} */
        this.invoke = function (command, options) {
            // used by consumers to invoke a component API command
            if (util.isFunction(self.api))
                self.api(command, options);
        };
        /** @type {function} */
        this.eventRouter = function (e) {
            //if (util.isFunction(self.behavior()))
            //    self.behavior().call(self.view(), a, b);
            if (util.isFunction(context._behaviorMap[e.type]))
                context._behaviorMap[e.type].call(self.view(), e, e.detail);
            if (util.isFunction(context._eventMap[e.type]))
                context._eventMap[e.type].call(self.view(), e, e.detail);
            // TODO: else-> should report anomaly
        };
        // create event map from context options
        var options = context.options(), handler = null;
        if (!util.isNoU(options.on)) {
            for (var ep in options.on) {
                handler = options.on[ep];
                // TODO: should log.warn if k already exists
                self.addEvent(self.view(), ep, handler);
            }
        }
        // create behavior map from context options
        if (!util.isNoU(options.behavior)) {
            for (var bp in options.behavior) {
                handler = options.behavior[bp];
                // TODO: should log.warn if k already exists
                self.addBehavior(self.view(), bp, handler);
            }
        }

        context.controller().call(this, this);

        return this;
    }

    // TODO: add jsDoc
    ContextController.prototype.addEvent = function (target, eventPath, handler_fn) {
        this.mapEvent(this.context._eventMap, target, eventPath, handler_fn);
        return this;
    };

    // TODO: add jsDoc
    ContextController.prototype.addBehavior = function (target, eventPath, handler_fn) {
        this.mapEvent(this.context._behaviorMap, target, eventPath, handler_fn);
        return this;
    };

    /***
     * Search and cache this view elements.
     *
     * @param {!string} field Name of the `data-ui-field` to search
     * @param {boolean} [globalSearch] Search a generic field attribute
     * @returns {Node}
     */
    ContextController.prototype.field = function (field, globalSearch) {
        var f = globalSearch ? '@' + field : field;
        var el = null;
        if (typeof this._fieldCache[f] === 'undefined') {
            el = globalSearch ? z$(field).get(0) : z$(this.view()).find('[data-ui-field=' + field + ']').get(0);
            if (!util.isNoU(el))
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
     * Returns Node with `_zuixFieldAttribute` attribute matching `fieldName` .
     *
     * @param {!string} fieldName The class to check for.
     * @param {!Node} [container] Starting DOM element for this search.
     * @returns {Node}
     */
    function field(fieldName, container) {
        return z$(container).find('[' + _zuixFieldAttribute + '="' + fieldName + '"]').get(0);
    }

    /**
     * TODO: describe
     *
     * @param [element] {Node}
     */
    function componentize(element) {
        // TODO: add 'data-ui-loaded="true"' attribute after loading
        // to prevent loading twice
        z$(element).find('[data-ui-load],[data-ui-include]').each(function () {
            if (z$(this).attr('data-ui-loaded') === 'true' || z$(this).parent('pre,code').length() > 0) {
                console.log("ZUIX", "WARN", "Skipped", this);
                return;
            }
            z$(this).attr('data-ui-loaded', 'true');
            /** @type {ContextOptions} */
            var options;
            if (!util.isNoU(z$(this).attr('data-ui-options'))) {
                options = util.propertyFromPath(window, z$(this).attr('data-ui-options'));
                // copy passed options
                options = util.cloneObject(options);
            } else
                options = {};

            // Automatic view/container selection
            if (util.isNoU(options.view) && !z$(this).isEmpty())
                options.view = this;
            else if (util.isNoU(options.view) && util.isNoU(options.container) && z$(this).isEmpty())
                options.container = this;

            var componentId = z$(this).attr('data-ui-load');
            if (util.isNoU(componentId)) {
                // Static include should not have any controller
                componentId = z$(this).attr('data-ui-include');
                z$(this).attr('data-ui-component', componentId);
                // disable controller auto-loading
                if (util.isNoU(options.controller))
                    options.controller = null;
            }

            // TODO: Behavior are also definable in "data-ui-behavior" attribute
            // TODO: Events are also definable in "data-ui-on" attribute
            // util.propertyFromPath( ... )
            /*
             if (!util.isNoU(z$(this).attr('data-ui-ready')))
             options.ready = util.propertyFromPath(window, z$(this).attr('data-ui-ready'));
             if (!util.isNoU(z$(this).attr('data-ui-error')))
             options.error = util.propertyFromPath(window, z$(this).attr('data-ui-error'));
             if (!util.isNoU(z$(this).attr('data-ui-container')))
             options.container = field(z$(this).attr('data-ui-container'));
             if (!util.isNoU(z$(this).attr('data-ui-model')))
             options.model = util.propertyFromPath(window, z$(this).attr('data-ui-model'));
             if (!util.isNoU(z$(this).attr('data-ui-view')))
             options.view = field(z$(this).attr('data-ui-view'));
             if (!util.isNoU(z$(this).attr('data-ui-controller')))
             options.controller = util.propertyFromPath(window, z$(this).attr('data-ui-controller'));
             */

            load(componentId, options);
        });
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
                                context.error(context, err);
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
        var context = new ComponentContext(options);
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
            z$.ajax({
                url: context.componentId + ".css?" + new Date().getTime(),
                success: function (viewCss) {
                    context.style(viewCss);
                    task.end();
                    if (util.isFunction(callback))
                        callback.call(context);
                },
                error: function (err) {
                    task.end();
                    console.log(err, context);
                    if (util.isFunction(callback))
                        callback.call(context);
                }
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
                        try {
                            var il = ctrlJs.indexOf('.load');
                            if (il > 1)
                                ctrlJs = ctrlJs.substring(0, il - 4);
                            var ih = ctrlJs.indexOf('.controller');
                            if (ih > 1)
                                ctrlJs = ctrlJs.substring(ih + 11);
                            context.controller(getController(ctrlJs));
                        } catch (e) {
                            console.log(e, ctrlJs, context);
                            if (util.isFunction(context.error))
                                context.error(context, e);
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
                            context.error(context, err);
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

            z$(context.view()).one('create', function () {
                z$(context.view()).find('script').each(function () {
                    if (this.getAttribute('zuix-loaded') !== 'true') {
                        this.setAttribute('zuix-loaded', 'true');
                        var clonedScript = document.createElement('script');
                        clonedScript.setAttribute('zuix-loaded', 'true');
                        clonedScript.onload = function () {
                            // TODO: ...
                        };
                        if (!util.isNoU(this.type) && this.type.length > 0)
                            clonedScript.type = this.type;
                        if (!util.isNoU(this.text) && this.text.length > 0)
                            clonedScript.text = this.text;
                        if (!util.isNoU(this.src) && this.src.length > 0)
                            clonedScript.src = this.src;
                        this.parentNode.insertBefore(clonedScript, this);
                    }
                });

                // give to inline scripts a little time to start before binding model
                // TODO: optimize this
                setTimeout(function () {
                    var model = context.view().getAttribute('data-bind-model');
                    if (!util.isNoU(model) && model.length > 0)
                        context.model(util.propertyFromPath(window, model));
                }, 500);

                initComponent(context);
            }).trigger('create');

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
                z$(c.view()).attr('data-ui-component', c.componentId);

            // TODO: review/improve life-cycle

            if (util.isFunction(c.create)) c.create();
            c.trigger('view:create');

            //if (util.isFunction(c.bind)) c.bind();
            context.updateModelView();
            //if (util.isFunction(c.refresh)) c.refresh();

            if (util.isFunction(c.resume)) c.resume();
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
        var instance = function (ctx) {
        };
        if (typeof javascriptCode === 'string')
            instance = _eval(javascriptCode);
        return instance;
    }


    // TODO: following code to be sorted/re-arranged


    function triggerHook(context, path, data) {
        // TODO: call all registered callback
        if (util.isFunction(_hooksCallbacks[path]))
            _hooksCallbacks[path].call(context, path, data);
    }

    var _hooksCallbacks = [];

    function hooks(path, handler) {
        if (util.isNoU(handler))
            return _hooksCallbacks[path];
        _hooksCallbacks[path] = handler;
        return this;
    }


    // Generic utility class
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
        },

        propertyFromPath: function (o, s) {
            if (typeof s !== 'string') return;
            s = s.replace(/\[(\w+)]/g, '.$1'); // convert indexes to properties
            s = s.replace(/^\./, '');           // strip a leading dot
            var a = s.split('.');
            var ref = o;
            for (var i = 0, n = a.length; i < n; ++i) {
                var k = a[i];
                if (typeof ref[k] !== 'undefined') {
                    ref = ref[k];
                } else {
                    return;
                }
            }
            return ref;
        },

        cloneObject: function cloneObject(obj) {
            if (obj === null || typeof obj !== 'object') {
                return obj;
            }
            // give temp the original obj's constructor
            var temp = obj.constructor();
            for (var key in obj)
                temp[key] = cloneObject(obj[key]);
            return temp;
        }

    };


    /**
     * Task Queue Manager
     *
     * @class TaskQueue
     * @constructor
     */
    function TaskQueue() {
        var _t = this;
        _t._worker = null;
        _t._taskList = [];
        _t.taskQueue = function (tid, fn) {
            _t._taskList.push({
                tid: tid,
                fn: fn,
                status: 0,
                end: function () {
                    this.status = 2;
                }
            });
            _t.check();
        };
        _t.check = function () {
            if (_t._worker != null)
                clearTimeout(_t._worker);
            _t._worker = setTimeout(function () {
                _t.taskCheck();
            }, 10);
        };
        _t.taskCheck = function () {
            var next = -1;
            for (var i = 0; i < _t._taskList.length; i++) {
                if (next != -2 && _t._taskList[i].status == 0) {
                    next = i;
                }
                else if (_t._taskList[i].status == 1) {
                    next = -2;
                    _t.check();
                    triggerHook(_t, 'load:step', {
                        task: _t._taskList[i].tid
                    });
                    return;
                }
                else if (_t._taskList[i].status == 2) {
                    triggerHook(this, 'load:next', {
                        task: _t._taskList[i].tid
                    });
                    _t._taskList.splice(i, 1);
                    _t.check();
                    return;
                }
            }

            if (next >= 0) {
                _t._taskList[next].status = 1;
                (_t._taskList[next].fn).call(_t._taskList[next]);
                _t.check();
                triggerHook(_t, 'load:begin', {
                    task: _t._taskList[next].tid
                });
            } else {
                triggerHook(_t, 'load:end');
            }
        }

    }

    TaskQueue.prototype.queue = function (tid, fn) {
        return this.taskQueue(tid, fn);
    };

    var tasker = new TaskQueue();


    /**
     * ZQuery, a very small subset of jQuery-like functions
     * internally used in Zuix
     * @class ZQuery
     * @param element {ZQuery|Array<Node>|Node|NodeList|string|undefined}
     * @return {ZQuery}
     * @constructor
     */
    function ZQuery(element) {
        /** @protected */
        this._selection = [];

        if (typeof element === 'undefined')
            element = document.documentElement;

        if (element instanceof ZQuery)
            return element;
        else if (element instanceof HTMLCollection || element instanceof NodeList || Array.isArray(element))
            this._selection = element;
        else if (element instanceof HTMLElement || element instanceof Node)
            this._selection = [element];
        else if (typeof element === 'string')
            this._selection = document.documentElement.querySelectorAll(element);
        else if (element !== null) { //if (typeof element === 'string') {
            console.log(typeof element);
            throw(element);
        }
        return this;
    }

    ZQuery.prototype.length = function () {
        return this._selection.length;
    };

    ZQuery.prototype.parent = function (filter) {
        if (!util.isNoU(filter))
            return new ZQuery(z$.getClosest(this._selection[0], filter));
        return new ZQuery(this._selection[0].parentNode);
    };
    ZQuery.prototype.children = function (filter) {
        // TODO: implement filtering
        if (!util.isNoU(filter))
            return new ZQuery(this._selection[0].querySelectorAll(filter));
        return new ZQuery(this._selection[0].children);
    };
    ZQuery.prototype.get = function (i) {
        if (util.isNoU(i))
            i = 0;
        return this._selection[i];
    };
    ZQuery.prototype.eq = function (i) {
        return new ZQuery(this._selection[i]);
    };
    ZQuery.prototype.find = function (selector) {
        return new ZQuery(this._selection[0].querySelectorAll(selector));
    };
    ZQuery.prototype.each = function (iterationCallback) {
        z$.each(this._selection, iterationCallback);
        return this;
    };
    ZQuery.prototype.attr = function (attr, val) {
        if (util.isNoU(val))
            return this._selection[0].getAttribute(attr);
        else
            this.each(function (k, v) {
                this.setAttribute(attr, val);
            });
        return this;
    };
    ZQuery.prototype.trigger = function (eventPath, eventData) {
        var event;
        if (window.CustomEvent) {
            event = new CustomEvent(eventPath, {detail: eventData});
        } else {
            event = document.createEvent('CustomEvent');
            event.initCustomEvent(eventPath, true, true, eventData);
        }
        this.each(function (k, v) {
            this.dispatchEvent(event);
        });
        return this;
    };
    ZQuery.prototype.one = function (eventPath, eventHandler) {
        var fired = false;
        this.on(eventPath, function (a, b) {
            if (fired) return;
            fired = true;
            z$(this).off(eventPath, eventHandler);
            (eventHandler).call(this, a, b);
        });
        return this;
    };
    ZQuery.prototype.on = function (eventPath, eventHandler) {
        var events = eventPath.match(/\S+/g) || [];
        this.each(function (k, v) {
            var _t = this;
            z$.each(events, function (k, v) {
                _t.addEventListener(v, eventHandler, false);
            });
        });
        return this;
    };
    ZQuery.prototype.off = function (eventPath, eventHandler) {
        var events = eventPath.match(/\S+/g) || [];
        this.each(function (k, v) {
            var _t = this;
            z$.each(events, function (k, v) {
                _t.removeEventListener(v, eventHandler);
            });
        });
        return this;
    };
    ZQuery.prototype.isEmpty = function () {
        return (this._selection[0].innerHTML.replace(/\s/g, '').length === 0);
    };
    // TODO: the following methods could be deprecated
    ZQuery.prototype.css = function (attr, val) {
        if (util.isNoU(val))
            return this._selection[0].style[attr];
        else
            this.each(function (k, v) {
                this.style[attr] = val;
            });
        return this;
    };
    ZQuery.prototype.addClass = function (className) {
        var classes = className.match(/\S+/g) || [];
        z$.each(this._selection, function (k, v) {
            if (this.classList) {
                var _t = this;
                z$.each(classes, function (k, v) {
                    _t.classList.add(v);
                });
            } else this.className += ' ' + className;
        });
        return this;
    };
    ZQuery.prototype.hasClass = function (className) {
        var classes = className.match(/\S+/g) || [];
        var success = false;
        var cls = this._selection[0];
        z$.each(classes, function (k, v) {
            if (cls)
                success = cls.classList.contains(v);
            else
                success = (new RegExp('(^| )' + v + '( |$)', 'gi').test(cls.className));
            if (success) return false;
        });
        return success;
    };
    ZQuery.prototype.removeClass = function (className) {
        var classes = className.match(/\S+/g) || [];
        z$.each(this._selection, function (k, v) {
            if (this.classList) {
                var _t = this;
                z$.each(classes, function (k, v) {
                    _t.classList.remove(v);
                });
            } else this.className = this.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
        });
        return this;
    };
    ZQuery.prototype.prev = function () {
        return new ZQuery(this._selection[0].previousElementSibling);
    };
    ZQuery.prototype.next = function () {
        return new ZQuery(this._selection[0].nextElementSibling);
    };
    ZQuery.prototype.html = function (htmlText) {
        if (util.isNoU(htmlText))
            return this._selection[0].innerHTML;
        else
            this.each(function (k, v) {
                this.innerHTML = htmlText;
            });
        return this;
    };
    ZQuery.prototype.display = function (mode) {
        z$.each(this._selection, function (k, v) {
            this.style.display = mode;
        });
        return this;
    };
    ZQuery.prototype.show = function () {
        return this.display('');
    };
    ZQuery.prototype.hide = function () {
        return this.display('none');
    };

    // ZQuery object factory and static methods
    var z$ = function (what) {
        return new ZQuery(what);
    };
    z$.find = function (filter) {
        return z$().find(filter);
    };
    z$.each = function (items, iterationCallback) {
        for (var i = 0, len = items.length; i < len; i++)
            if (iterationCallback.call(items[i], i, items[i]) === false)
                break;
        return this;
    };
    z$.ajax = function ajax(opt) {
        var url;
        if (!util.isNoU(opt) && !util.isNoU(opt.url))
            url = opt.url;
        else
            url = opt;
        var xhr = new XMLHttpRequest();
        xhr.open('GET', url);
        xhr.onload = function () {
            if (xhr.status === 200) {
                if (util.isFunction(opt.success)) opt.success(xhr.responseText);
            }
            else {
                if (util.isFunction(opt.error)) opt.error(xhr);
            }
        };
        xhr.send();
        return this;
    };
    z$.wrapElement = function (containerTag, element) {
        //$(element).wrap($('<'+containerTag+'/>'));
        //return element;
        /** @type Element */
        var container = document.createElement(containerTag);
        if (typeof element === 'string')
            container.innerHTML = element;
        else
        // TODO: test this, it may not work
            container.appendChild(element);
        return container;
    };
    z$.wrapCss = function (wrapperRule, css) {
        var wrapReX = /([.,\w])([^/{};]+)({)/g;
        var r, result = null, wrappedCss = '';
        while (r = wrapReX.exec(css)) {
            if (result != null)
                wrappedCss += wrapperRule + ' ' + css.substring(result.index, r.index);
            result = r;
        }
        if (result != null)
            wrappedCss += wrapperRule + ' ' + css.substring(result.index);
        if (wrappedCss != '') {
            css = wrappedCss;
        }
        return css;
    };
    z$.appendCss = function (css, target) {
        var style = null, head;
        if (typeof css === 'string') {
            // output css
            head = document.head || document.getElementsByTagName('head')[0];
            style = document.createElement('style');
            style.type = 'text/css';
            if (style.styleSheet)
                style.styleSheet.cssText = css;
            else
                style.appendChild(document.createTextNode(css));
        } else if (css instanceof Element) style = css;
        // remove previous style node
        if (!util.isNoU(target))
            head.removeChild(target);
        if (!util.isNoU(style))
            head.appendChild(style);
        return style;
    };
    z$.getClosest = function (elem, selector) {
        // Element.matches() polyfill
        if (!Element.prototype.matches) {
            Element.prototype.matches =
                Element.prototype.matchesSelector ||
                Element.prototype.mozMatchesSelector ||
                Element.prototype.msMatchesSelector ||
                Element.prototype.oMatchesSelector ||
                Element.prototype.webkitMatchesSelector ||
                function (s) {
                    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
                        i = matches.length;
                    while (--i >= 0 && matches.item(i) !== this) {
                    }
                    return i > -1;
                };
        }
        // Get closest match
        for (; elem && elem !== document; elem = elem.parentNode) {
            if (elem.matches(selector)) return elem;
        }
        return null;
    };


    // Public ```zuix``` interface

    /** @global */
    this.zuix = this.zuix || {

            /* Component loading methods */
            controller: controller,
            load: load,
            unload: unload,
            componentize: componentize,
            context: getContext,

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
            ZQuery: ZQuery,

            /* Dev utility methods */
            dumpCache: function () {
                console.log("ZUIX", "Component Cache", _componentCache);
            },
            dumpContexts: function () {
                console.log("ZUIX", "Loaded Component Instances", _contextRoot);
            }

        };


    // TODO: implement <componentId>.model.js loading

    // TODO: add zuix.options to configure stuff like
    // TODO: the css/html/js lookup base path (each individually own prop)

    // TODO: deprecate jQuery dependency


    return this.zuix;
}));