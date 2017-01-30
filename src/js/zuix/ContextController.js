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

    /** @protected */
    this.context = context;

    // TODO: should improve/deprecate this.componentId?
    this.componentId = context.componentId;

    this._view = null;
    /**
     * TODO: desc
     *
     * @param what {(Object|ZxQuery|Array<Node>|Node|NodeList|string|undefined)}
     * @return {ZxQuery}
     */
    this.view = function (what) {
        if (context.view() != null || this._view !== context.view())
            return this._view = (what == null ? z$(context.view())
                : typeof what === 'string' ? z$(context.view()).find(what)
                    : z$(what));
        else if (this._view !== null)
            return this._view;
        else
            throw({
                message: 'Not attacched to a view yet.',
                source: this
            });
    };
    /** @type {object} */
    this.model = function (model) {
        return context.model(model)
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

    /** @type {function} */
    this.loadHtml = function(options) {
        this.saveView();
        return context.loadHtml(options);
    };

    /** @type {function} */
    this.loadCss = function(options) {
        return context.loadCss(options);
    };

    /** @protected */
    this._fieldCache = [];

    /** @type {function} */
    this.create = null;
    /** @type {function} */
    this.destroy = null;

    /** @type {function} */
    this.trigger = function (eventPath, eventData) {
        if (context._eventMap[eventPath] == null)
            this.addEvent(this.view(), eventPath, null);
        // TODO: ...
        _t.view().trigger(eventPath, eventData);
    };
    /** @type {function} */
    this.on = function (eventPath, handler_fn) {
        this.addEvent(this.view(), eventPath, handler_fn);
        // TODO: implement automatic event unbinding (off) in super().destroy()
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
/***
 * Search and cache this view elements.
 *
 * @param {!string} field Name of the `data-ui-field` to search
 * @returns {ZxQuery}
 */
ContextController.prototype.field = function (field) {
    var _t = this, el = null;
    if (typeof this._fieldCache[field] === 'undefined') {
        el = this.view().find('[data-ui-field=' + field + ']');
        if (el != null) {
            // ZxQuery base methods override
            el.on = function (eventPath, eventHandler) {
                if (typeof eventHandler === 'string') {
                    var eh = eventHandler;
                    eventHandler = function () { _t.trigger(eh); }
                }
                z$.ZxQuery.prototype.on.call(el, eventPath, eventHandler);
            };
            this._fieldCache[field] = el;
        }
    } else {
        el = this._fieldCache[field];
    }
    return el;
};
ContextController.prototype.clearCache = function () {
    this._fieldCache.length = 0;
};

module.exports = ContextController;