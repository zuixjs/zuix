// load 'ui/layout/paged-view' component into element with [data-ui-field="content-pages"]
var pagedView = zuix.load('ui/layout/paged-view', {
    view: zuix.field('content-pages'),
    ready: function() {
        pagedView.on('page:change', function (e, i) {
            console.log('page changed', i);
        });
    }
});

// load 'actions-menu' component into element with [data-ui-field="actions-menu"]
var actionsMenu = zuix.load('ui/layout/actions-view', {
    view: zuix.field('actions-menu'),
    ready: function() {
        actionsMenu.on('item:click', function (e, i) {
            if (pagedView) pagedView.invoke('setPage', i);
        });
    }
});


// Define behavior for the PageView and the ActionMenu components
// TODO: Behavior are also definable in "data-ui-behavior" attribute

pagedView.behavior = function (e, i) {
    switch (e.type) {
        case 'page:change':
            // Animate page changing
            var pages = $(this).children();
            if (i.page > i.old) {
                pages.eq(i.page).animateCss('bounceInRight').show();
                pages.eq(i.old).animateCss('bounceOutLeft', function () {
                    pages.eq(i.old).hide();
                }).show();
            } else {
                pages.eq(i.page).animateCss('bounceInLeft').show();
                pages.eq(i.old).animateCss('bounceOutRight', function () {
                    pages.eq(i.old).hide();
                }).show();
            }
            break;
    }
};

actionsMenu.behavior = function (e, i) {
    switch (e.type) {
        case 'item:click':
            // Animate clicked button
            $(this).children().eq(i).animateCss('tada', function () { });
            break;
    }
};



/*
// Example of loading UI logic from two different components
// into the same view
var test = zuix.load('ui/layout/actions-view', {
    view: zuix.field('content-pages'),
    ready: function(c) {
        c.on('item:click', function (e, i) {
            console.log(this);
            console.log(i);
        });
    }
});
*/


// Example - Loading external hosted component
// NOTE: ensure the source is trusted before
// loading any external hosted component in your site
zuix.load('https://codepen.io/genielabs/pen/RomJZy', {
    container: zuix.field('zuix-demo'),
    ready: function (context) {
        zuix.field('loader').hide();
    }
});

// debug
setTimeout(function () {
    zuix.dumpCache();
    zuix.dumpContexts();
}, 5000);
