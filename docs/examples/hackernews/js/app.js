/*
|| Hacker News reader - ZUIX implementation
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
        },
    };

    if ('onhashchange' in window) {
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
                                    'item:enter': function (e, sourceView) {
                                    },
                                    'item:leave': function (e, sourceView) {
                                    },
                                    'item:click': function (e, sourceView) {
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

            },
            then: function () {

            }
        })
    }

})(window);

