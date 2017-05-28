/*
|| ZUIX - ListView component example
|| this is an alternative implementation of the official list-view component
|| that is located at http://www.zuix.it/ui/layout/list_view.js
 */
zuix.controller(function (cp) {

    var listItems = [], listEndCallback = null, itemOptions;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().html('');
        // globally store list view item options
        window.list_view_opts = {};
        itemOptions = window.list_view_opts[cp.context.contextId.replace(/-/g, '_')] = {};
        // expose method list_view.done(fn_callback)
        cp.expose('done', loadedCallback);
    };

    cp.destroy = function () {
        // TODO: ...
    };

    cp.update = function() {

        var modelList = cp.model().itemList;
        if (modelList == null) return;

        for (var i = 0; i < modelList.length; i++) {
            var dataItem = cp.model().getItem(i, modelList[i]);
            var id = dataItem.itemId;
            var item = listItems[id];
            if (typeof item === 'undefined') {
                // create container for the list item
                var container = document.createElement('div');
                // set the component to load for this item
                container.setAttribute('data-ui-load', dataItem.componentId);
                // TODO: this is a work around, otherwise element won't load - not sure if this is a bug
                dataItem.options.lazyLoad = false;
                container.setAttribute('data-ui-options', setItemOptions(i, dataItem.options));
                // use a responsive CSS class if provided
                if (dataItem.options.className != null) {
                    // this class should set the min-height property
                    container.classList.add(dataItem.options.className);
                } else {
                    // set a temporary height for the container (for lazy load to work properly)
                    container.style['min-height'] = dataItem.options.height || '48px';
                }
                // add item container to the list-view, the component will be lazy-loaded later as needed
                cp.view().insert(i, container);
                // register a callback to know when the component is actually loaded
                var listener = function (itemIndex, el) {
                    el.removeEventListener('component:ready', listener);
                    if (itemIndex == modelList.length-1 && listEndCallback != null) {
                        listEndCallback();
                    }
                }(i, container);
                container.addEventListener('component:ready', listener);
                // keep track of already created items
                listItems[id] = container;
            } else if (!dataItem.options.static) {
                // update item model's data
                zuix.context(item).model(dataItem.options.model);
            }
        }
        // `componentize` is required to process lazy-loaded items (if any)
        zuix.componentize(cp.view());

    };

    function loadedCallback(c) {
        listEndCallback = c;
    }

    function setItemOptions(i, options){
        itemOptions['opt_'+i] = options;
        return 'list_view_opts.'+cp.context.contextId.replace(/-/g, '_')+'.opt_'+i;
    }
});