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
 * Javascript UI components enhancer. A lite MV* library.
 * Find more details about zuix here:
 *   https://github.com/genielabs/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 */

// Reference to the horizontal page scroller component
var pagedView = null;

// Main page setup
var main = {
    options: {
        content: {
            markdown: true,
            mdl: true,
            prism: true
        },
        content_no_css: {
            markdown: true,
            mdl: true,
            prism: true,
            css: false
        },
        codepen_example_01: {
            model: {
                data: {
                    title: 'ZUIX',
                    subtitle: 'Data-binding test',
                    description: 'Hello World!'
                }
            }
        }
    },
    // Component 'ui/layout/actions-view'
    topMenu: {
        // actions map
        on: {
            // call 'menuItemClicked' handler when a menu item is clicked
            'item:click': menuItemClicked
        },
        // behaviors map
        behavior: {
            // animate the button when clicked
            'item:click': function (e, i) {
                zuix.$(this).children().eq(i).animateCss('tada');
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
            // animate entering/exiting pages on page:change event
            'page:change': changePage
        },
        ready: function (ctx) {
            // store a reference to this component once it's loaded
            pagedView = ctx;
            console.log("ZUIX", "INFO", "Paged view ready.", ctx);
        }
    }

};

// Zuix hook handlers
var splashScreen = zuix.$(zuix.field('splashScreen')).show();
var loaderMessage = zuix.$(zuix.field('loaderMessage'));
var mainPage = zuix.$(zuix.field('main')).hide();
zuix
.hook('load:begin', function(a,b){
    if (splashScreen) splashScreen.show();
    loaderMessage.show();

}).hook('load:step', function(a,b){

}).hook('load:next', function(a,b){
    if (splashScreen)
        zuix.$(zuix.field('loader-progress'))
            .html(b.task).prev()
            .animateCss('bounce');
    loaderMessage.html(b.task)
        .animateCss('bounce');

}).hook('load:end', function(a,b){
    if (splashScreen) {
        // this is only executed once, on app startup
        var s = splashScreen; splashScreen = false;
        s.animateCss('fadeOutUp', function(){
            s.hide();
        });
        // fade in main page
        mainPage.animateCss('fadeIn', function(){
            s.hide();
        }).show();
    }
    loaderMessage.hide();

}).hook('html:parse', function (h, w) {
    // ShowDown - Markdown compiler
    if (this.options().markdown === true && typeof showdown !== 'undefined')
        w.content = new showdown.Converter().makeHtml(w.content);

}).hook('css:parse', function (h, w) {
    console.log("css:parse", w);

}).hook('view:process', function (h, w) {
    // Prism code syntax highlighter
    zuix.$(w).find('code').each(function (i, block) {
        zuix.$(block).addClass('language-javascript');
        Prism.highlightElement(block);
    });
    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]').attr('target','_blank');
    // TODO: move MDL to 'view:ready' hook and remove setTimeout
    // Material Design Light  DOM upgrade
    if (componentHandler) {
        setTimeout(function () {
            componentHandler.upgradeElements(w);
        }, 500);
    }

}).componentize(); // Componentize the page

// Top menu `item:click` event handler
function menuItemClicked(e, i) {
    if (pagedView)
        pagedView.invoke('setPage', i);
    console.log("item::click@ActionsView", i);
}

// PagedView `page:change` behavior handler
function changePage(e, i) {
    // Animate page changing
    var pages = zuix.$(this).children();
    if (i.page > i.old) {
        pages.eq(i.page).animateCss('bounceInRight').show();
        pages.eq(i.old).animateCss('bounceOutLeft', function () {
            pages.eq(i.old).hide();
        }).show();
    } else {
        pages.eq(i.page).animateCss('bounceInLeft').show();
        pages.eq(i.old).animateCss('bounceOutRight', function () {
            pages.eq(i.old).hide();
        }).show();
    }
}

// animateCss extension method for ZQuery
zuix.zQuery.prototype.animateCss  = function (animationName, callback) {
    // TODO: should iterate -> this.each(...)
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    if (this.hasClass('animated'))
        this.trigger('animationend');
    var _t = this;
    this.addClass('animated ' + animationName).one(animationEnd, function () {
        zuix.$(this).removeClass('animated ' + animationName);
        if (typeof callback === 'function')
            callback.call(_t.get(0), animationName);
    });
    return this;
};

// debug stuff
setTimeout(function () {
    zuix.dumpCache();
    zuix.dumpContexts();
}, 5000);
