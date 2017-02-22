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

/**
 * TODO: complete JSDoc
 *
 * @param {ComponentContext} context
 * @returns {ContextController}
 * @constructor
 */
function ContextController(context) {
    var _t = this;

    this._view = null;

    this.context = context;
    /** @type {function} */
/*    this.behavior = function () {
        return context.behavior;
    };*/

    /**
     * @protected
     * @type {!Array.<ZxQuery>}
     **/
    this._fieldCache = [];

    // Interface methods

    /** @type {function} */
    this.init = null;
    /** @type {function} */
    this.create = null;
    /** @type {function} */
    this.destroy = null;

    /** @protected */
    this._childNodes = [];
    /** @type {function} */
    this.saveView = function () {
        this.restoreView();
        this.view().children().each(function (i, el) {
            _t._childNodes.push(el);
        });
    };
    this.restoreView = function() {
        if (this._childNodes.length > 0) {
            _t.view().html('');
            z$.each(_t._childNodes, function (i, el) {
                _t.view().append(el);
            });
            this._childNodes.length = 0;
        }
    };

    this.on = function (eventPath, handler_fn) {
        this.addEvent(this.view(), eventPath, handler_fn);
        // TODO: implement automatic event unbinding (off) in super().destroy()
        return this;
    };
    /** @protected */
    this.mapEvent = function (eventMap, target, eventPath, handler_fn) {
        if (target != null) {
            target.off(eventPath, this.eventRouter);
            eventMap[eventPath] = handler_fn;
            target.on(eventPath, this.eventRouter);
        } else {
            // TODO: should report missing target
        }
    };
    /** @protected */
    this.eventRouter = function (e) {
        if (typeof context._behaviorMap[e.type] === 'function')
            context._behaviorMap[e.type].call(_t.view(), e, e.detail);
        if (typeof context._eventMap[e.type] === 'function')
            context._eventMap[e.type].call(_t.view(), e, e.detail);
        // TODO: else-> should report anomaly
    };

    // create event map from context options
    var options = context.options(), handler = null;
    if (options.on != null) {
        for (var ep in options.on) {
            handler = options.on[ep];
            // TODO: should log.warn if k already exists
            _t.addEvent(_t.view(), ep, handler);
        }
    }
    // create behavior map from context options
    if (options.behavior != null) {
        for (var bp in options.behavior) {
            handler = options.behavior[bp];
            // TODO: should log.warn if k already exists
            _t.addBehavior(_t.view(), bp, handler);
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

/**
 * Gets elements in the component's view with `data-ui-field`
 * matching the given `fieldName`.
 *
 * @example
 *
 <small>**Example - View's HTML**</small>
 ```html
 <h1 data-ui-field="title">...</h1>
 <p data-ui-field="description">...</p>
 ```

 <small>**Example - JavaScript**</small>
 ```js
 cp.field('title')
 .html('Hello World!');
 var desc = cp.field('description');
 desc.html('The spectacle before us was indeed sublime.');
 ```
 *
 *
 * @param {!string} fieldName Value to match in the `data-ui-field` attribute.
 * @returns {ZxQuery} A `{ZxQuery}` object wrapping the matching element.
 */
ContextController.prototype.field = function (fieldName) {
    // this method is "attacched" from Zuix.js on controller initialization
    return null;
};
ContextController.prototype.clearCache = function () {
    this._fieldCache.length = 0;
};
/**
 * Gets the component's view or the view elements matching
 * the given `filter` in which case acts as a shorthand for
 * `cp.view().find(filter)`.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * // get all `checkbox` elements with `.checked` class.
 * var choices = cp.view('input[type="checkbox"].checked');
 * choices.removeClass('.checked');
 * // hide the component's view
 * cp.view().hide();
 * </code></pre>
 *
 * @param {(string|undefined)} [filter]
 * @return {ZxQuery}
 */
ContextController.prototype.view = function (filter) {
    // dispose cached fields from previous attacched view
    if (this.context.view() != null || this._view !== this.context.view()) {
        this.clearCache();
        this._view = z$(this.context.view());
    }
    // TODO: dispose also events on view change (!!!)
    if (filter != null)
        return this._view.find(filter);
    else if (this._view !== null)
        return this._view;
    else
        throw({
            message: 'Not attacched to a view yet.',
            source: this
        });
};
/**
 * Gets/Sets the component's data model.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
 * var m = {
 *      title: 'Thoughts',
 *      message: 'She stared through the window at the stars.'
 *  };
 * cp.model(m);
 * cp.model().title = 'Changes';
 * console.log(cp.model().title);
 * </code></pre>
 *
 * @param {object|undefined} [model] The model object.
 * @return {ContextController|object}
 */
ContextController.prototype.model = function (model) {
    if (model == null)
        return this.context.model();
    else this.context.model(model);
    return this;
};
/**
 * Gets the component options.
 *
 * @return {object} The component options.
 */
ContextController.prototype.options = function () {
    return this.context.options();
};
/**
 * Triggers the component event `eventPath` with the given
 * `eventData` object. To listen to a component event use the
 * `{ComponentContext}.on(eventPath, handler)` method or
 * in case `isHook` is set to true, use the
 * `zuix.hook(eventPath, handler)` method.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre><code class="language-js">
// somewhere inside the slide-show component controller
cp.trigger('slide:change', slideIndex);

// somewhere in a page hosting the slide-show component
// set component's event listeners
zuix.context('my-slide-show')
  .on('slide:change', function(slideIndex) { ... })
  .on(...);
 * </code></pre>
 *
 * @param {string} eventPath The event path.
 * @param {object} eventData The event data.
 * @param {boolean} [isHook] Trigger as global hook event.
 * @return {ContextController}
 */
ContextController.prototype.trigger = function (eventPath, eventData, isHook) {
    if (this.context._eventMap[eventPath] == null && isHook !== true)
        this.addEvent(this.view(), eventPath, null);
    // TODO: ...
    if (isHook === true) {
        var target = this.context.container();
        if (target == null) target = this.context.view();
        if (target != null)
            z$(target)
                .trigger(eventPath, eventData);
        this.context.trigger(this.context, eventPath, eventData);
    } else
        this.view().trigger(eventPath, eventData);
    return this;
};
/**
 *  Expose in the component context a property or method
 *  defined in the controller.
 *
 * @example
 * <small>Example - JavaScript</small>
 * <pre data-line="5"><code class="language-js">
 * // somewhere in the `create` method of the {ContextController}
 * zuix.controller(function(cp){
 *   cp.create = function() {
 *     // ....
 *     cp.expose('setSlide', slide);
 *   }
 *   // ...
 *   function slide(slideIndex) { ... }
 *   // ...
 * });
 * // ...
 * // calling the exposed method from the instance of
 * // the component.
 * var ctx = zuix.context('my-slide-show');
 * ctx.setSlide(2);
 * </code></pre>
 *
 *
 * @param {string|JSON} methodName Name of the exposed function, or list of method names/functions.
 * @param {function} [handler] Reference to the controller member to expose.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.expose = function (methodName, handler) {
    if (typeof methodName === 'object') {
        var _t = this;
        z$.each(methodName, function (k, v) {
            _t.context[k] = v;
        });
    } else this.context[methodName] = handler;
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
 * cp.loadCss();
 * // or loads the view's css with options
 * cp.loadCss({
 *     path: 'url/of/style/file.css',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadCss = function(options) {
    this.context.loadCss(options);
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
 * cp.loadHtml();
 * // or loads the view's html with options
 * cp.loadHtml({
 *     path: 'url/of/view/file.html',
 *     success: function() { ... },
 *     error: function(err) { ... },
 *     then: function() { ... }
 * });
 * </code></pre>
 *
 * @param {object} [options] The options object.
 * @return {ContextController} The ```{ContextController}``` object itself.
 */
ContextController.prototype.loadHtml = function(options) {
    this.saveView();
    this.context.loadHtml(options);
    return this;
};
/**
 * this member is "attacched" from Zuix.js on controller initialization
 * @type {Logger} */
ContextController.prototype.log = {};
/**
 * Register as default controller for the given component type.
 *
 * @example
<small>**Example - JavaScript**</small>
<pre data-line="6"><code class="language-js">
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
</pre></code>
 *
 * @param {!string} componentId Component identifier.
 * @return {ContextController} The `{ContextController}` itself.
 */
ContextController.prototype.for = function (componentId) { return this; };

module.exports = ContextController;