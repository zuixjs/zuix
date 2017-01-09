zuix.controller(function (ctx) {

    ctx.create = function () {

        zuix.$(ctx.view()).children().each(function (index) {
            zuix.$(this).on('click', function () {
                setSelected(index);
            });
        });
        setSelected(0)

    };

    ctx.destroy = function () {

        zuix.$(ctx.view()).children().each(function () {
            zuix.$(this).off('click');
            zuix.$(this).removeClass('is-active');
        });
        selectedItem = -1;

    };

    ctx.api = function (command, options) {
        switch (command) {
            case 'select':
            case 'setSelected':
                setSelected(options);
                break;
        }
    };

    // Private Members

    var selectedItem = -1;

    function setSelected(index) {
        var actions = zuix.$(ctx.view()).children();
        actions.each(function () {
            zuix.$(this).removeClass('is-active');
        });
        if (index != selectedItem)
            actions.eq(index).addClass('is-active');
        ctx.trigger('item:click', index);
    }

});