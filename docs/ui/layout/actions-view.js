zuix.controller(function($$){

    $$.create = function () {

        $$.view.children().each(function(index){
            $(this).on('click', function () {
                setSelected(index);
            });
        });
        setSelected(0)

    };

    $$.destroy = function() {

        $$.view.children().each(function(){
            $(this).off('click');
            $(this).removeClass('is-active');
        });
        selectedItem = -1;

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

    var selectedItem = -1;
    function setSelected(index) {
        var actions = $$.view.children();
        actions.each(function(){
           $(this).removeClass('is-active');
        });
        if (index != selectedItem)
            actions.eq(index).addClass('is-active');
        $$.trigger('item:click', index);
    }

});