/*
 * Copyright 2015-2023 G-Labs. All Rights Reserved.
 *
 *           https://zuixjs.org
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
 *        https://zuixjs.org
 *
 * @author Generoso Martello  -  https://github.com/genemars
 */

'use strict';

const _optionAttributes =
    require('./OptionAttributes');

const LIBRARY_PATH_DEFAULT = 'https://zuixjs.github.io/zkit/lib/1.2/';

/**
 * TODO: describe this...
 *
 * @param {Element|ZxQuery|undefined} [element] Scan and process loadable elements inside `element`.
 * @return {Componentizer}
 */
Componentizer.prototype.componentize = function(element) {
  if (isBusy) {
    z$().one('componentize:step', () =>
      // TODO: should be `requestIdleCallback`
      //       but it's not supported by Safari yet
      requestAnimationFrame(() => {
        isBusy = false;
        zuix.componentize(element);
      })
    );
    return this;
  }
  isBusy = true;
  zuix.trigger(this, 'componentize:begin');
  zuix.$().trigger('componentize:begin');
  zuix.resolveImplicitLoad(element);
  addRequest(element);
  loadNext(element);
  return this;
};

Componentizer.prototype.applyOptions = function(element, options) {
  applyOptions(element, options);
  return this;
};

Componentizer.prototype.loadInline = function(element, options) {
  loadInline(element, options);
  return this;
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
  return this;
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
const _lazyUpdateScrollRefresh = 150;

/** @private */
let _disableLazyLoading = false;
/** @private */
let _lazyLoadingThreshold = 1;

/** @type {Zuix} **/
let zuix = null;

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
  return !_disableLazyLoading;
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

/** @private */
function queueLoadables(element) {
  if (element == null && _componentizeRequests.length > 0) {
    element = _componentizeRequests.unshift();
  }
  if (element instanceof z$.ZxQuery) {
    element = element.get();
  }
  // Select all loadable elements
  const q = util.dom.queryAttribute(_optionAttributes.zLoad, null, util.dom.cssNot(_optionAttributes.zLoaded));
  let waitingLoad = z$(element).find(q);
  waitingLoad = Array.prototype.slice.call(waitingLoad._selection);
  // Process elements options
  const waitingTasks = [];
  for (let w = 0; w < waitingLoad.length; w++) {
    const el = waitingLoad[w];
    let pri = +(util.dom.getAttribute(el, _optionAttributes.zPriority));
    if (isNaN(pri)) pri = 0;
    // adjust priority by element level
    let level = 0;
    let parent = el.parentNode;
    let ignore = false;
    while (parent != null && parent !== document && !(parent instanceof ShadowRoot)) {
      level++;
      if (util.dom.getAttribute(parent, _optionAttributes.zView) != null) {
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
      // Add attributes to element if z-options was provided
      const el = waitingTasks[i].element;
      const options = util.dom.getAttribute(el, _optionAttributes.zOptions);
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
    const el = item.element;
    // defer element loading if lazy loading is enabled and the element is not in view
    const isLazy = lazyElementCheck(el);
    if (lazyLoad() && isLazy) {
      item.lazy = true;
      item.visible = z$.getPosition(el, _lazyLoadingThreshold).visible;
    } else {
      item.lazy = false;
      item.visible = true;
    }
    if (el != null && item.visible) {
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
    const el = job.item.element;
    loadInline(el);
  }
}

/** @protected */
function loadInline(element, opts) {
  const v = z$(element);
  if (v.attr(_optionAttributes.zLoaded) === true || v.attr(_optionAttributes.zLoaded) === false || v.parent('pre,code').length()) {
    //_log.w('Skipped', element);
    return false;
  }
  v.attr(_optionAttributes.zLoaded, 'true');

  /** @type {ContextOptions} */
  let options = v.attr(_optionAttributes.zOptions);
  if (options) {
    options = parseOptions(element, options);
    // copy passed options
    options = util.cloneObject(options) || {};
  } else if (v.get().__zuix_loadOptions != null) {
    options = v.get().__zuix_loadOptions;
  } else {
    options = {};
  }

  if (opts) {
    Object.assign(options, opts);
  }

  const contextId = v.attr(_optionAttributes.zContext);
  if (contextId) {
    // inherit options from context if already exists
    const ctx = zuix.context(contextId);
    if (ctx !== null) {
      options = ctx.options();
    }
    options.contextId = contextId;
  }

  // Automatic view/container selection
  if (!options.view && !v.isEmpty()) {
    options.view = element;
    options.viewDeferred = true;
  } else if (!options.view && !options.container && v.isEmpty() && v.attr(_optionAttributes.resourceType.controller) == null) {
    options.container = element;
  }

  const setAsTemplate = function() {
    v.attr(_optionAttributes.zComponent, null);
    // View-only templates have no controller
    if (!options.controller) {
      options.controller = function() {};
    }
  };
  let componentId = v.attr(_optionAttributes.zLoad);
  if (!componentId) {
    return false;
  } else {
    componentId = resolvePath(componentId);
    v.attr(_optionAttributes.zLoad, componentId);
    // check for `view` and `ctrl` type attributes
    if (componentId !== 'default' && v.attr(_optionAttributes.resourceType.view) !== null) {
      setAsTemplate();
    } else if (componentId === 'default' || v.attr(_optionAttributes.resourceType.controller) !== null) {
      options.view = options.view || element;
      options.viewDeferred = true;
      options.html = options.html || false;
      options.css = options.css || false;
      // custom inline view style
      const styleElement = v.children('[media="#"]');
      if (styleElement.length() && styleElement.parent().get() === v.get()) {
        if (options.css === false) {
          options.css = '';
        }
        styleElement.each((i, el, $el) =>
          options.css += '\n' + options.css + $el.html()
        );
        styleElement.detach();
      }
      if (componentId === 'default') {
        options.controller = options.controller || function() {};
      }
    }
  }

  // inline attributes have precedence over ```options```

  const optionAttributes = Array.from(v.get().attributes)
      .filter((a) => a.nodeName.startsWith(':'));
  optionAttributes.forEach((attribute) => {
    const attr = attribute.nodeName;
    const path = attr.match(/[^:]+/g);
    let co = options;
    path && path.forEach((p, i) => {
      p = util.hyphensToCamelCase(p);
      if (i === path.length - 1) {
        let val;
        // Seek parentContext if any
        let parentContext = null;
        if (v.parent().get() instanceof ShadowRoot) {
          parentContext = options.__shadowRoot.parent(`[${_optionAttributes.zReady}="true"]`);
        } else {
          parentContext = v.parent(`[${_optionAttributes.zReady}="true"]`);
        }
        parentContext = zuix.context(parentContext);
        try {
          if (parentContext) {
            // evaluate option attributes value in the parent component scripting context
            let scriptlet = attribute.nodeValue;
            if (!scriptlet) return;
            const attr = attribute.nodeName;
            const isRootOption = attr.lastIndexOf(':') < 2;
            if (!scriptlet.match(/^[^<>()\[\]\-+\s!?/&£"=^#@:;,.*|]+$/g)) {
              scriptlet = `(event, args) => \{ ${attribute.nodeValue} \}`;
            }
            if (attr.startsWith(':model') || isRootOption) {
              scriptlet = `(${attribute.nodeValue})`;
            }
            try {
              val = zuix.runScriptlet(scriptlet, v, parentContext.$, null);
            } catch (e) {
              _log.warn(attr, attribute.nodeValue, e);
            }

            if (val == null) return; // TODO: should report a warning?

            if (attr === ':ready') {
              co.ready = val;
              return;
            }
            if (attr === ':error') {
              co.error = val;
              return;
            }
            if (attr.startsWith(':on') || attr.startsWith(':behavior')) {
              if (isRootOption) {
                co.on = val;
                return;
              }
              const eventName = attr.substring(attr.indexOf(':', 1) + 1);
              const optionField = (attr.startsWith(':behavior') ? co.behavior : co.on) || {};
              optionField[eventName] = val;
            } else if (attr.startsWith(':model')) {
              if (isRootOption) {
                co.model = val;
                return;
              }
              const path = attr.match(/[^:]+/g).splice(1);
              let model = co.model || {};
              path.forEach((p, i) => {
                p = util.hyphensToCamelCase(p);
                if (i === path.length - 1) {
                  return model[p] = val;
                }
                model = model[p] = model[p] || {};
              });
            }
          } else {
            // evaluate expression in the global scripting context
            val = Function('return ' + attribute.nodeValue + ';')();
          }
        } catch (e) {
          _log.warn(path.join(':'), p, attribute.nodeValue, e);
        }
        return co[p] = val;
      }
      co = co[p] = co[p] || {};
    });
  });

  const on = v.attr(_optionAttributes.zOn);
  if (on) {
    options.on = parseOptions(element, on);
  }

  const css = v.attr(_optionAttributes.zCss);
  if (css) {
    options.css = parseOptions(element, css);
  }

  const behavior = v.attr(_optionAttributes.zBehavior);
  if (behavior) {
    options.behavior = parseOptions(element, behavior);
  }

  const model = v.attr(_optionAttributes.zModel);
  if (model) {
    options.model = parseOptions(element, model);
  }

  const using = v.attr(_optionAttributes.zUsing);
  if (using) {
    options.using = using;
  }

  const priority = v.attr(_optionAttributes.zPriority);
  if (priority) {
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
          z$.each(config.libraryPath, (k, v) => {
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
    const parentComponent = z$(element).parent(util.dom.queryAttribute(_optionAttributes.zLoad));
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
  if (element && options) {
    if (options.componentId) {
      util.dom.setAttribute(element, _optionAttributes.zLoad, options.componentId.toString().toLowerCase());
    }
    if (options.contextId) {
      util.dom.setAttribute(element, _optionAttributes.zContext, options.contextId.toString().toLowerCase());
    }
    if (options.lazyLoad) {
      util.dom.setAttribute(element, _optionAttributes.zLazy, options.lazyLoad.toString().toLowerCase());
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
  const $el = z$(element);
  const lazyParent = $el.parent(`[${_optionAttributes.zLazy}]`);
  if ($el.attr(_optionAttributes.zLazy) === 'false' ||
      (lazyParent.length() && lazyParent.attr(_optionAttributes.zLazy) === 'false') ) {
    return false;
  }
  // Check if element is already added to Lazy-Element list
  if (!getLazyElement(element)) {
    // Check if element inherits lazy-loading from a parent lazy container/scroll
    const q = util.dom.queryAttribute(_optionAttributes.zLazy, 'scroll') + ',' +
            util.dom.queryAttribute(_optionAttributes.zLazy, 'true');
    const p = $el.parent();
    const lazyContainer = p.length() ? p.parent(q).get() : null;
    if (lazyContainer) {
      addLazyElement(element);
      // Check if the lazy container is already added to the lazy container list
      let lc = getLazyContainer(lazyContainer);
      if (!lc) {
        lc = addLazyContainer(lazyContainer);
        // if it's of type 'scroll' attach 'scroll' event handler
        if (util.dom.getAttribute(lazyContainer, _optionAttributes.zLazy) === 'scroll') {
          (function(instance, lc) {
            let lastScroll = new Date().getTime();
            let timeout;
            z$(lc === document.body ? window : lc).on('scroll', () => {
              const now = new Date().getTime();
              if (now - lastScroll > _lazyUpdateScrollRefresh) {
                lastScroll = now;
                loadNext(lc);
              } else {
                clearTimeout(timeout);
                timeout = setTimeout(() => loadNext(lc), 100);
              }
            });
          })(this, lazyContainer);
        }
      }
      return true;
    } else if ($el.attr(_optionAttributes.zLazy) === 'true') {
      // element has explicit lazyLoad=true flag set
      addLazyElement(element);
      return true;
    }
  } else return true;
  return false;
}
