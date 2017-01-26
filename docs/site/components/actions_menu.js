zuix.controller(function (ctx) {
    var toolbar, fab, actions;
    var open = true; // initial state

    ctx.create = function () {

        // toolbar view
        toolbar = ctx.view();
        // fab button
        fab = toolbar.children().eq(0);
        fab.on('click', function () {
            toolbarToggle();
        });
        // actions buttons
        actions = toolbar.children().eq(1)
            .css('overflow', 'hidden')
            .children();
        actions.each(function (index) {
            zuix.$(this).on('click', function () {
                toolbarToggle();
                ctx.trigger('item:click', index);
            });
        });

        toolbarToggle();
    };

    ctx.destroy = function () {

        actions.each(function () {
            zuix.$(this).off('click');
        });

    };

    // Private Members

    function toolbarToggle() {
        open = !open;
        actions.each(function (i) {
            var button = zuix.$(this);
            if (open)
                button
                    .animateCss('fadeInLeftBig', {
                        delay: (i / 10) + 's',
                        duration: '0.35s'
                    }).css('visibility', 'visible');
            else
                button
                    .animateCss('fadeOutLeftBig', {
                        delay: (i / 8) + 's',
                        duration: '1.0s'
                    }, function () {
                        zuix.$(this).css('visibility', 'hidden');
                    });
        }).reverse();
        fab.css('-webkit-animation-duration', '0.6s').animateCss('rubberBand');
    }

});