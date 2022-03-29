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

/**
 * ObservableListener interface.
 *
 * @class
 * @constructor
 */
function ObservableListener() {}

/**
 * TODO: add description
 *
 * @param {Object} target The updated object
 * @param {string} key The property key
 * @param {Object} value The value
 * @param {string} path Full property path
 * @returns undefined
 */
ObservableListener.prototype.get = function(target, key, value, path) {};

/**
 * TODO: add description
 *
 * @param {Object} target The updated object
 * @param {string} key The property key
 * @param {Object} value The value
 * @param {string} path Full property path
 * @param {Object} old A copy of the object before the update
 * @returns undefined
 */
ObservableListener.prototype.set = function(target, key, value, path, old) {};

/**
 * TODO: add description
 *
 * @param {Object} target The updated object
 * @param {string} key The property key
 * @param {Object} value The value
 * @param {string} path Full property path
 * @param {Object} old A copy of the object before the update
 * @returns undefined
 */
ObservableListener.prototype.change = function(target, key, value, path, old) {};

module.export = ObservableListener;
