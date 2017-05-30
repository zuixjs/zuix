zuix.controller(function (cp) {

    var listItems = [];

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().html(''); // TODO: this line can be removed
        // exposed methods
        cp.expose('clear', clear);
    };

    cp.destroy = function () {
        clear();
    };

    cp.update = function() {

        var modelList = cp.model().itemList;
        if (modelList == null) return;

        // TODO: DOM is not really ready for dynamic views, so the current "polite"
        // TODO: approach might seem a bit slow. The only way to improve this is by
        // TODO: creating in memory the whole html string and then getting item instances
        // TODO: with using zuix.load(...) method.

        for (var i = 0; i < modelList.length; i++) {
            var dataItem = cp.model().getItem(i, modelList[i]);
            var id = dataItem.itemId;
            if (typeof listItems[id] === 'undefined') {
                // create the component for the new list item
                listItems[id] = zuix.createComponent(dataItem.componentId, dataItem.options);
                var container = listItems[id].container();
                // use a responsive CSS class if provided
                if (dataItem.options.className != null) {
                    // this class should set the min-height property
                    container.classList.add(dataItem.options.className);
                } else {
                    // set a temporary height for the container (for lazy load to work properly)
                    container.style['min-height'] = dataItem.options.height || '48px';
                }
                // register a callback to know when the component is actually loaded
                var listener = function (itemIndex, el) {
                    var l = function () {
                        el.removeEventListener('component:ready', l);
                        // if all components have been loaded, then trigger 'complete' event
                        if (itemIndex === modelList.length-1)
                            cp.trigger('complete');
                    };
                    container.addEventListener('component:ready', l);
                }(i, container);
                cp.view().insert(i, container);
            } else if (!dataItem.options.static) {
                // update existing item model's data
                // TODO: should check if the data in the model has changed before calling this
                listItems[id].model(dataItem.options.model);
            }
        }

        // `componentize` is required to process lazy-loaded items (if any)
        zuix.componentize(cp.view());

    };

    function clear() {
        // clear data and cache
        cp.view().html('');
        // dispose components
        for (var i = 0; i < listItems.length; i++) {
            zuix.unload(listItems[i]);
        }
        listItems.length = 0;
    }

});