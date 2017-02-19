zuix.controller(function (cp) {

    cp.create = function () {
        var c = cp.model();
        cp.field('componentId').html(c.componentId);
        cp.view().on('click', function () {
           cp.trigger('item:click', c);
        });
    };

});