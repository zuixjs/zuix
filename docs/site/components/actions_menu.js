zuix.controller(function (cp) {
    var toolbar, fab, actions;
    var open = true; // initial state

    cp.create = function () {

        // toolbar view
        toolbar = cp.view();
        // fab button
        fab = toolbar.children().eq(0);
        fab.on('click', function () {
            toolbarToggle();
        });
        // actions buttons
        actions = toolbar.children().eq(1)
            .css('overflow', 'hidden')
            .children();
        actions.each(function (index, item) {
            this.on('click', function () {
                toolbarToggle();
                cp.trigger('item:click', index);
            });
        });

        toolbarToggle();
    };

    cp.destroy = function () {

        actions.each(function (i, item) {
            this.off('click');
        });

    };

    // Private Members

    function toolbarToggle() {
        open = !open;
        /** @type {ZxQuery} actions */
        actions.each(function (i, button) {
            if (open)
                this.animateCss('fadeInLeftBig', {
                        delay: (i / 10) + 's',
                        duration: '0.35s'
                    }).css('visibility', 'visible');
            else
                this.animateCss('fadeOutLeftBig', {
                        delay: (i / 8) + 's',
                        duration: '1.0s'
                    }, function () {
                        this.css('visibility', 'hidden');
                    });
        }).reverse();
        fab.animateCss('rubberBand', { 'duration': '0.6s' });
    }

});