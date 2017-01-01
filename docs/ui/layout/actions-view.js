zuix.controller(function($$){

    $$.create = function () {

        // TODO: move the following line in the zuix core
        $$.view.attr('data-ui-component', $$.componentId);

        $$.view.children().each(function(index){
            $(this).on('click', function () {
                setSelected(index);
            });
        });
        setSelected(0)

    };

    $$.destroy = function() {

        // TODO: move the following line in the zuix core
        $$.view.removeAttr('data-ui-component');

        $$.view.children().each(function(){
            $(this).off('click');
            $(this).removeClass('is-active');
        });
        selected = -1;

    };

    $$.api = function(command, options) {
        switch (command) {
            case 'select':
            case 'setSelected':
                setSelected(options);
                break;
        }
    };

    // Private Members

    var selected = -1;

    function setSelected(index) {
        var actions = $$.view.children();
        actions.each(function(){
           $(this).removeClass('is-active');
        });
        if (index != selected)
            actions.eq(index).addClass('is-active');
        $$.trigger('item:click', index);
    }

});