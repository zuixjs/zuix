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
 *
 * Find more details about ZUIX here:
 *   http://zuix.it
 *   https://github.com/genielabs/zuix
 *
 * @author Generoso Martello <generoso@martello.com>
 *
 */

'use strict';

// Main options and configuration
var main = {
    options: {
        content: {
            mdl: true,
            prism: true
        },
        content_no_css: {
            mdl: true,
            prism: true,
            css: false
        },
        component_no_css: {
            css: false
        }
    },
    // Component 'controllers/paged_view'
    contentPager: {
        css: false,
        html: false,
        // actions map
        on: {
            'page:change': function (e, i) {
                // console.log('page:change@PagedView', i);
            }
        },
        // behaviors map
        behavior: {
            // animate entering/exiting pages on page:change event
            'page:change': changePage
        },
        ready: function() {
            // store a reference to this component once it's loaded
            pagedView = this;
            // console.log("zUIx", "INFO", "Paged view ready.", this);
        }
    }

};


// Instead of including CSS and JS scripts
// using '<style>' and '<script>' we take
// advantage of the 'zuix.using' method so
// the included files will be packed into
// the final 'app.bundle.js'

zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/flex-layout-attribute/1.0.3/css/flex-layout-attribute.min.css');
zuix.using('style', 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.5.2/animate.min.css');

// Animate CSS extension method for ZxQuery
zuix.$.ZxQuery.prototype.animateCss = function() { return this; };
zuix.using('component', '@lib/extensions/animate_css', function(res, ctx){
    console.log('AnimateCSS extension loaded.', res, ctx);
});


// Get reference to various elements of the main page

const loaderMessage = zuix.field('loaderMessage');
const mainPage = zuix.field('main').hide();
let splashScreen = zuix.field('splashScreen').show();
let revealTimeout = null;
// reference to homepage's cover and features block (used for change-page animation)
let coverBlock = null;
let featuresBlock = null;
zuix.field('content-home').on('component:ready', function (ctx) {
    // these element are available only after the 'content-home' is loaded
    coverBlock = zuix.field('mainCover', this);
    featuresBlock = zuix.field('mainFeatures', this);
});
// Reference to navigation components
let pagedView = null;


// Turn off debug output

window.zuixNoConsoleOutput = true;
// zuix.lazyLoad(false);
// zuix.httpCaching(false);


// Global zUIx event hooks

zuix.hook('load:begin', function(data) {
    if (splashScreen) {
        splashScreen.animateCss('fadeIn').show();
    }
    loaderMessage.html('Loading "<em>'+data.task+'</em>" ...').show();
    if (revealTimeout != null) {
        clearTimeout(revealTimeout);
    }
    loaderMessage.animateCss('bounceInUp', {duration: '1.0s'});
}).hook('load:next', function(data) {
    if (data.task.indexOf('zuix_hackbox') > 0) return;
    if (splashScreen) {
        zuix.field('loader-progress')
            .html(data.task).prev()
            .animateCss('bounce');
    }
    loaderMessage.html('Loading "<em>'+data.task+'</em>" complete.')
        .animateCss('bounceInUp', {duration: '1.0s'});
    if (revealTimeout != null) {
        clearTimeout(revealTimeout);
    }
}).hook('load:end', function(data) {
    revealMainPage();
}).hook('componentize:end', function(data) {
    // revealMainPage();
}).hook('html:parse', function(data) {
    // ShowDown - Markdown compiler
    if (typeof data.content == 'string' && this.options().markdown === true && typeof showdown !== 'undefined') {
        data.content = new showdown.Converter()
            .makeHtml(data.content);
    }
}).hook('css:parse', function(data) {
    // console.log(data);
}).hook('view:process', function(view) {
    // Prism code syntax highlighter
    if (this.options().prism && typeof Prism !== 'undefined') {
        view.find('code').each(function(i, block) {
            this.addClass('language-javascript');
            Prism.highlightElement(block);
        });
    }
    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]')
        .attr('target', '_blank')
        .attr('rel', 'noreferrer');

    // Material Design Light integration - DOM upgrade
    if (this.options().mdl && typeof componentHandler !== 'undefined')
        componentHandler.upgradeElements(view.get());
});


// URL routing

