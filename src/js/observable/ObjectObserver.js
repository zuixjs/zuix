/*
 * Copyright 2015-2021 G-Labs. All Rights Reserved.
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
 * @author Generoso Martello <generoso@martello.com>
 */

'use strict';

const ObservableListener =
    require('./ObservableListener');
const ObservableObject =
    require('./ObservableObject');

/**
 * Object Observer
 *
 * @class ObjectObserver
 * @constructor
 */
function ObjectObserver() {
  /**
     * @private
     * @type {ObservableObject[]}
     */
  this.observableList = [];
}

function getPath(observable) {
  let path = '';
  while (observable && observable.__path__) {
    const co = observable;
    // TODO: this line is perhaps ambiguous how to resolve path if target[key] has more parents?
    observable = observable.__parents__[0];
    if (observable != null && observable.__path__ != null) {
      path = '[\'' + co.__path__ + '\'].' + path;
    } else {
      path = co.__path__ + (!path.startsWith('[') ? '.' : '') + path;
    }
  }
  return path;
}
function getListeners(observable) {
  const listeners = [];
  observable.__parents__.forEach(function(po) {
    listeners.push(...getListeners(po));
  });
  listeners.push(...observable.__listeners__);
  return listeners;
};

function deleteObservable(targetObservable) {
  getListeners(targetObservable).forEach(
      /** @param {ObservableListener} l */
      function(l) {
        targetObservable.unsubscribe(l);
      }
  );
}

/**
 * Get an observable instance of an object for detecting changes.
 *
 * @param {Object} obj The object to observe
 * @return {ObservableObject} The observable object
 */
ObjectObserver.prototype.observable = function(obj) {
  const _t = this;
  /** @type {ObservableObject} */
  let observable;
  const matches = this.observableList.filter(function(o) {
    return obj === o.proxy || obj === o.target;
  });
  if (matches.length === 1) {
    observable = matches[0];
  }
  if (observable == null) {
    const handler = {
      /** @type ObjectObserver */
      context: null,
      get: function(target, key) {
        if (key === 'observableTarget') return target;
        let value = target[key];
        if (typeof value === 'undefined') {
          return;
        }
        /** @type {ObservableListener[]} */
        const listeners = [];
        const targetObservable = this.context.observable(target);
        if (typeof value === 'object') {
          /** @type {ObservableObject} */
          const valueObservable = this.context.observable(value);
          // link to parent
          if (valueObservable.__parents__.indexOf(targetObservable) === -1) {
            valueObservable.__parents__.push(targetObservable);
            valueObservable.__path__ = key;
          }
          listeners.push(...getListeners(valueObservable));
          // set the return value to the observable value proxy (child)
          value = valueObservable.proxy;
        } else {
          listeners.push(...getListeners(targetObservable));
        }
        const path = getPath(targetObservable) + key;
        // propagate to all listeners
        listeners.forEach(function(l) {
          l.get(target, key, value, path);
        });
        return value;
      },
      set: function(target, key, value) {
        const old = JSON.parse(JSON.stringify(target));
        const oldValue = target[key];
        if (typeof oldValue === 'object') {
          deleteObservable(this.context.observable(oldValue));
        }
        target[key] = value;
        const targetObservable = this.context.observable(target);
        const path = getPath(targetObservable) + key;
        getListeners(targetObservable).forEach(
            /** @param {ObservableListener} l */
            function(l) {
              l.set(target, key, value, path, old);
            }
        );
        return true;
      },
      deleteProperty: function(target, property) {
        const value = target[property];
        if (typeof value === 'object') {
          deleteObservable(this.context.observable(value));
        }
        return delete target[property];
      }
    };
    observable = new ObservableObject(this, obj, handler);
  }
  return observable;
};
module.exports = ObjectObserver;
