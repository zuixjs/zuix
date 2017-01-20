zuix.controller(function (ctx) {

    ctx.create = function() {
        var view = zuix.$(ctx.view());
        //view.get(0).style.visibility = 'hidden';

        // read inline image list before loading the
        // slideshow HTML layout
        var items = [];
        var index = 0;
        zuix.$.each(ctx.view().childNodes, function(e,i) {
            if (this instanceof Element) {
                //this.style.display = 'none';
                this.index = index++;
                items.push(this);
                zuix.$(this).on('click', function(){
                    setSlide(this.index);
                });
            }
        });

        // load css and html for this component
        ctx.loadCss(function () { });
        ctx.loadHtml(function () {
            // move image list inside the horiz. thumb list
            var itemList = ctx.field('list');
            zuix.$.each(items, function() {
                itemList.appendChild(this);
            });
            setSlide(0);
            setTimeout(function () {
                view.get(0).style.visibility = '';
                view.animateCss('zoomIn');
            }, 500);
        });

        // exposed methods
        //ctx.expose('setSlide', function (i) {
        //    setSlide(i);
        //});
    };

    ctx.destroy = function () {
        zuix.$(ctx.view()).children().each(function () {
            // TODO: should restore original container styles
        });
        currentItem = -1;
    };

    ctx.api = function (command, options) {
        switch (command) {
            case 'slide':
            case 'setSlide':
                setSlide(options);
                break;
        }
    };

    // Private Members

    var currentItem = -1;

    function setSlide(p) {
        if (currentItem == p) return;
        currentItem = p;
        var item = zuix.$(ctx.field('list')).children().eq(p);
        item.animateCss('pulse');
        var img1 = zuix.$(ctx.field('img1'));
        var img2 = zuix.$(ctx.field('img2'));
        if (img1.display() == 'none') {
            img1.attr('src', item.attr('data-href'));
            img1.animateCss('zoomInUp', function () {
                img2.hide();
            }).show();
            img2.animateCss('zoomOutDown');
        } else {
            img2.attr('src', item.attr('data-href'));
            img2.animateCss('zoomInUp', function () {
                img1.hide();
            }).show();
            img1.animateCss('zoomOutDown');
        }
    }

});