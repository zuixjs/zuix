'use strict';

/**
 * @class ControllerInstance
 * @param {ContextController} [controller] The controller instance.
 * @extends {ContextController}
 * @constructor
 */
function ControllerInstance(controller) {
  const _t = this;
  /**
   * @type {ContextController}
   */
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
ControllerInstance.prototype.onUpdate = function(target, key, value, path, old) {
};

module.exports = ControllerInstance;
