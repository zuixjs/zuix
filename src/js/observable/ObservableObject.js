/*
 * Copyright 2015-2022 G-Labs. All Rights Reserved.
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

/**
 * ObservableObject class.
 *
 * @class
 * @param {Object} context The observer context
 * @param {Object} target The target object to observe
 * @param {ProxyHandler} handler Handler for get/set callbacks
 * @constructor
 */
function ObservableObject(context, target, handler) {
  Object.assign(handler, {context: context});
  Object.assign(this, Proxy.revocable(target, handler));
  /** @private */
  this.handler = handler;
  /** @private */
  this.handler.context.observableList = this.handler.context.observableList || [];
  this.handler.context.observableList.push(this);
  /** @private */
  this.target = target;
  /** @private */
  this.__parents__ = [];
  /** @private */
  this.__listeners__ = [];
}

/**
 * Subscribe a listener to this observable events
 *
 * @param {ObservableListener} observableListener
 * @returns ObservableObject
 */
ObservableObject.prototype.subscribe = function(observableListener) {
  this.handler.context.observableList.forEach((p) => {
    if (p !== this && p.__listeners__.indexOf(observableListener) !== -1) {
      throw new Error('Listener already registered.');
    }
  });
  this.__listeners__.push(observableListener);
  return this;
};

/**
 * Unsubscribe a listener
 *
 * @param {ObservableListener} observableListener
 * @returns ObservableObject
 */
ObservableObject.prototype.unsubscribe = function(observableListener) {
  const i = this.__listeners__.indexOf(observableListener);
  if (i !== -1) {
    this.__listeners__.splice(i, 1);
  }
  if (this.__listeners__.length === 0) {
    // this observable has no more direct listeners and can be removed
    this.revoke();
    // TODO: this is untested!!!
    // remove this observable and parent references to it
    this.handler.context.observableList = this.handler.context.observableList.filter((p) => {
      if (p === this) return false;
      const i = p.__parents__.indexOf(this);
      if (i !== -1) {
        p.__parents__.splice(i, 1);
        // if child has no more parents nor listeners, then remove it as well
        if (p.__parents__.length === 0 && p.__listeners__.length === 0) {
          // recursive call
          p.unsubscribe(null);
          return false;
        }
      }
      return true;
    });
  }
  return this;
};

module.exports = ObservableObject;
