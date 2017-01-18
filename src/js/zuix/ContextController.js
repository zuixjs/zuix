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
    require('../helpers/zQuery');

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
        if (target != null) {
            var t = z$(target);
            t.off(eventPath, this.eventRouter);
            eventMap[eventPath] = handler_fn;
            t.on(eventPath, this.eventRouter);
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
        if (context._eventMap[eventPath] == null)
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
        if (typeof self.api === 'function')
            self.api(command, options);
    };
    /** @type {function} */
    this.eventRouter = function (e) {
        //if (typeof self.behavior() === 'function')
        //    self.behavior().call(self.view(), a, b);
        if (typeof context._behaviorMap[e.type] === 'function')
            context._behaviorMap[e.type].call(self.view(), e, e.detail);
        if (typeof context._eventMap[e.type] === 'function')
            context._eventMap[e.type].call(self.view(), e, e.detail);
        // TODO: else-> should report anomaly
    };
    // create event map from context options
    var options = context.options(), handler = null;
    if (options.on != null) {
        for (var ep in options.on) {
            handler = options.on[ep];
            // TODO: should log.warn if k already exists
            self.addEvent(self.view(), ep, handler);
        }
    }
    // create behavior map from context options
    if (options.behavior != null) {
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
        if (el != null)
            this._fieldCache[f] = el;
    } else {
        el = this._fieldCache[f];
    }
    return el;
};
ContextController.prototype.clearCache = function () {
    this._fieldCache.length = 0;
};


module.exports = ContextController;