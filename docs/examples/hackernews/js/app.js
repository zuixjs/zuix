/*
 || Hacker News Web - ZUIX implementation
 || Framework official site and documentation:
 ||     http://zuix.it
 */

(function (window) {
    'use strict';

    window.currentFeed = null;
    window.hnListOptions = {
        ready: function (hnList) {
            hnList.callback(function (listStatus) {
                // update counter/status info in the footer
                zuix.field('load-count').html(listStatus.itemsLoaded+' of '+listStatus.itemsCount);
                zuix.field('page-count').html((listStatus.pagesCurrent+1)+' / '+listStatus.pagesCount);
            });
        }
    };

    // Set lazy loading and show the current view
    zuix.lazyLoad(true, 1.0);
    showCurrentView();

    // register event handler for URL routing
    if ('onhashchange' in window) {
        // custom url routing
        window.onhashchange = function () {
            showCurrentView(parseUrlPath(window.location.hash));
        };
    }
    // force componentize on resize to process lazy-elements that might come into the view
    window.addEventListener('resize', function () {
        zuix.componentize();
    });

    function parseUrlPath(hash) {
        if (hash == null || hash.length < 3)
            hash = '#/top';
        // get page number parameter
        var page;
        var i= hash.lastIndexOf('/');
        if (i > 1) {
            page = hash.substring(i+1);
            hash = hash.substring(0, i);
        }
        hash = hash.substring(2);
        return { path: hash, page: page };
    }

    function showCurrentView(pr) {
        if (pr == null)
            pr = parseUrlPath(window.location.hash);
        // update top menu
        zuix.$.find('header .menu a').removeClass('is-active');
        zuix.$.find('header .menu a[href="#/'+pr.path+'"]').addClass('is-active');
        // hide all Hacker News lists
        zuix.$.find('.scrollable')
            .removeClass('tab-visible')
            .addClass('tab-hidden');
        // show the current one
        var hn_current = zuix.$.find('[data-source="'+pr.path+'stories"]');
        hn_current
            .removeClass('tab-hidden')
            .addClass('tab-visible');
        // store a reference to the current hn_list component
        zuix.context(hn_current, function (ctx) {
            window.currentFeed = ctx;
            if (!isNaN(pr.page))
                ctx.page(parseInt(pr.page));
        });
        // run componentize to lazy-load elements
        zuix.componentize(hn_current);
    }

})(window);
