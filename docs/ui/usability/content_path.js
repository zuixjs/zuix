zuix.controller(function (cp) {
    var currentTitle = '', currentPos = 0;
    var offset = 116, items = [], title = null;
    var ready = false;

    cp.create = function () {
        title = zuix.$(cp.options().target);
        cp.view().on('scroll', function (e) {
            update();
        });
        cp.expose('update', function () {
            title.attr('title', '');
            currentPos = 0;
            update();
        });
        ready = true;
    };

    function update() {
        items = cp.view().find(cp.options().tags);
        if (!ready || items.length < 1) return;
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
    }

});