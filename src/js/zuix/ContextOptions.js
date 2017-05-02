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
 *  ZUIX, Javascript library for component-based development.
 *        https://genielabs.github.io/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

/**
 * Component Context options object.
 * @typedef {object} ContextOptions
 * @property {Object|undefined} contextId The context id. HTML attribute equivalent: `data-ui-context`.
 * @property {Element|undefined} container The container element,
 * @property {JSON|undefined} model The data model.  HTML attribute equivalent: `data-bind-model`.
 * @property {Element|undefined} view The view element. HTML attribute equivalent: `data-ui-view`.
 * @property {ContextControllerHandler|undefined} controller The controller handler.
 * @property {Array.<EventMapping>|EventCallback|undefined} on The events handling map.
 * @property {Array.<EventMapping>|EventCallback|undefined} behavior The behaviors handling map.
 * @property {Element|string|boolean|undefined} css The view style.
 * @property {string|undefined} cext When loading view content, append the specified string instead of `.html`.
 * @property {boolean|undefined} html Enable or disable HTML auto-loading (**default:** true).
 * @property {boolean|undefined} lazyLoad Enable or disable lazy-loading (**default:** false).
 * @property {number|undefined} priority Loading priority (**default:** 0).
 * @property {ContextReadyCallback|undefined} ready The ready callback, called once the component is succesfully loaded.
 * @property {ContextErrorCallback|undefined} error The error callback, called when error occurs.
 */