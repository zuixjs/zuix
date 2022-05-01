/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
 *         https://zuixjs.github.io/zuix
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

/*
 *
 *  This file is part of
 *  zUIx, Javascript library for component-based development.
 *        https://zuixjs.github.io/zuix
 *
 * @author Generoso Martello  -  https://github.com/genemars
 */

'use strict';

const _optionAttributes =
    require('./OptionAttributes');

const LIBRARY_PATH_DEFAULT = 'https://zuixjs.github.io/zkit/lib/'; // CORS works only over HTTPS

/**
 * TODO: describe this...
 *
 * @param {Element|ZxQuery|undefined} [element] Scan and process loadable elements inside `element`.
 * @param {Element|undefined} [child] Process only the specified `child` of `element`.
 * @return {Componentizer}
 */
Componentizer.prototype.componentize = function(element, child) {
  if (isBusy) {
    z$().one('componentize:step', function() {
      requestAnimationFrame(function() {
        isBusy = false;
        zuix.componentize(element, child);
      });
    });
    return this;
  }
  isBusy = true;
  zuix.trigger(this, 'componentize:begin');
  zuix.$().trigger('componentize:begin');
  zuix.resolveImplicitLoad(element);
  if (child != null) {
    const cache = getElementCache(element);
    if (cache == null) {
      setElementCache(element, [child]);
    } else cache.push(child);
  } else {
    addRequest(element);
  }
  loadNext(element);
  return this;
};

Componentizer.prototype.applyOptions = function(element, options) {
  applyOptions(element, options);
  return this;
};

Componentizer.prototype.loadInline = function(element, options) {
  loadInline(element, options);
};

Componentizer.prototype.resolvePath = function(path) {
  return resolvePath(path);
};

/**
 *
 * @return {boolean}
 */
Componentizer.prototype.willLoadMore = function() {
  return _componentizeQueue.length > 0 || _componentizeRequests.length > 0;
};

/**
 * Enable/Disable lazy-loading, or get current value.
 *
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Load-ahead threshold (default is 1.0 => 100% of view size).
 * @return {boolean} *true* if lazy-loading is enabled, *false* otherwise.
 */
Componentizer.prototype.lazyLoad = function(enable, threshold) {
  return lazyLoad(enable, threshold);
};


