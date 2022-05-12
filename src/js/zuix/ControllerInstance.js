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

// noinspection JSClosureCompilerSyntax
/**
 * @class ControllerInstance
 * @param {ContextController} controller The controller instance.
 * @extends {ContextController}
 * @constructor
 */
function ControllerInstance(controller) {
  const _t = this;
  controller.init = this.onInit.bind(this);
  controller.create = this.onCreate.bind(this);
  controller.dispose = this.onDispose.bind(this);
  controller.update = function(target, key, value, path, old) {
    return _t.onUpdate.call(_t, target, key, value, path, old);
  };
  Object.assign(this, controller);
  Object.assign(this, Object.getPrototypeOf(controller));
}
/**
 * @type {ContextControllerInitCallback}
 */
ControllerInstance.prototype.onInit = function() {
};
/**
 * @type {ContextControllerCreateCallback}
 */
ControllerInstance.prototype.onCreate = function() {
};
/**
 * @type {ContextControllerDisposeCallback}
 */
ControllerInstance.prototype.onDispose = function() {
};
/**
 * @type {ContextControllerUpdateCallback}
 */
// eslint-disable-next-line no-unused-vars
ControllerInstance.prototype.onUpdate = function(target, key, value, path, old) {
};

module.exports = ControllerInstance;
