zuix.controller(function (cp) {

    cp.create = function () {
        cp.expose('setPage', function (i) {
            setPage(i);
        });
        cp.view().children().each(function (i, el) {
            el.style['position'] = 'absolute';
            el.style['top'] = '0';
            el.style['left'] = '0';
            el.style['bottom'] = '0';
            el.style['right'] = '0';
            el.style['overflow'] = 'auto';
            this.hide();
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