zuix.controller(function ($$) {

    $$.create = function () {

        $$.expose('setPage', function (i) {
            setPage(i);
        });

        $$.view().children().each(function () {
            $(this).wrap('<div style="position:absolute;top:0;left:0;bottom:0;right:0;overflow: auto;"></div>');
            $(this).parent().hide();
        });
        setPage(0);

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
            pages.eq(p).show();
            pages.eq(oldPage).hide();
            $$.trigger('page:change', {
                old: oldPage,
                page: currentPage
            });
        } else if (p < currentPage) {
            currentPage = p;
            pages.eq(p).show();
            pages.eq(oldPage).hide();
            $$.trigger('page:change', {
                old: oldPage,
                page: currentPage
            });
        }
    }

});
