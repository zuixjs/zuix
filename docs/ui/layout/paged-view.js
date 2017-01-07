zuix.controller(function ($$) {

    $$.create = function () {

        var pages = $$.view().children();
        pages.hide().eq(0).show();

        $$.expose('setPage', function (i) {
            setPage(i);
        });

        $$.view().children().each(function () {
            $(this).wrap('<div style="position:absolute;top:0;left:0;bottom:0;right:0;overflow: auto;"></div>');
            $(this).parent().hide();
        });
        setPage(0);
        setTimeout(function () {
            pages.show();
        }, 500);

    };

    $$.destroy = function () {

        $$.view().children().each(function () {
            $(this).unwrap();
        });
        currentPage = -1;

    };

    $$.api = function (command, options) {
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
        var pages = $$.view().children();
        var oldPage = currentPage;
        if (p > currentPage) {
            currentPage = p;
            pages.eq(p).fadeIn();
            pages.eq(oldPage).fadeOut();
            $$.trigger('page:change', {
                old: oldPage,
                page: currentPage
            });
        } else if (p < currentPage) {
            currentPage = p;
            pages.eq(p).fadeIn();
            pages.eq(oldPage).fadeOut();
            $$.trigger('page:change', {
                old: oldPage,
                page: currentPage
            });
        }
    }

});
