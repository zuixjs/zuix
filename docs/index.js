/**
 * @license
 * Copyright 2015-2017 G-Labs. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * Javascript UI components enhancer. A lite MVC library.
 * Find more details about zuix here:
 *   https://github.com/genielabs/zuix-mvc-js
 *
 * @author Generoso Martello <generoso@martello.com>
 */

// Wait for bootstrap to complete
zuix.field('loader').show();
zuix.loadEnd(function () {
    zuix.field('loader').fadeOut(500);
});

// Main page setup
var pagedView = null;
var main = {

    // Component 'ui/layout/actions-view'
    topMenu: {
        // actions map
        on: {
            'item:click': menuItemClicked
        },
        // behaviors map
        behavior: {
            'item:click': function (e, i) {
                // animate the button when clicked
                $(this).children().eq(i).animateCss('tada');
            }
        },
        // component ready callback
        ready: function (ctx) {
            console.log("ZUIX", "INFO", "Top menu ready.", ctx);
        }
    },

    // Component 'ui/layout/paged-view'
    contentPager: {
        // actions map
        on: {
            'page:change': function (e, i) {
                console.log('page:change@PagedView', i);
            }
        },
        // behaviors map
        behavior: {
            'page:change': changePage
        },
        ready: function (ctx) {
            // store a reference to this component once it's loaded
            pagedView = ctx;
            console.log("ZUIX", "INFO", "Paged view ready.", ctx);
        }
    }

};
zuix.componentize();

function menuItemClicked(e, i) {
    if (pagedView) pagedView.invoke('setPage', i);
    console.log("item::click@ActionsView", i);
}

function changePage(e, i) {
    // Animate page changing
    var pages = $(this).children();
    if (i.page > i.old) {
        pages.eq(i.page).animateCss('bounceInRight').show();
        pages.eq(i.old).animateCss('bounceOutLeft', function () {
            if (!pages.eq(i.old).hasClass('animated'))
                pages.eq(i.old).hide();
        }).show();
    } else {
        pages.eq(i.page).animateCss('bounceInLeft').show();
        pages.eq(i.old).animateCss('bounceOutRight', function () {
            if (!pages.eq(i.old).hasClass('animated'))
                pages.eq(i.old).hide();
        }).show();
    }
}

/*
 // Example of loading UI logic from two different components
 // into the same view
 var test = zuix.load('ui/layout/actions-view', {
 view: zuix.field('content-pages'),
 ready: function(c) {
 c.on('item:click', function (e, i) {
 console.log(this);
 console.log(i);
 });
 }
 });
 */


// Example - Loading external hosted component
// NOTE: ensure the source is trusted before
// loading any external hosted component in your site
zuix.load('https://codepen.io/genielabs/pen/RomJZy', {
    container: zuix.field('zuix-demo')
});


// debug
setTimeout(function () {
    zuix.dumpCache();
    zuix.dumpContexts();
}, 5000);


// jQuery helpers
$.fn.extend({
    animateCss: function (animationName, callback) {
        var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
        if (this.hasClass('animated'))
            this.trigger('animationend');
        this.addClass('animated ' + animationName).one(animationEnd, function () {
            $(this).removeClass('animated ' + animationName);
            if (typeof callback === 'function') {
                callback.this = this;
                callback(animationName);
            }
        });
        return this;
    }
});