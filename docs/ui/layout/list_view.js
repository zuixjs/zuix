zuix.controller(function (cp) {

    var listItems = [], listEndCallback = null;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().html('');
        cp.expose('done', loadedCallback);
    };

    cp.destroy = function () {
        // TODO: ...
    };

    cp.update = function() {

        //cp.view().detach();

        var modelList = cp.model().itemList;
        if (modelList == null) return;

        // TODO: DOM is not really ready for dynamic views, so the current "polite"
        // TODO: approach might seem a bit slow. The only way to improve this is by
        // TODO: creating in memory the whole html string and then getting item instances
        // TODO: with using zuix.load(...) method.
        for (var i = 0; i < modelList.length; i++) {
            var dataItem = cp.model().getItem(i, modelList[i]);
            var id = dataItem.itemId;
            var item = listItems[id];
            if (typeof item === 'undefined') {
                listItems[id] = zuix.createComponent(dataItem.componentId, dataItem.options);
                var container = listItems[id].container();
                // set a temporary height for the container (for lazy load to work properly)
                container.style['min-height'] = dataItem.options.height || '48px';
                var listener = function (itemIndex, el) {
                    el.removeEventListener('component:ready', listener);
                    if (itemIndex == modelList.length-1 && listEndCallback != null) {
                        listEndCallback();
                    }
                }(i, container);
                container.addEventListener('component:ready', listener);
                cp.view().insert(i, container);
            } else if (!dataItem.options.static) {
                // update item model's data
                item.model(dataItem.options.model);
            }
        }
        // `componentize` is required to process lazy-loaded items (if any)
        zuix.componentize(cp.view());

    };

    function loadedCallback(c) {
        listEndCallback = c;
    }

});