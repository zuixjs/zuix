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

/**
 * ObservableObject type definition.
 *
 * @typedef {Object} ObservableObject
 * @property {function(ObservableListener):ObservableObject} subscribe Subscribe a listener to this observable events
 * @property {function(ObservableListener):ObservableObject} unsubscribe Unsubscribe a listener
 * @property {function():void} revoke Revoke this observable
 * @property {Proxy} proxy The proxy object of this observable
 * @property {Object} target The target object
 * @package
 * @property {ObservableListener[]|undefined} __parents__
 * @package
 * @property {ObservableListener[]} __listeners__
 * @package
 * @property {string} __path__
 */

/**
 * ObservableListener type definition.
 *
 * @typedef ObservableListener
 * @property {function(Object,string,Object,string):void} get Value get callback
 * @property {function(Object,string,Object,string,Object):void} set Value set callback
 */

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
 * @param {Proxy|Object} obj The object to observe
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
                let targetObservable = this.context.observable(target);
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
                let old = JSON.parse(JSON.stringify(target));
                let oldValue = target[key];
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
                let value = target[property];
                if (typeof value === 'object') {
                    deleteObservable(this.context.observable(value));
                }
                return delete target[property];
            }
        };
        Object.assign(handler, {context: this});
        observable = Proxy.revocable(obj, handler);
        observable.target = obj;
        observable.__parents__ = [];
        observable.__listeners__ = [];
        observable.subscribe = function(listener) {
            _t.observableList.forEach(function(p) {
                if (p !== observable && p.__listeners__.indexOf(listener) !== -1) {
                    throw new Error('Listener already registered.');
                }
            });
            observable.__listeners__.push(listener);
            return observable;
        };
        observable.unsubscribe = function(listener) {
            const i = observable.__listeners__.indexOf(listener);
            if (i !== -1) {
                observable.__listeners__.splice(i, 1);
            }
            if (observable.__listeners__.length === 0) {
                // this observable has no more direct listeners and can be removed
                observable.revoke();
                // TODO: this is untested!!!
                // remove this observable and parent references to it
                _t.observableList = _t.observableList.filter(function(p) {
                    if (p === observable) return false;
                    const i = p.__parents__.indexOf(observable);
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
            return observable;
        };
        this.observableList.push(observable);
    }
    return observable;
};
module.exports = ObjectObserver;
