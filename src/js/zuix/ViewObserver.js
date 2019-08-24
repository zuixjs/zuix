/*
 * Copyright 2015-2019 G-Labs. All Rights Reserved.
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

const _optionAttributes =
    require('./OptionAttributes');
const util =
    require('../helpers/Util');

/**
 *
 * @param {ComponentContext} context
 * @constructor
 */
function ViewObserver(context) {
    const _t = this._context = context;
    /**
     *
     * @type {MutationObserver|null}
     * @private
     */
    this._mutationObserver = null;
    /**
     * @private
     * @type {MutationCallback}
     */
    this._mutationCallback =
        /**
         * @param mutationsList
         * @param observer
         * @private
         */
        function(mutationsList, observer) {
            const zc = util.dom.queryAttribute(_optionAttributes.dataUiComponent);
            for (let mutation of mutationsList) {
                if (mutation.type === 'childList') {
                    mutation.addedNodes.forEach(function(node) {
                        if (node instanceof Element) {
                            let parent = zuix.$(node).parent(zc);
                            if (_t.options().css !== false && parent.attr(_controllerOnlyAttribute) == null) {
                                if ((parent.get() === _t._container || parent.get() === _t._view)) {
                                    let found = false;
                                    for (let i = 0; i < node.attributes.length; i++) {
                                        if (node.attributes[i].name.startsWith(_cssIdAttribute)) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        util.dom.setAttribute(node, _t.getCssId(), '');
                                    }
                                }
                            } else {
                                let c = 0;
                                do {
                                    c++;
                                    parent = parent.parent(zc);
                                } while (c < 10 && parent.get() != null && parent.attr(_controllerOnlyAttribute) != null);
                                if (parent.get()) {
                                    parent = zuix.context(parent);
                                    let found = false;
                                    for (let i = 0; i < node.attributes.length; i++) {
                                        if (node.attributes[i].name.startsWith(_cssIdAttribute)) {
                                            found = true;
                                            break;
                                        }
                                    }
                                    if (!found) {
                                        util.dom.setAttribute(node, parent.getCssId(), '');
                                        zuix.$(node).find('*').each(function() {
                                            this.attr(parent.getCssId(), '');
                                        });
                                    }
                                }
                            }
                        }
                    });
                }
                // TODO: this might be used for improving data binding
                // else if (mutation.type === 'attributes') {
                //     console.log('The ' + mutation.attributeName + ' attribute was modified.');
                // }
            }
        };
}
ViewObserver.prototype.start = function() {
    this.stop();
    const config = {attributes: false, childList: true, subtree: true};
    this._mutationObserver = new MutationObserver(this._mutationCallback);
    this._mutationObserver.observe(this._context._view, config);
};
ViewObserver.prototype.stop = function() {
    if (this._mutationObserver != null) {
        this._mutationObserver.disconnect();
        this._mutationObserver = null;
    }
};

module.exports = ViewObserver;
