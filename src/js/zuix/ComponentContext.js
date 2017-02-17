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
 *  This file is part of
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

"use strict";

var _log =
    require('../helpers/Logger')('ComponentContext.js');
var z$ =
    require('../helpers/ZxQuery');
var util =
    require('../helpers/Util');

/***
 * TODO: describe this class...
 *
 * @param {ContextOptions} options The context options.
 * @returns {ComponentContext} The component context instance.
 * @constructor
 */

function ComponentContext(options, eventCallback) {

    this._options = null;
    this.contextId = (options == null || options.contextId == null) ? null : options.contextId;
    this.componentId = null;
    this.trigger = function(context, eventPath, eventValue) {
        if (typeof eventCallback === 'function')
            eventCallback(context, eventPath, eventValue);
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

    /** @protected */
    this._eventMap = [];
    /** @protected */
    this._behaviorMap = [];

    /**
     * --@-protected
     * @type {ContextController}
     */
    this._c = null;

    this.options(options);

    return this;
}
/**
 * Gets/Sets the component's container element.
 * Returns the current component element if no
 * argument is passed, the {ComponentContext} itself
 * otherwise.
 *
 * @param {Element} [container] The container element.
 * @returns {ComponentContext|Element}
 */
ComponentContext.prototype.container = function (container) {
    // TODO: should automatically re-attach view to the new parent?
    if (container == null) return this._container;
    else this._container = container;
    return this;
};

/**
 * Gets/Sets the component's view element.
 * If an *HTML* string is passed, the the view element
 * will be a new `div` wrapping the given markup.
 * Returns the current view element if no
 * argument is passed, the {ComponentContext} itself otherwise.
 *
 * @param {Element|string|undefined} [view] The view *HTML* string or element.
 * @returns {ComponentContext|Element}
 */
ComponentContext.prototype.view = function (view) {
    if (typeof view === 'undefined') return this._view;
    if (typeof view === 'string') {
        // load view from HTML source

        // trigger `html:parse` hook before assigning content to the view
        var hookData = {content: view};
        this.trigger(this, 'html:parse', hookData);
        view = hookData.content;

        if (this._container != null) {
            // append view content to the container
            this._view = this._container;
            this._view.innerHTML += view;
        } else {
            var viewDiv = z$.wrapElement('div', view);
            if (this._view != null)
                this._view.innerHTML = viewDiv.innerHTML;
            else this._view = viewDiv;
        }

        z$(this._view).find('script').each(function (i, el) {
            if (this.attr('zuix-loaded') !== 'true') {
                this.attr('zuix-loaded', 'true');
                /*if (el.src != null && el.src.length > 0) {
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
                    this.get().parentNode.insertBefore(clonedScript, this.get());
                } else */
                    (eval).call(window, el.innerHTML);
            }
        });

        // trigger `view:process` hook when the view is ready to be processed
        this.trigger(this, 'view:process', z$(this._view));

    } else {
        if (view instanceof z$.ZxQuery)
            view = view.get();
        // load inline view
        if (this._container != null) {
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

    this.modelToView();

    return this;
};

/**
 * Gets/Sets the component's view style.
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
        var hookData = { content: css };
        this.trigger(this, 'css:parse', hookData);
        css = hookData.content;

        // output css
        this._style = z$.appendCss(css, this._style);

    }
    // TODO: should throw error if ```css``` is not a valid type
    return this;
};
/**
 * Gets/Sets the component's data model.
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
 * @returns {ComponentContext|object}
 */
ComponentContext.prototype.model = function (model) {
    if (typeof model === 'undefined') return this._model;
    else this._model = model; // model can be set to null
    this.modelToView();
    return this;
};
/**
 * Gets/Sets the controller handler function.
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
 * @param {ContextControllerHandler|undefined} [controller] The controller handler function.
 * @returns {ComponentContext|ContextControllerHandler}
 */
ComponentContext.prototype.controller = function (controller) {
    if (typeof controller === 'undefined') return this._controller;
    // TODO: should dispose previous context controller first
    else this._controller = controller; // can be null
    return this;
};

/**
 * Gets/Sets the component options.
 *
 * @param {ContextOptions|undefined} options The JSON options object.
 * @return {ComponentContext|object}
 */
ComponentContext.prototype.options = function (options) {
    if (options == null)
        return this._options;
    this._options = options;
    if (options.componentId != null)
        this.componentId = options.componentId;
    this.container(options.container);
    this.view(options.view);
    if (typeof options.css !== 'undefined')
        this.style(options.css);
    this.controller(options.controller);
    this.model(options.model);
    return this;
};

/**
 * Listen for a component event.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * ctx.on('item:share', function(evt, data) { ... });
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {EventCallback} eventHandler The event handler function.
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.on = function (eventPath, eventHandler) {
    // TODO: throw error if _c (controller instance) is not yet ready
    this._c.on(eventPath, eventHandler);
    return this;
};
/**
 * Load the `.css` file and replace the component's view style.
 * If no `options.path` is specified, it will try to load
 * the file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.css' by default
 * ctx.loadCss();
 * // or loads the view's css with options
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
ComponentContext.prototype.loadCss = function (options, enableCaching) {
    var context = this;
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.caching))
        enableCaching = options.caching;
    var cssPath = context.componentId + '.css';
    if (!util.isNoU(options.path))
        cssPath = options.path;
    if (!enableCaching)
        cssPath += '?'+new Date().getTime();
    z$.ajax({
        url: cssPath,
        success: function (viewCss) {
            context.style(viewCss);
            if (util.isFunction(options.success))
                (options.success).call(context, viewCss);
        },
        error: function (err) {
            _log.e(err, context);
            if (util.isFunction(options.error))
                (options.error).call(context, err);
        },
        then: function () {
            if (util.isFunction(options.then))
                (options.then).call(context);
        }
    });
    return this;
};
/**
 * Load the `.html` file and replace the component's view markup.
 * If no `options.path` is specified, it will try to load the
 * file with the same base-name as the `componentId`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // loads 'path/to/component_name.html' by default
 * ctx.loadHtml();
 * // or loads the view's html with options
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
    var context = this;
    var htmlPath = context.componentId;
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.caching))
        enableCaching = options.caching;
    if (!util.isNoU(options.path))
        htmlPath = options.path;
    // TODO: check if view caching is working in this case too
    var inlineView = z$().find('[data-ui-view="' + htmlPath + '"]:not([data-ui-component*=""])');
    if (inlineView.length() > 0) {
        var inlineElement = inlineView.get(0);
        if (context.view() === inlineElement || (context.container() != null && context.container().contains(inlineElement)))
            // TODO: test this case
            context.view(inlineElement);
        else
            context.view(inlineElement.outerHTML);
        var html = context.view().innerHTML;
        if (util.isFunction(options.success))
            (options.success).call(context, html);
        if (util.isFunction(options.then))
            (options.then).call(context);
    } else {
        if (htmlPath == context.componentId)
            htmlPath +=  '.html' + (!enableCaching ? '?'+new Date().getTime() : '');
        z$.ajax({
            url: htmlPath,
            success: function (viewHtml) {
                context.view(viewHtml);
                if (util.isFunction(options.success))
                    (options.success).call(context, viewHtml);
            },
            error: function (err) {
                _log.e(err, context);
                if (util.isFunction(options.error))
                    (options.error).call(context, err);
            },
            then: function () {
                if (util.isFunction(options.then))
                    (options.then).call(context);
            }
        });
    }
    return this;
};
/**
 * Create the data model starting from ```data-ui-field```
 * elements declared in the component's view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.viewToModel = function() {
    var _t = this;
    this._model = {};
    // create data model from inline view fields
    z$(this._view).find('[data-ui-field]').each(function(i, el) {
        if (this.parent('pre,code').length() > 0)
            return true;
        var name = this.attr('data-ui-field');
        var value =
            // TODO: this is a work around for IE where "el.innerHTML" is lost after view replacing
            (!util.isNoU(el.innerHTML) && util.isIE())
                ? el.cloneNode(true) : el;
        // dotted field path
        if (name.indexOf('.')>0) {
            var path = name.split('.');
            var cur = _t._model;
            for (var p = 0; p < path.length - 1; p++) {
                if (typeof cur[path[p]] === 'undefined')
                    cur[path[p]] = {};
                cur = cur[path[p]];
            }
            cur[path[path.length - 1]] = value;
        } else _t._model[name] = value;
    });
    return this;
};
/**
 * Copy values from the data model to the ```data-ui-field``
 * elements declared in the component's view.
 *
 * @return {ComponentContext} The ```{ComponentContext}``` object itself.
 */
ComponentContext.prototype.modelToView = function () {
    if (this._view != null && this._model != null) {
        var _t = this;
        z$(this._view).find('[data-ui-field]').each(function(i, el) {
            if (this.parent('pre,code').length() > 0)
                return true;
            var boundField = this.attr('data-bind-to');
            if (boundField == null)
                boundField = this.attr('data-ui-field');
            if (typeof _t._model === 'function')
                (_t._model).call(z$(_t._view), this, boundField);
            else {
                var boundData = util.propertyFromPath(_t._model, boundField);
                if (typeof boundData === 'function') {
                    (boundData).call(z$(_t._view), this, boundField);
                } else if (boundData != null) {
                    // try to guess target property
                    switch (el.tagName.toLowerCase()) {
                        // TODO: complete binding cases
                        case 'img':
                            el.src = (!util.isNoU(boundData.src) ?  boundData.src :
                                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
                            if (boundData.alt) el.alt = boundData.alt;
                            break;
                        case 'a':
                            el.href = (!util.isNoU(boundData.href) ? boundData.href :
                                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
                            if (boundData.title) el.title = boundData.title;
                            break;
                        case 'input':
                            el.value = (!util.isNoU(boundData.value) ? boundData.value :
                                (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData));
                            break;
                        default:
                            el.innerHTML = (!util.isNoU(boundData.innerHTML) ? boundData.innerHTML : boundData);
                    }
                }
            }
        });
    }
    return this;
};

module.exports = ComponentContext;