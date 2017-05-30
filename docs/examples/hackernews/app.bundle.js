zuix.bundle([{"componentId":"layout\u002Fhackernews","view":"\u003Cdiv self=\"size-x1\" layout=\"column center-center\"\u003E\n    \u003Cdiv data-ui-load=\"components\u002Flist_view\"\n         data-ui-options=\"hackerNewsOptions\"\n         self=\"size-large\"\u003E\n\n        Loading news list...\n\n    \u003C\u002Fdiv\u003E\n    \u003Cfooter layout=\"row center-spread\"\u003E\n\n        \u003Cdiv class=\"load-info\"\u003E\n            Showing\n            \u003Cspan class=\"load-count\"\u003E0 of 0\u003C\u002Fspan\u003E\n        \u003C\u002Fdiv\u003E\n\n        \u003Cdiv align=\"right\" class=\"load-more\" onclick=\"loadMore(this)\"\u003E\n            \u003Cdiv class=\"animated pulse infinite\"\u003E\n                more &#8681;\n            \u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n\n    \u003C\u002Ffooter\u003E\n\u003C\u002Fdiv\u003E\n","css":".load-info {\n    color: white;\n    font-size: 120%;\n    font-weight:bold;\n}\n\n.load-more {\n    cursor: pointer;\n    color: white;\n    font-weight:bolder;\n    font-size: 160%;\n    max-height: 48px;\n    width: 120px;\n    overflow: hidden;\n}","controller":function (){}},{"componentId":"components\u002Flist_view","controller":function (cp) {

    var listItems = [], itemOptions;
    var currentPage = 0, itemsPerPage = 30, loadedCount = 0;

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        // exposed methods
        cp.expose('goto', function (page) {
            currentPage = page;
            cp.update();
        });
        cp.expose('more', function () {
            currentPage++;
            var children = cp.view().children();
            for (var i = currentPage*itemsPerPage; i < ((currentPage+1)*itemsPerPage); i++)
                children.eq(i).show();
        });
        cp.expose('clear', clear);
    };

    cp.destroy = function () {
        clear();
    };

    cp.update = function() {

        var modelList = cp.model().itemList;
        if (modelList == null) return;

        for (var i = 0; i < modelList.length; i++) {

            var dataItem = cp.model().getItem(i, modelList[i]);
            var id = dataItem.itemId;

            if (typeof listItems[id] === 'undefined') {
                // create container for the new list item
                var container = document.createElement('div');
                // set the component to load for this item
                //container.innerHTML = '<div class="spinner"><div></div><div></div><div></div><div></div></div>';
                container.setAttribute('data-ui-load', dataItem.componentId);
                container.setAttribute('data-ui-options', setItemOptions(i, dataItem.options));
                // TODO: the next line is a work around, otherwise element won't load - not sure if this is a bug
                dataItem.options.lazyLoad = false;
                // use a responsive CSS class if provided
                if (dataItem.options.className != null) {
                    // this class should set the min-height property
                    container.classList.add(dataItem.options.className);
                } else {
                    // set a temporary height for the container (for lazy load to work properly)
                    container.style['min-height'] = dataItem.options.height || '48px';
                }
                // add item container to the list-view, the component will be lazy-loaded later as needed
                cp.view().insert(i, container);
                // register a callback to know when the component is actually loaded
                var listener = function (itemIndex, el) {
                    var l = function () {
                        el.removeEventListener('component:ready', l);
                        cp.trigger('loaded', ++loadedCount);
                        // if all components have been loaded, then trigger 'complete' event
                        if (itemIndex === modelList.length-1)
                            cp.trigger('complete');
                    };
                    container.addEventListener('component:ready', l);
                }(i, container);
                // keep track of already created items
                listItems[id] = container;
            } else if (!dataItem.options.static) {
                // update existing item model's data
                // TODO: should check if the data in the model has changed before calling this
                zuix.context(listItems[id]).model(dataItem.options.model);
            }

            // Paging mode if currentPage > -1, otherwise full-list with scroll
            if (currentPage !== -1) {
                if (i < currentPage*itemsPerPage || i > ((currentPage+1)*itemsPerPage-1))
                    listItems[id].style.display = 'none';
                else
                    listItems[id].style.display = '';
            }

        }

        // `componentize` is required to process lazy-loaded items (if any)
        zuix.componentize(cp.view());

    };

    function setItemOptions(i, options){
        itemOptions['opt_'+i] = options;
        return 'list_view_opts.'+cp.context.contextId.replace(/-/g, '_')+'.opt_'+i;
    }

    function clear() {
        // clear data and cache
        cp.view().html('');
        // globally store list view item options
        window.list_view_opts = window.list_view_opts || {};
        itemOptions = window.list_view_opts[cp.context.contextId.replace(/-/g, '_')] = {};
        // dispose components
        for (var i = 0; i < listItems.length; i++) {
            zuix.unload(listItems[i]);
        }
        listItems.length = 0;
    }
}},{"componentId":"components\u002Fnews_item","view":"\u003Cdiv class=\"number -animated -zoomIn\" data-ui-field=\"number\"\u003E\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-field=\"card\" class=\"content -animated -fadeIn\"\u003E\n    \u003Ch3 data-ui-field=\"title\" class=\"single-line\"\u003E\n        \u003Cdiv class=\"spinner\"\u003E\n            \u003Cdiv\u003E\u003C\u002Fdiv\u003E\n            \u003Cdiv\u003E\u003C\u002Fdiv\u003E\n            \u003Cdiv\u003E\u003C\u002Fdiv\u003E\n            \u003Cdiv\u003E\u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fh3\u003E\n    \u003Ca data-ui-field=\"url\" class=\"single-line\"\u003E\u003C\u002Fa\u003E\n    \u003Cdiv data-ui-field=\"description\" class=\"single-line\"\u003E\n        \u003Cspan data-ui-field=\"date\"\u003E...\u003C\u002Fspan\u003E\n        by \u003Cspan data-ui-field=\"user\"\u003E...\u003C\u002Fspan\u003E\n        \u002F \u003Cspan data-ui-field=\"score\"\u003E...\u003C\u002Fspan\u003E points\n        \u003Cspan data-ui-field=\"descendants\"\u003E\u003C\u002Fspan\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n","css":". {\n    border-bottom: solid 1px whitesmoke;\n    overflow: hidden;\n    position: relative;\n}\n\nh3 {\n    margin: 0;\n    font-weight: 600;\n}\na {\n    text-decoration: none;\n}\n.single-line {\n    width: 100%;\n    white-space: nowrap;\n    overflow: hidden;\n    text-overflow: ellipsis;\n}\n.number {\n    position: absolute;\n    margin: 0;\n    padding: 8px 0 0;\n    width: 48px;\n    text-align: center;\n    color: lightgray;\n    font-size: 120%;\n    font-weight: bold;\n    animation-duration: 0.8s;\n    -webkit-animation-duration: 0.8s;\n    -moz-animation-duration: 0.8s;\n    -o-animation-duration: 0.8s;\n}\n.content {\n    cursor: pointer;\n    padding-top: 8px;\n    padding-left: 48px;\n    animation-duration: 0.3s;\n    -webkit-animation-duration: 0.3s;\n    -moz-animation-duration: 0.3s;\n    -o-animation-duration: 0.3s;\n}\n.active {\n    background-color: rgba(100, 100, 100, 0.1);\n}","controller":function (cp) {
    'use strict';

    cp.create = function () {
        var item = cp.model();
        // Display item number
        cp.field('number').html(item.index+1);
        loadItem(item.id);
    };

    cp.destroy = function () {
        cp.log.i('Element disposed... G\'bye!');
    };

    function loadItem(id) {
        // Pick data from cache if exists
        var cache = window.hn_firebase_cache = window.hn_firebase_cache || {};
        if (cache[id] != null) {
            render(cache[id]);
            return;
        }
        // Fetch item data from remote service
        zuix.$.ajax({
            url: 'https://hacker-news.firebaseio.com/v0/item/'+id+'.json',
            success: function (jsonText) {
                cache[id] = JSON.parse(jsonText);
                render(cache[id]);
            }
        });
    }

    function render(newsData) {
        cp.field('title').html(newsData.title);
        cp.field('user').html(newsData.by);
        cp.field('score').html(newsData.score);
        if (newsData.descendants > 0) {
            cp.field('descendants').html(' / '+newsData.descendants+' comments');
        }
        // Use Moment.js to format time
        var timestamp = moment.unix(newsData.time);
        cp.field('date').html(timestamp.fromNow());
        // Shorten displayed URL (if present)
        if (newsData.url != null) {
            var path = newsData.url.split('/');
            if (path.length > 0) {
                path = path[2].replace('www.', '') + (path[3] != null && path[3].length > 0 && path[3].length < 30 && path[3].indexOf('.') < 0 ? '/' + path[3] : '');
            }
            cp.field('url').html(path).attr('href', newsData.url);
        }
        // Custom Events for this component
        var card = cp.field('card');
        var payload = {
            view: card,
            data: newsData
        };
        card.on('mouseover', 'item:enter', payload)
            .on('mouseout', 'item:leave', payload)
            .on('click', 'item:click', payload);
    }

},"css_applied":true}]);