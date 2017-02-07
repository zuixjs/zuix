zuix.controller(function (cp) {
    var currentTitle = '', currentPos = 0;
    var offset = 200, items = [], title = null;
    var timeout = null;

    cp.create = function () {
        title = zuix.$(cp.options().target);
        cp.view().on('scroll', function (e) {
            postUpdate();
        });
        cp.expose('update', function () {
            title.attr('title', '');
            currentPos = 0;
            postUpdate();
        });
    };

    function postUpdate() {
        if (timeout != null)
            clearTimeout(timeout);
        timeout = setTimeout(update, 100);
    }

    function update() {
        var direction = '', top = 0;
        currentTitle = '';
        items = cp.view().find(cp.options().tags);
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
    }

});