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
var actionsView = null;

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
        content_no_md: {
            markdown: false,
            mdl: true,
            prism: true
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
                this.children().eq(i).animateCss('tada');
            }
        },
        // component ready callback
        ready: function () {
            actionsView = this;
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
.hook('load:begin', function(data){
    if (splashScreen) splashScreen.show();
    loaderMessage.html(data.task)
        .animateCss('bounce')
        .show();

}).hook('load:next', function(data){
    if (splashScreen)
        zuix.field('loader-progress')
            .html(data.task).prev()
            .animateCss('bounce');
    loaderMessage.html(data.task+' complete.')
        .animateCss('bounce');

}).hook('load:end', function(data){
    if (splashScreen) {
        // this is only executed once, on app startup
        var s = splashScreen; splashScreen = false;
        s.animateCss('fadeOutUp', function(){
            s.hide();
        });
        // fade in main page
        mainPage.animateCss('fadeIn',
            { duration: '2s' },
        function(){
            s.hide();
        }).show();
    }
    loaderMessage.hide();

}).hook('html:parse', function (data) {
    // ShowDown - Markdown compiler
    if (this.options().markdown === true && typeof showdown !== 'undefined')
        data.content = new showdown.Converter()
            .makeHtml(data.content);

}).hook('css:parse', function (data) {
    console.log(data);

}).hook('view:process', function (data) {
    // Prism code syntax highlighter
    if (this.options().prism) {
        data.find('code').each(function (i, block) {
            this.addClass('language-javascript');
            Prism.highlightElement(block);
        });
    }
    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]').attr('target','_blank');
    // Material Design Light integration - DOM upgrade
    if (this.options().mdl && componentHandler)
        componentHandler.upgradeElements(data.get());
});

// Top menu `item:click` event handler
function menuItemClicked(e, i) {
    if (pagedView)
        pagedView.setPage(i);
    console.log("item::click@ActionsView", i);
}

zuix.$.find('.site-header').hide();
zuix.$.find('.site-footer').hide();

// PagedView `page:change` behavior handler
function changePage(e, i, effectIn, effectOut, dirIn, dirOut) {
    if (i.page === 0) {
        zuix.$.find('.site-header').animateCss('fadeOut', function () {
            this.hide();
        });
        zuix.$.find('.zuix-color--block-1')
            .animateCss('bounceInDown');
        zuix.$.find('.zuix-color--block-2')
            .animateCss('bounceInUp');
        //zuix.$.find('.site-footer').visibility('hidden');
    } else if (i.old === 0) {
        zuix.$.find('.site-header').show().animateCss('fadeIn');
        zuix.$.find('.zuix-color--block-1')
            .animateCss('slideOutUp');
        zuix.$.find('.zuix-color--block-2')
            .animateCss('slideOutDown');
        //zuix.$.find('.site-footer').visibility('');
    }
    if (effectIn == null) effectIn = 'fadeIn';
    if (effectOut == null) effectOut = 'fadeOut';
    // Animate page changing
    var options = { duration: '1.5s' };
    var pages = this.children();
    if (i.page > i.old) {
        if (dirIn == null) dirIn = ''; //'Right';
        if (dirOut == null) dirOut = ''; //'Left';
        pages.eq(i.page).animateCss(effectIn+dirIn, options)
            .show();
        pages.eq(i.old).animateCss(effectOut+dirOut, options, function () {
            pages.eq(i.old).hide();
        }).show();
    } else {
        if (dirIn == null) dirIn = ''; //'Left';
        if (dirOut == null) dirOut = ''; //'Right';
        pages.eq(i.page).animateCss(effectIn+dirIn, options)
            .show();
        pages.eq(i.old).animateCss(effectOut+dirOut, options, function () {
            pages.eq(i.old).hide();
        }).show();
    }
}

// animateCss extension method for ZxQuery
zuix.$.ZxQuery.prototype.animateCss  = function (animationName, param1, param2) {
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
    var prefixes = [ '-webkit', '-moz', '-o', '-ms' ];
    for(var key in options)
        for (var p in prefixes)
            this.css(prefixes[p] + '-animation-' + key, options[key]);
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
    if (this.hasClass('animated'))
        this.trigger('animationend');
    var _t = this;
    this.addClass('animated ' + animationName).one(animationEnd, function () {
        this.removeClass('animated ' + animationName);
        for(var key in options)
            for (var p in prefixes)
                _t.css(prefixes[p] + '-animation-' + key, '');
        if (typeof callback === 'function')
            callback.call(_t, animationName);
    });
    return this;
};

// debug stuff
setTimeout(function () {
    zuix.dumpCache();
    zuix.dumpContexts();
}, 5000);
