// load 'ui/layout/paged-view' component into element with [data-ui-field="content-pages"]
var pagedView = zuix.load('ui/layout/paged-view', {
    view: zuix.field('content-pages')
});

// load 'actions-menu' component into element with [data-ui-field="actions-menu"]
var actionsMenu = zuix.load('ui/layout/actions-view', {
    view: zuix.field('actions-menu')
});
actionsMenu.on('item:click', function (e, i) {
    $(this).children().eq(i).animateCss('tada', function () {
    });
    if (pagedView) pagedView.invoke('setPage', i);
});

// Example - Loading external hosted component
// NOTE: ensure the source is trusted before
// loading any external hosted component in your site
zuix.load('https://codepen.io/genielabs/pen/RomJZy', {
    container: zuix.field('zuix-demo'),
    ready: function (context) {
        zuix.field('loader').hide();
    }
});

/*
 zuix.behaviour('ui/layout/actions-view', function(e, i){
 switch(e) {
 case 'item:click':
 //$(this).children().eq(i).animateCss('tada', function() { });
 break;
 }
 });
 */

