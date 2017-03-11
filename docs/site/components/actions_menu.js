zuix.controller(function (cp) {
    var toolbar, fab, actions;
    var open = false; // initial state

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {

        cp.expose('showMenu', showMenu);
        cp.expose('hideMenu', hideMenu);
        cp.expose('open', function (doOpen) {
            if (doOpen != null)
                toolbarToggle(doOpen);
            else return open;
        });

        // toolbar view
        toolbar = cp.view();
        toolbar.css('overflow', 'hidden');
        // fab button
        fab = toolbar.find('.menu');
        fab.on('click', function () {
            toolbarToggle();
        });
        // actions buttons
        actions = toolbar.find('.options')
            .css('overflow', 'hidden')
            .hide()
            .children();
        actions.each(function (index, item) {
            this.on('click', function () {
                toolbarToggle();
                cp.trigger('item:click', index);
            });
        });

    };

    cp.destroy = function () {

        actions.each(function (i, item) {
            this.off('click');
        });

    };

    // Private Members

    function showMenu() {
        cp.view().show().animateCss('flipInY', { delay: '0.5s' });
    }
    function hideMenu() {
        if (open) toolbarToggle();
        fab.animateCss('flipOutY', function () {
            if (!cp.view().hasClass('animated'))
                cp.view().hide()
        });
    }

    function toolbarToggle(doOpen) {
        var duration = 0.5;
        open = typeof doOpen !== 'undefined' ? doOpen : !open;
        if (open)
            toolbar.find('.options').show().animateCss('bounceInUp', { duration: duration+'s' }, function () {
                open = true;
            });
        else
            toolbar.find('.options').animateCss('bounceOutDown', { duration: duration+'s' }, function () {
                toolbar.find('.options').hide();
                open = false;
            });
        fab.animateCss('rubberBand', { duration: duration+'s' });
    }

});