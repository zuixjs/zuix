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
 *
 * @typedef {{
 *    contextId: Object|undefined The context id,
 *    container: Element|undefined The container element,
 *    componentId: string|undefined The component identifier,
 *    model: JSON|undefined The data model,
 *    view: Element|ZxQuery|undefined The view element,
 *    css: Element|string|undefined,
 *    html: boolean|undefined,
 *    controller: ContextControllerHandler|undefined The controller handler,
 *    on: Array.<EventMapping>|EventCallback|undefined The events handling map,
 *    behavior: Array.<EventMapping>|EventCallback|undefined The behaviors handling map,
 *    ready: ContextReadyCallback|undefined The ready callback, called once the component is succesfully loaded,
 *    error: ContextErrorCallback|undefined The error callback, called when error occurs
 * }} ContextOptions
 *
 */