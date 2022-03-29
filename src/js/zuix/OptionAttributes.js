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

const OptionAttributes = Object.freeze({
  dataBindModel:
        'z-model,data-bind-model',
  dataBindTo:
        'z-bind,data-bind-to',
  dataUiBehavior:
        'z-behavior',
  dataUiOn:
        'z-on',
  dataUiComponent:
        'z-component',
  dataUiContext:
        'z-context,data-ui-context',
  dataUiField:
        'z-field,data-ui-field',
  dataUiInclude:
        'z-include,data-ui-include',
  dataUiLazyload:
        'z-lazy,data-ui-lazyload',
  dataUiLoad:
        'z-load,data-ui-load',
  dataUiLoaded:
        'z-loaded',
  dataUiOptions:
        'z-options,data-ui-options',
  dataUiPriority:
        'z-priority,data-ui-priority',
  dataUiView:
        'z-view,data-ui-view',
  zuixLoaded:
        'zuix-loaded',
  dataUiReady:
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
