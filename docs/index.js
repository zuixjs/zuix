// load 'ui/layout/paged-view' component into element with [data-ui-field="content-pages"]
var pagedView = juice.load('ui/layout/paged-view', {
    view: juice.field('content-pages')
});

// load 'actions-menu' component into element with [data-ui-field="actions-menu"]
var actionsMenu = juice.load('ui/layout/actions-view', {
    view: juice.field('actions-menu')
});
actionsMenu.on('item:click', function (e, i) {
    $(this).children().eq(i).animateCss('tada', function () {
    });
    if (pagedView) pagedView.invoke('setPage', i);
});

// Example - Loading external hosted component
// NOTE: ensure the source is trusted before
// loading any external hosted component in your site
juice.load('https://codepen.io/genielabs/pen/RomJZy', {
    container: juice.field('juice-demo'),
    ready: function (context) {
        juice.field('loader').hide();
    }
});

/*
 juice.behaviour('ui/layout/actions-view', function(e, i){
 switch(e) {
 case 'item:click':
 //$(this).children().eq(i).animateCss('tada', function() { });
 break;
 }
 });
 */

