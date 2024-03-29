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

const ObservableObject =
    require('./ObservableObject');

/**
 * Object Observer
 *
 * @class
 * @constructor
 */
function ObjectObserver() {
  /**
     * @private
     * @type {ObservableObject[]}
     */
  this.observableList = [];
}

/** @private */
function getPath(observable) {
  let path = '';
  while (observable && observable.__path__) {
    const co = observable;
    // TODO: this line is perhaps ambiguous how to resolve path if target[key] has more parents?
    observable = observable.__parents__[0];
    if (observable && observable.__path__) {
      path = '[\'' + co.__path__ + '\'].' + path;
    } else {
      path = co.__path__ + (!path.startsWith('[') ? '.' : '') + path;
    }
  }
  return path;
}
/** @private */
function getListeners(observable) {
  const listeners = [];
  observable.__parents__.forEach((po) =>
    listeners.push(...getListeners(po))
  );
  listeners.push(...observable.__listeners__);
  return listeners;
}

/** @private */
function deleteObservable(targetObservable) {
  getListeners(targetObservable).forEach(
      /** @param {ObservableListener} l */
      (l) => targetObservable.unsubscribe(l)
  );
}

/**
 * Get an observable instance of an object for detecting changes.
 *
 * @param {Object} obj The object to observe
 * @return {ObservableObject} The observable object
 */
ObjectObserver.prototype.observable = function(obj) {
  /** @type {ObservableObject} */
  let observable;
  const matches = this.observableList.filter((o) =>
    obj === o.proxy || obj === o.target);
  if (matches.length === 1) {
    observable = matches[0];
  }
  if (observable == null) {
    const handler = {
      /** @type ObjectObserver */
      context: null,
      get: function(target, key) {
        if (key === 'toJSON') {
          return () => target;
        }
        if (key === 'observableTarget') {
          return target;
        }
        if (key.toString() === 'Symbol(Symbol.toStringTag)') {
          return;
        }
        let value;
        try {
          value = target[key];
        } catch (e) {
          // TODO: proxy has been revoked
        }
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
        listeners.forEach((l) => {
          if (l.get) {
            l.get(target, key, value, path);
          }
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
            (l) => {
              if (l.set) {
                l.set(target, key, value, path, old);
              }
              if (old[path] !== value && l.change) {
                l.change(target, key, value, path, old);
              }
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
