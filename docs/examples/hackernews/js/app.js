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
            url: 'https://hacker-news.firebaseio.com/v0/topstories.json',
            success: function (jsonText) {
                var listData = JSON.parse(jsonText);
                newsList.model({
                    itemList: listData,
                    getItem: function (index, item) {
                        return {
                            // unique identifier for this item
                            itemId: index,
                            // display as "bundle item"
                            componentId: 'components/news_item',
                            // loading options
                            options: {
                                model: { index: index, id: item },
                                lazyLoad: true,
                                static: true,
                                height: '84px',
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
