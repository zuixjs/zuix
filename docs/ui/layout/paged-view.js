zuix.controller(function (ctx) {

    ctx.create = function () {
        ctx.expose('setPage', function (i) {
            setPage(i);
        });
        zuix.$(ctx.view()).children().each(function () {
            var c = this; //zuix.$.wrapElement('div', this);
            c.style['position'] = 'absolute';
            c.style['top'] = '0';
            c.style['left'] = '0';
            c.style['bottom'] = '0';
            c.style['right'] = '0';
            c.style['overflow'] = 'auto';
            console.log("DEBUG", c);
            //$(this).wrap('<div style="position:absolute;top:0;
            // left:0;bottom:0;right:0;overflow: auto;"></div>');
            zuix.$(c).hide();
        });
        setPage(0);
    };

    ctx.destroy = function () {
        zuix.$(ctx.view()).children().each(function () {
            // TODO: should restore original container styles
        });
        currentPage = -1;
    };

    ctx.api = function (command, options) {
        switch (command) {
            case 'page':
            case 'setPage':
                setPage(options);
                break;
        }
    };

    // Private Members

    var currentPage = -1;

    function setPage(p) {
        var pages = zuix.$(ctx.view()).children();
        var oldPage = currentPage;
        if (p != currentPage) {
            currentPage = p;
            pages.eq(p).show();
            if (oldPage != -1) {
                pages.eq(oldPage).hide();
                ctx.trigger('page:change', {
                    old: oldPage,
                    page: currentPage
                });
            }
        }
    }

});