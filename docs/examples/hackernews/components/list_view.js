/*
|| ZUIX - ListView component example
|| this is an alternative implementation of the official list-view component
|| that is located at http://www.zuix.it/ui/layout/list_view.js
 */
zuix.controller(function (cp) {

    var listItems = [], itemOptions;
    var currentPage = 0, itemsPerPage = 30, loadedCount = 0;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        // exposed methods
        cp.expose('goto', function (page) {
            currentPage = page;
            cp.update();
        });
        cp.expose('more', function () {
            currentPage++;
            var children = cp.view().children();
            for (var i = currentPage*itemsPerPage; i < ((currentPage+1)*itemsPerPage); i++)
                children.eq(i).show();
        });
        cp.expose('clear', clear);
    };

    cp.destroy = function () {
        clear();
    };

    cp.update = function() {

        var modelList = cp.model().itemList;
        if (modelList == null) return;

        for (var i = 0; i < modelList.length; i++) {

            var dataItem = cp.model().getItem(i, modelList[i]);
            var id = dataItem.itemId;

            if (typeof listItems[id] === 'undefined') {
                // create container for the new list item
                var container = document.createElement('div');
                // set the component to load for this item
                //container.innerHTML = '<div class="spinner"><div></div><div></div><div></div><div></div></div>';
                container.setAttribute('data-ui-load', dataItem.componentId);
                container.setAttribute('data-ui-options', setItemOptions(i, dataItem.options));
                // TODO: the next line is a work around, otherwise element won't load - not sure if this is a bug
                dataItem.options.lazyLoad = false;
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
                    var l = function () {
                        el.removeEventListener('component:ready', l);
                        cp.trigger('loaded', ++loadedCount);
                        // if all components have been loaded, then trigger 'complete' event
                        if (itemIndex === modelList.length-1)
                            cp.trigger('complete');
                    };
                    container.addEventListener('component:ready', l);
                }(i, container);
                // keep track of already created items
                listItems[id] = container;
            } else if (!dataItem.options.static) {
                // update existing item model's data
                // TODO: should check if the data in the model has changed before calling this
                zuix.context(listItems[id]).model(dataItem.options.model);
            }

            // Paging mode if currentPage > -1, otherwise full-list with scroll
            if (currentPage !== -1) {
                if (i < currentPage*itemsPerPage || i > ((currentPage+1)*itemsPerPage-1))
                    listItems[id].style.display = 'none';
                else
                    listItems[id].style.display = '';
            }

        }

        // `componentize` is required to process lazy-loaded items (if any)
        zuix.componentize(cp.view());

    };

    function setItemOptions(i, options){
        itemOptions['opt_'+i] = options;
        return 'list_view_opts.'+cp.context.contextId.replace(/-/g, '_')+'.opt_'+i;
    }

    function clear() {
        // clear data and cache
        cp.view().html('');
        // globally store list view item options
        window.list_view_opts = window.list_view_opts || {};
        itemOptions = window.list_view_opts[cp.context.contextId.replace(/-/g, '_')] = {};
        // dispose components
        for (var i = 0; i < listItems.length; i++) {
            zuix.unload(listItems[i]);
        }
        listItems.length = 0;
    }
});