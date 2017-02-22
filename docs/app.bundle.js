zuix.bundle([{"componentId":"ui\u002Fusability\u002Fcontent_path","view":"\n                \u003Cdiv layout=\"column top-center\" self=\"size-x1\" class=\"page-content\"\u003E\n                    \u003C!-- Your content goes here --\u003E\n                    \u003Cdiv self=\"size-larger top-center\" class=\"section-content mdl-shadow--8dp\"\u003E\n\n                        \u003C!-- include content from local resource --\u003E\n                        \u003Cdiv data-ui-include=\"content\u002Fget_started\" data-ui-priority=\"2\" data-ui-options=\"main.options.content\" data-ui-lazyload=\"false\" class=\"progressive-content-container\" data-ui-loaded=\"false\" data-ui-component=\"content\u002Fget_started\" style=\"visibility: hidden;\"\u003E\u003C\u002Fdiv\u003E\n\n                    \u003C\u002Fdiv\u003E\n                \u003C\u002Fdiv\u003E\n            ","css":null,"controller":function (cp) {
    var currentTitle = '', currentPos = 0;
    var offset = 200, items = [], title = null;
    var timeout = null;

    cp.create = function () {
        title = zuix.$(cp.options().target);
        cp.view().on('scroll', function (e) {
            postUpdate();
        });
        cp.expose('update', function () {
            title.attr('title', '');
            currentPos = 0;
            postUpdate();
        });
    };

    function postUpdate() {
        if (timeout != null)
            clearTimeout(timeout);
        timeout = setTimeout(update, 100);
    }

    function update() {
        var direction = '', top = 0;
        currentTitle = '';
        items = cp.view().find(cp.options().tags);
        items.each(function (k, v) {
            var p = this.position();
            if (p.y < offset) {
                top = this.get().offsetTop;
                currentTitle = this.html().replace(/<i.*>.*<\/i>/g, '');
            }
        });
        if (currentTitle != null) {
            if (title.attr('title') != currentTitle) {
                title.attr('title', currentTitle);
                if (currentPos != 0) {
                    if (currentPos > top)
                        direction = 'Down';
                    else
                        direction = 'Up';
                }
                currentPos = top;
                title.animateCss('fadeOut'+direction, { duration: '0.2s' }, function () {
                    this.html(currentTitle)
                        .animateCss('fadeIn'+direction, { duration: '0.2s' });
                });
            }
        }
    }

}},{"componentId":"content\u002Fapi\u002Fmenu","view":"\u003Cdiv style=\"position: fixed;right:32px;bottom:16px;z-index:100; height: auto;\"\u003E\n    \u003Cdiv data-ui-options=\"api_menu_options\"\n         data-ui-load=\"site\u002Fcomponents\u002Factions_menu\"\n         data-ui-context=\"menu_api\"\n         class=\"content-padding\"\n         layout=\"column center-right\"\u003E\n        \u003C!-- menu actions --\u003E\n        \u003C!-- Colored FAB button with ripple --\u003E\n        \u003Cdiv layout=\"column center-right\"\n             class=\"options mdl-shadow--8dp\"\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EAPI\u003C\u002Fspan\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EZuix class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EContextOptions object\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Eradio_button_unchecked\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EComponentContext class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EContextController class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EZxQuery class\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Ecode\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv class=\"menu\"\u003E\n            \u003Ca class=\"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-color--blue mdl-shadow--6dp\"\u003E\n                \u003Ci class=\"material-icons\"\u003Etoc\u003C\u002Fi\u003E\n            \u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\n    var api_menu_options = {\n        css: false,\n        html: false,\n        on: {\n            'view:create': function () {\n                this.hide();\n            },\n            'item:click': function (e, i) {\n                var p = pagedView.getPage(2);\n                switch (parseInt(i)) {\n                    case 0:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API').position().y);\n                        break;\n                    case 1:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--Zuix').position().y);\n                        break;\n                    case 2:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ContextOptions').position().y);\n                        break;\n                    case 3:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ComponentContext').position().y);\n                        break;\n                    case 4:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ContextController').position().y);\n                        break;\n                    case 5:\n                        scrollTo(p.get(), p.find('a[id=ZUIX_API--ZxQuery').position().y);\n                        break;\n                }\n                e.preventDefault();\n            }\n        }\n    };\n\u003C\u002Fscript\u003E\n","css":".options .menu-item {\n    padding: 16px;\n    height: 48px;\n    cursor: pointer;\n    vertical-align: middle;\n}\ndiv.options {\n    margin-bottom: 16px;\n    margin-right: -12px;\n    margin-left: 32px;\n    padding: 16px;\n    color:white;\n    background-color: rgba(60, 60, 60, 0.9);\n    font-weight: 400;\n    -webkit-border-radius: 20px;\n    -moz-border-radius: 20px;\n    border-radius: 20px;\n}\n.options .menu-item i {\n    color: white;\n}\n.menu {\n    max-width: 56px;\n}","controller":function (){}},{"componentId":"ui\u002Fwidgets\u002Fzuix_hackbox","view":"\u003Cdiv data-ui-field=\"toolbox\" layout=\"column top-stretch\" class=\"toolbox mdl-shadow--24dp\"\u003E\n\n    \u003Cdiv class=\"header mdl-shadow--6dp\"\n         layout=\"row center-justify\"\u003E\n        \u003Cdiv class=\"logo\"\u003E\n            \u003Cspan\u003Ez\u003C\u002Fspan\u003E\u003Cstrong\u003EUI\u003C\u002Fstrong\u003E\u003Cspan\u003Ex\u003C\u002Fspan\u003E\n            hack box\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv self=\"right\"\u003E\n            \u003C!--a class=\"mdl-button mdl-js-button mdl-js-ripple-effect\"\u003E\n                \u003Ci class=\"material-icons\"\u003Efullscreen\u003C\u002Fi\u003E\n            \u003C\u002Fa--\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\n    \u003Cdiv self=\"size-x1\"\n         data-ui-load=\"ui\u002Flayout\u002Fpaged_view\"\n         data-ui-field=\"paged-view\"\n         data-ui-context=\"pagedView\"\n         data-ui-relative=\"true\"\n         layout=\"column stretch-stretch\"\u003E\n\n        \u003Cdiv data-ui-field=\"fragment-log\"\n             data-ui-lazyload=\"scroll\"\n             class=\"log-box scrollable mdl-shadow--16dp\"\u003E\n\n            \u003Cdiv data-ui-field=\"log-list\"\n                 data-ui-lazyload=\"false\"\n                 data-ui-load=\"ui\u002Flayout\u002Flist_view\"\u003E\n\n                loading...\n\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv data-ui-field=\"fragment-bundle\"\n             data-ui-lazyload=\"scroll\"\n             class=\"bundle-box  mdl-color--white mdl-color-text--black scrollable content-padding\"\u003E\n\n            \u003Cdiv class=\"content-padding\" layout=\"columns spread\"\u003E\n                \u003Cp\u003E\n                    Bundling the application will pack all loaded components so far (html, css, js),\n                    into a single \u003Cstrong\u003Eapp.bundle.js\u003C\u002Fstrong\u003E file.\n                    \u003Cbr\u002F\u003E\n                    Include the generated file right after the \u003Cu\u003Ezuix.min.js\u003C\u002Fu\u003E script.\n                    Using a single app bundle will speed up loading when ready for production.\n                \u003C\u002Fp\u003E\n                \u003Cdiv data-ui-field=\"bundle-progress\" self=\"size-1of3\" class=\"mdl-progress mdl-js-progress mdl-progress__indeterminate\"\u003E\u003C\u002Fdiv\u003E\n                \u003Cdiv align=\"center\" layout=\"row top-spread\" class=\"content-padding\"\u003E\n                    \u003Cdiv class=\"content-padding\"\u003E\n                        \u003Ca data-ui-field=\"button-load\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-color-text--accent\"\u003ELoad all components\u003C\u002Fa\u003E\n                    \u003C\u002Fdiv\u003E\n                    \u003Cdiv class=\"content-padding\"\u003E\n                        \u003Ca data-ui-field=\"button-save\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect mdl-button--raised mdl-color-text--accent\"\u003EDownload Bundle\u003C\u002Fa\u003E\n                    \u003C\u002Fdiv\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv data-ui-field=\"fragmemnt-components\"\n             data-ui-load=\"ui\u002Fwidgets\u002Fzuix_editor\"\n             data-ui-context=\"zuix-editor\"\n             data-ui-lazyload=\"scroll\"\n             class=\"bundle-box  mdl-color--white mdl-color-text--black scrollable content-padding\"\n             layout=\"row stretch-stretch\"\u003E\u003C\u002Fdiv\u003E\n\n    \u003C\u002Fdiv\u003E\n\n    \u003Cdiv class=\"footer mdl-shadow--24dp\"\n         layout=\"row center-spread\"\u003E\n        \u003Ca data-ui-field=\"button-hide\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\"\u003E\n            \u003Ci class=\"material-icons\"\u003Echevron_left\u003C\u002Fi\u003E\n        \u003C\u002Fa\u003E\n        \u003Cdiv self=\"size-x1\" layout=\"row center-center\"\u003E\n            \u003Csmall data-ui-field=\"editor-info\" class=\"mdl-color-text--accent\"\u003E\u003C\u002Fsmall\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Ca data-ui-field=\"button-bundle\" class=\"mdl-button mdl-js-button margin-left\"\u003EBundle\u003C\u002Fa\u003E\n        \u003Ca data-ui-field=\"button-log\" class=\"mdl-button mdl-js-button margin-left is-active\"\u003ELog\u003C\u002Fa\u003E\n        \u003Ca data-ui-field=\"button-components\" class=\"material-icons mdl-color-text--blue-900 mdl-badge mdl-badge--overlap mdl-badge--no-background margin-left\" data-badge=\"!\"\u003E\n            extension\n        \u003C\u002Fa\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-field=\"log-overlay\" class=\"log-overlay\"\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-field=\"fab-menu\" class=\"fab-menu\"\u003E\n    \u003Ca data-ui-field=\"components\" class=\"mdl-button mdl-js-button mdl-button--fab mdl-button--mini-fab mdl-color--yellow-A400 mdl-js-ripple-effect mdl-shadow--24dp mdl-badge mdl-badge--overlap\" data-badge=\"!\"\u003E\n        \u003Ci class=\"material-icons mdl-color-text--blue-900\"\u003Eextension\u003C\u002Fi\u003E\n    \u003C\u002Fa\u003E\n\u003C\u002Fdiv\u003E\n","css":"code {\n    padding-left: 8px;\n}\npre {\n    font-size: 80%;\n    margin: 0;\n    padding: 8px;\n}\na.is-active {\n    border-top: 4px solid ;\n    color: rgba(255,0,100,0.8);\n    transform: translate(0,-4px);\n}\n\n.header {\n    padding: 4px 8px 4px 4px;\n    border: solid 1px rgba(150,150,150,0.5);\n    background-color: rgba(230,230,255,0.95);\n    z-index: 1;\n}\n.header .logo {\n    margin-left: 8px;\n}\n\n.footer {\n    padding: 8px 24px 8px 0;\n    border: solid 1px rgba(150,150,150,0.5);\n    background-color: rgba(230,230,255,0.95);\n    z-index: 1;\n}\n.footer a.margin-left { cursor: pointer; margin-left: 24px; }\n.footer small { font-weight: 700; }\n\n.toolbox {\n    height: 100%;\n    background-color: rgba(0,0,0,0.9);\n    overflow: hidden;\n}\n.fab-menu {\n    position: absolute;\n    bottom: -24px;\n    left: -24px;\n    padding: 8px;\n}\n\n.log-box {\n    border: solid 1px rgba(150,150,150,0.5);\n    padding-right: 8px;\n    color: greenyellow;\n    margin-top: 8px;\n}\n\n.bundle-box {\n    margin-top: 8px;\n    border: solid 1px rgba(150,150,150,0.5);\n    padding: 8px;\n    color: greenyellow;\n    -webkit-box-shadow: inset 0 -1px 5px 0 rgba(0,0,0,0.35);\n    -moz-box-shadow:    inset 0 -1px 5px 0 rgba(0,0,0,0.35);\n    box-shadow:         inset 0 -1px 5px 0 rgba(0,0,0,0.35);\n}\ndiv[data-ui-field=debug-log] {\n    color: white;\n    font-size:70%;\n    font-family: monospace;\n    text-align: left;\n}\na[data-ui-field=\"components\"] {\n    overflow: visible;\n}\n.scrollable {\n    overflow: hidden;\n    overflow-y: auto;\n    position: absolute;\n    bottom: 56px;\n    top: 40px;\n    left: 0;\n    right: 0;\n}\n","controller":function (cp) {
    var mainToolbox = null,
        pagedView = null,
        logListContainer = null;
    /** @type {ComponentContext} */
    var logListView;

    var logCache = [],
        timeout = null,
        editorOpen = false,
        zuixEditor = null;

    var PAGE_LOG = 0,
        PAGE_BUNDLE = 1,
        PAGE_COMPONENTS = 2;

    var bundleBox = null, logBox = null, componentsBox;
    var logOverlay = null, fabMenu = null, buttonHide = null;

    cp.init = function () {
        // disable zuix logging to console
        window.zuixNoConsoleOutput = true;
    };

    cp.create = function () {
        // the main toolbox fragment
        mainToolbox = cp.field('toolbox').hide();
        pagedView = cp.field('paged-view');
        logListContainer = cp.field('log-list').on('component:ready', function () {
            logListView = zuix.context(this);
        });
        // the components fragment
        componentsBox = cp.field('fragment-components').hide();
        // the bundle fragment
        bundleBox = cp.field('fragment-bundle').hide();
        // the debug log fragment
        logBox = cp.field('fragment-log').show();
        // the fab button
        fabMenu = cp.field('fab-menu');
        fabMenu.on('click', showToolbox);
        // the hide button
        buttonHide = cp.field('button-hide')
            .on('click', backOrHide);
        // move overlay to the document root
        logOverlay = cp.field('log-overlay');
        logOverlay.css({
            overflow: 'hidden',
            position: 'absolute',
            left: 0, top: 0, bottom: 0, right: 0
        });
        document.body.appendChild(logOverlay.get());
        // event listeners
        cp.field('button-bundle').on('click', showBundle);
        cp.field('button-log').on('click', showLog);
        cp.field('button-save').on('click', saveBundle);
        cp.field('button-load').on('click', function () {
            cp.field('button-load').attr('disabled', true)
                .removeClass('mdl-button--accent');
            cp.field('bundle-progress').show();
            zuix.bundle(true, function () {
                cp.field('bundle-progress').hide();
            });
        });
        cp.field('button-components').on('click', function () {
            showComponents();
        });
        cp.field('fragmemnt-components').on('component:ready', function (e, ctx) {
            zuixEditor = zuix.context(this);
            // if editor is ready, register event handler
            zuixEditor.on('page:change', function (e, data) {
                if (data.page == 'editor') {
                    cp.field('editor-info').html(data.context.model().componentId);
                    cp.field('button-bundle').hide();
                    cp.field('button-log').hide();
                    editorOpen = true;
                } else {
                    cp.field('editor-info').html('');
                    cp.field('button-bundle').show();
                    cp.field('button-log').show();
                    editorOpen = false;
                }
            });
        });
        // hide the toolbox at startup
        backOrHide(false);
        // init
        initialize();
        cp.expose('saveBundle', saveBundle);
    };


    function updateLog() {

        logListView.model({
            itemList: logCache.slice(0),
            getItem: function (index, item) {
                return {
                    // unique identifier for this item
                    itemId: index,
                    // display as "bundle item"
                    componentId: 'ui/widgets/zuix_hackbox/log_item',
                    // loading options
                    options: {
                        model: item,
                        lazyLoad: true,
                        on: {
                            'item:enter': function (e, sourceView) {
                                highlightComponent(sourceView, true);
                            },
                            'item:leave': function (e, sourceView) {
                                highlightComponent(sourceView, false);
                            },
                            'item:click': function (e, sourceView) {
                                highlightComponent(sourceView, false);
                                sourceView.get()
                                    .scrollIntoView({
                                        //block: 'end',
                                        //behavior: 'smooth'
                                    });
                                highlightComponent(sourceView, true);
                            }
                        },
                        ready: function () {
                            // TODO: ...
                        }
                    }
                }
            }
        });

    }

    function highlightComponent(view, enable) {
        if (enable) {
            var p = view.position();
            if (!p.visible) return;
            var boxElement = document.createElement('div');
            zuix.$(boxElement).css({
                'left': p.x + 'px',
                'top': p.y + 'px',
                'width': view.get().offsetWidth + 'px',
                'height': view.get().offsetHeight + 'px',
                'position': 'absolute',
                'border': 'solid 4px rgba(255,0,100,0.8)',
                'padding': '2px',
                'z-index': 900,
                'background-color': 'rgba(255,255,0,0.3)'
            }).animateCss('flash', {duration: '0.25s'/*, 'iteration-count': '3'*/});
            view.get().hackBoxRef = boxElement;
            logOverlay.append(boxElement);
        } else if (view.get().hackBoxRef) {
            logOverlay.get().removeChild(view.get().hackBoxRef);
            view.get().hackBoxRef = null;
            delete view.get().hackBoxRef;
        }
    }

    function initialize() {
        zuix.monitor = function (level, args) {
            if (level == 'TRACE' ||
                args[0].toString().indexOf('load:end') == 0 ||
                args[0].toString().indexOf('componentize:check') == 0 ||
                args[0].toString().indexOf('componentize:lazyload') == 0 ||
                args[0].toString().indexOf('componentize:begin') == 0 ||
                args[0].toString().indexOf('componentize:count') == 0 ||
                args[0].toString().indexOf('componentize:end') == 0 ||
                args[0].toString().indexOf('/zuix_hackbox/') > 0) // args[0] == 'load:end' || args[0].toString().indexOf('componentize:') == 0 || args[0].toString().indexOf('/zuix_hackbox/') > 0)
                return;
            logCache.push({
                level: level,
                args: args,
                time: (new Date().toISOString().substring(11).replace('Z', ''))
            });
            if (timeout != null)
                clearTimeout(timeout);
            var updateTimeout = function () {
                cp.view('.mdl-badge')
                    .animateCss('tada', function () {
                        this.attr('data-badge', zuix.bundle().length);
                    });
                if (logBox.display() != 'none')
                    updateLog();
                else setTimeout(updateTimeout, 500);
            };
            timeout = setTimeout(updateTimeout, 500);
        };
        cp.field('bundle-progress').hide();
    }

    function showLog(animate) {
//        if (animate) logBox
//            .animateCss('fadeInLeft', { duration: '0.5s' });
        cp.field('button-bundle').removeClass('is-active');
        cp.field('button-log').addClass('is-active');
        cp.field('button-components').addClass('mdl-badge--no-background');
        zuix.context(pagedView).setPage(PAGE_LOG);
    }

    function showComponents() {
        cp.field('button-log').removeClass('is-active');
        cp.field('button-bundle').removeClass('is-active');
        cp.field('button-components').removeClass('mdl-badge--no-background');
        zuix.context(pagedView).setPage(PAGE_COMPONENTS);
        if (zuixEditor) zuixEditor.list();
    }

    function showBundle() {
//        bundleBox.show().animateCss('fadeInRight', { duration: '0.5s' });
        cp.field('button-log').removeClass('is-active');
        cp.field('button-bundle').addClass('is-active');
        cp.field('button-components').addClass('mdl-badge--no-background');
        zuix.context(pagedView).setPage(PAGE_BUNDLE);
    }

    function showToolbox() {
        cp.view().css('width', '');
        cp.view().css('height', '');
        mainToolbox.animateCss('fadeInLeftBig').show();
        fabMenu.css('z-index', '-10');
        fabMenu.animateCss('zoomOutDown', function () {
            fabMenu.css('z-index', '0').hide();
        });
        // force loading of visible lazy-elements (log items)
        setTimeout(function () {
            zuix.componentize(logListContainer);
        }, 500);
    }

    function backOrHide(animate) {
        if (editorOpen) {
            // close editor / go back to components list
            zuixEditor.list();
        } else {
            // hide toolbox
            var hide = function () {
                mainToolbox.hide();
                cp.view().css('width', '0');
                cp.view().css('height', '64px');
            };
            if (animate)
                mainToolbox.animateCss('fadeOutLeft', function () {
                    hide();
                });
            else hide();
            fabMenu.animateCss('fadeInUp').show();
        }
    }

    function saveBundle() {

        var saveAs = saveAs || function(e){"use strict";if(typeof e==="undefined"||typeof navigator!=="undefined"&&/MSIE [1-9]\./.test(navigator.userAgent)){return}var t=e.document,n=function(){return e.URL||e.webkitURL||e},r=t.createElementNS("http://www.w3.org/1999/xhtml","a"),o="download"in r,a=function(e){var t=new MouseEvent("click");e.dispatchEvent(t)},i=/constructor/i.test(e.HTMLElement)||e.safari,f=/CriOS\/[\d]+/.test(navigator.userAgent),u=function(t){(e.setImmediate||e.setTimeout)(function(){throw t},0)},s="application/octet-stream",d=1e3*40,c=function(e){var t=function(){if(typeof e==="string"){n().revokeObjectURL(e)}else{e.remove()}};setTimeout(t,d)},l=function(e,t,n){t=[].concat(t);var r=t.length;while(r--){var o=e["on"+t[r]];if(typeof o==="function"){try{o.call(e,n||e)}catch(a){u(a)}}}},p=function(e){if(/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(e.type)){return new Blob([String.fromCharCode(65279),e],{type:e.type})}return e},v=function(t,u,d){if(!d){t=p(t)}var v=this,w=t.type,m=w===s,y,h=function(){l(v,"writestart progress write writeend".split(" "))},S=function(){if((f||m&&i)&&e.FileReader){var r=new FileReader;r.onloadend=function(){var t=f?r.result:r.result.replace(/^data:[^;]*;/,"data:attachment/file;");var n=e.open(t,"_blank");if(!n)e.location.href=t;t=undefined;v.readyState=v.DONE;h()};r.readAsDataURL(t);v.readyState=v.INIT;return}if(!y){y=n().createObjectURL(t)}if(m){e.location.href=y}else{var o=e.open(y,"_blank");if(!o){e.location.href=y}}v.readyState=v.DONE;h();c(y)};v.readyState=v.INIT;if(o){y=n().createObjectURL(t);setTimeout(function(){r.href=y;r.download=u;a(r);h();c(y);v.readyState=v.DONE});return}S()},w=v.prototype,m=function(e,t,n){return new v(e,t||e.name||"download",n)};if(typeof navigator!=="undefined"&&navigator.msSaveOrOpenBlob){return function(e,t,n){t=t||e.name||"download";if(!n){e=p(e)}return navigator.msSaveOrOpenBlob(e,t)}}w.abort=function(){};w.readyState=w.INIT=0;w.WRITING=1;w.DONE=2;w.error=w.onwritestart=w.onprogress=w.onwrite=w.onabort=w.onerror=w.onwriteend=null;return m}(typeof self!=="undefined"&&self||typeof window!=="undefined"&&window||this.content);if(typeof module!=="undefined"&&module.exports){module.exports.saveAs=saveAs}else if(typeof define!=="undefined"&&define!==null&&define.amd!==null){define("FileSaver.js",function(){return saveAs})}
        var bundle = zuixEditor.serialize(zuix.bundle());
        // revert loaded status before exporting
        bundle = bundle.replace(/data-ui-loaded=\\"true\\"/g, 'data-ui-loaded=\\"false\\"');
        bundle = bundle.replace(/zuix-loaded=\\"true\\"/g, 'zuix-loaded=\\"false\\"');
        // save bundle
        var blob = new Blob(['zuix.bundle('+bundle+');'], {type: "text/plain;charset=utf-8"});
        saveAs(blob, "app.bundle.js");
        return bundle;
    }

}},{"componentId":"content\u002Fquick_start\u002Fmenu","view":"\u003Cdiv style=\"position: fixed;right:32px;bottom:16px;z-index:100; height: auto;\"\u003E\n    \u003Cdiv data-ui-options=\"get_started_menu_options\"\n         data-ui-load=\"site\u002Fcomponents\u002Factions_menu\"\n         data-ui-context=\"menu_getting_started\"\n         class=\"content-padding\"\n         layout=\"column center-right\"\u003E\n        \u003C!-- menu actions --\u003E\n        \u003C!-- Colored FAB button with ripple --\u003E\n        \u003Cdiv layout=\"column center-right\"\n             class=\"options mdl-shadow--8dp\"\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EUsage\u003C\u002Fspan\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EQuick Start Guide\u003C\u002Fspan\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EContent Management\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Edashboard\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EView Templates\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Esettings_ethernet\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n            \u003Cdiv class=\"menu-item\" layout=\"row center-spread\"\u003E\n                \u003Cspan\u003EComponent Management\u003C\u002Fspan\u003E\n                \u003Ci self=\"right\" class=\"material-icons\"\u003Eextension\u003C\u002Fi\u003E\n            \u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv class=\"menu\"\u003E\n            \u003Ca class=\"mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored mdl-shadow--6dp\"\u003E\n                \u003Ci class=\"material-icons\"\u003Etoc\u003C\u002Fi\u003E\n            \u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\n    var get_started_menu_options = {\n        css: false,\n        html: false,\n        on: {\n            'view:create': function () {\n                this.hide();\n            },\n            'item:click': function (e, i) {\n                var p = pagedView.getPage(1);\n                switch (parseInt(i)) {\n                    case 0:\n                        scrollTo(p.get(), p.position().y \u002F*p.find('a[id=Getting_Started').position().y*\u002F);\n                        break;\n                    case 1:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--Quick_Start').position().y);\n                        break;\n                    case 2:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--Content_Management').position().y);\n                        break;\n                    case 3:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--View_Templates').position().y);\n                        break;\n                    case 4:\n                        scrollTo(p.get(), p.find('a[id=Getting_Started--Component_Management').position().y);\n                        break;\n                }\n                e.preventDefault();\n            }\n        }\n    };\n\n\n    \u002F\u002F TODO: move this to ZxQuery\n    function scrollTo(el, targetY) {\n        if (targetY === 0 || targetY == null)\n            return;\n        var duration = 500;\n        var scrollTop = el.scrollTop+targetY - 56;\n        var scrollOffset = el.scrollTop-scrollTop;\n        el.firstElementChild.style.transition = 'transform '+duration+'ms ease';\n        if (typeof el.firstElementChild.style.WebkitTransform !== 'undefined')\n            el.firstElementChild.style.WebkitTransform = \"translate(0, \" + (scrollOffset) + \"px)\";\n        else if (typeof el.firstElementChild.style.MozTransform !== 'undefined')\n            el.firstElementChild.style.MozTransform= \"translate(0, \" + (scrollOffset) + \"px)\";\n        else\n            el.firstElementChild.style.transform = \"translate(0, \" + (scrollOffset) + \"px)\";\n        window.setTimeout(function () {\n            \u002F\u002F TODO: should backup and restore old value\n            if (typeof el.firstElementChild.style.WebkitTransform !== 'undefined')\n                el.firstElementChild.style.WebkitTransform = \"\";\n            else if (typeof el.firstElementChild.style.MozTransform !== 'undefined')\n                el.firstElementChild.style.MozTransform= \"\";\n            else\n                el.firstElementChild.style.transform = \"\";\n            el.firstElementChild.style.transition = '';\n            el.scrollTop = scrollTop;\n        }, duration);\n\n    }\n\u003C\u002Fscript\u003E","css":".options .menu-item {\n    padding: 16px;\n    height: 48px;\n    cursor: pointer;\n    vertical-align: middle;\n}\ndiv.options {\n    margin-bottom: 16px;\n    margin-right: -12px;\n    margin-left: 32px;\n    padding: 16px;\n    color:white;\n    background-color: rgba(60, 60, 60, 0.9);\n    font-weight: 400;\n    -webkit-border-radius: 20px;\n    -moz-border-radius: 20px;\n    border-radius: 20px;\n}\n.options .menu-item i {\n    color: white;\n}\n.menu {\n    max-width: 56px;\n}","controller":function (){}},{"componentId":"content\u002Fhome","view":"\u003Cdiv data-ui-include=\"content\u002Fhome\u002Fcover\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fhome\u002Flinks\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fhome\u002Ffeatures\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Ffooter\"\n     data-ui-options=\"main.options.content_no_md\"\u003E\u003C\u002Fdiv\u003E","css":"div {\n    font-size: 102%;\n}\np {\n    margin-bottom: 12px;\n    line-height: 140%;\n    font-weight: 200;\n}\n\n.material-icons {\n    margin-left: 8px;\n    margin-right: 8px;\n    font-size: 110%;\n    vertical-align: middle;\n}\n\ncite {\n    font-size: 60%;\n    text-wrap: avoid;\n    white-space: nowrap;\n}\n.intro {\n    margin-top: 24px;\n}\n.mdl-mini-footer, .mdl-logo {\n    background-color: rgb(255,235,59);\n    color: dimgrey;\n}\n.mdl-mini-footer a {\n    color: #545454;\n    text-decoration: none;\n}\n","controller":function (){}},{"componentId":"content\u002Fget_started","view":"### Usage\n\n\u003Ca id=\"Getting_Started\"\u003E\u003C\u002Fa\u003E\n###### Download\n\nGet **ZUIX** minified Javascript file and include it in the `head` section of the page.\n\n\u003Cpre\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003Cscript src=\"js\u002Fzuix.min.js\"\u003E\u003C\u002Fscript\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Cdiv align=\"center\"\u003E\n    \u003Ca class=\"mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent\"\n       href=\"https:\u002F\u002Fgenielabs.github.io\u002Fzuix\u002Fjs\u002Fzuix.min.js\"\u003E\n        Download \u003Cstrong\u003EZUIX v0.4.9-2\u003C\u002Fstrong\u003E\n    \u003C\u002Fa\u003E\n\u003C\u002Fdiv\u003E\n\u003Cdiv align=\"center\"\u003E\u003Csmall\u003E\u003Cem\u003E8,8 kB (gzipped)\u003C\u002Fem\u003E\u003C\u002Fsmall\u003E\u003C\u002Fdiv\u003E\n\n###### Hosted\n\nLink the script as an external resource by adding the following line in the ```head``` section of the page:\n\n\u003Cpre\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003Cscript src=\"https:\u002F\u002Fgenielabs.github.io\u002Fzuix\u002Fjs\u002Fzuix.min.js\"\u003E\u003C\u002Fscript\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n###### Build\n\nBuild source and create minified version in ```.\u002Fbuild\u002Fjs``` folder:\n\n    gulp browserify ; gulp compile ; gulp dox ; gulp dist\n\n###### NPM\n\nInstall development package\n\n    npm install zuix --save\n\nStart local web server\n\n    npm start\n\n###### Bower\n\n    bower install zuix --save\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\n\u003Ca id=\"Getting_Started--Quick_Start\"\u003E\u003C\u002Fa\u003E\n### Quick Start Guide\n\nThis guide is organized in three sections with different\ndifficulty grades:\n\n- \u003Ci class=\"material-icons mdl-color-text--grey-500\"\u003Econtent_copy\u003C\u002Fi\u003E **Content Management** \u003Csmall\u003E(beginner)\u003C\u002Fsmall\u003E\n- \u003Ci class=\"material-icons mdl-color-text--grey-500\"\u003Eview_column\u003C\u002Fi\u003E **View Templates** and Data Binding \u003Csmall\u003E(intermediate-)\u003C\u002Fsmall\u003E\n- \u003Ci class=\"material-icons mdl-color-text--grey-500\"\u003Edashboard\u003C\u002Fi\u003E **Component Management** \u003Csmall\u003E(intermediate+)\u003C\u002Fsmall\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fquick_start\u002Fcontent_management\"\n     data-ui-lazyload=\"false\"\n     data-ui-options=\"main.options.content_no_css\"\n     class=\"progressive-content-container\" \u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n    \u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n    \u003Cp\u003E\u003Csmall\u003ELoading \u003Cem\u003E'Content Management'\u003C\u002Fem\u003E...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Csmall\u003E**ZUIX** Quick Start Guide. &copy; Generoso Martello 2016-2017.\u003C\u002Fsmall\u003E\n","css":"h3 {\n    margin-top: 56px;\n    margin-bottom: 32px;\n}\nh4 {\n    margin-top: 56px;\n    margin-bottom: 32px;\n}\nh5 {\n    margin-top: 56px;\n    margin-bottom: 32px;\n}\nh6 {\n    margin-top: 32px;\n    margin-bottom: 32px;\n}\n","controller":function (){}},{"componentId":"content\u002Fapi","view":"\u003Ca id=\"ZUIX_API\"\u003E\u003C\u002Fa\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fzuix\"\n     data-ui-options=\"main.options.content_no_css\"\n     data-ui-lazyload=\"false\"\n     \u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fcomponent_context\"\n     data-ui-options=\"main.options.content_no_css\"\n     data-ui-lazyload=\"false\"\n     \u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fcontext_controller\"\n     data-ui-options=\"main.options.content_no_css\"\n     data-ui-lazyload=\"false\"\n     \u003E\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fapi\u002Fzxquery\"\n     data-ui-options=\"main.options.content_no_css\"\n     data-ui-lazyload=\"false\"\n     \u003E\u003C\u002Fdiv\u003E\n\n\u003Cscript\u003E\nvar api_loader_options = {\n    html: false,\n    markdown: true,\n    prism: true\n};\n\u003C\u002Fscript\u003E\n","css":"h3 {\n    font-weight:200;\n    margin-top: 48px;\n}\nh3 code {\n    font-weight:400;\n    font-size: 80%;\n}\n","controller":function (){}},{"componentId":"ui\u002Flayout\u002Fpaged_view","controller":function (cp) {

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.expose('setPage', setPage);
        cp.expose('getPage', getPage);
        cp.expose('getCurrent', getCurrent);
        cp.view().children().each(function (i, el) {
            if (cp.view().attr('data-ui-relative') != 'true') {
                el.style['position'] = 'absolute';
                el.style['top'] = '0';
                el.style['left'] = '0';
                el.style['bottom'] = '0';
                el.style['right'] = '0';
                el.style['overflow'] = 'auto';
                el.style['overflow-x'] = 'hidden';
            }
            this.hide();
        });
        setPage(0);
    };

    cp.destroy = function () {
        cp.view().children().each(function () {
            // TODO: should restore original container styles
        });
        currentPage = -1;
    };

    // Private Members

    var currentPage = -1;

    function getPage(p) {
        var pages = cp.view().children();
        return pages.eq(p);
    }

    function getCurrent() {
        return currentPage;
    }

    function setPage(p, anchor) {
        var pages = cp.view().children();
        var oldPage = currentPage;
        if (p != currentPage) {
            currentPage = p;
            pages.eq(p).show();
            zuix.componentize();
            if (oldPage != -1) {
                pages.eq(oldPage).hide();
                cp.trigger('page:change', {
                    old: oldPage,
                    page: currentPage
                });
            }
        }
        if (!isNaN(anchor))
            pages.get(p).scrollTop = anchor;
        else if (anchor != null)
            pages.get(p).scrollTop = pages.eq(p)
                .find('a[id='+anchor+']')
                .position().y;
    }

}},{"componentId":"site\u002Fcomponents\u002Factions_menu","controller":function (cp) {
    var toolbar, fab, actions;
    var open = false; // initial state

    cp.create = function () {

        cp.expose('showMenu', showMenu);
        cp.expose('hideMenu', hideMenu);

        // toolbar view
        toolbar = cp.view();
        toolbar.css('overflow', 'hidden');
        // fab button
        // fab button
        fab = toolbar.find('.menu');
        fab.on('click', function () {
            toolbarToggle();
        });
        // actions buttons
        actions = toolbar.find('.options')
            .css('overflow', 'hidden')
            .hide()
            .children();
        actions.each(function (index, item) {
            this.on('click', function () {
                toolbarToggle();
                cp.trigger('item:click', index);
            });
        });

    };

    cp.destroy = function () {

        actions.each(function (i, item) {
            this.off('click');
        });

    };

    // Private Members

    function showMenu() {
        cp.view().show().animateCss('flipInY', { delay: '0.5s' });
    }
    function hideMenu() {
        if (open) toolbarToggle();
        fab.animateCss('flipOutY', function () {
            if (!cp.view().hasClass('animated'))
                cp.view().hide()
        });
    }

    function toolbarToggle() {
        var duration = 0.5;
        open = !open;
        if (open)
            toolbar.find('.options').show().animateCss('bounceInUp', { duration: duration+'s' }, function () {
                open = true;
            });
        else
            toolbar.find('.options').animateCss('bounceOutDown', { duration: duration+'s' }, function () {
                toolbar.find('.options').hide();
                open = false;
            });
        fab.animateCss('rubberBand', { duration: duration+'s' });
    }

}},{"componentId":"ui\u002Fwidgets\u002Fzuix_editor","view":"\n\u003Cdiv data-ui-field=\"fragment-list\"\u003E\n\n    \u003Cdiv data-ui-field=\"component-list\"\n         data-ui-lazyload=\"false\"\n         data-ui-load=\"ui\u002Flayout\u002Flist_view\"\u003E\n\n        loading...\n\n    \u003C\u002Fdiv\u003E\n\n    \u003Cdiv layout=\"row center-justify\" class=\"summary\"\u003E\n        \u003Cdiv self=\"left\"\u003E\n            \u003Csmall\u003Eloaded \u003Cspan data-ui-field=\"total-components\"\u003E--\u003C\u002Fspan\u003E components\u003C\u002Fsmall\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv self=\"right\"\u003E\n            \u003Csmall\u003Etotal instances \u003Cspan data-ui-field=\"total-instances\"\u003E--\u003C\u002Fspan\u003E\u003C\u002Fsmall\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cdiv data-ui-field=\"fragment-editor\" class=\"editor-box mdl-color-text--lime-400\"\n     layout=\"row stretch-stretch\"\u003E\n\n    \u003Cdiv class=\"mdl-tabs mdl-js-tabs mdl-js-ripple-effect mdl-color--white\" layout=\"column top-stretch\"\u003E\n        \u003Cdiv class=\"mdl-tabs__tab-bar\"\u003E\n            \u003Ca href=\"#hackbox-editor-js\" class=\"mdl-tabs__tab is-active\"\u003EJavaScript\u003C\u002Fa\u003E\n            \u003Ca href=\"#hackbox-editor-html\" class=\"mdl-tabs__tab\"\u003EHTML\u003C\u002Fa\u003E\n            \u003Ca href=\"#hackbox-editor-css\" class=\"mdl-tabs__tab\"\u003ECSS\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n        \u003Cpre id=\"hackbox-editor-js\"\n             self=\"size-x1\"\n             class=\"mdl-tabs__panel scrollable-relative is-active\"\u003E\u003Ccode data-ui-field=\"js\" class=\"language-javascript\"\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n        \u003Cpre id=\"hackbox-editor-html\"\n             self=\"size-x1\"\n             class=\"mdl-tabs__panel scrollable-relative\"\u003E\u003Ccode data-ui-field=\"html\" class=\"language-html\"\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n        \u003Cpre id=\"hackbox-editor-css\"\n             self=\"size-x1\"\n             class=\"mdl-tabs__panel scrollable-relative\"\u003E\u003Ccode data-ui-field=\"css\" class=\"language-css\"\u003E\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n","css":".editor-box {\n    overflow-y: auto;\n    max-height: 100%;\n    position: relative;\n    padding: 2px;\n    z-index: 10;\n}\n.editor-box .mdl-tabs {\n    position: absolute;top: 0;bottom: 0;left: 0;right: 0;\n}\n.scrollable-relative {\n    border: 1px solid;\n    margin: 2px;\n}\n.summary {\n    display: none;\n    margin-bottom: 48px;\n    padding: 16px;\n    background-color: rgba(0,255,0,0.1);\n}\n.summary span {\n    font-weight: 700;\n}\n","controller":function (cp) {
    /** @type {ComponentContext} */
    var componentListView = null;
    /** @type {ZxQuery} */
    var editorFragment = null,
        componentListFragment = null;

    cp.create = function () {
        editorFragment = cp.field('fragment-editor');
        componentListFragment = cp.field('fragment-list');
        cp.field('component-list').on('component:ready', function () {
            componentListView = zuix.context(this);
        });
        cp.expose({
            list: showComponents,
            serialize: serialize
        });
    };

    // private members

    function showComponents() {
        componentListFragment.show();
        editorFragment.hide();

        var instancesCount = 0;
        var bundle = zuix.bundle().slice(0);
        bundle.sort(function (a, b) {
            return (a.componentId.toString() < b.componentId.toString())
                ? -1 : (a.componentId.toString() > b.componentId.toString())
                    ? 1 : 0;
        });

        componentListView.model({
            itemList: bundle,
            getItem: function (index, item) {
                return {
                    // unique identifier for this item
                    itemId: item.componentId,
                    // display as "bundle item"
                    componentId: 'ui/widgets/zuix_hackbox/bundle_item',
                    // loading options
                    options: {
                        model: item,
                        lazyLoad: true,
                        on: {
                            'item:click': openEditor,
                            'item:update': function () {
                                var ctx = zuix.context(this);
                                // do not count if is zuix-hackbox
                                if (!ctx.isHackBox()) {
                                    instancesCount += ctx.instanceCount();
                                }
                                if (index == bundle.length - 1) {
                                    cp.field('total-components').html(zuix.bundle().length);
                                    cp.field('total-instances').html(instancesCount);
                                }
                            }
                        },
                        ready: function () {
                        }
                    }
                }
            }
        });

        cp.trigger('page:change', {
            page: 'list'
        });
    }


    function openEditor(e, item) {
        // get the item component context
        var ctx = zuix.context(this);
        var tabs = cp.view('.mdl-tabs__tab,.mdl-tabs__panel')
            .hide();
        if (ctx.hasResource('css')) {
            tabs.removeClass('is-active')
                .eq(2, 5).show().addClass('is-active');
            cp.field('css').html(item.css);
            Prism.highlightElement(cp.field('css').get());
        }
        if (ctx.hasResource('html')) {
            tabs.removeClass('is-active')
                .eq(1, 4).show().addClass('is-active');
            var html = item.view
                .replace(/\</g, "&lt;")
                .replace(/\>/g, "&gt;")
                .replace(/ zuix-loaded="true"/g, '');
            cp.field('html').html(html);
            Prism.highlightElement(cp.field('html').get());
        }
        if (ctx.hasResource('js')) {
            tabs.removeClass('is-active')
                .eq(0, 3).show().addClass('is-active');
            cp.field('js').html(serialize(item.controller));
            Prism.highlightElement(cp.field('js').get());
        }

        componentListFragment.hide();
        editorFragment.show();

        cp.trigger('page:change', {
            page: 'editor',
            context: ctx
        });
    }

    function closeEditor() {
        componentListFragment.show();
        editorFragment.hide();

        cp.trigger('page:change', {
            page: 'list'
        });
    }


    // component item serialization

    var isRegExp = function (re) {
        return Object.prototype.toString.call(re) === '[object RegExp]';
    };

    // FileSaver polyfill:
    //      https://github.com/eligrey/FileSaver.js/blob/master/FileSaver.min.js
    // Generate an internal UID to make the regexp pattern harder to guess.

    var UID                 = Math.floor(Math.random() * 0x10000000000).toString(16);
    var PLACE_HOLDER_REGEXP = new RegExp('"@__(F|R)-' + UID + '-(\\d+)__@"', 'g');

    var IS_NATIVE_CODE_REGEXP = /\{\s*\[native code\]\s*\}/g;
    var UNSAFE_CHARS_REGEXP   = /[<>\/\u2028\u2029]/g;

    // Mapping of unsafe HTML and invalid JavaScript line terminator chars to their
    // Unicode char counterparts which are safe to use in JavaScript strings.
    var ESCAPED_CHARS = {
        '<'     : '\\u003C',
        '>'     : '\\u003E',
        '/'     : '\\u002F',
        '\u2028': '\\u2028',
        '\u2029': '\\u2029'
    };

    function escapeUnsafeChars(unsafeChar) {
        return ESCAPED_CHARS[unsafeChar];
    }

    var serialize = function(obj, options) {
        options || (options = {});

        // Backwards-compatability for `space` as the second argument.
        if (typeof options === 'number' || typeof options === 'string') {
            options = {space: options};
        }

        var functions = [];
        var regexps = [];

        // Returns placeholders for functions and regexps (identified by index)
        // which are later replaced by their string representation.
        function replacer(key, value) {
            if (!value) {
                return value;
            }

            var type = typeof value;

            if (type === 'object') {
                if (isRegExp(value)) {
                    return '@__R-' + UID + '-' + (regexps.push(value) - 1) + '__@';
                }

                return value;
            }

            if (type === 'function') {
                return '@__F-' + UID + '-' + (functions.push(value) - 1) + '__@';
            }

            return value;
        }

        var str;

        // Creates a JSON string representation of the value.
        // NOTE: Node 0.12 goes into slow mode with extra JSON.stringify() args.
        if (options.isJSON && !options.space) {
            str = JSON.stringify(obj);
        } else {
            str = JSON.stringify(obj, options.isJSON ? null : replacer, options.space);
        }

        // Protects against `JSON.stringify()` returning `undefined`, by serializing
        // to the literal string: "undefined".
        if (typeof str !== 'string') {
            return String(str);
        }

        // Replace unsafe HTML and invalid JavaScript line terminator chars with
        // their safe Unicode char counterpart. This _must_ happen before the
        // regexps and functions are serialized and added back to the string.
        str = str.replace(UNSAFE_CHARS_REGEXP, escapeUnsafeChars);

        if (functions.length === 0 && regexps.length === 0) {
            return str;
        }

        // Replaces all occurrences of function and regexp placeholders in the JSON
        // string with their string representations. If the original value can not
        // be found, then `undefined` is used.
        return str.replace(PLACE_HOLDER_REGEXP, function (match, type, valueIndex) {
            if (type === 'R') {
                return regexps[valueIndex].toString();
            }

            var fn = functions[valueIndex];
            var serializedFn = fn.toString();

            if (IS_NATIVE_CODE_REGEXP.test(serializedFn)) {
                throw new TypeError('Serializing native function: ' + fn.name);
            }

            return serializedFn;
        });
    };

}},{"componentId":"ui\u002Flayout\u002Flist_view","controller":function (cp) {

    var listItems = {};

    cp.init = function () {
        cp.options().html = false;
        cp.options().css = false;
    };

    cp.create = function () {
        cp.view().html('');
        cp.update();
    };

    cp.destroy = function () {

    };

    cp.update = function() {

        var modelList = cp.model().itemList;
        if (modelList == null) return;

        for (var i = 0; i < modelList.length; i++) {
            var dataItem = cp.model().getItem(i, modelList[i]);
            var id = dataItem.itemId;
            var item = listItems[id];
            if (typeof item === 'undefined') {
                listItems[id] = zuix.createComponent(dataItem.componentId, dataItem.options);
                var container = listItems[id].container();
                // set a temporary height for the container (for lazy load to work property)
                container.style['min-height'] = '24px';
                var attach = function (i, container) {
                    setTimeout(function () {
                        cp.view().insert(i, container);
                    }, i*5);
                }(i, container);
            } else {
                // update item model's data
                item.model(dataItem.options.model);
            }
        }
        setTimeout(function () {
            zuix.componentize(cp.view());
        }, modelList.length*5);

    }

}},{"componentId":"content\u002Fhome\u002Fcover","view":"\u003Cdiv layout=\"column center-center\" class=\"opaqueBlocK mdl-shadow--8dp animated bounceInDown\"\u003E\n\n    \u003Cdiv self=\"size-medium top-center\"\u003E\n\n        \u003Cdiv align=\"center\"\u003E\n            \u003Ch3 layout=\"row center-center\" class=\"logo animated zoomIn\"\u003E\n                \u003Cspan\u003EZ\u003C\u002Fspan\u003E\u003Cstrong class=\"animated bounceInDown\"\u003EUI\u003C\u002Fstrong\u003E\u003Cspan\u003EX\u003C\u002Fspan\u003E\n            \u003C\u002Fh3\u003E\n            \u003Cdiv class=\"animated rubberBand\"\u003E\n                \u003Csmall class=\"mdl-color-text--grey\"\u003E\u003Ccite\u003Ethe easy shift to component-based development\u003C\u002Fcite\u003E\u003C\u002Fsmall\u003E\n            \u003C\u002Fdiv\u003E\n        \u003C\u002Fdiv\u003E\n\n        \u003Cdiv class=\"intro animated fadeIn\"\u003E\n            \u003Cp\u003E\n                \u003Cspan class=\"logo-text\"\u003Ezuix\u003C\u002Fspan\u003E\u003Cstrong\u003E.js\u003C\u002Fstrong\u003E is a JavaScript library\n                for creating component-based web sites and applications.\n            \u003C\u002Fp\u003E\n            \u003Cp\u003E\n                Component-based development helps keeping application files smaller,\n                better organized and easier to mantain.\n            \u003C\u002Fp\u003E\n            \u003Cp\u003E\n                It allows reusing which improves UI consistency and also grants\n                a better user experience.\n            \u003C\u002Fp\u003E\n        \u003C\u002Fdiv\u003E\n\n    \u003C\u002Fdiv\u003E\n\n    \u003Cdiv layout=\"rows center-center\"\n         data-ui-options=\"main.options.sharing_buttons_options\"\n         data-ui-include=\"content\u002Fhome\u002Fsharing\"\u003E\n        \u003Ca data-ui-field=\"url\" href=\"http:\u002F\u002Fzuix.it\"\u003EZUIX Home\u003C\u002Fa\u003E\n        \u003Cp data-ui-field=\"description\"\u003EJavaScript UI content and component manager for creating sites and web apps.\u003C\u002Fp\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cscript\u003E\n        main.options.sharing_buttons_options = {\n            ready: function () {\n                var html = this.view().innerHTML,\n                    outHtml = '',\n                    matched = 0, currentIndex = 0;\n                var tags = new RegExp(\u002F[^{}]+(?=})\u002Fg);\n                while (result = tags.exec(html)) {\n                    var value = '{'+result[0]+'}';\n                    switch (result[0]) {\n                        case 'url':\n                            matched++;\n                            value = encodeURIComponent(this.model()[result[0]].href);\n                            break;\n                        case 'description':\n                            matched++;\n                            value = encodeURIComponent(this.model()[result[0]].innerHTML);\n                            break;\n                    }\n                    outHtml += html.substr(currentIndex, result.index-currentIndex-1)+value;\n                    currentIndex = result.index+result[0].length+1;\n                }\n                if (matched \u003E 0) {\n                    outHtml += html.substr(currentIndex);\n                    this.view(outHtml);\n                }\n            }\n        };\n    \u003C\u002Fscript\u003E\n\n\u003C\u002Fdiv\u003E\n","css":".opaqueBlocK {\n    overflow: hidden;\n    background-color: rgba(16, 16, 53, 0.9);\n    color:white;\n    padding: 24px;\n    font-size: 110%;\n}\n.logo {\n    margin:0;\n    padding:0;\n    color:yellow;\n    font-size: 200%;\n}\n.logo .material-icons {\n    font-size: 90%;\n}\n.logo span {\n    font-size: 90%;\n}\n.logo-text {\n    color:yellow;\n}\np {\n    font-size: 100%;\n}\nh3 {\n    font-weight: 400;\n}\n.content-padding {\n  padding-top: 0;\n}","controller":function (){}},{"componentId":"content\u002Fhome\u002Flinks","view":"\n\u003Cdiv layout=\"column center-center\" class=\"opaqueBlocK mdl-shadow--8dp\"\u003E\n\n\n    \u003Cdiv self=\"size-large\" layout=\"rows center-spread\"\u003E\n\n        \u003Cdiv class=\"animated rubberBand\"\u003E\n            \u003Ca class=\"animated pulse mdl-button mdl-js-button mdl-js-ripple-effect\" layout=\"row center-center\"\n               href=\"javascript:pagedView.setPage(1);\"\u003E\n                \u003Ci class=\"material-icons mdl-color-text--grey-700\"\u003Eschool\u003C\u002Fi\u003E\n                \u003Cspan class=\"mdl-color-text--grey-700\"\u003EUsage\u003C\u002Fspan\u003E\n            \u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n\n        \u003Cdiv class=\"animated rubberBand\"\u003E\n            \u003Ca class=\"animated pulse mdl-button mdl-js-button mdl-js-ripple-effect\" layout=\"row center-center\"\n               href=\"javascript:pagedView.setPage(2);\"\u003E\n                \u003Ci class=\"material-icons mdl-color-text--grey-700\"\u003Eimport_contacts\u003C\u002Fi\u003E\n                \u003Cspan class=\"mdl-color-text--grey-700\"\u003EAPI\u003C\u002Fspan\u003E\n            \u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n\n        \u003Cdiv class=\"animated rubberBand\"\u003E\n            \u003Ca class=\"animated pulse mdl-button mdl-js-button mdl-js-ripple-effect\" layout=\"row center-center\"\n               href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\"\u003E\n                \u003Ci class=\"material-icons mdl-color-text--grey-700\"\u003Ereorder\u003C\u002Fi\u003E\n                \u003Cspan class=\"mdl-color-text--grey-700\"\u003ESource\u003C\u002Fspan\u003E\n            \u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n\n    \u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E","css":".opaqueBlocK {\n    background: white;\n    color: gray;\n    font-size: 160%;\n    margin-top: 16px;\n}\n.opaqueBlocK .animated {\n    -webkit-animation-delay: 0.28s;\n    -moz-animation-delay: 0.28s;\n    -o-animation-delay: 0.28s;\n    -ms-animation-delay: 0.28s;\n}\n.opaqueBlocK div {\n    padding: 2px;\n}\n.opaqueBlocK a {\n    color:black;\n    text-decoration: none;\n    font-size: 80%;\n    padding: 32px;\n}","controller":function (){}},{"componentId":"content\u002Fhome\u002Ffeatures","view":"\u003Cdiv layout=\"column center-center\" class=\"opaqueBlocK animated bounceInUp mdl-shadow--8dp\"\u003E\n    \u003Cdiv self=\"size-xlarge center-center\" layout=\"rows top-justify\"\u003E\n        \u003Cdiv self=\"size-1of2 -sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Edashboard\u003C\u002Fi\u003E\n                    Content Manager\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cp\u003E\n                        Simplifies site structuring\n                        and management, with \u003Cstrong\u003Econtent\n                        inclusion\u003C\u002Fstrong\u003E feature, content and style\n                        files can be split and conveniently arranged.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Optimizes speed with \u003Cstrong\u003Elazy-loading\u003C\u002Fstrong\u003E feature,\n                        content will be loaded only when it actually\n                        comes into the user's screen view.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Can load content from different sites\n                        with just one HTML tag,\n                        making of \u003Cstrong\u003Ereusability\u003C\u002Fstrong\u003E a native feature.\n                    \u003C\u002Fp\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv self=\"size-1of2 -sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Esettings_ethernet\u003C\u002Fi\u003E\n                    Template Engine\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cp\u003E\n                        Turns any HTML snippet into a template.\n                        Template \u003Cstrong\u003Epreview is immediate\u003C\u002Fstrong\u003E and\n                        truly matching, NO custom tags\n                        or \u003Cem\u003Emustaches\u003C\u002Fem\u003E needed.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Maps data model's fields to view elements either automatically or\n                        by using custom \u003Cstrong\u003Ebinding-adapters\u003C\u002Fstrong\u003E, with\n                        full control over model-view transformation process.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Prevents style attributes redundancy hell with\n                        \u003Cstrong\u003EScoped CSS\u003C\u002Fstrong\u003E files.\n                    \u003C\u002Fp\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv self=\"size-xlarge center-center\" layout=\"rows top-justify\"\u003E\n        \u003Cdiv self=\"size-x1 sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Eextension\u003C\u002Fi\u003E\n                    Component Manager\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cp\u003E\n                        Empowers the implementation of\n                        \u003Cstrong\u003Eagnostic component logic\u003C\u002Fstrong\u003E\n                        for creating components that can stick to any\n                        UI-framework and easily upgrade at any time.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Enables running of multiple components\n                        on the same UI view with \u003Cstrong\u003Ecomponents\n                        overlapping\u003C\u002Fstrong\u003E feature.\n                    \u003C\u002Fp\u003E\n                    \u003Cp\u003E\n                        Introduces a new way of app theming with\n                        instant \u003Cstrong\u003Eview switching\u003C\u002Fstrong\u003E, that allow\n                        replacing of the component's view template\n                        at any time.\n                    \u003C\u002Fp\u003E\n                \u003C\u002Fdiv\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n        \u003Cdiv self=\"size-x1 sm-full\"\u003E\n\n            \u003Cdiv data-ui-include=\"ui\u002Ftemplates\u002Fmdl_card\"\u003E\n                \u003Ch3 data-ui-field=\"title\"\u003E\n                    \u003Ci class=\"material-icons\"\u003Eplaylist_add_check\u003C\u002Fi\u003E\n                    Other features\n                \u003C\u002Fh3\u003E\n                \u003Cdiv data-ui-field=\"text\"\u003E\n                    \u003Cstrong\u003EZUIX\u003C\u002Fstrong\u003E is a lightweight library,\n                    though still giving a full feature set.\n                    \u003Cul\u003E\n                        \u003Cli\u003EEvents, Behaviors and Hooks\u003C\u002Fli\u003E\n                        \u003Cli\u003EComponents and fields caching\u003C\u002Fli\u003E\n                        \u003Cli\u003EAutomatic events unbinding\u003C\u002Fli\u003E\n                        \u003Cli\u003EIntegrated resources loader\u003C\u002Fli\u003E\n                        \u003Cli\u003EIntegrated jQuery-like DOM helper\u003C\u002Fli\u003E\n                        \u003Cli\u003ELocalization \u003Csmall\u003E(WIP v0.5.0)\u003C\u002Fsmall\u003E\u003C\u002Fli\u003E\n                    \u003C\u002Ful\u003E\n                \u003C\u002Fdiv\u003E\n                \u003Ca data-ui-field=\"link\"\u003E\u003C\u002Fa\u003E\n            \u003C\u002Fdiv\u003E\n\n        \u003C\u002Fdiv\u003E\n\n\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n","css":".opaqueBlocK {\n    background-color: rgba(27, 106, 185, 0.9);\n    font-size: 90%;\n    margin-top: 16px;\n    margin-bottom: 16px;\n    overflow: hidden;\n}\np {\n    margin-bottom: 28px;\n    font-weight: 400;\n}\nul li {\n    list-style: disc;\n}\n.mdl-card {\n    padding: 16px;\n}\n.mdl-card__title {\n    color:yellow;\n    padding: 0;\n    text-wrap: avoid;\n    white-space: nowrap;\n    vertical-align: middle;\n    margin-bottom: 24px;\n}\n.mdl-card__title .material-icons {\n    color: white;\n}\n.mdl-card__title-text {\n    width: 100%;\n    font-weight: bold;\n    font-size: 140%;\n}\n.mdl-card__supporting-text {\n    font-family: 'Dosis', sans-serif;\n    color:white;\n    padding: 0;\n    padding-left: 48px;\n    padding-right: 32px;\n    font-weight: 400;\n    width: 100%;\n    font-size: 100%;\n    line-height: 180%;\n}\n","controller":function (){}},{"componentId":"content\u002Ffooter","view":"\u003Cfooter class=\"mdl-mini-footer mdl-color--yellow-400\"\u003E\n    \u003Cdiv self=\"top-left\" class=\"mdl-mini-footer__left-section\"\u003E\n        \u003Cspan\u003EZ\u003C\u002Fspan\u003E\u003Cstrong\u003EUI\u003C\u002Fstrong\u003E\u003Cspan\u003EX\u003C\u002Fspan\u003E\n        \u003Cspan\u003E\n            &copy;\n            \u003Ca href=\"http:\u002F\u002Fglabs.it\"\u003EG-Labs\u003C\u002Fa\u003E\n            2016-2017\n        \u003C\u002Fspan\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv self=\"size-x1 bottom\" layout=\"row top-right\" class=\"mdl-mini-footer__right-section\"\u003E\n        \u003Cul layout=\"rows top-right\" class=\"mdl-mini-footer__link-list\"\u003E\n            \u003Cli\u003E\n                \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\u002F\"\u003E\n                    Contribute\n                    \u003Ci class=\"material-icons mdl-color-text--blue-200\"\u003Elink\u003C\u002Fi\u003E\n                \u003C\u002Fa\u003E\n            \u003C\u002Fli\u003E\n            \u003Cli\u003E\n                \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\u002Fissues\u002Fnew?labels=enhancement\"\u003E\n                    Feature Request\n                    \u003Ci class=\"material-icons mdl-color-text--green-200\"\u003Eadd_circle_outline\u003C\u002Fi\u003E\n                \u003C\u002Fa\u003E\n            \u003C\u002Fli\u003E\n            \u003Cli\u003E\n                \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\u002Fissues\u002Fnew?labels=bug\"\u003E\n                    Bug Report\n                    \u003Ci class=\"material-icons mdl-color-text--red-200\"\u003Ebug_report\u003C\u002Fi\u003E\n                \u003C\u002Fa\u003E\n            \u003C\u002Fli\u003E\n        \u003C\u002Ful\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Ffooter\u003E","css":".mdl-mini-footer__right-section {\n    padding: 8px 8px 16px;\n    font-size: 80%;\n}\n.mdl-mini-footer__left-section {\n    padding: 8px 8px 16px;\n    font-size:80%;\n}\n.mdl-mini-footer {\n    padding-bottom: 16px;\n}","controller":function (){}},{"componentId":"content\u002Fquick_start\u002Fcontent_management","controller":function (){},"view":"\u003Ca id=\"Getting_Started--Content_Management\"\u003E\u003C\u002Fa\u003E\n#### Content Management \u003Ci class=\"material-icons mdl-color-text--grey-500\"\u003Edashboard\u003C\u002Fi\u003E\n\nWith *Content Management* we are referring here to the capability of\ndynamically loading into a page some content that is placed in\nother files.\n\nWith such feature, it is possible to structure a web site or application into modules\nthat can be conveniently organized in the directory tree.\n\nFor example, the following page template\n\n\u003Cdiv style=\"margin: 24px\"\u003E\n\u003Cdiv self=\"size-1of2 center\" layout=\"column center-center\" style=\"height: 320px\"\u003E\n\u003Cdiv self=\"size-x1\" layout=\"column center-center\" class=\"mdl-color--blue-100\"\u003Eheader\u003C\u002Fdiv\u003E\n\u003Cdiv self=\"size-x3\" layout=\"column center-center\" class=\"mdl-color--teal-50\"\u003Emain content\u003C\u002Fdiv\u003E\n\u003Cdiv self=\"size-x1\" layout=\"column center-center\" class=\"mdl-color--blue-100\"\u003Efooter\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\ncould be implemented with the following files:\n\n- site\u002Flayout\u002Fheader.html\n- site\u002Fcontent\u002Fmain.html\n- site\u002Flayout\u002Ffooter.html\n- **index.html**\n\nwhere the ```index.html``` is the main page that will include the other files.\n\n\u003Ca id=\"Getting_Started--Content_Loading\"\u003E\u003C\u002Fa\u003E\n##### Loading content\n\nTo include a content, we just add a ```div``` (or any other tag supposed to be a container element)\nwith the attribute ```data-ui-include``` with its value set to the path of the content that\nyou want to be loaded.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE PAGE - \u003C\u002Fstrong\u003E **HTML** file ```index.html```\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"9,11,13\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Chtml\u003E\n    \u003Chead\u003E\n        \u003C!-- ... Script\u002FCSS includes ... --\u003E\n        \u003Cscript src=\"js\u002Fzuix.min.js\"\u003E\u003C\u002Fscript\u003E\n        \u003C!-- ... --\u003E\n    \u003C\u002Fhead\u003E\n    \u003Cbody\u003E\n        \u003C!-- header --\u003E\n        \u003Cdiv data-ui-include=\"site\u002Flayout\u002Fheader\"\u003E\u003C\u002Fdiv\u003E\n        \u003C!-- page content --\u003E\n        \u003Cdiv data-ui-include=\"site\u002Fcontent\u002Fmain\"\u003E\u003C\u002Fdiv\u003E\n        \u003C!-- footer --\u003E\n        \u003Cdiv data-ui-include=\"site\u002Flayout\u002Ffooter\"\u003E\u003C\u002Fdiv\u003E\n    \u003C\u002Fbody\u003E\n\u003C\u002Fhtml\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nThe ```data-ui-include``` attribute shown at lines 9-11-13, will instruct *ZUIX*\nto load the specified content into each ```div``` element.\n\nNotice that the value of the ```data-ui-include``` attribute is the URL of the file to include\n\u003Cu\u003Ewithout\u003C\u002Fu\u003E the ```.html``` extension. This value is the\n*component identifier*.\n\nThe following example shows how a ```div``` will looks like after\nthe content ```site\u002Fcommon\u002Flinks``` is included into it.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE\u003C\u002Fstrong\u003E - **HTML** file [site\u002Fcommon\u002Flinks.html](https:\u002F\u002Fgenielabs.github.io\u002Fzuix\u002Fsite\u002Fcommon\u002Flinks.html)\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"1\"\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003C!-- content site\u002Fcommon\u002Flinks ---\u003E\n    \u003Cdiv layout=\"row center-spread\"\u003E\n        \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\"\u003EZUIX on GitHub\u003C\u002Fa\u003E\n        \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\"\u003E@genielabs\u003C\u002Fa\u003E\n        \u003Ca href=\"https:\u002F\u002Fgenielabs.github.io\u002FHomeGenie\u002F\"\u003EHomeGenie\u003C\u002Fa\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nElement including the above content\n\n\u003Cpre data-line=\"1\"\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003C!-- include common links --\u003E\n    \u003Cdiv data-ui-include=\"site\u002Fcommon\u002Flinks\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003EPROCESSED OUTPUT\u003C\u002Fstrong\u003E - resulting ```div``` after content is loaded into it\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"1,4\"\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003C!-- include common links --\u003E\n    \u003Cdiv data-ui-include=\"site\u002Fcommon\u002Flinks\"\n         data-ui-component=\"site\u002Fcommon\u002Flinks\"\n         data-ui-loaded=\"false\"\u003E\n        \u003C!-- site\u002Fcommon\u002Flinks ---\u003E\n        \u003Cdiv layout=\"row center-spread\"\u003E\n            \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\"\u003EZUIX on GitHub\u003C\u002Fa\u003E\n            \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\"\u003E@genielabs\u003C\u002Fa\u003E\n            \u003Ca href=\"https:\u002F\u002Fgenielabs.github.io\u002FHomeGenie\u002F\"\u003EHomeGenie\u003C\u002Fa\u003E\n        \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\n\u003Cdiv data-ui-include=\"site\u002Fcommon\u002Flinks\" data-ui-options=\"main.options.content_no_css\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\nIt is also possible to include content that is located on a different server by\nspecifying the absolute URL:\n\n\u003Cpre\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003Cdiv data-ui-include=\"https:\u002F\u002Fgenielabs.github.io\u002Fzuix\u002Fsite\u002Fcommon\u002Flinks\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n##### Lazy loading\n\nWhen dealing with big pages that request to load a bunch\nof *includes*, it is perhaps desirable to have the content\nloaded only when it actually comes into the user screen's view.\nThis kind of *on-demand* content composition, is called\n*lazy loading*.\n\nTo enable this feature, set the attribute ```data-ui-lazyload=\"true\"```\non the same element you want to enable lazy loading on, or on a container\nelement so that all the \"include\" elements contained in it will inherit\nthe option.\nIn this last case, all container's children will be lazy-loaded.\n\nTo force loading of a particular element that currently\ninherits lazy-loading, we set on it the attribute ```data-ui-lazyload=\"false\"```.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E Use of lazy loading option\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"1,5\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv data-ui-lazyload=\"true\"\u003E\n    \u003C!-- the \"content\u002Fpreface\" include will load anyway\n          because of the 'data-ui-lazyload=false' option --\u003E\n    \u003Cdiv data-ui-include=\"content\u002Fpreface\"\n         data-ui-lazyload=\"false\"\u003E\u003C\u002Fdiv\u003E\n    \u003C!-- following 'includes' inherits 'data-ui-lazyload' from\n         the parent and these will be loaded only when the user\n         scrolls the page down to them --\u003E\n    \u003Cdiv data-ui-include=\"content\u002Fchapter_01\"\u003E\u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-include=\"content\u002Fchapter_02\"\u003E\u003C\u002Fdiv\u003E\n    \u003C!-- ... ---\u003E\n    \u003Cdiv data-ui-include=\"content\u002Fchapter_12\"\u003E\u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-include=\"content\u002Fappendix\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\n##### Styling content\n\nWhen including a content, after loading the ```.html``` file,\n*ZUIX* will also try to load a ```.css``` style\nfile with the same location\u002Fbasename.\n\nIf the style file is found, all style definitions contained in it,\nwill be applied to the container where the content has been loaded.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E **HTML** file [site\u002Fcommon\u002Flinks.html](https:\u002F\u002Fgenielabs.github.io\u002Fzuix\u002Fsite\u002Fcommon\u002Flinks.html)\u003C\u002Fsmall\u003E\n\u003Cpre\u003E\u003Ccode class=\"language-html\"\u003E\n\u003C!-- site\u002Fcommon\u002Flinks ---\u003E\n\u003Cdiv layout=\"row center-spread\"\u003E\n    \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\"\u003EZUIX on GitHub\u003C\u002Fa\u003E\n    \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\"\u003E@genielabs\u003C\u002Fa\u003E\n    \u003Ca href=\"https:\u002F\u002Fgenielabs.github.io\u002FHomeGenie\u002F\"\u003EHomeGenie\u003C\u002Fa\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E **CSS** file [site\u002Fcommon\u002Flinks.css](https:\u002F\u002Fgenielabs.github.io\u002Fzuix\u002Fsite\u002Fcommon\u002Flinks.css)\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"1,9\"\u003E\u003Ccode class=\"language-css\"\u003E\ndiv[layout] {\n    padding: 16px;\n    margin: 24px;\n    background-color: #1c88e6;\n    -webkit-box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n    -moz-box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n    box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n}\na {\n    color: white;\n    font-size: 18px;\n}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nContainer including the above:\n\n\u003Cpre\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003C!-- include common links --\u003E\n    \u003Cdiv data-ui-include=\"site\u002Fcommon\u002Flinks\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003EPROCESSED OUTPUT\u003C\u002Fstrong\u003E resulting ```div``` after content is loaded into it\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"12,20\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003C!-- include common links --\u003E\n\u003Cdiv data-ui-include=\"site\u002Fcommon\u002Flinks\"  data-ui-loaded=\"false\"\n     data-ui-component=\"site\u002Fcommon\u002Flinks\"\u003E\n    \u003C!-- site\u002Fcommon\u002Flinks ---\u003E\n    \u003Cdiv layout=\"row center-spread\"\u003E\n        \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\"\u003EZUIX on GitHub\u003C\u002Fa\u003E\n        \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\"\u003E@genielabs\u003C\u002Fa\u003E\n        \u003Ca href=\"https:\u002F\u002Fgenielabs.github.io\u002FHomeGenie\u002F\"\u003EHomeGenie\u003C\u002Fa\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cstyle type=\"text\u002Fcss\"\u003E\n[data-ui-component=\"site\u002Fcommon\u002Flinks\"] div[layout] {\n    padding: 16px;\n    margin: 24px;\n    background-color: #1c88e6;\n    -webkit-box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n    -moz-box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n    box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n}\n[data-ui-component=\"site\u002Fcommon\u002Flinks\"] a {\n    color: white;\n    font-size: 18px;\n}\n\u003C\u002Fstyle\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv data-ui-include=\"site\u002Fcommon\u002Flinks\"\n     data-ui-options=\"main.options.content\"\n     data-ui-lazyload=\"false\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\nSo, as shown in the processed output, the ```.css``` style definitions\nare applied only to the loaded content via the ```data-ui-component``` constraint,\nmaking possible to keep **global style** files separated from **content-local style** files\n(scoped CSS).\n\n\u003Cdiv data-ui-include=\"content\u002Fquick_start\u002Fview_templates\"\n     data-ui-lazyload=\"false\"\n     data-ui-options=\"main.options.content_no_css\"\n     class=\"progressive-content-container\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n    \u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n    \u003Cp\u003E\u003Csmall\u003ELoading \u003Cem\u003E'View Templates'\u003C\u002Fem\u003E...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n"},{"componentId":"content\u002Fapi\u002Fzuix","view":"\u003Ca id=\"ZUIX_API--Zuix\"\u003E\u003C\u002Fa\u003E\n### `Zuix` class\n\nIs the main *ZUIX* class\nwhich is exposed as a the global object `zuix`.\n\n#### Methods\n\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\"\n     data-ui-options=\"api_loader_options\"\n     data-ui-api=\"Zuix\"\n     class=\"api-dox\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EZuix\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n","css":null,"controller":function (){}},{"componentId":"content\u002Fapi\u002Fcomponent_context","view":"\u003Ca id=\"ZUIX_API--ContextOptions\"\u003E\u003C\u002Fa\u003E\n### `ContextOptions` object\n\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\"\n     data-ui-options=\"api_loader_options\"\n     data-ui-api=\"ContextOptions\"\n     class=\"api-dox\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EContextOptions\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\n\u003Ca id=\"ZUIX_API--ComponentContext\"\u003E\u003C\u002Fa\u003E\n### `ComponentContext` class\n\nThis is the class that holds all objects and data of a component\ninstance, hence represent a component instance itself.\n\nA reference to a component can be obtained in two ways:\n\n```\n\u002F\u002F get component context as return value of the ```zuix.load(...)``` command\nvar ctx = zuix.load( ... );\n```\n\nor\n\n```html\n\u003Cdiv data-ui-load=\"path\u002Fto\u002Fcomponent_name\"\n     data-ui-context=\"my-context-id\"\u003E\u003C!-- ... --\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\n\u002F\u002F get component instance starting from it's view or container element\nvar ctx = zuix.context('my-context-id');\n\u003C\u002Fscript\u003E\n```\n\n#### Methods\n\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\"\n     data-ui-options=\"api_loader_options\"\n     data-ui-api=\"ComponentContext\"\n     class=\"api-dox\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n    \u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n    \u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EComponentContext\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n","css":null,"controller":function (){}},{"componentId":"content\u002Fapi\u002Fcontext_controller","view":"\u003Ca id=\"ZUIX_API--ContextController\"\u003E\u003C\u002Fa\u003E\n### `ContextController` class\n\nInstance of this class is passed to the *context controller handler*\nand allow accessing and controlling the component's view, events\nand all other aspect of it from inside the controller JavaScript code.\n\n#### Methods\n\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\"\n     data-ui-options=\"api_loader_options\"\n     data-ui-api=\"ContextController\"\n     class=\"api-dox\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EContextController\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n","css":null,"controller":function (){}},{"componentId":"content\u002Fapi\u002Fzxquery","view":"\u003Ca id=\"ZUIX_API--ZxQuery\"\u003E\u003C\u002Fa\u003E\n### `ZxQuery` class\n\n*ZxQuery* is a *ZUIX* built-in class that implements a very\nlite subset of jQuery-like functionality. It can wrap elements\nin a DOM and provide useful methods for manipulating it.\n\n#### Constructor\n\nThe constructor takes one optional argument that can be a DOM element,\na node list or a valid DOM query selector string expression.\nIf no parameter is given, the ZxQuery will wrap the root *document* element.\n\n\u003Cpre\u003E\u003Ccode\u003Evar zxElement = new ZxQuery(element);\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nor\n\n\u003Cpre\u003E\u003Ccode\u003Evar zxElement = zuix.$(element);\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nwhich is the recommended way of creating `ZxQuery` objects.\n\n#### Methods\n\n\u003Cdiv data-ui-load=\"content\u002Fapi\u002Fapi_loader\"\n     data-ui-options=\"api_loader_options\"\n     data-ui-api=\"ZxQuery\"\n    class=\"api-dox\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n\u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n\u003Cp\u003E\u003Csmall\u003EBuilding \u003Cem\u003EZxQuery\u003C\u002Fem\u003E jsDoc...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C!-- prevent scroll from blocking\n this content will be replaced after loading ---\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\n\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n","css":null,"controller":function (){}},{"componentId":"content\u002Fhome\u002Fsharing","controller":function (){},"css":".resp-sharing-button__link,\n.resp-sharing-button__icon {\n    display: inline-block\n}\n\n.resp-sharing-button__link {\n    text-decoration: none;\n    color: #fff;\n    margin-left: 0.4em;\n    margin-right: 0.4em;\n}\n\n.resp-sharing-button {\n    border-radius: 5px;\n    transition: 25ms ease-out;\n    padding: 4px;\n    font-family: Helvetica Neue,Helvetica,Arial,sans-serif\n}\n\n.resp-sharing-button__icon svg {\n    width: 1em;\n    height: 1em;\n    margin-right: 0.4em;\n    vertical-align: top\n}\n\n.resp-sharing-button--small svg {\n    margin: 0;\n    vertical-align: middle\n}\n\n\u002F* Non solid icons get a stroke *\u002F\n.resp-sharing-button__icon {\n    stroke: #facace;\n    fill: white;\n}\n\n\u002F* Solid icons get a fill *\u002F\n.resp-sharing-button__icon--solid,\n.resp-sharing-button__icon--solidcircle {\n    fill: #fff;\n    stroke: none\n}\n\n.resp-sharing-button--facebook {\n    background-color: #3b5998;\n    -webkit-animation-delay: 0.7s;\n    -moz-animation-delay: 0.7s;\n    -o-animation-delay: 0.7s;\n    -ms-animation-delay: 0.7s;\n}\n\n.resp-sharing-button--facebook:hover {\n    background-color: #2d4373\n}\n\n.resp-sharing-button--twitter {\n    background-color: #55acee;\n    -webkit-animation-delay: 0.8s;\n    -moz-animation-delay: 0.8s;\n    -o-animation-delay: 0.8s;\n    -ms-animation-delay: 0.8s;\n}\n\n.resp-sharing-button--twitter:hover {\n    background-color: #2795e9\n}\n\n.resp-sharing-button--google {\n    background-color: #dd4b39;\n    -webkit-animation-delay: 0.9s;\n    -moz-animation-delay: 0.9s;\n    -o-animation-delay: 0.9s;\n    -ms-animation-delay: 0.9s;\n}\n\n.resp-sharing-button--google:hover {\n    background-color: #c23321\n}\n\n.resp-sharing-button--tumblr {\n    background-color: #35465C;\n    -webkit-animation-delay: 1.0s;\n    -moz-animation-delay: 1.0s;\n    -o-animation-delay: 1.0s;\n    -ms-animation-delay: 1.0s;\n}\n\n.resp-sharing-button--tumblr:hover {\n    background-color: #222d3c\n}\n\n.resp-sharing-button--pinterest {\n    background-color: #bd081c;\n    -webkit-animation-delay: 1.1s;\n    -moz-animation-delay: 1.1s;\n    -o-animation-delay: 1.1s;\n    -ms-animation-delay: 1.1s;\n}\n\n.resp-sharing-button--pinterest:hover {\n    background-color: #8c0615\n}\n\n.resp-sharing-button--reddit {\n    background-color: #5f99cf\n}\n\n.resp-sharing-button--reddit:hover {\n    background-color: #3a80c1\n}\n\n.resp-sharing-button--linkedin {\n    background-color: #0077b5\n}\n\n.resp-sharing-button--linkedin:hover {\n    background-color: #046293\n}\n\n.resp-sharing-button--email {\n    background-color: #777\n}\n\n.resp-sharing-button--email:hover {\n    background-color: #5e5e5e\n}\n\n.resp-sharing-button--xing {\n    background-color: #1a7576\n}\n\n.resp-sharing-button--xing:hover {\n    background-color: #114c4c\n}\n\n.resp-sharing-button--whatsapp {\n    background-color: #25D366\n}\n\n.resp-sharing-button--whatsapp:hover {\n    background-color: #1da851\n}\n\n.resp-sharing-button--hackernews {\n    background-color: #FF6600\n}\n.resp-sharing-button--hackernews:hover, .resp-sharing-button--hackernews:focus {   background-color: #FB6200 }\n\n.resp-sharing-button--vk {\n    background-color: #507299\n}\n\n.resp-sharing-button--vk:hover {\n    background-color: #43648c\n}\n\n.resp-sharing-button--facebook {\n    background-color: #3b5998;\n    border-color: #3b5998;\n}\n\n.resp-sharing-button--facebook:hover,\n.resp-sharing-button--facebook:active {\n    background-color: #2d4373;\n    border-color: #2d4373;\n}\n\n.resp-sharing-button--twitter {\n    background-color: #55acee;\n    border-color: #55acee;\n}\n\n.resp-sharing-button--twitter:hover,\n.resp-sharing-button--twitter:active {\n    background-color: #2795e9;\n    border-color: #2795e9;\n}\n\n.resp-sharing-button--google {\n    background-color: #dd4b39;\n    border-color: #dd4b39;\n}\n\n.resp-sharing-button--google:hover,\n.resp-sharing-button--google:active {\n    background-color: #c23321;\n    border-color: #c23321;\n}\n\n.resp-sharing-button--tumblr {\n    background-color: #35465C;\n    border-color: #35465C;\n}\n\n.resp-sharing-button--tumblr:hover,\n.resp-sharing-button--tumblr:active {\n    background-color: #222d3c;\n    border-color: #222d3c;\n}\n\n.resp-sharing-button--email {\n    background-color: #777777;\n    border-color: #777777;\n}\n\n.resp-sharing-button--email:hover,\n.resp-sharing-button--email:active {\n    background-color: #5e5e5e;\n    border-color: #5e5e5e;\n}\n\n.resp-sharing-button--pinterest {\n    background-color: #bd081c;\n    border-color: #bd081c;\n}\n\n.resp-sharing-button--pinterest:hover,\n.resp-sharing-button--pinterest:active {\n    background-color: #8c0615;\n    border-color: #8c0615;\n}\n\n.resp-sharing-button--linkedin {\n    background-color: #0077b5;\n    border-color: #0077b5;\n}\n\n.resp-sharing-button--linkedin:hover,\n.resp-sharing-button--linkedin:active {\n    background-color: #046293;\n    border-color: #046293;\n}\n","view":"\u003C!-- Sharingbutton Facebook --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Ffacebook.com\u002Fsharer\u002Fsharer.php?u={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--facebook resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M18.77 7.46H14.5v-1.9c0-.9.6-1.1 1-1.1h3V.5h-4.33C10.24.5 9.5 3.44 9.5 5.32v2.15h-3v4h3v12h5v-12h3.85l.42-4z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton Twitter --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Ftwitter.com\u002Fintent\u002Ftweet\u002F?text={description}&amp;url={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--twitter resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M23.44 4.83c-.8.37-1.5.38-2.22.02.93-.56.98-.96 1.32-2.02-.88.52-1.86.9-2.9 1.1-.82-.88-2-1.43-3.3-1.43-2.5 0-4.55 2.04-4.55 4.54 0 .36.03.7.1 1.04-3.77-.2-7.12-2-9.36-4.75-.4.67-.6 1.45-.6 2.3 0 1.56.8 2.95 2 3.77-.74-.03-1.44-.23-2.05-.57v.06c0 2.2 1.56 4.03 3.64 4.44-.67.2-1.37.2-2.06.08.58 1.8 2.26 3.12 4.25 3.16C5.78 18.1 3.37 18.74 1 18.46c2 1.3 4.4 2.04 6.97 2.04 8.35 0 12.92-6.92 12.92-12.93 0-.2 0-.4-.02-.6.9-.63 1.96-1.22 2.56-2.14z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton Google+ --\u003E\n\u003Ca class=\"resp-sharing-button__link animated pulse\" href=\"https:\u002F\u002Fplus.google.com\u002Fshare?url={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--google resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M11.37 12.93c-.73-.52-1.4-1.27-1.4-1.5 0-.43.03-.63.98-1.37 1.23-.97 1.9-2.23 1.9-3.57 0-1.22-.36-2.3-1-3.05h.5c.1 0 .2-.04.28-.1l1.36-.98c.16-.12.23-.34.17-.54-.07-.2-.25-.33-.46-.33H7.6c-.66 0-1.34.12-2 .35-2.23.76-3.78 2.66-3.78 4.6 0 2.76 2.13 4.85 5 4.9-.07.23-.1.45-.1.66 0 .43.1.83.33 1.22h-.08c-2.72 0-5.17 1.34-6.1 3.32-.25.52-.37 1.04-.37 1.56 0 .5.13.98.38 1.44.6 1.04 1.84 1.86 3.55 2.28.87.23 1.82.34 2.8.34.88 0 1.7-.1 2.5-.34 2.4-.7 3.97-2.48 3.97-4.54 0-1.97-.63-3.15-2.33-4.35zm-7.7 4.5c0-1.42 1.8-2.68 3.9-2.68h.05c.45 0 .9.07 1.3.2l.42.28c.96.66 1.6 1.1 1.77 1.8.05.16.07.33.07.5 0 1.8-1.33 2.7-3.96 2.7-1.98 0-3.54-1.23-3.54-2.8zM5.54 3.9c.33-.38.75-.58 1.23-.58h.05c1.35.05 2.64 1.55 2.88 3.35.14 1.02-.08 1.97-.6 2.55-.32.37-.74.56-1.23.56h-.03c-1.32-.04-2.63-1.6-2.87-3.4-.13-1 .08-1.92.58-2.5zM23.5 9.5h-3v-3h-2v3h-3v2h3v3h2v-3h3\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton Tumblr --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Fwww.tumblr.com\u002Fwidgets\u002Fshare\u002Ftool?posttype=link&amp;title={description}&amp;caption={description}&amp;content={url}&amp;canonicalUrl={url}&amp;shareSource=tumblr_share_button\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--tumblr resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M13.5.5v5h5v4h-5V15c0 5 3.5 4.4 6 2.8v4.4c-6.7 3.2-12 0-12-4.2V9.5h-3V6.7c1-.3 2.2-.7 3-1.3.5-.5 1-1.2 1.4-2 .3-.7.6-1.7.7-3h3.8z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton E-Mail -- \u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"mailto:?subject={description}&amp;body={url}\" target=\"_self\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--email resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M22 4H2C.9 4 0 4.9 0 6v12c0 1.1.9 2 2 2h20c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM7.25 14.43l-3.5 2c-.08.05-.17.07-.25.07-.17 0-.34-.1-.43-.25-.14-.24-.06-.55.18-.68l3.5-2c.24-.14.55-.06.68.18.14.24.06.55-.18.68zm4.75.07c-.1 0-.2-.03-.27-.08l-8.5-5.5c-.23-.15-.3-.46-.15-.7.15-.22.46-.3.7-.14L12 13.4l8.23-5.32c.23-.15.54-.08.7.15.14.23.07.54-.16.7l-8.5 5.5c-.08.04-.17.07-.27.07zm8.93 1.75c-.1.16-.26.25-.43.25-.08 0-.17-.02-.25-.07l-3.5-2c-.24-.13-.32-.44-.18-.68s.44-.32.68-.18l3.5 2c.24.13.32.44.18.68z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa--\u003E\n\n\u003C!-- Sharingbutton Pinterest --\u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Fpinterest.com\u002Fpin\u002Fcreate\u002Fbutton\u002F?url={url}&amp;media={url}&amp;description={description}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--pinterest resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M12.14.5C5.86.5 2.7 5 2.7 8.75c0 2.27.86 4.3 2.7 5.05.3.12.57 0 .66-.33l.27-1.06c.1-.32.06-.44-.2-.73-.52-.62-.86-1.44-.86-2.6 0-3.33 2.5-6.32 6.5-6.32 3.55 0 5.5 2.17 5.5 5.07 0 3.8-1.7 7.02-4.2 7.02-1.37 0-2.4-1.14-2.07-2.54.4-1.68 1.16-3.48 1.16-4.7 0-1.07-.58-1.98-1.78-1.98-1.4 0-2.55 1.47-2.55 3.42 0 1.25.43 2.1.43 2.1l-1.7 7.2c-.5 2.13-.08 4.75-.04 5 .02.17.22.2.3.1.14-.18 1.82-2.26 2.4-4.33.16-.58.93-3.63.93-3.63.45.88 1.8 1.65 3.22 1.65 4.25 0 7.13-3.87 7.13-9.05C20.5 4.15 17.18.5 12.14.5z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa\u003E\n\n\u003C!-- Sharingbutton LinkedIn -- \u003E\n\u003Ca class=\"resp-sharing-button__link\" href=\"https:\u002F\u002Fwww.linkedin.com\u002FshareArticle?mini=true&amp;url={url}&amp;title={description}&amp;summary={description}&amp;source={url}\" target=\"_blank\" aria-label=\"\"\u003E\n    \u003Cdiv class=\"animated bounceIn resp-sharing-button resp-sharing-button--linkedin resp-sharing-button--small\"\u003E\u003Cdiv aria-hidden=\"true\" class=\"resp-sharing-button__icon resp-sharing-button__icon--solid\"\u003E\n        \u003Csvg xmlns=\"http:\u002F\u002Fwww.w3.org\u002F2000\u002Fsvg\" viewBox=\"0 0 24 24\"\u003E\u003Cpath d=\"M6.5 21.5h-5v-13h5v13zM4 6.5C2.5 6.5 1.5 5.3 1.5 4s1-2.4 2.5-2.4c1.6 0 2.5 1 2.6 2.5 0 1.4-1 2.5-2.6 2.5zm11.5 6c-1 0-2 1-2 2v7h-5v-13h5V10s1.6-1.5 4-1.5c3 0 5 2.2 5 6.3v6.7h-5v-7c0-1-1-2-2-2z\"\u002F\u003E\u003C\u002Fsvg\u003E\n    \u003C\u002Fdiv\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fa--\u003E\n"},{"componentId":"ui\u002Ftemplates\u002Fmdl_card","controller":function (){},"view":"\u003Cdiv class=\"mdl-card\"\u003E\n    \u003Cdiv class=\"mdl-card__title\"\u003E\n        \u003Ch2 data-ui-field=\"title\" class=\"mdl-card__title-text\"\u003ETitle\u003C\u002Fh2\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"text\" class=\"mdl-card__supporting-text\"\u003E\n        Card text...\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n","css":".mdl-card {\n    height: 100%;\n    width: auto;\n    background: transparent;\n}\n\n.mdl-card__title-text {\n    display: block;\n}"},{"componentId":"site\u002Fcommon\u002Flinks","view":"\u003Cdiv layout=\"row center-spread\"\u003E\n    \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix\"\u003EZUIX on GitHub\u003C\u002Fa\u003E\n    \u003Ca href=\"https:\u002F\u002Fgithub.com\u002Fgenielabs\"\u003E@genielabs\u003C\u002Fa\u003E\n    \u003Ca href=\"https:\u002F\u002Fgenielabs.github.io\u002FHomeGenie\u002F\"\u003EHomeGenie\u003C\u002Fa\u003E\n\u003C\u002Fdiv\u003E\n","css":"div[layout] {\n    width:auto;\n    padding: 16px;\n    margin: 24px;\n    background-color: #1c88e6;\n    -webkit-box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n    -moz-box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n    box-shadow: 9px 10px 36px -7px rgba(0,0,0,0.58);\n}\na {\n    color: white;\n    font-size: 18px;\n    text-decoration: none;\n}","controller":function (){}},{"componentId":"content\u002Fquick_start\u002Fview_templates","controller":function (){},"view":"\u003Ca id=\"Getting_Started--View_Templates\"\u003E\u003C\u002Fa\u003E\n#### View Templates \u003Ci class=\"material-icons mdl-color-text--grey-500\"\u003Esettings_ethernet\u003C\u002Fi\u003E\n\nIn a more generic fashion, we call it **View Template** (or just *View*),\nwhen we refer to that particular kind of content where some elements\nin it are bound to fields of a *data model* and, so, that dynamically\nchange the shown data accordingly to it.\n\nThe ```data-ui-field``` attribute, placed on elements of a view template,\nis used to bind them to the associated fields in the model.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - HTML\u003C\u002Fstrong\u003E View Template\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"3,6\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003C!-- View Template - Article item summary --\u003E\n\u003Cdiv class=\"article\"\u003E\n    \u003Ch6 data-ui-field=\"title\"\u003E\n        Article Title\n    \u003C\u002Fh6\u003E\n    \u003Cdiv data-ui-field=\"summary\"\u003E\n        This is the place holder for the article summary.\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003EDATA MODEL\u003C\u002Fstrong\u003E Example instance\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"2,3\"\u003E\u003Ccode class=\"language-js\"\u003E\nmodel = {\n    title: 'Pizza recipe',\n    summary: 'Classic homemade pizza recipe, including ...'\n}\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv self=\"size-1of2\" class=\"zuix-example article mdl-shadow--6dp\"\u003E\n\u003Ch6 data-ui-field=\"title\"\u003EPizza recipe\u003C\u002Fh6\u003E\n\u003Cdiv data-ui-field=\"summary\"\u003E\nClassic homemade pizza recipe, including pizza dough and toppings, step-by-step instructions with photos.\n\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cstyle\u003E\n.zuix-example.article {\n    margin: 12px 36px 24px;\n    padding: 0px 12px 12px;\n    opacity: 0.6;\n}\n.zuix-example.article h4 {\n    margin-top: 0; margin-bottom: 0;\n}\n\u003C\u002Fstyle\u003E\n\nA *View* can be either implemented in a file, like already described for\n[loading content](#Getting_Started--Content_Loading), or as an **inline** View, that is so\nplaced in the same page rather than on a its own file.\n\n###### Inline View Template\n\nA view is declared inline by adding the ```data-ui-view``` attribute to its root element.\nThe value of this attribute is meant to be a unique identifier and shall not match the path\nof any other view placed in a file or inline in the same page, unless we want to *override* it.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E Inline View Template\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"2\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003C!-- definition of a inline view template --\u003E\n\u003Cspan data-ui-view=\"inline\u002Fcommon\u002Fcontact_chip\"\n      class=\"mdl-chip mdl-chip--contact\"\u003E\n    \u003Cimg class=\"mdl-chip__contact\" src=\"site\u002Fimages\u002Favatar_01.png\"\u003E\n    \u003Cspan class=\"mdl-chip__text\"\u003EContact Name\u003C\u002Fspan\u003E\n\u003C\u002Fspan\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nInclusion of the above view in the same page\n\n\u003Cpre\u003E\u003Ccode class=\"language-html\"\u003E\n    \u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv class=\"content-padding\"\u003E\n\u003Cspan data-ui-view=\"inline\u002Fcommon\u002Fcontact_chip\" class=\"mdl-chip mdl-chip--contact mdl-color--blue mdl-color-text--white mdl-shadow--4dp\"\u003E\n\u003Cimg data-ui-field=\"image\" class=\"mdl-chip__contact\" src=\"site\u002Fimages\u002Favatar_01.png\"\u003E\n\u003Cspan data-ui-field=\"name\" class=\"mdl-chip__text\"\u003EContact Name\u003C\u002Fspan\u003E\n\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n\n##### Data Binding\n\nSo, to bind elements of a view template to fields of a given data model, we set the ```data-ui-field``` attribute\non these elements with the name of the model field that we want to bind to.\n\n\u003Ca id=\"Getting_Started--Basic_Binding\"\u003E\u003C\u002Fa\u003E\n###### Basic Binding\n\nWhen providing a simple data model like the one described in the previous example,\nthe model's field is automatically mapped to a certain element's property\ndepending on the type of the binding element.\nFor instance, if the element is an ```img```, then the mapped property\nwill be ```.src```, while for a ```div``` or a ```p``` it will be\nthe ```.innerHTML``` property.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E Inline View Template with ```data-ui-field``` fields.\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"4,7\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003C!-- definition of a inline view template --\u003E\n\u003Cspan data-ui-view=\"inline\u002Fcommon\u002Fcontact_chip\"\n      class=\"mdl-chip mdl-chip--contact\"\u003E\n    \u003Cimg  data-ui-field=\"image\"\n          class=\"mdl-chip__contact\"\n          src=\"site\u002Fimages\u002Favatar_01.png\"\u003E\n    \u003Cspan data-ui-field=\"name\"\n          class=\"mdl-chip__text\"\u003EContact Name\u003C\u002Fspan\u003E\n\u003C\u002Fspan\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nWhen including the view template we can specify in its body\na minimal markup declaring same fields as the template,\nwhose values will be replaced in the template\nafter it's loaded.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E Inclusion of a view template with embedded data model.\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"2,3\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\u003E\n    \u003Cp data-ui-field=\"name\"\u003EMr. Brown\u003C\u002Fp\u003E\n    \u003Cp data-ui-field=\"image\"\u003Esite\u002Fimages\u002Favatar_02.png\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv layout=\"row center-spread\" class=\"mdl-color--grey-50\"\u003E\n\u003Csmall\u003E\u003Cstrong\u003Ebefore inclusion...\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Csmall\u003E\u003Cstrong\u003E...after template inclusion\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003C\u002Fdiv\u003E\n\u003Cdiv layout=\"row center-spread\" class=\"mdl-color--grey-50 content-padding\"\u003E\n\u003Cdiv class=\"mdl-color--white\"\u003E\n\u003Cp data-ui-field=\"name\"\u003EMr. Brown\u003C\u002Fp\u003E\n\u003Cp data-ui-field=\"image\"\u003Esite\u002Fimages\u002Favatar_02.png\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\" data-ui-options=\"main.options.component_no_css\" class=\"mdl-color--white\"\u003E\n\u003Cp data-ui-field=\"name\"\u003EMr. Brown\u003C\u002Fp\u003E\n\u003Cp data-ui-field=\"image\"\u003Esite\u002Fimages\u002Favatar_02.png\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\nSo this allows having a valid preview even before\napplying the view template (eg. if loading a view from file\nand the network is slow or JavaScript is disabled).\n\n\u003Cstyle\u003E\n.custom-style {\n    border: solid 1px teal;\n    padding: 4px;\n}\n\u003C\u002Fstyle\u003E\n\u003Cpre data-line=\"3,4\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\u003E\n    \u003Cdiv class=\"custom-style\"\u003E\n        \u003Cimg data-ui-field=\"image\" src=\"site\u002Fimages\u002Favatar_01.png\"\u003E\n        \u003Cspan data-ui-field=\"name\"\u003EMrs. Black\u003C\u002Fspan\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv layout=\"row center-spread\" class=\"mdl-color--grey-50\"\u003E\n\u003Csmall\u003E\u003Cstrong\u003Ebefore inclusion...\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Csmall\u003E\u003Cstrong\u003E...after template inclusion\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003C\u002Fdiv\u003E\n\u003Cdiv layout=\"row center-spread\" class=\"mdl-color--grey-50 content-padding\"\u003E\n\u003Cdiv class=\"mdl-color--white\"\u003E\n\u003Cdiv class=\"custom-style\"\u003E\n\u003Cimg width=\"48\" height=\"48\" data-ui-field=\"image\" src=\"site\u002Fimages\u002Favatar_01.png\"\u003E\n\u003Cspan data-ui-field=\"name\"\u003EMrs. Black\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\" data-ui-options=\"main.options.component_no_css\" class=\"mdl-color--white\"\u003E\n\u003Cimg width=\"48\" height=\"48\" data-ui-field=\"image\" src=\"site\u002Fimages\u002Favatar_01.png\"\u003E\n\u003Cspan data-ui-field=\"name\"\u003EMrs. Black\u003C\u002Fspan\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\nAnother way of using basic binding is by employing\nthe ```data-bind-model``` attribute as shown below:\n\n\u003Cpre data-line=\"4,7,11,15\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv layout=\"row center-spread\"\u003E\n    \u003C!-- Foo Bar chip --\u003E\n    \u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n         data-bind-model=\"foo_bar_contact\"\u003E\u003C\u002Fdiv\u003E\n    \u003C!-- Jane Doe chip --\u003E\n    \u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n         data-bind-model=\"a_random_contact\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\n\u002F\u002F example inline data model\nfoo_bar_contact = {\n    image: 'site\u002Fimages\u002Favatar_02.png',\n    name: 'Foo Bar'\n};\na_random_contact = {\n    image: 'site\u002Fimages\u002Favatar_01.png',\n    name: function(element, field) { element.html(a_random_name()); }\n};\n\u003C\u002Fscript\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv data-ui-view=\"chip_example_result\" layout=\"row center-spread\"\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n  data-id=\"0\" data-bind-model=\"chip_adapter\"\n  data-ui-options=\"main.options.component_no_css\"\u003E\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n  data-id=\"1\" data-bind-model=\"chip_adapter\"\n  data-ui-options=\"main.options.component_no_css\"\u003E\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\nvar chip_items = {\n    \"0\": { name: 'Foo Bar', image: 'site\u002Fimages\u002Favatar_02.png'},\n    \"1\": { name: 'Jane Doe', image: 'site\u002Fimages\u002Favatar_01.png'},\n    \"2\": { name: 'Mikey M.', image: 'site\u002Fimages\u002Favatar_03.png'}\n};\n\u002F\u002F example model view adapter\nvar chip_adapter = function(element, field) {\n    var id = this.attr('data-id');\n    var value = chip_items[id][field];\n    switch (field) {\n        case 'name':\n            element.html(value);\n            break;\n        case 'image':\n            element.attr('src', value);\n            break;\n    }\n};\n\u003C\u002Fscript\u003E\n\u003C\u002Fdiv\u003E\n\n###### Binding Adapters\n\nSometimes it might be required to have more control over\nhow the value of a model's field affects the view.\nFor this purpose *Binding Adapters* can be used rather than\n*[Basic Binding](#Getting_Started--Basic_Binding)*.\n\nA *binding adapter* is a function that gets called when the data model\nassociated to a view is updated.\n\n    function vm_binding_adapter(element, field) {\n        \u002F\u002F adapter code ...\n    }\n\nwhere ```element``` (`ZxQuery`) is the view element that needs to be updated,\n```field``` is the name of the bound field in the model and the\ncontext object **this**, is the view itself.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E Using a binding adapter\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"3,6,16\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv layout=\"row center-spread\"\u003E\n    \u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n         data-bind-model=\"chip_adapter\"\n         data-id=\"0\"\u003E\u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n         data-bind-model=\"chip_adapter\"\n         data-id=\"1\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\n\u002F\u002F items list\nchip_items = {\n    \"0\": { name: 'Foo Bar', image: 'site\u002Fimages\u002Favatar_02.png'},\n    \"1\": { name: 'Jane Doe', image: 'site\u002Fimages\u002Favatar_01.png'}\n};\n\u002F\u002F example adapter\nchip_adapter = function(element, field) {\n    \u002F\u002F the context 'this', is the View itself\n    var id = this.attr('data-id');\n    \u002F\u002F get the value of 'field' in the data model\n    var value = chip_items[id][field];\n    \u002F\u002F use the value to update the bound 'element'\n    switch (field) {\n        case 'name':\n            element.html(value);\n            break;\n        case 'image':\n            \u002F\u002F show place-holder if no image is provided\n            if (value == '')\n                element.attr('src', 'site\u002Fimages\u002Fchip_placeholder.png');\n            else\n                element.attr('src', value);\n            break;\n    }\n};\n\u003C\u002Fscript\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv data-ui-include=\"chip_example_result\" data-ui-options=\"main.options.component_no_css\"\u003E\u003C\u002Fdiv\u003E\n\n\u003Ca id=\"Getting-Started__Behaviors\"\u003E\u003C\u002Fa\u003E\n##### Behaviors\n\nTo describe how a view\nwill behave upon certain events, like on user interaction events,\na *behavior handler* is used.\nA behavior handler is a function that maps events of a view, to\na visible feedback reaction.\nFor example a view could animate if clicked.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E Implmenting behavior handler\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"4,22\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv layout=\"row center-left\"\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n     data-id=\"2\" data-bind-model=\"chip_adapter\"\n     data-ui-options=\"chip_view_options\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\nchip_view_behavior = {\n    'mouseover': function () {\n        this.css('cursor', 'pointer');\n    },\n    'mouseout': function () {\n        this.css('cursor', 'default')\n            .find('img')\n            .animateCss('swing');\n    },\n    'click': function() {\n        this.animateCss('pulse')\n            .find('img')\n            .animateCss('bounce');\n    }\n};\nchip_view_options = {\n    css: false,\n    behavior: chip_view_behavior\n}\n\u003C\u002Fscript\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nSee the next example for the result.\n\n##### Events\n\nIn a similar way to [Behaviors](#Getting-Started__Behaviors), a event\nhandler can be implemented to map events of a view to the expected action.\nFor example by clicking a button, a link will open.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE - \u003C\u002Fstrong\u003E Implmenting both behavior handler and event handler\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"24\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv layout=\"row center-left\"\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n     data-id=\"2\" data-bind-model=\"chip_adapter\"\n     data-ui-options=\"chip_view_options\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\nchip_view_behavior = {\n    'mouseover': function () {\n        this.css('cursor', 'pointer');\n    },\n    'mouseout': function () {\n        this.css('cursor', 'default')\n            .find('img')\n            .animateCss('swing');\n    },\n    'click': function() {\n        this.animateCss('pulse')\n            .find('img')\n            .animateCss('bounce');\n    }\n};\nchip_view_options = {\n    behavior: chip_view_behavior,\n    on: { \u002F\u002F inline events mapping\n        'click': function() {\n            window.open('https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix')\n        }\n    }\n}\n\u003C\u002Fscript\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\n\u003Cdiv layout=\"row center-left\" class=\"content-padding\"\u003E\n\u003Cdiv data-ui-include=\"inline\u002Fcommon\u002Fcontact_chip\"\n     data-id=\"2\" data-bind-model=\"chip_adapter\"\n     data-ui-options=\"chip_view_options\"\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\n\u002F\u002F items list\n\u002F** @type {EventMapping} *\u002F\nvar chip_view_behavior = {\n\n    'view:create': \u002F** @type {EventCallback} *\u002F function () {\n        this.find('img')\n            .animateCss('bounce', { delay: '1s' });\n    },\n    'mouseover': function () {\n        this.css('cursor', 'pointer');\n    },\n    'mouseout': function () {\n        this.css('cursor', 'default')\n            .find('img')\n            .animateCss('swing');\n    },\n    'test': function () {\n\n    },\n    'click': function() {\n        this.animateCss('pulse')\n            .find('img')\n            .animateCss('bounce');\n    }\n};\n\u002F** @type {ContextOptions} *\u002F\nvar chip_view_options = {\n    css: false,\n    behavior: chip_view_behavior,\n    on: {\n        'click': function() {\n            setTimeout(function(){\n                window.open('https:\u002F\u002Fgithub.com\u002Fgenielabs\u002Fzuix')\n            }, 1000);\n        }\n    }\n};\n\u003C\u002Fscript\u003E\n\n\u003Cdiv data-ui-include=\"content\u002Fquick_start\u002Fcomponent_management\"\n     data-ui-options=\"main.options.content_no_css\"\n     class=\"progressive-content-container\"\n     data-ui-lazyload=\"false\"\u003E\n\n\u003Cdiv class=\"content-loader\"\u003E\n    \u003Cdiv class=\"mdl-spinner mdl-js-spinner is-active\"\u003E\u003C\u002Fdiv\u003E\n    \u003Cp\u003E\u003Csmall\u003ELoading \u003Cem\u003E'Component Management'\u003C\u002Fem\u003E...\u003C\u002Fsmall\u003E\u003C\u002Fp\u003E\n\u003C\u002Fdiv\u003E\n\n\u003C\u002Fdiv\u003E\n"},{"componentId":"content\u002Fquick_start\u002Fcomponent_management","controller":function (){},"view":"\u003Ca id=\"Getting_Started--Component_Management\"\u003E\u003C\u002Fa\u003E\n#### Component Management \u003Ci class=\"material-icons mdl-color-text--grey-500\"\u003Eextension\u003C\u002Fi\u003E\n\nException made for handling of standard events and behaviors,\na [view template](#Getting_Started--View_Templates) cannot implement a more complex UI logic.\n\nThis is where *components* are being used. In addition to all the features of\na view template, a component has a piece of *JavaScript* code associated\nto it and can so control any element in its view and implement\nany kind of UI functionality.\n\nThis piece of JavaScript code is the **Controller** (or *Presenter*)\nof the component and it consist of a function handler with two\ninterface methods: **create** and **destroy**, that are obviously\ncalled respectively at the start and the end of the component\nlife-cycle.\n\nTo declare a component controller the ```zuix.controller(...)``` method is\nused. This will be described in next paragraph.\n\n##### Loading a component\n\nIn place of `data-ui-include` attribute, to load a component, the ```data-ui-load```\nattribute is used. The value of this attribute is the *component identifier*.\nAlso a ```data-ui-options``` attribute may be provided as for all other options\u002Ffeatures\nalready described for ```data-ui-include``` in [content loading](#Getting_Started--Content_Loading),\nsuch as *lazy loading* and *data binding*.\n\nFor example, consider the following \"Summary Card\" component, which\nshows a title, a summary text, a button to share and a button to open\nthe full article.\n\nThe component will consist of a view template and a controller.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE\u003C\u002Fstrong\u003E Declaration of view template for the component ```site\u002Fcomponents\u002Fsummary_card```\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"3,5,10,14\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003Cdiv data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\" class=\"mdl-card mdl-shadow--2dp\"\u003E\n    \u003Cdiv class=\"mdl-card__title\"\u003E\n        \u003Ch2 data-ui-field=\"title\" class=\"mdl-card__title-text\"\u003ETitle\u003C\u002Fh2\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"summary\" class=\"mdl-card__supporting-text\"\u003E\n        Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n        Mauris sagittis pellentesque lacus eleifend lacinia...\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv class=\"mdl-card__actions\"\u003E\n        \u003Ca data-ui-field=\"button-share\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\"\u003E\n            \u003Ci class=\"material-icons\"\u003Eshare\u003C\u002Fi\u003E\n            Share\n        \u003C\u002Fa\u003E\n        \u003Ca data-ui-field=\"button-read\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\"\u003E\n            \u003Ci class=\"material-icons\"\u003Eopen_in_new\u003C\u002Fi\u003E\n            Read\n        \u003C\u002Fa\u003E\n    \u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003EPREVIEW\u003C\u002Fstrong\u003E Preview of view template ```site\u002Fcomponents\u002Fsummary_card```\u003C\u002Fsmall\u003E\n\u003Cdiv data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\" class=\"mdl-card mdl-shadow--2dp\"\u003E\n\u003Cdiv class=\"mdl-card__title\"\u003E\n\u003Ch2 data-ui-field=\"title\" class=\"mdl-card__title-text\"\u003ETitle\u003C\u002Fh2\u003E\n\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-field=\"summary\" layout=\"column spread-stretch\" class=\"mdl-card__supporting-text\"\u003E\nLorem ipsum dolor sit amet, consectetur adipiscing elit.\nMauris sagittis pellentesque lacus eleifend lacinia...\n\u003C\u002Fdiv\u003E\n\u003Cdiv class=\"mdl-card__actions\" align=\"right\"\u003E\n\u003Ca data-ui-field=\"button-share\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\"\u003E\n    \u003Ci class=\"material-icons\"\u003Eshare\u003C\u002Fi\u003E\n    Share\n\u003C\u002Fa\u003E\n\u003Ca data-ui-field=\"button-read\" class=\"mdl-button mdl-js-button mdl-js-ripple-effect\"\u003E\n    \u003Ci class=\"material-icons\"\u003Eopen_in_new\u003C\u002Fi\u003E\n    Read\n\u003C\u002Fa\u003E\n\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cstyle\u003E\n    .mdl-card[data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\"]\n    { width: 300px; }\n    [data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\"]\n    .mdl-card__title {\n        font-size: 24px;\n        color: black;\n        height: 96px;\n        background: #C8E6C9 center \u002F cover;\n    }\n    [data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\"]\n    .mdl-card__title h2 {\n        font-weight: 700;\n        -webkit-text-stroke: 1pt rgba(255,255,255,0.6);\n    }\n    [data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\"]\n    .mdl-card__supporting-text {\n        width: 100%;\n    }\n    [data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\"]\n    .mdl-card__supporting-text {\n        height: 108px;\n        overflow-y: auto;\n    }\n    [data-ui-view=\"site\u002Fcomponents\u002Fsummary_card\"]\n    .mdl-card__menu {\n        color: #fff;\n    }\n\u003C\u002Fstyle\u003E\n\u003Cscript\u003E\nzuix.controller(function(cp) {\n\n    cp.create = function() {\n        cp.field('button-read').on('click', 'item:read');\n        cp.field('button-share').on('click', 'item:share');\n    };\n\n}).for('site\u002Fcomponents\u002Fsummary_card');\n\u003C\u002Fscript\u003E\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\nThe view template declaration can be either placed in the same document (in-line) or\nin files (```site\u002Fcomponents\u002Fsummary_card.html``` - ```site\u002Fcomponents\u002Fsummary_card.css```),\nin which case the ```data-ui-view``` attribute can be omitted.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE\u003C\u002Fstrong\u003E Controller for the component ```site\u002Fcomponents\u002Fsummary_card```\u003C\u002Fsmall\u003E\n\u003Cpre\u003E\u003Ccode\u003E\nzuix.controller(function(cp) {\n\n    cp.create = function() {\n        \u002F\u002F UI event handlers\n        cp.field('button-read').on('click', 'item:read');\n        cp.field('button-share').on('click', 'item:share');\n    };\n\n}).for('site\u002Fcomponents\u002Fsummary_card');\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nAlso the controller declaration can be placed in the same document or\nin its own file (```site\u002Fcomponents\u002Fsummary_card.js```),\nin which case the instruction ```.for('site\u002Fcomponents\u002Fsummary_card')``` can be omitted.\n\nTo actually create an instance of the component, the ```data-ui-load``` attribute is used.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE\u003C\u002Fstrong\u003E Loading two instances of the component ```site\u002Fcomponents\u002Fsummary_card```\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"2,8\"\u003E\u003Ccode class=\"language-html\"\u003E\n\u003C!-- Card 1 --\u003E\n\u003Cdiv data-ui-load=\"site\u002Fcomponents\u002Fsummary_card\" data-id=\"0\"\n     data-ui-options=\"example_card_options\"\u003E\n    \u003Cdiv data-ui-field=\"title\"\u003EIntroduction to JavaScript\u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"summary\"\u003EThis updated and expanded second edition ...\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003C!-- Card 2 --\u003E\n\u003Cdiv data-ui-load=\"site\u002Fcomponents\u002Fsummary_card\" data-id=\"1\"\n     data-ui-options=\"example_card_options\"\u003E\n    \u003Cdiv data-ui-field=\"title\"\u003ERecipes 1-2-3\u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"summary\"\u003EAn ingenious repertoire of dishes that..\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\u003Cscript\u003E\nexample_card_options = {\n    on: {\n        'item:read': function () {\n            var id = this.getAttribute('data-id');\n            \u002F\u002F TODO: open_the_content(id);\n        },\n        'item:share': function () {\n            var id = this.getAttribute('data-id');\n            \u002F\u002F TODO: open_share_dialog(id)\n        }\n    },\n    behavior: {\n        'item:read': function () { \u002F*...*\u002F },\n        'item:share': function () { \u002F*...*\u002F }\n    }\n};\n\u003C\u002Fscript\u003E\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\n\u003Csmall\u003E\u003Cstrong\u003ERESULT\u003C\u002Fstrong\u003E\u003C\u002Fsmall\u003E\n\u003Cdiv layout=\"rows center-spread\"\u003E\n\n\u003Cdiv data-ui-load=\"site\u002Fcomponents\u002Fsummary_card\"\n data-ui-options=\"example_card_1_options\"\n class=\"example_card_1\"\u003E\n\u003Cdiv data-ui-field=\"title\"\u003EIntroduction to JavaScript\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-field=\"summary\"\u003EThis updated and expanded second edition of the 'Introduction to JavaScript' provides a user-friendly introduction to the subject.\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\n\u003Cstyle\u003E\n.example_card_1 .mdl-card__title {\n    background: url('site\u002Fimages\u002Fcover_javascript.jpg') center \u002F cover;\n}\n\u003C\u002Fstyle\u003E\n\n\u003Cscript\u003E\nexample_card_show_delay = 0.1;\n\u002F** @type {ContextOptions} *\u002F\nexample_card_1_options = {\n    css: false,\n    on: {\n        'view:create': animation_reveal,\n        'item:read': function () {\n            \u002F\u002F TODO:... open the popup with content\n            var card = this.children().eq(0)\n                .addClass('mdl-shadow--8dp');\n            this.animateCss('pulse', { duration: '0.2s' }, function () {\n                    card.removeClass('mdl-shadow--8dp')\n                });\n            \u002F*var i = 1, blocks = this.children().eq(0).children();\n            blocks.each(function () {\n                this.animateCss('pulse', { delay: ((i\u002F15))+'s', duration: '0.15ds' });\n                i++;\n            });*\u002F\n        },\n        'item:share': function () {\n            this.animateCss('flipOutY', function () {\n                \u002F\u002Fthis.visibility('hidden');\n                animation_reveal.call(this);\n            });\n        }\n    }\n};\nfunction animation_reveal () {\n    var card = this.children().eq(0)\n        .addClass('mdl-shadow--6dp');\n    this.animateCss('fadeInDown', { delay: '0.5s', duration: '0.3s' }, function () {\n        card.removeClass('mdl-shadow--6dp');\n    });\n    var blocks = this.children().eq(0).children();\n    blocks.each(function (i, item) {\n        this.animateCss('bounceInDown', { delay: 0.4+(i\u002F5)+'s', duration: '0.3s' });\n    });\n}\n\u003C\u002Fscript\u003E\n\n\u003Cdiv data-ui-load=\"site\u002Fcomponents\u002Fsummary_card\"\n  data-ui-options=\"example_card_1_options\"\n  class=\"example_card_2\"\u003E\n\u003Cdiv data-ui-field=\"title\"\u003ERecipes 1-2-3\u003C\u002Fdiv\u003E\n\u003Cdiv data-ui-field=\"summary\"\u003EAn ingenious repertoire of dishes that use only three simple ingredients presents more than 250 delectable recipes.\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n\n\u003Cstyle\u003E\n.example_card_2 .mdl-card__title {\n    background: url('site\u002Fimages\u002Fcover_recipes.jpg') center \u002F cover;\n}\n\u003C\u002Fstyle\u003E\n\n\u003C\u002Fdiv\u003E\n\n\n\n\u003Cp\u003E&nbsp;\u003C\u002Fp\u003E\n\n\n##### The Controller\n\nWhen all elements of a component are loaded (html, css, js) the\ncontroller method ```create()``` is called.\nWhen otherwise a component is requestd to unload, the ```destroy()```\nmethod is called.\n\nThe following snippet shows the skelton of a controller declaration.\n\n\u003Csmall\u003E\u003Cstrong\u003EEXAMPLE\u003C\u002Fstrong\u003E Declaration of a generic controller for ```path\u002Fto\u002Fcomponent_name```\u003C\u002Fsmall\u003E\n\u003Cpre data-line=\"2\"\u003E\u003Ccode class=\"language-js\"\u003E\n\u002F\u002F Controller of component 'path\u002Fto\u002Fcomponent_name'\nzuix.controller(function(cp) {\n\n    cp.init = function() { \u002F* called before component is created and before applying options *\u002F };\n\n    cp.create = function() { \u002F* called after loading, when the component is created *\u002F };\n\n    cp.destroy = function() { \u002F* called when the component is destroyed *\u002F }\n\n}).for('path\u002Fto\u002Fcomponent_name');\n\u003C\u002Fcode\u003E\u003C\u002Fpre\u003E\n\nThe ```cp``` object passed to the controller handler\nis the controller instance itself and exposes\nthe following fields\u002Fmethods.\n\n###### Life-cycle handlers\n\n- ```cp.init = function() { ... }```\n\u003Cbr\u003Eoptional *handler* function that gets called after loading and before the component is created.\n\n- ```cp.create = function() { ... }```\n\u003Cbr\u003Eoptional *handler* function that gets called after loading, when the component is created.\n\n- ```cp.destroy = function() { ... }```\n\u003Cbr\u003E*optional *handler* function called when the component is destroyed\n\n###### Helper methods\n\n- ```cp.view([selector])```\n\u003Cbr\u002F\u003Eget the component's view or if a *selector* is specified, get\nthe view's elements matching the *selector* criteria.\nThe returned value is a *ZxQuery* object. To get the underlying\nDOM *Element* object, use  the *ZxQuery***.get()** method\n(eg. ```var el = cp.view().get();```).\n\n- ```cp.field(fieldName)```\n\u003Cbr\u002F\u003Eget the view's element with matching ```data-ui-field``` attribute.\nThe returned value is a *ZxQuery* object. To get the underlying\nDOM *Element* object, use  the *ZxQuery***.get()** method\n(eg. \u003Csmall\u003E```var el = cp.view().get();```\u003C\u002Fsmall\u003E).\n\n- ```cp.model([mode])```\n\u003Cbr\u002F\u003E\u003Cem\u003Eget\u002Fset the data model object.\u003C\u002Fem\u003E\n\n- ```cp.trigger(eventPath, eventValue)```\n\u003Cbr\u002F\u003E\u003Cem\u003Etrigger a component event.\u003C\u002Fem\u003E\n\n- ```cp.options([options])```\n\u003Cbr\u002F\u003E\u003Cem\u003Eget\u002Fset the component's options.\u003C\u002Fem\u003E\n\n- ```cp.expose(methodName, handler)```\n\u003Cbr\u002F\u003E\u003Cem\u003Eexpose a component's method.\u003C\u002Fem\u003E\n\n###### ZxQuery DOM helper class\n\n*ZxQuery* is a built-in class of *ZUIX* that implements a very\nlite subset of jQuery-like functionality. So, it can wrap elements\nin a DOM and provide useful methods for manipulating it.\n\nSome fields\u002Fparameters in *ZUIX* classes are exposed as *ZxQuery*\nobjects to facilitate common element's manipulation tasks.\n\nFor example the `cp.view()` method of a controller handler,\nused to get the *View* element of a component,\nwill return a *ZxQuery* object.\n\nTo access the DOM Element behind a *ZxQuery* object the method\n`.get()` is used.\n\n```\nvar el = cp.view().get();\nconsole.log( el.innerHTML )\n```\nSo the `.get()` method can be used to interoperate with\nother libraries and frameworks used in a project.\n\nFor a detailed description of available methods in a *ZxQuery*\nobject, see the **API** section.\n"},{"componentId":"ui\u002Fwidgets\u002Fzuix_hackbox\u002Flog_item","view":"\u003Cdiv layout=\"row top-spread\" class=\"log-row animated fadeIn\"\u003E\n    \u003Cdiv self=\"sm-hide size-x1\" class=\"\"\u003E\u003Ccode data-ui-field=\"target\"\u003Eui\u002Fwidgets\u002Fzuix_hackbox\u003C\u002Fcode\u003E\u003C\u002Fdiv\u003E\n    \u003Cdiv class=\"odd\"\u003E\u003Ccode data-ui-field=\"state\"\u003Ecomponent:loaded\u003C\u002Fcode\u003E\u003C\u002Fdiv\u003E\n    \u003Cdiv\u003E\u003Ccode data-ui-field=\"info\"\u003Ezuix-ctx-3\u003C\u002Fcode\u003E\u003C\u002Fdiv\u003E\n    \u003Cdiv data-ui-field=\"level\" class=\"level\"\u003EL\u003C\u002Fdiv\u003E\n    \u003Cdiv\u003E\u003Ccode data-ui-field=\"time\"\u003E14:04:03.788\u003C\u002Fcode\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E\n","css":".log-row {\n    color: white;\n    vertical-align: middle;\n    font-size:70%;\n    margin-bottom: 1px;\n}\n.log-row.linked {\n    cursor: pointer;\n    border-bottom: solid 1px rgba(255,255,255,0.2);\n}\n.log-row:hover {\n    background-color: rgba(150,150,150,0.4);\n}\n.log-row .level {\n    width: 30px;\n    text-align: right;\n    padding-right: 12px;\n    margin-left: 8px;\n}\n.log-row .odd {\n    color: yellow;\n}\n.log-row .level.error { background-color: rgba(255,0,0,0.5)}\n.log-row .level.warn { background-color: rgba(255,255,0,0.5)}\n.log-row .level.info { background-color: rgba(0,255,0,0.5)}\n.log-row .level.debug { background-color: rgba(100,50,250,0.5)}\n.log-row .level.trace { background-color: rgba(255,140,0,0.5)}\n\n.animated {\n    -moz-animation-duration: 0.3s;\n    -o-animation-duration: 0.3s;\n    -webkit-animation-duration: 0.3s;\n}","controller":function (logItem) {

    logItem.create = function () {
        var args = logItem.model().args;
        if (args[1] === 'component:loaded') {
            logItem.view().children().eq(0).addClass('linked');
            var sourceView = zuix.$(zuix.context(args[2]).view());
            logItem.view().on('mouseenter', function () {
                logItem.trigger('item:enter', sourceView);
            }).on('mouseleave', function () {
                logItem.trigger('item:leave', sourceView);
            }).on('click', function () {
                logItem.trigger('item:click', sourceView);
            });
        }
        logItem.update();
    };

    logItem.update = function () {
        var level = logItem.model().level;
        var args = logItem.model().args;
        var time = logItem.model().time;

        logItem.field('level')
            .addClass(level.toLowerCase())
            .html(level.substring(0, 1).toUpperCase());
        logItem.view().addClass(level.toLowerCase());

        logItem.field('target').html(args[0]);
        logItem.field('state').html(args[1] ? args[1] : '');
        logItem.field('info').html(args[2] ? args[2] : '');
        logItem.field('time').html(time);
    };

},"css_applied":true},{"componentId":"ui\u002Fwidgets\u002Fzuix_hackbox\u002Fbundle_item","view":"\u003Cdiv layout=\"row center-left\" class=\"row\"\u003E\n    \u003Cdiv self=\"size-x1\" layout=\"column stretch-stretch\" class=\"animated fadeIn\"\u003E\n        \u003Cdiv data-ui-field=\"componentId\" self=\"size-x1\" class=\"title\"\u003E\u003C\u002Fdiv\u003E\n        \u003Csmall data-ui-field=\"resources\"\u003E\u003C\u002Fsmall\u003E\n    \u003C\u002Fdiv\u003E\n    \u003Cdiv\u003E\u003Csmall data-ui-field=\"instances\"\u003E\u003C\u002Fsmall\u003E\u003C\u002Fdiv\u003E\n\u003C\u002Fdiv\u003E","css":".row {\n    line-height: 120%;\n    cursor: pointer;\n    padding:4px;\n    border-bottom: solid 1px rgba(0,0,0,0.1);\n}\n.zuix-hackbox {\n    opacity: 0.3;\n}\n.row:hover {\n    background-color: rgba(0,0,0,0.1);\n    border-bottom: solid 1px rgba(255,255,255,0.1);\n}\n.row div {\n    margin:0;\n    padding-right: 8px;\n}\n.title {\n    font-size: 105%;\n    font-weight: 600;\n}\n\n.animated {\n    -moz-animation-duration: 0.3s;\n    -o-animation-duration: 0.3s;\n    -webkit-animation-duration: 0.3s;\n}","controller":function (cp) {

    var instances = 0, resources = ' ';

    cp.create = function () {
        cp.view().on('click', function () {
           cp.trigger('item:click', cp.model());
        });
        cp.expose('count', function () {
            return instances;
        });
        var isHackBox = cp.model().componentId.indexOf('/zuix_hackbox') > 0;
        if (isHackBox)
            this.view().children().eq(0).addClass('zuix-hackbox');
        // populate fixed fields
        var c = cp.model();
        cp.field('componentId').html(c.componentId);
        if (c.controller != null && c.controller.toString().length > 30)
            resources += 'js ';
        if (c.view != null)
            resources += 'html ';
        if (c.css != null)
            resources += 'css ';
        cp.field('resources').html(resources);
        // display variable data
        cp.update();
        // expose public interface members
        cp.expose({
            'instanceCount': countInstances,
            'hasResource': hasResource,
            'isHackBox': function () {
                return isHackBox;
            }
        });
    };

    cp.update = function () {
        instances = countInstances();
        cp.field('instances').html(instances);
        cp.trigger('item:update');
    };

    function countInstances() {
        var components = zuix.dumpContexts(),
            count = 0;
        for(var i = 0; i < components.length; i++)
            if (components[i].componentId == cp.model().componentId)
                count++;
        return count;
    }

    function hasResource(resourceType) {
        return (resources.indexOf(' '+resourceType+' ') >= 0);
    }

},"css_applied":true}]);