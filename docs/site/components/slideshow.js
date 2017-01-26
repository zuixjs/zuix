zuix.controller(function (cp) {

    cp.create = function() {
        cp.view().visibility('hidden');

        // read inline image list
        var items = [];
        var index = 0;
        cp.view().children().each(function(e,i) {
            if (this instanceof Element) {
                // add image and attach click listener
                this.index = index++;
                items.push(this);
                cp.view(this).on('click', function(){
                    setSlide(this.index);
                });
            }
        });

        // load css and html for this component
        //cp.loadCss();
        cp.loadHtml({
            then: function () {
                // move image list inside the horiz. thumb list
                var itemList = cp.field('list');
                cp.view(items).each(function () {
                    itemList.append(this);
                });
                setSlide(0);
                setTimeout(function () {
                    cp.view().animateCss('zoomIn');
                    cp.view().visibility('');
                }, 500);
            }
        });

        // exposed methods
        //cp.expose('setSlide', function (i) {
        //    setSlide(i);
        //});
    };

    cp.destroy = function () {
        cp.view().children().each(function () {
            // TODO: should restore original container styles
        });
        currentItem = -1;
    };

    // Private Members

    var currentItem = -1;

    function setSlide(p) {
        if (currentItem == p) return;
        currentItem = p;
        var itemList = cp.field('list')
            .children()
            .removeClass('selected');
        var item = itemList.eq(p);
        item.addClass('selected').animateCss('pulse');
        //cp.field('list').scrollLeft = zuix.$.getPosition(item.get(0)).x - cp.field('list').parentNode.clientWidth / 2;
        var img1 = cp.field('img1');
        var img2 = cp.field('img2');
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