Componentizer.prototype.dequeue = function(element) {
  for (let i = 0; i < _componentizeQueue.length; i++) {
    const item = _componentizeQueue[i];
    if (item.element === element) {
      _componentizeQueue.splice(i, 1);
      break;
    }
  }
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


// ---------------------------------------------


const _log =
    require('../helpers/Logger')('ComponentContext.js');
const util =
    require('../helpers/Util');
const z$ =
    require('../helpers/ZxQuery');

/** @private */
const _componentizeRequests = [];
/** @private */
const _componentizeQueue = [];
/** @private */
const _componentizeStats = {};
/** @private */
const _lazyElements = [];
/** @private */
const _lazyContainers = [];

/** @private */
const TaskItem = function() {
  return {
    /** @type {Element} */
    element: null,
    /** @type {number} */
    priority: 0,
    /** @type {boolean} */
    visible: true,
    /** @type {boolean} */
    lazy: false
  };
};

/** @private */
let _disableLazyLoading = false;
/** @private */
let _lazyLoadingThreshold = 1;

/** @type {Zuix} **/
let zuix = null;

// Browser Agent / Bot detection
/** @private */
let _isCrawlerBotClient = false;
if (navigator && navigator.userAgent) {
  _isCrawlerBotClient = new RegExp(/bot|googlebot|crawler|spider|robot|crawling/i)
      .test(navigator.userAgent);
}
if (_isCrawlerBotClient) {
  _log.d(navigator.userAgent, 'is a bot, ignoring `lazy-loading` option.');
}

let isBusy = false;

/**
 *
 * @class
 * @constructor
 */
function Componentizer() {
  // ...
}
/**
 * Lazy Loading settings.
 * @param {boolean} [enable] Enable or disable lazy loading.
 * @param {number} [threshold] Read ahead tolerance (default is 1.0 => 100% of view size).
 * @return {boolean}
 */
function lazyLoad(enable, threshold) {
  if (enable != null) {
    _disableLazyLoading = !enable;
  }
  if (threshold != null) {
    _lazyLoadingThreshold = threshold;
  }
  return !_isCrawlerBotClient && !_disableLazyLoading;
}
/** @private */
function addRequest(element) {
  if (element == null) {
    element = document;
  }
  if (!_componentizeRequests.indexOf(element)) {
    _componentizeRequests.push(element);
  }
}

const _elementCache = [];
/** @private */
function setElementCache(element, waiting) {
  _elementCache.push({
    element: element,
    waiting: waiting
  });
}
/** @private */
function getElementCache(element) {
  for (let i = 0; i < _elementCache.length; i++) {
    const cache = _elementCache[i];
    if (cache.element === element) {
      return cache.waiting;
    }
  }
  return null;
}

/** @private */
function queueLoadables(element) {
  if (element == null && _componentizeRequests.length > 0) {
    element = _componentizeRequests.unshift();
  }
  if (element instanceof z$.ZxQuery) {
    element = element.get();
  }
  // Select all loadable elements
  let waitingLoad = getElementCache(element);
  //    if (waitingLoad == null || waitingLoad.length == 0) {
  const q = util.dom.queryAttribute(_optionAttributes.dataUiLoad, null, util.dom.cssNot(_optionAttributes.dataUiLoaded)) + ',' +
        util.dom.queryAttribute(_optionAttributes.dataUiInclude, null, util.dom.cssNot(_optionAttributes.dataUiLoaded));
  waitingLoad = z$(element).find(q);
  waitingLoad = Array.prototype.slice.call(waitingLoad._selection);
  setElementCache(element, waitingLoad);
  //    }
  const waitingTasks = [];
  for (let w = 0; w < waitingLoad.length; w++) {
    const el = waitingLoad[w];
    let pri = +(util.dom.getAttribute(el, _optionAttributes.dataUiPriority));
    if (isNaN(pri)) pri = 0;
    // adjust priority by element level
    let level = 0;
    let parent = el.parentNode;
    let ignore = false;
    while (parent != null && parent !== document) {
      level++;
      if (util.dom.getAttribute(parent, _optionAttributes.dataUiView) != null) {
        ignore = true;
        break;
      }
      parent = parent.parentNode;
    }
    if (!ignore) {
      const task = new TaskItem();
      task.element = el;
      task.priority = pri + (level * 1000);
      waitingTasks.push(task);
    } else {
      // _log.w("Element belongs to a template: process only when attached to a context instance.", el);
    }
  }
  let added = 0;
  // add selected elements to the requests queue
  for (let i = 0; i < waitingTasks.length; i++) {
    let alreadyAdded = false;
    for (let j = 0; j < _componentizeQueue.length; j++) {
      if (waitingTasks[i].element === _componentizeQueue[j].element) {
        alreadyAdded = true;
        break;
      }
    }
    if (!alreadyAdded) {
      // Add attributes to element if data-ui-options was provided
      const el = waitingTasks[i].element;
      const options = util.dom.getAttribute(el, _optionAttributes.dataUiOptions);
      applyOptions(el, options);
      // Add task to the queue
      _componentizeQueue.push(waitingTasks[i]);
      added++;
    }
  }


  if (_componentizeStats.queued !== _componentizeQueue.length || _componentizeStats.added !== added) {
    _log.t('componentize:count', _componentizeQueue.length, added);
    _componentizeStats.queued = _componentizeQueue.length;
    _componentizeStats.added = added;
  }

  if (added === 0 || (_componentizeRequests.length === 0 && _componentizeQueue.length === 0)) {
    zuix.trigger(this, 'componentize:end');
    zuix.$().trigger('componentize:end');
  } else {
    zuix.$().trigger('componentize:step');
  }
  isBusy = false;
}

/** @private */
function getNextLoadable() {
  // sort by priority (elements with lower pri number get processed first)
  _componentizeQueue.sort(function(a, b) {
    return a.priority - b.priority;
  });
  let job = null;
  let item = _componentizeQueue.length > 0 ? _componentizeQueue.shift() : null;
  while (item != null && item.element != null) {
    // defer element loading if lazy loading is enabled and the element is not in view
    const isLazy = lazyElementCheck(item.element);
    if (lazyLoad() && isLazy) {
      item.lazy = true;
      item.visible = z$.getPosition(item.element, _lazyLoadingThreshold).visible;
    } else {
      item.lazy = false;
      item.visible = true;
    }
    if (item.element != null && item.visible) {
      job = {
        item: item,
        cancelable: item.lazy
      };
      break;
    }
    if (_componentizeQueue.length > 0) {
      item = _componentizeQueue.shift();
    } else break;
  }
  return job;
}

/** @private */
function loadNext(element) {
  queueLoadables(element);
  const job = getNextLoadable();
  if (job != null && job.item != null && job.item.element != null) {
    z$(job.item.element).one('component:ready', function() {
      zuix.componentize(job.item.element);
    });
    loadInline(job.item.element);
  }
}

/** @protected */
function loadInline(element, opts) {
  const v = z$(element);
  if (v.attr(_optionAttributes.dataUiLoaded) != null || v.parent('pre,code').length() > 0) {
    // _log.w("Skipped", element);
    return false;
  }
  v.attr(_optionAttributes.dataUiLoaded, 'true');

  /** @type {ContextOptions} */
  let options = v.attr(_optionAttributes.dataUiOptions);
  if (!util.isNoU(options)) {
    options = parseOptions(element, options);
    // copy passed options
    options = util.cloneObject(options) || {};
  } else {
    options = {};
  }

  if (opts) {
    Object.assign(options, opts);
  }

  const contextId = v.attr(_optionAttributes.dataUiContext);
  if (!util.isNoU(contextId)) {
    // inherit options from context if already exists
    const ctx = zuix.context(contextId);
    if (ctx !== null) {
      options = ctx.options();
    }
    options.contextId = contextId;
  }

  // Automatic view/container selection
  if (util.isNoU(options.view) && !v.isEmpty()) {
    options.view = element;
    options.viewDeferred = true;
  } else if (util.isNoU(options.view) && util.isNoU(options.container) && v.isEmpty() && v.attr(_optionAttributes.resourceType.controller) == null) {
    options.container = element;
  }

  let componentId = v.attr(_optionAttributes.dataUiLoad);
  if (util.isNoU(componentId)) {
    const include = v.attr(_optionAttributes.dataUiInclude);
    if (include != null) {
      componentId = resolvePath(include);
      v.attr(_optionAttributes.dataUiInclude, componentId);
      v.attr(_optionAttributes.dataUiComponent, null);
      // Static include hove no controller
      if (util.isNoU(options.controller)) {
        options.controller = function() {};
      }
    } else {
      return false;
    }
  } else {
    componentId = resolvePath(componentId);
    v.attr(_optionAttributes.dataUiLoad, componentId);
    // check for `view` and `ctrl` type attributes
    if (componentId !== 'default' && v.attr(_optionAttributes.resourceType.view) !== null) {
      v.attr(_optionAttributes.dataUiComponent, null);
      // Static includes have no controller
      if (util.isNoU(options.controller)) {
        options.controller = function() {};
      }
    } else if (componentId === 'default' || v.attr(_optionAttributes.resourceType.controller) !== null) {
      options.view = options.view || element;
      options.viewDeferred = true;
      options.html = options.html || false;
      options.css = options.css || false;
      // custom inline view style
      const styleElement = v.children('[media="#"]');
      if (styleElement.length() > 0 && styleElement.parent().get() === v.get()) {
        if (options.css === false) {
          options.css = '';
        }
        styleElement.each(function(i, el, $el) {
          options.css += '\n' + options.css + $el.html();
        });
      }
      if (componentId === 'default') {
        options.controller = options.controller || function() {};
      }
    }
  }

  // inline attributes have precedence over ```options```

  const model = v.attr(_optionAttributes.dataBindModel);
  if (!util.isNoU(model) && model.length > 0) {
    options.model = parseOptions(element, model);
  }

  const behavior = v.attr(_optionAttributes.dataUiBehavior);
  if (!util.isNoU(behavior) && behavior.length > 0) {
    options.behavior = parseOptions(element, behavior);
  }

  const on = v.attr(_optionAttributes.dataUiOn);
  if (!util.isNoU(on) && on.length > 0) {
    options.on = parseOptions(element, on);
  }

  const priority = v.attr(_optionAttributes.dataUiPriority);
  if (!util.isNoU(priority)) {
    options.priority = +(priority);
  }

  zuix.load(componentId, options);

  return true;
}

/** @private */
function resolvePath(path) {
  if (path[0] === '@') {
    let config = zuix.store('config');
    let libraryPath = LIBRARY_PATH_DEFAULT;
    if (config != null && config[location.host] != null) {
      config = config[location.host];
    }
    if (config != null) {
      switch (typeof config.libraryPath) {
        case 'object':
          z$.each(config.libraryPath, function(k, v) {
            if (path.startsWith(k + '/')) {
              libraryPath = v;
              return false;
            }
            return true;
          });
          break;
        case 'string':
          libraryPath = config.libraryPath;
          break;
      }
    }
    path = libraryPath + path.substring(path.indexOf('/') + 1);
  }
  return path;
}

/** @private */
function parseOptions(element, attributeValue) {
  if (typeof attributeValue === 'string') {
    const parentComponent = z$(element).parent(util.dom.queryAttribute(_optionAttributes.dataUiLoad));
    if (parentComponent.get()) {
      // parent component context should be already loaded
      const context = zuix.context(parentComponent);
      try {
        return context._refreshHandler
            .runScriptlet(element, `[${attributeValue}][0]`);
      } catch (e) { }
    }
    if (attributeValue.trim().startsWith('{') && attributeValue.trim().endsWith('}')) {
      attributeValue = Function('return ' + attributeValue)();
    } else {
      attributeValue = util.propertyFromPath(window, attributeValue);
    }
  }
  return attributeValue;
}

/** @private */
function applyOptions(element, options) {
  options = parseOptions(element, options);
  // TODO: should check if options object is valid
  if (element != null && options != null) {
    if (options.lazyLoad != null) {
      util.dom.setAttribute(element, _optionAttributes.dataUiLazyload, options.lazyLoad.toString().toLowerCase());
    }
    if (options.contextId != null) {
      util.dom.setAttribute(element, _optionAttributes.dataUiContext, options.contextId.toString().toLowerCase());
    }
    if (options.componentId != null) {
      util.dom.setAttribute(element, _optionAttributes.dataUiLoad, options.componentId.toString().toLowerCase());
    }
    // TODO: eventually map other attributes from options
  }
}

// ------------ Lazy Loading

/** @private */
function getLazyElement(el) {
  for (let l = 0; l < _lazyElements.length; l++) {
    const le = _lazyElements[l];
    if (le.element === el) {
      return le;
    }
  }
  return null;
}

/** @private */
function addLazyElement(el) {
  const le = {
    element: el
  };
  _lazyElements.push(le);
  return le;
}

/** @private */
function getLazyContainer(el) {
  for (let l = 0; l < _lazyContainers.length; l++) {
    const ls = _lazyContainers[l];
    if (ls.element === el) {
      return ls;
    }
  }
  return null;
}

/** @private */
function addLazyContainer(el) {
  const lc = {
    element: el
  };
  _lazyContainers.push(lc);
  return lc;
}

/** @private */
function lazyElementCheck(element) {
  // Check if element has explicit lazyLoad=false flag set
  if (util.dom.getAttribute(element, _optionAttributes.dataUiLazyload) === 'false') {
    return false;
  }
  // Check if element is already added to Lazy-Element list
  let le = getLazyElement(element);
  if (le == null) {
    // Check if element inherits lazy-loading from a parent lazy container/scroll
    const q = util.dom.queryAttribute(_optionAttributes.dataUiLazyload, 'scroll') + ',' +
            util.dom.queryAttribute(_optionAttributes.dataUiLazyload, 'true');
    const lazyContainer = element.parentNode && z$.getClosest(element.parentNode, q);
    if (lazyContainer != null) {
      le = addLazyElement(element);
      // Check if the lazy container is already added to the lazy container list
      let lc = getLazyContainer(lazyContainer);
      if (lc == null) {
        lc = addLazyContainer(lazyContainer);
        // if it's of type 'scroll' attach 'scroll' event handler
        if (util.dom.getAttribute(lazyContainer, _optionAttributes.dataUiLazyload) === 'scroll') {
          (function(instance, lc) {
            let lastScroll = new Date().getTime();
            let timeout;
            z$(lc === document.body ? window : lc).on('scroll', function() {
              const now = new Date().getTime();
              if (now - lastScroll > 100) {
                lastScroll = now;
                loadNext(lc);
              } else {
                clearTimeout(timeout);
                timeout = setTimeout(function() {
                  loadNext(lc);
                }, 150);
              }
            });
          })(this, lazyContainer);
        }
      }
      return true;
    } else if (util.dom.getAttribute(element, _optionAttributes.dataUiLazyload) === 'true') {
      // element has explicit lazyLoad=true flag set
      le = addLazyElement(element);
      return true;
    }
  } else return true;
  return false;
}
