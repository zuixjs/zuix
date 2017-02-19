zuix.controller(function (logItem) {

    logItem.create = function () {

        var level = logItem.model().level;
        var args = logItem.model().args;
        var time = logItem.model().time;

        logItem.field('level')
            .addClass(level.toLowerCase())
            .html(level.substring(0, 1).toUpperCase());
        logItem.view().addClass(level.toLowerCase());

        logItem.field('target').html(args[0]);
        logItem.field('state').html(args[1] ? args[1] : '');
        logItem.field('info').html(args[2] ? args[2] : '');
        logItem.field('time').html(time);

        if (args[1] === 'component:loaded') {
            logItem.view().children().eq(0).addClass('linked');
            var sourceView = zuix.$(zuix.context(args[2]).view());
            logItem.view().on('mouseenter', function () {
                logItem.trigger('item:enter', sourceView);
            }).on('mouseleave', function () {
                logItem.trigger('item:leave', sourceView);
            }).on('click', function () {
                logItem.trigger('item:click', sourceView);
            });
        }

    };

});