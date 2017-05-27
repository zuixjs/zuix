zuix.controller(function (cp) {
    var currentTitle = '', currentPos = 0, scrollOffset = 0;
    var offset = 200, items = [], title = null;
    var timeout = null;

    cp.init = function () {
        cp.options().css = false;
        cp.options().html = false;
    };

    cp.create = function () {
        title = zuix.$(cp.options().target);
        items = cp.view().find(cp.options().tags);
        cp.view().on('scroll', postUpdate);
        cp.expose('update', function () {
            title.attr('title', '');
            currentPos = 0;
            postUpdate();
        });
    };

    function postUpdate(e) {
        if (timeout !== null) return;
        timeout = setTimeout(update, 100);
    }

    function update() {
        var direction = '', top = 0;
        currentTitle = '';
        items.each(function (k, v) {
            var p = this.position();
            if (p.y < offset) {
                top = this.get().offsetTop;
                currentTitle = this.html().replace(/<i.*>.*<\/i>/g, '');
            }
        });
        if (currentTitle != null) {
            if (title.attr('title') != currentTitle) {
                title.attr('title', currentTitle);
                if (currentPos != 0) {
                    if (currentPos > top)
                        direction = 'Down';
                    else
                        direction = 'Up';
                }
                currentPos = top;
                title.animateCss('fadeOut'+direction, { duration: '0.2s' }, function () {
                    this.html(currentTitle)
                        .animateCss('fadeIn'+direction, { duration: '0.2s' });
                });
            }
        }
        var callback = cp.options().callback;
        if (typeof callback === 'function') {
            var cy = cp.view().position().y;
            var dy = scrollOffset - cy;
            //if (dy > 0) dy = 1;
            //if (dy < 0) dy = -1;
            callback(dy);
            scrollOffset = cy;
        }
        timeout = null;
    }
});