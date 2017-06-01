zuix.controller(function (cp) {
    'use strict';

    var listView, statusCallback, statusInfo = {
        itemsLoaded: 0,
        itemsCount: 0,
        pagesCurrent: 0,
        pagesCount: 0
    };

    cp.create = function () {
        var dataSource = cp.view().attr('data-source');
        // get a reference to the list_view component (async)
        zuix.context(cp.field('list-view'), function(ctx){
            listView = ctx;
            // update counters each time a item is loaded
            listView.on('loaded', function (e, loadedCount) {
                statusInfo.itemsLoaded = loadedCount;
                statusCallback(statusInfo);
            });
            // fetch the news list from Hacker News FireBase API
            loadList(dataSource);
        });
        // public methods
        cp.expose('page', function (p) {
            statusInfo.pagesCurrent = p;
            if (listView != null)
                statusInfo.pagesCurrent = listView.page(p);
            statusCallback(statusInfo);
        });
        cp.expose('next', function () {
            cp.view().get().scrollTop = 0;
            listView.next();
            statusInfo.pagesCurrent = listView.page();
            statusCallback(statusInfo);
        });
        cp.expose('prev', function () {
            cp.view().get().scrollTop = 0;
            listView.prev();
            statusInfo.pagesCurrent = listView.page();
            statusCallback(statusInfo);
        });
        cp.expose('callback', function(callback){
            statusCallback = callback;
        });
    };

    cp.destroy = function () {
        cp.log.i('Element disposed... G\'bye!');
    };

    function loadList(sourceId) {
        listView.clear();
        zuix.$.ajax({
            // Load item data using official Hacker News firebase API
            url: 'https://hacker-news.firebaseio.com/v0/'+sourceId+'.json',
            success: function (jsonText) {
                var listData = JSON.parse(jsonText);
                listView.model({
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
                statusInfo.itemsCount = listData.length;
                statusInfo.pagesCount = listView.count();
                if (statusInfo.pagesCurrent > 0)
                    statusInfo.pagesCurrent = listView.page(statusInfo.pagesCurrent);
            },
            error: function () {
                // TODO: ...
            },
            then: function () {
                // TODO: ...
            }
        })
    }

});
