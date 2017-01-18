(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define('zuix', function () {
            return (root.zuix = (factory).call(root));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node
        module.exports = (factory).call(root);
    } else {
        // Browser globals
        root.zuix = (factory).call(root);
    }
}(this, require('./zuix/Zuix.js')));
