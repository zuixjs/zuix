zuix.controller(function (cp) {

    cp.create = function () {

        cp.view().children().each(function (index) {
            cp.view(this).on('click', function () {
                setSelected(index);
            });
        });
        setSelected(0)

    };

    cp.destroy = function () {

        cp.$().children().each(function () {
            cp.view(this).off('click');
            cp.view(this).removeClass('is-active');
        });
        selectedItem = -1;

    };

    // Private Members

    var selectedItem = -1;

    function setSelected(index) {
        var actions = cp.view().children();
        actions.each(function () {
            cp.view(this).removeClass('is-active');
        });
        if (index != selectedItem)
            actions.eq(index).addClass('is-active');
        cp.trigger('item:click', index);
    }

});