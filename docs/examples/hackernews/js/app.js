/*
 || Hacker News Web - ZUIX implementation
 || Framework official site and documentation:
 ||     http://zuix.it
 */

(function (window) {
    'use strict';

    var $ = zuix.$;

    window.hackerNewsOptions = {
        // the list_view component is ready
        ready: function (listView) {
            var view = $(listView.view());
            var container = view.parent('.scrollable');
            // update counters each time a item is loaded
            listView.on('loaded', function (e, count) {
                container.find('.load-count')
                    .html(count+' of '+listView.model().itemList.length);
                container.find('.page-count')
                    .html((listView.page()+1)+'/'+listView.count());
            });
            // fetch the news list from Hacker News FireBase API
            loadList(listView, container.attr('data-source'));
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
        $.find('header .menu a').removeClass('is-active');
        $.find('header .menu a[href="#/'+pr.path+'"]').addClass('is-active');
        // hide all Hacker News lists
        $.find('.scrollable')
            .removeClass('tab-visible')
            .addClass('tab-hidden');
        // show the current one
        var hn_current = $.find('[data-source="'+pr.path+'stories"]');
        hn_current
            .removeClass('tab-hidden')
            .addClass('tab-visible');
        // run componentize to lazy-load elements
        zuix.componentize(hn_current);
    }

    // local app's methods

    function loadList(listCtx, sourceId) {
        listCtx.clear();
        $.ajax({
            // Load item data using official Hacker News firebase API
            url: 'https://hacker-news.firebaseio.com/v0/'+sourceId+'.json',
            success: function (jsonText) {
                var listData = JSON.parse(jsonText);
                listCtx.model({
                    itemList: listData,
                    getItem: function (index, item) {
                        return {
                            // Unique identifier for this item.
                            itemId: index,
                            // Display item using "news_item" component.
                            componentId: 'components/news_item',
                            // Component options.
                            options: {
                                // Set the item model's data.
                                model: { index: index, id: item },
                                // Do not check for model refresh since
                                // it does not change once created.
                                static: true,
                                // Load the component only when
                                // it's about to come into view
                                lazyLoad: true,
                                // The min-height of the item container
                                // should be specified before its component
                                // is loaded in order to prevent list resize
                                // flickering after lazy-loading an item.
                                // So we either define a responsive 'className'
                                // or a fixed 'height' property.
                                className: 'list-item',
                                // Event handlers.
                                on: {
                                    'item:enter': function (e, item) {
                                        item.view.addClass('active');
                                    },
                                    'item:leave': function (e, item) {
                                        item.view.removeClass('active');
                                    },
                                    'item:click': function (e, item) {
                                        if (item.data.url != null) {
                                            item.view.removeClass('fadeIn')
                                                .addClass('pulse');
                                            setTimeout(function () {
                                                location.href = item.data.url;
                                            }, 300);
                                        }
                                    }
                                },
                                ready: function () {
                                    // TODO: ...
                                }
                            }
                        }
                    }
                });
            },
            error: function () {
                // TODO: ...
            },
            then: function () {
                // TODO: ...
            }
        })
    }

    // global app's methods

    window.loadPrev = function(button) {
        button = $(button);
        var footer = button.parent();
        // the list component is right before (prev) the footer
        var listView = zuix.context(footer.prev());
        footer.find('.page-count')
            .html((listView.prev()+1)+'/'+listView.count());
        button.parent('.scrollable').get().scrollTop = 0;
    };

    window.loadNext = function(button) {
        button = $(button);
        var footer = button.parent();
        // the list component is right before (prev) the footer
        var listView = zuix.context(footer.prev());
        footer.find('.page-count')
            .html((listView.next()+1)+'/'+listView.count());
        button.parent('.scrollable').get().scrollTop = 0;
    }

})(window);
