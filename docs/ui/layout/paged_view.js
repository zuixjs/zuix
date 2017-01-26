zuix.controller(function (cp) {

    cp.create = function () {
        cp.expose('setPage', function (i) {
            setPage(i);
        });
        cp.view().children().each(function () {
            var c = this;
            c.style['position'] = 'absolute';
            c.style['top'] = '0';
            c.style['left'] = '0';
            c.style['bottom'] = '0';
            c.style['right'] = '0';
            c.style['overflow'] = 'auto';
            cp.view(c).hide();
        });
        setPage(0);
    };

    cp.destroy = function () {
        cp.view().children().each(function () {
            // TODO: should restore original container styles
        });
        currentPage = -1;
    };

    // Private Members

    var currentPage = -1;

    function setPage(p) {
        var pages = cp.view().children();
        var oldPage = currentPage;
        if (p != currentPage) {
            currentPage = p;
            pages.eq(p).show();
            zuix.componentize();
            if (oldPage != -1) {
                pages.eq(oldPage).hide();
                cp.trigger('page:change', {
                    old: oldPage,
                    page: currentPage
                });
            }
        }
    }

});