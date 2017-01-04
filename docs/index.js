// load 'ui/layout/paged-view' component into element with [data-ui-field="content-pages"]
var pagedView = null;
var actionMenu = null;

zuix.field('loader').show();
zuix.loadEnd(function() {
    zuix.field('loader').fadeOut(500);
});

// Main page setup
var main = {
    topMenu: {
        // Context Options
        model: {
            test: 'testing...'
        },
        // actions map or function
        on: { // '<event_name>': handlerFn
            'item:click': changePage
        },
        // behaviors map or function
        behavior: { // '<event_name>':  handlerFn
            'item:click': animateMenuItem
        },
        ready: function (ctx) {
            console.log("MENU READY", ctx);
            actionMenu = ctx;
            ctx.on('item:click', function (e, i) {
                console.log("item::click@ActionsView", i);
                $(this).children().eq(i).animateCss('tada');
                if (pagedView) pagedView.invoke('setPage', i);
            });
        }
    },
    contentPager: {
        // Context Options
        ready: function (ctx) {
            pagedView = ctx;
            ctx.behavior = function (e, i) {
                switch (e.type) {
                    case 'page:change':
                        // Animate page changing
                        var pages = $(this).children();
                        if (i.page > i.old) {
                            pages.eq(i.page).animateCss('bounceInRight').show();
                            pages.eq(i.old).animateCss('bounceOutLeft', function () {
                                if (!pages.eq(i.old).hasClass('animated'))
                                    pages.eq(i.old).hide();
                            }).show();
                        } else {
                            pages.eq(i.page).animateCss('bounceInLeft').show();
                            pages.eq(i.old).animateCss('bounceOutRight', function () {
                                if (!pages.eq(i.old).hasClass('animated'))
                                    pages.eq(i.old).hide();
                            }).show();
                        }
                        break;
                }
            };
            ctx.on('page:change', function (e, i) {
                console.log('page:change@PagedView', i);
            });
        }
    }
};
zuix.componentize();

function changePage(i) {
    if (pagedView) pagedView.invoke('setPage', i);
}

function animateMenuItem() {
    $(this).children().eq(i).animateCss('tada');
}

/*
 // load 'actions-menu' component into element with [data-ui-field="actions-menu"]
 var actionsMenu = zuix.load('ui/layout/actions-view', {
 view: zuix.field('actions-menu'),
 ready: function () {
 actionsMenu.on('item:click', function (e, i) {
 console.log("item::click@ActionsView", i);
 $(this).children().eq(i).animateCss('tada');
 if (pagedView) pagedView.invoke('setPage', i);
 });
 }
 });
 */

// Define behavior for the PageView and the ActionMenu components
// TODO: Behavior are also definable in "data-ui-behavior" attribute
/*
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
*/
/*
 actionsMenu.behavior = function (e, i) {
 switch (e.type) {
 case 'item:click':
 // Animate clicked button
 $(this).children().eq(i).animateCss('tada');
 break;
 }
 };
 */

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
    container: zuix.field('zuix-demo')
});


// debug
setTimeout(function () {
    zuix.dumpCache();
    zuix.dumpContexts();
}, 5000);


// jQuery helpers
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        if (this.hasClass('animated'))
            this.trigger('animationend');
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (typeof callback === 'function') {
                callback.this = this;
                callback(animationName);
            }
        });
        return this;
    }
});