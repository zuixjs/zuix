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

const OptionAttributes = Object.freeze({
  zModel:
    'z-model',
  zBind:
    'z-bind',
  zBehavior:
    'z-behavior',
  zOn:
    'z-on',
  zCss:
    'z-css',
  zComponent:
    'z-component',
  zContext:
    'z-context',
  zField:
    'z-field',
  zLazy:
    'z-lazy',
  zLoad:
    'z-load',
  zLoaded:
    'z-loaded',
  zOptions:
    'z-options',
  zUsing:
    'z-using',
  zPriority:
    'z-priority',
  zView:
    'z-view',
  zuixLoaded:
    'zuix-loaded',
  zReady:
    'z-ready',
  // Types attributes
  resourceType: {
    view: 'view',
    controller: 'ctrl',
    file: 'file'
  },
  // Identifiers attributes
  cssIdPrefix:
    'z-css-'
});

module.exports = OptionAttributes;
