zuix.controller(function (cp) {

    var listItems = {};

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().html('');
        cp.update();
    };

    cp.destroy = function () {

    };

    cp.update = function() {

        var modelList = cp.model().itemList;
        if (modelList == null) return;

        for (var i = 0; i < modelList.length; i++) {
            var dataItem = cp.model().getItem(i, modelList[i]);
            var id = dataItem.itemId;
            var item = listItems[id];
            if (typeof item === 'undefined') {
                listItems[id] = zuix.createComponent(dataItem.componentId, dataItem.options);
                var container = listItems[id].container();
                // set a temporary height for the container (for lazy load to work property)
                container.style['min-height'] = '24px';
                cp.view().insert(i, container);
            } else {
                // update item model's data
                item.model(dataItem.options.model);
            }
        }
        zuix.componentize(cp.view());

    }

});