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
zuix.httpCaching(false);
zuix
.hook('load:begin', function(data){
    if (splashScreen) splashScreen.show();
    loaderMessage.html('Loading "<em>'+data.task+'</em>" ...')
        .animateCss('bounceInUp', { duration: '1.0s' })
        .show();

}).hook('load:next', function(data){
    if (splashScreen)
        zuix.field('loader-progress')
            .html(data.task).prev()
            .animateCss('bounce');
    loaderMessage.html('Loading "<em>'+data.task+'</em>" complete.')
        .animateCss('bounceInUp', { duration: '1.0s' });
    if (data.task === 'html:content/footer') {
        // reveal page after footer is loaded
        if (splashScreen) {
            // this is only executed once, on app startup
            var s = splashScreen; splashScreen = false;
            s.animateCss('fadeOutUp', function(){
                s.hide();
            });
            // fade in main page
            mainPage.animateCss('fadeIn',
                { duration: '1.2s' },
                function(){
                    s.hide();
                }).show();
            if (coverBlock == null) {
                coverBlock = zuix.$.find('[data-ui-component="content/home/cover"]');
                featuresBlock = zuix.$.find('[data-ui-component="content/home/features"]');
            }
        }
    }
}).hook('load:end', function(data){

    loaderMessage.animateCss('bounceOutDown', { duration: '2.0s' }, function () {
        this.hide();
    });

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
    if (/*this.options().mdl &&*/ componentHandler)
        componentHandler.upgradeElements(data.get());
});

// TODO: move animateCss to a separate util.js file
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
    // stops any previously running animation
    if (this.hasClass('animated')) {
        this.css('transition', ''); // TODO: <-- is this really needed?
        this.trigger('animationend');
    }
    // TODO: should run all the following code for each element in the ZxQuery selection
    var prefixes = [ '-webkit', '-moz', '-o', '-ms' ];
    for(var key in options)
        for (var p in prefixes)
            this.css(prefixes[p] + '-animation-' + key, options[key]);
    var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
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

var zxHeader = zuix.$.find('.site-header').hide();
zxHeader.hidden = true; var headerTriggerY = 100;
var zxHeaderTitle = zxHeader.find('[data-ui-field=title]');
var zxFooter = zuix.$.find('.site-footer').hide();
var featuresBlock = null;
var coverBlock = null;

zuix.$.find('section').eq(0).on('scroll', function (data) {
   checkMenuVisibility();
});

// USAGE section header title - on scroll
var usagePage = zuix.field('page-usage');
var usageTitlePath = zuix.load('ui/usability/content_path', {
    view: usagePage,
    tags: 'h3,h4,h5',
    target: zxHeaderTitle,
    html: false,
    css: false
});
// API section header title - on scroll
var apiPage = zuix.field('page-api');
var apiTitlePath = zuix.load('ui/usability/content_path', {
    view: apiPage,
    tags: 'h3',
    target: zxHeaderTitle,
    html: false,
    css: false
});

function checkMenuVisibility() {
    var checkPosition = featuresBlock.position();
    //console.log(checkPosition, zxHeader.display());
    if (checkPosition.y < headerTriggerY && zxHeader.hidden && !zxHeader.hasClass('animated')) {
        zxHeader.show()
            .animateCss('fadeInDown', { duration: '.5s' }, function () {
                this.show();
                zxHeader.hidden = false;
            });
    } else if (checkPosition.y >= headerTriggerY && !zxHeader.hidden && !zxHeader.hasClass('animated')) {
        zxHeader.show().animateCss('fadeOutUp', { duration: '.5s' }, function () {
            this.hide();
            zxHeader.hidden = true;
        });
    }
}

// Top menu `item:click` event handler
function menuItemClicked(e, i) {
    if (pagedView)
        pagedView.setPage(i);
    console.log("item::click@ActionsView", i);
}


// PagedView `page:change` behavior handler
function changePage(e, i, effectIn, effectOut, dirIn, dirOut) {
    zxHeaderTitle.html('');

    // cover+header animation reveal/hide
    if (i.page === 0) {
        zxHeader.animateCss('fadeOut', function () {
            this.hide();
        });
        coverBlock
            .animateCss('bounceInDown');
        featuresBlock
            .animateCss('bounceInUp', function () {
                zxHeader.hidden = true;
                checkMenuVisibility();
            });
    } else if (i.old === 0) {
        zxHeader.show().animateCss('fadeIn');
        coverBlock
            .animateCss('slideOutUp');
        featuresBlock
            .animateCss('slideOutDown');
    }

    // header title path
    if (i.page === 1)
        setTimeout(function () {
            usageTitlePath.update();
        }, 1000);
    else if (i.page === 2)
        setTimeout(function () {
            apiTitlePath.update();
        }, 1000);

    // contextual FAB menu
    if (i.old === 1)
        zuix.context('menu_getting_started').hideMenu();
    else if (i.old === 2)
        zuix.context('menu_api').hideMenu();
    if (i.page === 1)
        zuix.context('menu_getting_started').showMenu();
    else if (i.page === 2)
        zuix.context('menu_api').showMenu();

    // 'page change' animation
    if (effectIn == null) effectIn = 'fadeIn';
    if (effectOut == null) effectOut = 'fadeOut';
    // Animate page changing
    var options = { duration: '1.0s' };
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

// debug stuff
setTimeout(function () {
    zuix.dumpCache();
    zuix.dumpContexts();
}, 5000);
