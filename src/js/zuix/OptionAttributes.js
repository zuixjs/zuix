
const OptionAttributes = Object.freeze({
    dataBindModel:
        'data-bind-model',
    dataBindTo:
        'data-bind-to',
    dataUiComponent:
        'data-ui-component',
    dataUiContext:
        'data-ui-context',
    dataUiField:
        'data-ui-field',
    dataUiInclude:
        'data-ui-include',
    dataUiLazyload:
        'data-ui-lazyload',
    dataUiLoad:
        'data-ui-load',
    dataUiLoaded:
        'data-ui-loaded',
    dataUiOptions:
        'data-ui-options',
    dataUiPriority:
        'data-ui-priority',
    dataUiView:
        'data-ui-view',
    zuixLoaded:
        'zuix-loaded'
});

/**
 * @param root
 * @return {Zuix}
 */
module.exports = function(root) {
    return OptionAttributes;
};
