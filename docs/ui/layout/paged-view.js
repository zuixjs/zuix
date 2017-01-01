zuix.controller(function($$){

    $$.create = function () {

        $$.expose('setPage', function(i) {
            setPage(i, 'bounce');
        });

        $$.view.children().each(function(){
            $(this).wrap('<div style="position:absolute;top:0;left:0;bottom:0;right:0;overflow: auto;"></div>');
            $(this).parent().hide();
        });
        setPage(0, 'bounce');

    };

    $$.destroy = function() {

        $$.view.children().each(function(){
           $(this).unwrap();
        });
        currentPage = -1;

    };

    $$.api = function(command, options) {
      switch (command) {
          case 'page':
          case 'setPage':
              console.log(options);
              setPage(options, 'bounce');
              break;
      }
    };

    // Private Members

    var currentPage = -1;

    function setPage(p, anim) {
        var pages = $$.view.children();
        var oldPage = currentPage;
        if (p > currentPage) {
            currentPage = p;
            pages.eq(p).animateCss(anim+'InRight').show();
            pages.eq(oldPage).animateCss(anim+'OutLeft', function(){
                pages.eq(oldPage).hide();
            }).show();
        } else if (p < currentPage) {
            currentPage = p;
            pages.eq(p).animateCss(anim+'InLeft').show();
            pages.eq(oldPage).animateCss(anim+'OutRight', function(){
                pages.eq(oldPage).hide();
            }).show();
        }
    }

});