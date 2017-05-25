zuix.controller(function (cp) {
	'use strict';

	cp.create = function () {
		var item = cp.model();
		cp.field('id').html(item.id);
        cp.field('number').html(item.index+1);
		// TODO: should load details of the news item
        // https://hacker-news.firebaseio.com/v0/item/<id>.json

		zuix.$.ajax({
			url: 'https://hacker-news.firebaseio.com/v0/item/'+item.id+'.json',
			success: function (jsonText) {
				var newsData = JSON.parse(jsonText);
				cp.field('title').html(newsData.title);
				if (newsData.url != null) {
                    var path = newsData.url.split('/');
                    if (path.length > 0) {
                        path = path[2].replace('www.', '') + (path[3] != null && path[3].length > 0 && path[3].length < 30 && path[3].indexOf('.') < 0 ? '/' + path[3] : '');
                    }
                    cp.field('url').html(path).attr('href', newsData.url);
                }
				cp.field('score').html(newsData.score);
                cp.field('user').html(newsData.by);
                var timestamp = moment.unix(newsData.time);
                cp.field('date').html(timestamp.fromNow());
            },
            error: function () {

            },
			then: function () {

            }
		})

	};

	cp.destroy = function () {
		cp.log.i('Element disposed... G\'bye!');
	};

});

