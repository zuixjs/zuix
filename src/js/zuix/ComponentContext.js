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
     * --@-protected
     * @type {ContextController}
     */
    this._c = null;

    this.options(options);

    return this;
}

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

/***
 *
 * @param {ContextModel|undefined} [model]
 * @returns {ComponentContext|Object}
 */
ComponentContext.prototype.model = function (model) {
    if (typeof model === 'undefined') return this._model;
    else this._model = model; // model can be set to null
    this.modelToView();
    return this;
};
/**
 *
 * @return {ComponentContext}
 */
ComponentContext.prototype.viewToModel = function() {
    var _t = this;
    this._model = {};
    // create data model from inline view fields
    z$(this._view).find('[data-ui-field]').each(function () {
        var field = z$(this);
        if (field.parent('pre,code').length() > 0)
            return true;
        var name = field.attr('data-ui-field');
        var value = '';
        switch(this.tagName.toLowerCase()) {
            // TODO: complete binding cases
            case 'img':
                value = this.src;
                break;
            case 'input':
                value = this.value;
                break;
            default:
                value = this.innerHTML;
        }
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
 *
 * @return {ComponentContext}
 */
ComponentContext.prototype.modelToView = function () {
    if (this._view != null && this._model != null) {
        var _t = this;
        z$(this._view).find('[data-ui-field]').each(function () {
            var field = z$(this);
            if (field.parent('pre,code').length() > 0)
                return true;
            var boundField = field.attr('data-bind-to');
            if (boundField == null)
                boundField = field.attr('data-ui-field');
            if (typeof _t._model === 'function')
                (_t._model).call(_t._view, this, boundField);
            else {
                var boundData = util.propertyFromPath(_t._model, boundField);
                if (typeof boundData === 'function') {
                    (boundData).call(_t._view, this, boundField);
                } else if (boundData != null) {
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
        // TODO: deprecate this
        //if (!util.isNoU(this._c) && util.isFunction(this._c.refresh))
        //    this._c.refresh();
    }
    return this;
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
 *
 * @param callback
 * @returns {ComponentContext}
 */
ComponentContext.prototype.loadCss = function (options) {
    var context = this;

    var cssPath = context.componentId + ".css?" + new Date().getTime();
    if (util.isNoU(options)) options = {};
    if (!util.isNoU(options.path))
        cssPath = options.path;

    z$.ajax({
        url: cssPath,
        success: function (viewCss) {
            context.style(viewCss);
            if (util.isFunction(options.success))
                (options.success).call(context);
        },
        error: function (err) {
            console.log(err, context);
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

/***
 *
 * @param {Node|string|undefined} [view]
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

        z$(this._view).find('script').each(function () {
            if (this.getAttribute('zuix-loaded') !== 'true') {
                this.setAttribute('zuix-loaded', 'true');
                (eval).call(window, this.innerHTML);
                /*
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
                 */
            }
        });

        // trigger `view:process` hook when the view is ready to be processed
        this.trigger(this, 'view:process', this._view);

    } else {
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
ComponentContext.prototype.loadHtml = function(options) {
    var context = this;

    var htmlPath = context.componentId;
    if (util.isNoU(options)) options = {};
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
        if (util.isFunction(options.success))
            (options.success).call(context);
        if (util.isFunction(options.then))
            (options.then).call(context);
    } else {
        if (htmlPath == context.componentId)
            htmlPath +=  '.html?' + new Date().getTime();
        z$.ajax({
            url: htmlPath,
            success: function (viewHtml) {
                context.view(viewHtml);
                if (util.isFunction(options.success))
                    (options.success).call(context);
            },
            error: function (err) {
                console.log(err, context);
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

/***
 *
 * @param {ContextControllerCallback|undefined} [controller]
 * @returns {ComponentContext|ContextControllerCallback}
 */
ComponentContext.prototype.controller = function (controller) {
    if (typeof controller === 'undefined') return this._controller;
    // TODO: should dispose previous context controller first
    else this._controller = controller; // can be null
    return this;
};
/***
 *
 * @param {ViewContainer} [container]
 * @returns {ComponentContext|Node}
 */
ComponentContext.prototype.container = function (container) {
    // TODO: should automatically re-attach view to the new parent?
    if (container == null) return this._container;
    else this._container = container;
    return this;
};


module.exports = ComponentContext;