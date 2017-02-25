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
var util =
    require('../helpers/Util');
var z$ =
    require('../helpers/ZxQuery');

/** @private */
var _componentizeRequests = [];
/** @private */
var _componentizeQueue = [],
    /** @private */
    _disableLazyLoading = false;

/** @private */
var busyLoading = false,
    /** @private */
    retryTimeout = null,
    /** @private */
    pause = false;

/** @type {Zuix} **/
var zuix = null;

// Browser Agent / Bot detection
/** @private */
var _isCrawlerBotClient = false;
if (navigator && navigator.userAgent)
    _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
        .test(navigator.userAgent);
if (_isCrawlerBotClient)
    _log.d(navigator.userAgent, "is a bot, ignoring `lazy-loading` option.");

var TaskItem = function () {
    return {
        /** @typedef {Element} */
        element: null,
        /** @typedef {number} */
        priority: 0,
        /** @typedef {boolean} */
        visible: true,
        /** @typedef {boolean} */
        lazy: false
    }
};

function Componentizer() {

}

function lazyLoad(enable) {
    if (enable != null)
        _disableLazyLoading = !enable;
    return !_isCrawlerBotClient && !_disableLazyLoading;
}

function addRequest(element) {
    if (!_componentizeRequests.indexOf(element))
        _componentizeRequests.push(element);
}

function processRequests(element) {
    if (element == null && _componentizeRequests.length > 0)
        element = _componentizeRequests.unshift();

    if (element instanceof z$.ZxQuery)
        element = element.get();

    // Select all loadable elements
    var waitingLoad = z$(element).find('[data-ui-load]:not([data-ui-loaded=true]),[data-ui-include]:not([data-ui-loaded=true])');
    waitingLoad = Array.prototype.slice.call(waitingLoad._selection);

    /** @type {TaskItem[]} */
    var waitingTasks = [];
    for (var w = 0; w < waitingLoad.length; w++) {
        var pri = parseInt(waitingLoad[w].getAttribute('data-ui-priority'));
        if (isNaN(pri)) pri = 0;
        var task = new TaskItem();
        task.element = waitingLoad[w];
        task.priority = w - ( 12 * ( w % 2 ) ) + ( pri * 73 );
        waitingTasks.push(task);
    }

    // add selected elements to the requests queue
    var processNext = false;
    for (var i = 0; i < waitingTasks.length; i++) {
        var alreadyAdded = false;
        for (var j = i + 1; j < _componentizeQueue.length; j++) {
            if (waitingTasks[i].element === _componentizeQueue[j].element) {
                alreadyAdded = true;
                break;
            }
        }
        if (!alreadyAdded) {
            _componentizeQueue.push(waitingTasks[i]);
            processNext = true;
        }
    }

    _log.t('componentize:count', _componentizeQueue.length);

    if (processNext) {
        // sort by priority (minor number gets higher priority)
        _componentizeQueue.sort(function (a, b) {
            return a.priority - b.priority;
        });
        loadNext();
    } else {
        _log.t('componentize:complete', 'No more requests for this session');
    }

}

function loadNext() {
    if (busyLoading) {
        if (retryTimeout != null)
            clearTimeout(retryTimeout);
        retryTimeout = setTimeout(processRequests, 5);
        return;
    }
    busyLoading = true;

    var item = _componentizeQueue.length > 0 ? _componentizeQueue.shift() : null;
    while (item != null) {

        // store a reference to its scroller container for lazy-loaded elements
        if (item.element.zuix_lazyContainer == null) {
            var lazyContainer = item.element.zuix_lazyContainer || z$.getClosest(item.element, '[data-ui-lazyload=scroll]'); //el$.parent('[data-ui-lazyload=scroll]');
            item.element.zuix_lazyContainer = lazyContainer;
            // override lazy loading if 'lazyload' is set to 'false' for the current element
            if (!(lazyContainer != null && lazyContainer.getAttribute('data-ui-lazyload') == 'force')
                &&
                (!lazyLoad() || item.element.getAttribute('data-ui-lazyload') == 'false')) {
                item.element.zuix_lazyContainer = false;
            } else if (lazyContainer !== null) {
                // attach 'scroll' event handler to lazy-scroller
                var scrollWatcher = function (instance, lc) {
                    z$(lc).on('scroll', function () {
                        if (lc._zuix_scrollTimeout != null)
                            return;
                        lc._zuix_scrollTimeout = setTimeout(function () {
                            (Componentizer.prototype.componentize).call(instance, lc);
                            lc._zuix_scrollTimeout = null;
                        }, 73);
                    });
                }(this, lazyContainer);
            }
        }

        // defer element loading if lazy loading is enabled and the element is not in view
        if (lazyLoad() && item.element.zuix_lazyContainer instanceof Element) {
            var position = z$.getPosition(item.element);
            if (!position.visible) {
                item.priority++;
                item.visible = false;
            } else item.visible = true;
        } else item.visible = true;

        // ...
        if (item.element.getAttribute('data-ui-loaded') == 'true' ||
            (item.element.zuix_lazyContainer instanceof Element && !item.visible))
            if (_componentizeQueue.length > 0) {
                item = _componentizeQueue.shift();
            } else item = null;
        else
            break;

    }

    if (item == null) {
        if (!pause) {
            if (retryTimeout != null)
                clearTimeout(retryTimeout);
            retryTimeout = setTimeout(processRequests);
            pause = true;
        } else pause = false;
        // no more requests to process for this session
        busyLoading = false;
        return;
    }
    pause = false;

    // proceed loading item
    _log.t('componentize:begin', 'timer:task:start', item.element);

    // proceed loading inline element
    var el = z$(item.element);
    el.one('component:ready', function () {
        _log.t('componentize:end', 'timer:task:stop', el.get(), _componentizeQueue.length);
        busyLoading = false;
        loadNext();
    });
    loadInline(el.get());
}

/** @protected */
function loadInline(element) {
    var v = z$(element);
    if (v.attr('data-ui-loaded') === 'true' || v.parent('pre,code').length() > 0) {
        //_log.w("Skipped", element);
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

    var contextId = v.attr('data-ui-context');
    if (!util.isNoU(contextId))
        options.contextId = contextId;

    var priority = v.attr('data-ui-priority');
    if (!util.isNoU(priority))
        options.priority = priority;
    //else
    //    options.priority = _contextRoot.length;

    // TODO: Behavior are also definable in "data-ui-behavior" attribute
    // TODO: Events are also definable in "data-ui-on" attribute
    // TODO: perhaps "data-ui-ready" and "data-ui-error" too
    // util.propertyFromPath( ... )

    zuix.load(componentId, options);
}

/**
 *
 * @param {Element|ZxQuery|undefined} [element]
 * @return {Componentizer}
 */
Componentizer.prototype.componentize = function(element) {
    if (element == null)
        element = document;
    addRequest(element);
    loadNext();
    return this;
};

/**
 *
 * @return {boolean}
 */
Componentizer.prototype.willLoadMore = function() {
    return busyLoading ||  _componentizeQueue.length > 0 || _componentizeRequests.length > 0;
};

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @param {boolean} [enable]
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Componentizer.prototype.lazyLoad = function(enable) {
    return lazyLoad(enable);
};

/**
 *
 * @param {Zuix} zuixInstance
 * @return {Componentizer}
 */
Componentizer.prototype.setHost = function(zuixInstance) {
    zuix = zuixInstance;
    return this;
};

module.exports = function() {
    return new Componentizer();
};