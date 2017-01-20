zuix.controller(function (ctx) {

    ctx.create = function() {
        var view = zuix.$(ctx.view());
        //view.get(0).style.visibility = 'hidden';

        // read inline image list
        var items = [];
        var index = 0;
        zuix.$.each(ctx.view().childNodes, function(e,i) {
            if (this instanceof Element) {
                // add image and attach click listener
                this.index = index++;
                items.push(this);
                zuix.$(this).on('click', function(){
                    setSlide(this.index);
                });
            }
        });

        // load css and html for this component
        // TODO: replace these two calls with a single
        // TODO:   ctx.loadView(...)
        ctx.loadCss(function() { });
        ctx.loadHtml(function() {
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

    // Private Members

    var currentItem = -1;

    function setSlide(p) {
        if (currentItem == p) return;
        currentItem = p;
        var itemList = zuix.$(ctx.field('list'))
            .children()
            .removeClass('selected');
        var item = itemList.eq(p);
        item.addClass('selected').animateCss('pulse');
        //ctx.field('list').scrollLeft = zuix.$.getPosition(item.get(0)).x - ctx.field('list').parentNode.clientWidth / 2;
        var img1 = zuix.$(ctx.field('img1'));
        var img2 = zuix.$(ctx.field('img2'));
        if (img1.display() == 'none') {
            img1.attr('src', item.attr('data-href'));
            img1.parent().css('zIndex', 10);
            img1.show();
            img2.parent().css('zIndex', 1);
            img2.hide();
            animateSlide(img1, img2);
        } else {
            img2.attr('src', item.attr('data-href'));
            img2.parent().css('zIndex', 10);
            img2.show();
            img1.parent().css('zIndex', 1);
            img1.hide();
            animateSlide(img2, img1);
        }
    }

    function animateSlide(slideIn, slideOut) {
        slideIn.animateCss('zoomInUp').show();
        slideOut.animateCss('zoomOutDown', function () {
            slideOut.hide();
        }).show();
    }

});