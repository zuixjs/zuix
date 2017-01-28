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
        component_no_css: {
            css: false
        }
    },
    // Component 'ui/layout/actions_view'
    topMenu: {
        css: false,
        html: false,
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
        ready: function () {
            console.log("ZUIX", "INFO", "Top menu ready.", this);
        }
    },

    // Component 'ui/layout/paged_view'
    contentPager: {
        css: false,
        html: false,
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
        ready: function () {
            // store a reference to this component once it's loaded
            pagedView = this;
            console.log("ZUIX", "INFO", "Paged view ready.", this);
        }
    }

};

// Zuix hook handlers
var splashScreen = zuix.field('splashScreen').show();
var loaderMessage = zuix.field('loaderMessage');
var mainPage = zuix.field('main').hide();
//zuix.lazyLoad(false);
zuix
.hook('load:begin', function(a,b){
    if (splashScreen) splashScreen.show();
    loaderMessage.show();

}).hook('load:step', function(a,b){

}).hook('load:next', function(a,b){
    if (splashScreen)
        zuix.field('loader-progress')
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
    w.find('code').each(function (i, block) {
        block.addClass('language-javascript');
        Prism.highlightElement(block.get());
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
        pagedView.setPage(i);
    console.log("item::click@ActionsView", i);
}

// PagedView `page:change` behavior handler
function changePage(e, i, effectIn, effectOut, dirIn, dirOut) {
    if (effectIn == null) effectIn = 'bounceIn';
    if (effectOut == null) effectOut = 'bounceOut';
    // Animate page changing
    var options = { duration: '.5s' };
    var pages = zuix.$(this).children();
    if (i.page > i.old) {
        if (dirIn == null) dirIn = 'Right';
        if (dirOut == null) dirOut = 'Left';
        pages.eq(i.page).animateCss(effectIn+dirIn, options)
            .css('overflow', 'hidden').show();
        pages.eq(i.old).animateCss(effectOut+dirOut, options, function () {
            pages.eq(i.page).css('overflow', 'auto');
            pages.eq(i.old).css('overflow', 'auto').hide();
        }).css('overflow', 'hidden').show();
    } else {
        if (dirIn == null) dirIn = 'Left';
        if (dirOut == null) dirOut = 'Right';
        pages.eq(i.page).animateCss(effectIn+dirIn, options)
            .css('overflow', 'hidden').show();
        pages.eq(i.old).animateCss(effectOut+dirOut, options, function () {
            pages.eq(i.page).css('overflow', 'auto');
            pages.eq(i.old).css('overflow', 'auto').hide();
        }).css('overflow', 'hidden').show();
    }
}

// animateCss extension method for ZxQuery
zuix.ZxQuery.prototype.animateCss  = function (animationName, param1, param2) {
    var callback, options;
    if (typeof param2 === 'function') {
        options = param1;
        callback = param2;
    } else {
        if (typeof param1 === 'function')
            callback = param1;
        else options = param1;
    }
    // TODO: should run all the following code for each element in the ZxQuery selection
    var prefixes = [ '-webkit', '-moz', '-ms' ];
    for(var key in options)
        for (var p in prefixes)
            this.css(prefixes[p] + '-animation-' + key, options[key]);
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    if (this.hasClass('animated'))
        this.trigger('animationend');
    var _t = this;
    this.addClass('animated ' + animationName).one(animationEnd, function () {
        zuix.$(this).removeClass('animated ' + animationName);
        for(var key in options)
            for (var p in prefixes)
                zuix.$(_t).css(prefixes[p] + '-animation-' + key, '');
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
