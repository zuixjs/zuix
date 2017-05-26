/*
 || Hacker News Web - ZUIX implementation
 || Framework official site and documentation:
 ||     http://zuix.it
 */

(function (window) {
    'use strict';

    var newsList;
    window.newsListOptions = {
        ready: function (ctx) {
            newsList = ctx;
            loadNewsList();
        }
    };

    if ('onhashchange' in window) {
        // custom url routing
        window.onhashchange = function () {
            // TODO: ..
        };
    }

    function loadNewsList() {
        zuix.$.ajax({
            // Load item data using official Hacker News firebase API
            url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
            success: function (jsonText) {
                var listData = JSON.parse(jsonText);
                newsList.model({
                    itemList: listData,
                    getItem: function (index, item) {
                        return {
                            // unique identifier for this item
                            itemId: index,
                            // display item using "news_item" component
                            componentId: 'components/news_item',
                            // component options
                            options: {
                                // set the item model's data
                                model: { index: index, id: item },
                                // do not check for model refresh since
                                // it does not change once created
                                static: true,
                                // load the component only when
                                // it's about to come into view
                                lazyLoad: true,
                                // set the height of the item in the list
                                // to prevent resize flickers after load
                                height: '85px',
                                // event handlers
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

})(window);