window.onhashchange = function() {
    routeCurrentUrl(window.location.hash);
};
function routeCurrentUrl(path) {
    // check if pagedView is loaded
    if (pagedView == null) return;
    const anchorIndex = path.lastIndexOf('#');
    let pageAnchor = null;
    if (anchorIndex > 0) {
        pageAnchor = path.substring(anchorIndex + 1);
        path = path.substring(0, anchorIndex);
    }
    switch (path) {
        case '#/start':
            pagedView.setPage(1);
            break;
        case '#/docs':
            pagedView.setPage(2);
            break;
        case '#/api':
            pagedView.setPage(3);
            break;
        case '':
        case '#/':
            pagedView.setPage(0, 0);
            break;
    }
    const p = pagedView.getCurrentPage();
    if (pageAnchor !== null) {
        const a = p.find('a[id=' + pageAnchor+']');
        if (a.length() > 0) {
            setTimeout(function() {
                scrollTo(p.get(), p.get().scrollTop+a.position().y-64, 750);
            }, 500);
        }
    } // else p.get().scrollTop = 0;
}


// Other utility functions

let scrollEndTs;
function scrollTo(element, to, duration) {
    const currentTs = Date.now();
    if (duration != null) {
        scrollEndTs = currentTs + duration;
    }
    duration = scrollEndTs-currentTs;
    const difference = to - element.scrollTop;
    if (duration <= 0) {
        element.scrollTop = to;
        return;
    }
    requestAnimationFrame(function() {
        element.scrollTop = element.scrollTop + (difference / (duration/2));
        scrollTo(element, to);
    });
}

function revealMainPage() {
    loaderMessage.animateCss('bounceOutDown', { duration: '2.0s' }, function () {
        this.hide();
    });
    if (revealTimeout != null)
        clearTimeout(revealTimeout);
    revealTimeout = setTimeout(reveal, 350);
}

function reveal() {
    if (splashScreen) {
        const s = splashScreen; splashScreen = false;
        // unregister 'componentize:end' hook
        zuix.hook('componentize:end', null);
        // this is only executed once, on app startup
        s.animateCss('fadeOutUp', function(){
            s.hide();
        });
        // fade in main page
        mainPage.animateCss('fadeIn',
            {duration: '1.2s'},
            function() {
                s.hide();
            }).show();
        routeCurrentUrl(window.location.hash);
    }
}

const zxHeader = zuix.$.find('.site-header').hide();
zxHeader.hidden = true; const headerTriggerY = 100;
// const zxHeaderTitle = zxHeader.find('[data-ui-field=title]');
// const zxFooter = zuix.$.find('.site-footer').hide();

zuix.$.find('section').eq(0).on('scroll', function(data) {
   checkMenuVisibility();
});

function checkMenuVisibility() {
    const checkPosition = featuresBlock.position();
    // console.log(checkPosition, zxHeader.display());
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

// PagedView `page:change` behavior handler
function changePage(e, i, effectIn, effectOut, dirIn, dirOut) {

    // cover+header animation reveal/hide
    if (i.page == 0) {
        zxHeader.animateCss('fadeOut', function() {
            this.hide();
        });
        coverBlock
            .animateCss('bounceInDown');
        featuresBlock
            .animateCss('bounceInUp', function() {
                zxHeader.hidden = true;
                checkMenuVisibility();
            });
    } else if (i.old == 0) {
        zxHeader.show().animateCss('fadeIn');
        coverBlock
            .animateCss('slideOutUp');
        featuresBlock
            .animateCss('slideOutDown');
    } else if (i.old == 2) {
        zuix.context('menu-docs', function() {
            this.hideButton();
        });
    } else if (i.old == 3) {
        zuix.context('menu-api', function() {
            this.hideButton();
        });
    }

    if (i.page == 2) {
        zuix.context('menu-docs', function () {
            this.showButton();
        });
    } else if (i.page == 3) {
        zuix.context('menu-api', function () {
            this.showButton();
        });
    }

    // 'page change' animation
    if (effectIn == null) effectIn = 'fadeIn';
    if (effectOut == null) effectOut = 'fadeOut';
    // Animate page changing
    const options = { duration: '1.0s' };
    const pages = this.children();
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
