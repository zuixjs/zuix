/*
 || Hacker News Web - ZUIX implementation
 || Framework official site and documentation:
 ||     http://zuix.it
 */

(function (window) {
    'use strict';

    window.hackerNewsOptions = {
        ready: function (ctx) {
            var view = zuix.$(ctx.view());
            var container = view.parent('[data-source]');
            var counter = container.find('.load-count');
            // updated loaded count each time a item is loaded
            ctx.on('loaded', function (e, count) {
                counter.html(count+' of '+ctx.model().itemList.length);
            });
            // hide the 'more' button when the list is fully loaded
            ctx.on('complete', function () {
                view.next().hide();
            });
            // fetch the news list from firebase API
            loadList(ctx, container.attr('data-source'));
        }
    };

    if ('onhashchange' in window) {
        // custom url routing
        window.onhashchange = function () {
            updateView();
        };
    }

    // force componentize on resize to process lazy-elements that might come into the view
    window.addEventListener('resize', function () {
        zuix.componentize();
    });

    zuix.lazyLoad(true, 1.5);
    updateView();

    function updateView() {
        var hash = window.location.hash;
        // update top menu
        zuix.$.find('header .menu a').removeClass('is-active');
        zuix.$.find('header .menu a[href="'+hash+'"]').addClass('is-active');
        if (hash == null || hash.length < 3)
            hash = 'top';
        else
            hash = hash.substring(2);
        // hide all Hacker News lists
        var hn_lists = zuix.$.find('.scrollable')
            .removeClass('tab-visible')
            .addClass('tab-hidden');
        // show the current one
        var hn_current = zuix.$.find('[data-source="'+hash+'stories"]');
        hn_current
            .removeClass('tab-hidden')
            .addClass('tab-visible');
        // run componentize to lazy-load elements
        zuix.componentize(hn_current);
    }

    function loadList(listCtx, sourceId) {
        listCtx.clear();
        zuix.$.ajax({
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

    window.loadMore = function(button) {
        button = zuix.$(button);
        // the list component is right before (prev) the 'load more' button
        var ctx = zuix.context(button.parent().prev());
        // call method 'more' to show more items
        ctx.more();
        // scroll down to show new items
        var scroller = button.parent().parent().parent().get();
        zuix.$.scrollTo(scroller, scroller.offsetHeight - 12)
    }
})(window);
