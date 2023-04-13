---
layout: side_drawer.liquid
tags: api
options: mdl highlight
icon: construction
title: "zuix.js <i class='material-icons'>emoji_nature</i> API"
description: "zUIx.js API documentation, Class: Zuix"
keywords:
- Documentation
- API
---

<style>
/* BEGIN: MARKDOWN JSDOC */
main .content {
    padding-top: 24px;
}
main h2 code {
    font-weight: 400;
}
main h2 {
    margin-top: 0;
    font-size: 220%;
}
main h3 {
    margin-top: 72px;
    font-size: 200%;
    color: #525252;
}
main h4 {
    margin-top: 72px;
    margin-bottom: 0;
    font-size: 180%;
    font-weight: 500;
    color: #16641c;
}
main h5 {
    color: #7c3422;
    text-transform: uppercase;
    font-size: 100%;
    font-weight: bold;
}
main h6 {
    font-size: 220%;
}
main p {
    margin-top: 12px !important;
}
main em {
    font-family: monospace;
    font-size: 95%;
}
main table {
    border: solid 1px lightgray;
}
main table td {
    border: 1px solid whitesmoke;
    padding: 6px;
    margin: 0;
    vertical-align: top;
}
main table code {
    color: #8d5802;
}
/* END: MARKDOWN JSDOC */
</style>

## `Zuix` class

### Constructor

<a name="Zuix"></a>
#### new Zuix() &rarr; {[Zuix](../../zuix/Zuix)}

Allocates a new instance of *zuix.js*, JavaScript library for
 component-based development.
 A *zuix.js* instance is automatically allocated on page load,
 and always available in the global scope as `zuix`.

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 188](../../zuix/Zuix.js#L188)

-->

##### Returns

*[Zuix](../../zuix/Zuix)*

### Properties

<a name="$"></a>
#### $ &rarr; *[ZxQueryStatic](../../helpers/ZxQueryStatic)*

Helper function for manipulating the DOM.

### Methods

<a name="activeRefresh"></a>
#### activeRefresh($view, $element, contextData, refreshCallback) &rarr; {[ActiveRefresh](../../zuix/ActiveRefresh)}

Active-Refresh factory method.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`$view`|*[ZxQuery](../../helpers/ZxQuery)*|The component's view|
|`$element`|*[ZxQuery](../../helpers/ZxQuery)*|The target element|
|`contextData`|*object*|Custom data that ca be passed from call to call|
|`refreshCallback`|*[ActiveRefreshHandler](#ActiveRefreshHandler)*|The refresh handler function|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1844](../../zuix/Zuix.js#L1844)

-->

##### Returns

*[ActiveRefresh](../../zuix/ActiveRefresh)*
 &dash; The ActiveRefresh object. Invoke the `start()` method on the returned object, to actually activate the refresh handler.

<a name="bundle"></a>
#### bundle(bundleData, callback) &rarr; {[Zuix](../../zuix/Zuix)|Array.&lt;<a href="#BundleItem">BundleItem</a>>}

Gets/Sets the application's data bundle (all components and scripts used in the page packed into a single object).

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`bundleData`|*!Array.&lt;<a href="#BundleItem">BundleItem</a>>* \| *true*|*optional*  |A bundle object holding in memory all components' data (cache)|
|`callback`|*function*|*optional*  |Called once the bundle compilation ends. Works if *bundleData* is *true*|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1854](../../zuix/Zuix.js#L1854)

-->

##### Returns

*[Zuix](../../zuix/Zuix)* \| *Array.&lt;<a href="#BundleItem">BundleItem</a>>*

<a name="componentize"></a>
#### componentize(element) &rarr; {[Zuix](../../zuix/Zuix)}

Searches the document, or inside the given `element`,
for elements with `z-load` attribute, and loads the
requested components.
Is also possible to disable/enable the componentizer
by passing a boolean value as argument.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`element`|*Element* \| *[ZxQuery](../../helpers/ZxQuery)* \| *boolean*|*optional*  |Container to use as starting element for the search (**default:** *document*)|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1787](../../zuix/Zuix.js#L1787)

-->

##### Returns

*[Zuix](../../zuix/Zuix)*
 &dash; The `{Zuix}` object itself.

##### Example

```js
 zuix.componentize(document);
 // Globally disable the componentizer
 zuix.compenentize(false);
 // Re-enable the componentizer
 zuix.compenentize(true);
 ```

<a name="context"></a>
#### context(contextId, callback) &rarr; {[ComponentContext](../../zuix/ComponentContext)}

Gets a `ComponentContext` object, given its `contextId` or its host element.
The `contextId` is the one specified in the `ContextOptions` object or by using the `z-context` attribute on the host element.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`contextId`|*Element* \| *[ZxQuery](../../helpers/ZxQuery)* \| *string*|  |The `contextId` or the component's host element.|
|`callback`|*[ContextReadyCallback](#ContextReadyCallback)*|*optional*  |The callback function that will pass the component's context object once loaded and ready.|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1529](../../zuix/Zuix.js#L1529)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)*
 &dash; The matching component's context or `null` if the context does not exist or not yet loaded.

##### Example

```html
<div z-load="site/components/slideshow"
     z-context="my-slide-show">...</div>
```
```js
slideShow = null;
zuix.context('my-slide-show', function(ctx) {
  slideShow = ctx;
  // call component's methods
  slideShow.setSlide(1);
});
```

<a name="controller"></a>
#### controller(handler, options) &rarr; {[ContextControllerHandler](#ContextControllerHandler)}

Allocates a component's controller handler. The provided `handler` function will
be called to initialize the component's controller instance once the component
has been loaded.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`handler`|*[ContextControllerHandler](#ContextControllerHandler)* \| *string*|  |Function called to initialize the component controller that will be passed as argument of this function|
|`options`|*Object* \| *Object*|*optional*  |Optional controller options / callback|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1498](../../zuix/Zuix.js#L1498)

-->

##### Returns

*[ContextControllerHandler](#ContextControllerHandler)*
 &dash; The allocated controller handler.

##### Example

```js
// Allocates and assign a controller for
// the component 'path/to/component_name'
ctrl = zuix.controller(function(cp) {
  // `cp` is the {ContextController}
  // TODO: inline code of controller follows...
}).for('path/to/component_name');
```

<a name="dumpCache"></a>
#### dumpCache() &rarr; {Array.&lt;<a href="#ComponentCache">ComponentCache</a>>}

Dumps content of the components cache. Mainly for debugging purpose.

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1913](../../zuix/Zuix.js#L1913)

-->

##### Returns

*Array.&lt;<a href="#ComponentCache">ComponentCache</a>>*

<a name="dumpContexts"></a>
#### dumpContexts() &rarr; {Array.&lt;<a href="../../zuix/ComponentContext">ComponentContext</a>>}

Dumps allocated component's contexts. Mainly for debugging purpose.

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1918](../../zuix/Zuix.js#L1918)

-->

##### Returns

*Array.&lt;<a href="../../zuix/ComponentContext">ComponentContext</a>>*

<a name="field"></a>
#### field(fieldName, container, context) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Search the document or inside the given `container` for elements
with `z-field` attribute matching the provided `fieldName`.
This method implements a caching mechanism and automatic
disposal of allocated objects and events.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`fieldName`|*string*|  |Value of *z-field* to look for|
|`container`|*Element*|*optional*  |Starting DOM element for this search (**default:** *document*)|
|`context`|*object*|*optional*  |The context|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1353](../../zuix/Zuix.js#L1353)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; ZxQuery object with elements matching the given `z-field` attribute.
If there's just one matching element, then the returned object will also have the additional method `field(fieldName)`
to search for fields inside the element itself.

##### Example

```html
<div z-field="sample-container">
   <!-- HTML -->
</div>
<script>
container = zuix.field('sample-container');
container.html('Hello World!');
</script>
```

<a name="getResourcePath"></a>
#### getResourcePath(path) &rarr; {string}

Gets the path of a loadable resource.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`path`|*string*|Loadable resource *id*|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1825](../../zuix/Zuix.js#L1825)

-->

##### Returns

*string*
 &dash; The resource's path.

<a name="hook"></a>
#### hook(eventPath, eventHandler) &rarr; {[Zuix](../../zuix/Zuix)}

Sets a callback for a global event.
There can be only one callback for each kind of global event.
Pass null as `eventHandler` to unset a previously set callback.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`eventPath`|*string*|  |The event path|
|`eventHandler`|*function* \| *undefined*|*optional*  |The handler function|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1615](../../zuix/Zuix.js#L1615)

-->

##### Returns

*[Zuix](../../zuix/Zuix)*
 &dash; The `{Zuix}` object itself.

##### Example

```js
// The context `this` in the event handlers will be
// the {ComponentContext} object that sourced the event.
// The `data` parameter passed to the handlers, is of
// variant type, depending on the type of the occurring event.
zuix.hook('load:begin', function(data) {

  loaderMessage.html('Loading "' + data.task + '" ...');
  loaderMessage.show();

}).hook('load:next', function(data) {

  loaderMessage.html('"' + data.task + '" done, loading next..');

}).hook('load:end', function() {

  loaderMessage.hide();

}).hook('html:parse', function(data) {
  // Process HTML content before it's attached to the DOM

  if (this.options().markdown === true && typeof showdown !== 'undefined') {
    // ShowDown - MarkDown syntax compiler
    let htmlMarkDown = data.content;
    htmlMarkDown = new showdown.Converter()
      .makeHtml(htmlMarkDown);
    // return the processed content
    data.content = htmlMarkDown;
  }

}).hook('css:parse', function(data) {
  // Process CSS content before it's attached to the DOM

  let css = data.content;
  // process css, eg. run a CSS pre-processor
  // eg. Sass, Less, ...
  css = run_pre_processor(css);
  // return the processed content
  data.content = css;

}).hook('view:process', function(view) {
  // The view DOM is now fully loaded and ready
  // `view` is of {ZxQuery} type

  // Prism code syntax highlighter
  view.find('code').each(function(i, block) {
    this.addClass('language-javascript');
    Prism.highlightElement(block);
  });

  // Force opening of all non-local links in a new window
  zuix.$('a[href*="://"]').attr('target', '_blank');

  // Material Design Light auto-detection
  // Call DOM upgrade on newly added view elements
  if (componentHandler)
    componentHandler.upgradeElements(view.get());

});
```

<a name="lazyLoad"></a>
#### lazyLoad(enable, threshold) &rarr; {[Zuix](../../zuix/Zuix)|boolean}

Enables/Disables lazy-loading or gets the current setting.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`enable`|*boolean*|*optional*  |Enable or disable lazy loading.|
|`threshold`|*number*|*optional*  |Load-ahead threshold in pixels. When < 0, elements will be loaded before entering the viewport for the given amount of pixels. Positive values will delay loading of element until the entered the viewport for at least the given number of pixels.|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1760](../../zuix/Zuix.js#L1760)

-->

##### Returns

*[Zuix](../../zuix/Zuix)* \| *boolean*
 &dash; *true* if lazy-loading is enabled, *false* otherwise.

<a name="load"></a>
#### load(componentId, options) &rarr; {[ComponentContext](../../zuix/ComponentContext)}

Loads a component.
This is the programmatic equivalent of `z-load`
attribute used to load components from HTML.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`componentId`|*string*|  |The identifier name of the component to be loaded|
|`options`|*[ContextOptions](#ContextOptions)*|*optional*  |Options used to initialize the loaded component|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1403](../../zuix/Zuix.js#L1403)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)*
 &dash; The component context.

##### Example

```html
 <!--
 The controller will be loaded on the following host element:
 -->
<div #sample-view></div>

<script>
// Get the host element
const view = zuix.field('sample-view');

// Declares inline controller for 'my/example/component'
const exampleController = zuix.controller((cp) => {
  cp.create = onCreate;

  function onCreate() {
    // Sets the initial content of the view
    cp.view().html('Hello World!');
    // Exposes the private `testMethod`
    // as the public method `test`
    cp.expose('test', testMethod);
  }

  function testMethod() {
    cp.log.i("Method exposing test");
    cp.view().html('A simple test.');
  }
}).for('my/example/component');

// loads the controller
zuix.load('my/example/component', { view, ready: (ctx) => {
  // call the public method `test` after 1 second
  setTimeout(ctx.test, 1000);
}});
</script>
```

<a name="loadComponent"></a>
#### loadComponent(elements, componentId, type, options) &rarr; {[Zuix](../../zuix/Zuix)}

Loads a component, given the target host element(s).
If the target is already a component, it will be
unloaded and replaced by the new one.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`elements`|*[ZxQuery](../../helpers/ZxQuery)* \| *Element*|  |The target host element(s) or component context(s)|
|`componentId`|*string* \| *object*|  |The id of the component to load (path/component_name)|
|`type`|*'view'* \| *'ctrl'* \| *undefined*|*optional*  |The component type|
|`options`|*[ContextOptions](#ContextOptions)* \| *undefined*|*optional*  |The component options|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1475](../../zuix/Zuix.js#L1475)

-->

##### Returns

*[Zuix](../../zuix/Zuix)*
 &dash; The `{Zuix}` object itself.

##### Example

```html
<div layout="rows center-spread">

  <div class="card-component">
    <div z-field="title">Card 1</div>
  </div>

  <div class="card-component">
    <div z-field="title">Card 2</div>
  </div>

</div>
<style>
.card-component {
  margin: 8px;
  max-width: 360px;
}
</style>
<script>
  const elements = zuix.$.find('.card-component');
  zuix.loadComponent(elements, 'templates/mdl_card', 'view');
</script>
```
<div layout="rows center-spread">
  <div class="card-component">
    <div z-field="title">Card 1</div>
  </div>
  <div class="card-component">
    <div z-field="title">Card 2</div>
  </div>
</div>
<style>
.card-component {
  margin: 8px;
  max-width: 360px;
}
</style>
<script>
  const elements = zuix.$.find('.card-component');
  zuix.loadComponent(elements, 'templates/mdl_card', 'view');
</script>

<a name="observable"></a>
#### observable(obj) &rarr; {[ObservableObject](../../observable/ObservableObject)}

Gets an observable instance of the given object. Based on
the browser's built-in [Proxy](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy?retiredLocale=it) object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`obj`|*object*|Object to observe|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1833](../../zuix/Zuix.js#L1833)

-->

##### Returns

*[ObservableObject](../../observable/ObservableObject)*
 &dash; The observable object.

<a name="runScriptlet"></a>
#### runScriptlet(scriptCode, $el, $view, data) &rarr; {object|undefined}

// TODO: document method

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`scriptCode`|*string*|  |Scriptlet Js code|
|`$el`|*[ZxQuery](../../helpers/ZxQuery)*|  |Target ZxQuery-wrapped element|
|`$view`|*[ZxQuery](../../helpers/ZxQuery)*|  |Component's view (ZxQuery)|
|`data`|*object* \| *undefined*|*optional*  |Custom data|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1954](../../zuix/Zuix.js#L1954)

-->

##### Returns

*object* \| *undefined*

<a name="setComponentCache"></a>
#### setComponentCache()

Sets components cache.

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1908](../../zuix/Zuix.js#L1908)

-->

##### Returns

 &dash; void

<a name="store"></a>
#### store(name, value) &rarr; {object}

Gets/Sets a global store entry.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`name`|*string*|  |Entry name|
|`value`|*object*|*optional*  |Entry value|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1813](../../zuix/Zuix.js#L1813)

-->

##### Returns

*object*

##### Example

```js
 // stores *myObjectData* in the store entry named *my-data*
 zuix.store('my-data', myObjectData);
 // gets data from the store entry named *my-data*
 const data = zuix.store('my-data');
 ```

<a name="trigger"></a>
#### trigger(context, eventPath, eventData) &rarr; {[Zuix](../../zuix/Zuix)}

Triggers the event specified by `eventPath`.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`context`|*object*|  |The context object (*this*) passed to handler functions listening for this event|
|`eventPath`|*string*|  |The path of the event to fire|
|`eventData`|*object*|*optional*  |The data object of the event|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1540](../../zuix/Zuix.js#L1540)

-->

##### Returns

*[Zuix](../../zuix/Zuix)*
 &dash; The `{Zuix}` object itself.

<a name="unload"></a>
#### unload(context) &rarr; {[Zuix](../../zuix/Zuix)}

Unloads the given component context(s) releasing all allocated resources.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`context`|*[ComponentContext](../../zuix/ComponentContext)* \| *[ZxQuery](../../helpers/ZxQuery)* \| *Element*|The instance of the component to be unloaded, a *ZxQuery* selection, or the component's host element|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1417](../../zuix/Zuix.js#L1417)

-->

##### Returns

*[Zuix](../../zuix/Zuix)*
 &dash; The `{Zuix}` object itself.

##### Example

```js
zuix.unload(ctx);
```

<a name="using"></a>
#### using(resourceType, resourcePath, callback, ctx) &rarr; {[Zuix](../../zuix/Zuix)}

Loads a CSS, script or singleton component. Resources loaded
through this method are available in the global scope and can also be
included in the application bundle.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`resourceType`|*string*|  |Either *'style'*, *'script'* or *'component'*|
|`resourcePath`|*string*|  |Relative or absolute resource url path|
|`callback`|*[ResourceUsingCallback](#ResourceUsingCallback)*|*optional*  |Callback function to call once resource is loaded|
|`ctx`|*[ComponentContext](../../zuix/ComponentContext)*|*optional*  |The target context.|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 1637](../../zuix/Zuix.js#L1637)

-->

##### Returns

*[Zuix](../../zuix/Zuix)*
 &dash; The `{Zuix}` object itself.

##### Example

```js
zuix.using('script', 'https://some.cdn.js/moment.min.js', function(){
  // can start using moment.js
});
```

### Type Definitions

<a name="ActiveRefreshCallback"></a>
#### ActiveRefreshCallback(data, refreshMs, forceActive)

The callback for setting data and delay of next refresh request.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`data`|*object*|*optional*  |Data to be passed to next refresh call|
|`refreshMs`|*number*|*optional*  |Delay in milliseconds before the next refresh call|
|`forceActive`|*boolean* \| *undefined*|*optional*  |Ignore visibility, schedule anyway|

<!--

*Source:*
[zuix/ActiveRefresh.js](../../zuix/ActiveRefresh.js), [line 41](../../zuix/ActiveRefresh.js#L41)

-->

<a name="ActiveRefreshHandler"></a>
#### ActiveRefreshHandler($view, $element, data, nextCallback, attributeName)

The Active-Refresh function that will be called for each refresh request.

##### This
- {HTMLElement}

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`$view`|*[ZxQuery](../../helpers/ZxQuery)*|  |The component's view|
|`$element`|*[ZxQuery](../../helpers/ZxQuery)*|  |The target element as *ZxQuery* object|
|`data`|*object*|  |Custom data that ca be passed from call to call|
|`nextCallback`|*[ActiveRefreshCallback](#ActiveRefreshCallback)*|  |Callback for scheduling the next refresh call|
|`attributeName`|*string*|*optional*  |Source attribute name if it's a '@' handler|

<!--

*Source:*
[zuix/ActiveRefresh.js](../../zuix/ActiveRefresh.js), [line 29](../../zuix/ActiveRefresh.js#L29)

-->

<a name="BindingAdapterCallback"></a>
#### BindingAdapterCallback($element, fieldName, $view, refreshCallback)

Binding adapter callback.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`$element`|*[ZxQuery](../../helpers/ZxQuery)*|  |The view's element bound to the data model's *fieldName*|
|`fieldName`|*string*|  |The element's bound field name|
|`$view`|*[ZxQuery](../../helpers/ZxQuery)*|  |The view|
|`refreshCallback`|*[BindingAdapterRefreshCallback](#BindingAdapterRefreshCallback)*|*optional*  |Refresh loop callback|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 65](../../zuix/ComponentContext.js#L65)

-->

<a name="BindingAdapterRefreshCallback"></a>
#### BindingAdapterRefreshCallback(refreshMs)

Binding adapter refresh callback

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`refreshMs`|*number*|*optional*  |Milliseconds to wait before refresh (**default**: *500ms*)|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 75](../../zuix/ComponentContext.js#L75)

-->

<a name="BundleItem"></a>
#### BundleItem

Bundle item object.

##### Properties

|Name|Type|Description|
|----|----|-----------|
|`view`|*Element*||
|`css`|*string*||
|`controller`|*[ContextControllerHandler](#ContextControllerHandler)*||

<!--

*Source:*
[zuix/ComponentCache.js](../../zuix/ComponentCache.js), [line 39](../../zuix/ComponentCache.js#L39)

-->

<a name="ComponentCache"></a>
#### ComponentCache

Component cache object.

##### Properties

|Name|Type|Description|
|----|----|-----------|
|`componentId`|*string*|The id of the cached component.|
|`view`|*Element*|The view element.|
|`css`|*string*|The CSS style text.|
|`css_applied`|*boolean*|Whether the CSS style has been applied to the view or not.|
|`controller`|*[ContextControllerHandler](#ContextControllerHandler)*|The controller handler function.|
|`using`|*string*|The url/path if this is a resource loaded with `zuix.using(..)` method.|

<!--

*Source:*
[zuix/ComponentCache.js](../../zuix/ComponentCache.js), [line 27](../../zuix/ComponentCache.js#L27)

-->

<a name="ContextControllerCreateCallback"></a>
#### ContextControllerCreateCallback()

Function that gets called after loading, when the component is actually created and ready.

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 53](../../zuix/ContextController.js#L53)

-->

<a name="ContextControllerDisposeCallback"></a>
#### ContextControllerDisposeCallback()

Function called when the component is about to be disposed.

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 59](../../zuix/ContextController.js#L59)

-->

<a name="ContextControllerHandler"></a>
#### ContextControllerHandler(cp)

This function is called after the component is loaded
and it is used to initialize its controller.

##### This
- {<a href="../../zuix/ContextController">ContextController</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`cp`|*[ContextController](../../zuix/ContextController)*|The component controller object|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 45](../../zuix/ComponentContext.js#L45)

-->

<a name="ContextControllerInitCallback"></a>
#### ContextControllerInitCallback()

Function that gets called after loading and before the component is created.

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 47](../../zuix/ContextController.js#L47)

-->

<a name="ContextControllerUpdateCallback"></a>
#### ContextControllerUpdateCallback(target, key, value, path, old)

Function called when the data model of the component is updated

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`target`|*Object*|The target object.|
|`key`|*string*|The name of the property.|
|`value`|*Object*|The value of the property.|
|`path`|*string*|The full property path (dotted notation).|
|`old`|*Object*|The target object before the update.|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 35](../../zuix/ContextController.js#L35)

-->

##### Returns

 &dash; undefined

<a name="ContextErrorCallback"></a>
#### ContextErrorCallback(error, ctx)

Callback function triggered if an error occurs when loading a component.

##### This
- {<a href="../../zuix/ComponentContext">ComponentContext</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`error`|*Object*||
|`ctx`|*[ComponentContext](../../zuix/ComponentContext)*|The component context object (same as `this`).|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 85](../../zuix/Zuix.js#L85)

-->

<a name="ContextLoadedCallback"></a>
#### ContextLoadedCallback(ctx)

Callback function triggered when a component is created, after all of its dependencies have been loaded.

##### This
- {<a href="../../zuix/ComponentContext">ComponentContext</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`ctx`|*[ComponentContext](../../zuix/ComponentContext)*|The component context (same as `this`).|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 94](../../zuix/Zuix.js#L94)

-->

<a name="ContextOptions"></a>
#### ContextOptions

This object can be supplied when loading a component. It can be either passed as argument for the
`zuix.load(...) / zuix.loadComponent(...) ` methods, in the javascript code, or with the `z-options` attribute in the HTML code
of the component's host element.

##### Properties

|Name|Type|Description|
|----|----|-----------|
|`contextId`|*Object* \| *undefined*|The context id. HTML attribute equivalent: *z-context*. If not specified it will be randomly generated.  HTML attribute equivalent: *z-context*.|
|`container`|*Element* \| *undefined*|The container element.|
|`model`|*JSON* \| *undefined*|The data model. HTML attribute equivalent: *z-model*.|
|`view`|*Element* \| *undefined*|The view element.|
|`controller`|*[ContextControllerHandler](#ContextControllerHandler)* \| *undefined*|The controller handler.|
|`on`|*Object.&lt;string, <a href="#EventCallback">EventCallback</a>>* \| *Object.&lt;string, string>* \| *undefined*|The map of event handlers for standard and component's events. An event can also be simply routed to another component's event by specifying the mapped event name string. HTML attribute equivalent: *z-on*.|
|`behavior`|*Object.&lt;string, <a href="#EventCallback">EventCallback</a>>* \| *Object.&lt;string, string>* \| *undefined*|The map of event handlers for behaviors. An event can also be simply routed to another component's event by specifying the mapped event name string. HTML attribute equivalent: *z-behavior*.|
|`css`|*HTMLStyleElement* \| *string* \| *boolean* \| *undefined*|Custom stylesheet to apply to the component's view.|
|`encapsulation`|*boolean* \| *undefined*|Whether to use style encapsulation or not (**default:** false).|
|`resetCss`|*boolean* \| *undefined*|Whether to reset view style to prevent inheriting from parent containers (**default:** false).|
|`cext`|*string* \| *undefined*|When loading content of the view, appends the specified extension instead of *.html*.|
|`html`|*boolean* \| *string* \| *undefined*|It can be set to `false`, to disable HTML template loading, or it can be set to a string containing the inline HTML template code.|
|`lazyLoad`|*boolean* \| *undefined*|Enables or disables lazy-loading (**default:** false). HTML attribute equivalent: *z-lazy*.|
|`priority`|*number* \| *undefined*|Loading priority (**default:** 0). HTML attribute equivalent: *z-priority*.|
|`using`|*string* \| *undefined*|Comma separated contexts' id list of components used in this context. A variable with camel-case converted name for each referenced context, will be available in the local scripting scope.|
|`loaded`|*[ContextLoadedCallback](#ContextLoadedCallback)* \| *undefined*|The loaded callback, triggered once the component is successfully loaded.|
|`ready`|*[ContextReadyCallback](#ContextReadyCallback)* \| *undefined*|The ready callback, triggered once all component's dependencies have been loaded.|
|`error`|*[ContextErrorCallback](#ContextErrorCallback)* \| *undefined*|The error callback, triggered when an error occurs.|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 59](../../zuix/Zuix.js#L59)

-->

<a name="ContextReadyCallback"></a>
#### ContextReadyCallback(ctx)

Callback function triggered when a component has been successfully loaded.

##### This
- {<a href="../../zuix/ComponentContext">ComponentContext</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`ctx`|*[ComponentContext](../../zuix/ComponentContext)*|The component context (same as `this`).|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 103](../../zuix/Zuix.js#L103)

-->

<a name="ElementPosition"></a>
#### ElementPosition

The `ElementPosition` object returned by the `position()` method.

##### Properties

|Name|Type|Description|
|----|----|-----------|
|`x`|*number*|X coordinate of the element in the viewport|
|`y`|*number*|Y coordinate of the element in the viewport|
|`frame`|*[Position](#Position)*|Position of the element relative to the viewport|
|`event`|*string*|Current state change event description (*enter*, *exit*, *scroll*, *off-scroll*)|
|`visible`|*boolean*|Boolean value indicating whether the element is visible in the viewport|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 55](../../helpers/ZxQuery.js#L55)

-->

<a name="ElementsIterationCallback"></a>
#### ElementsIterationCallback(count, item, $item)

Callback function used with the `each(..)` method.

##### This
- {<a href="../../helpers/ZxQuery">ZxQuery</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`count`|*number*|Iteration count.|
|`item`|*Element*|Current element.|
|`$item`|*[ZxQuery](../../helpers/ZxQuery)*|ZxQuery wrapped element (same as 'this').|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 37](../../helpers/ZxQuery.js#L37)

-->

<a name="EventCallback"></a>
#### EventCallback(event, data, $el)

Callback function triggered when an event registered
with the `on` method occurs.

##### This
- {<a href="../../helpers/ZxQuery">ZxQuery</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`event`|*string*|Event name|
|`data`|*Object*|Event data|
|`$el`|*[ZxQuery](../../helpers/ZxQuery)*|ZxQuery wrapped element that sourced the event (same as `this`)|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 54](../../zuix/ComponentContext.js#L54)

-->

<a name="IterationCallback"></a>
#### IterationCallback(k, item)

The `IterationCallback` function.

##### This
- {object}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`k`|*number* \| *object*|Iteration count / item key.|
|`item`|*object*|Current element (same as `this`).|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 66](../../helpers/ZxQuery.js#L66)

-->

<a name="LoggerMonitorCallback"></a>
#### LoggerMonitorCallback(ctx, level)

Callback function for monitoring all log messages.

##### This
- {object}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`ctx`|*Object*||
|`level`|*string*||
|`...args`|*Array.&lt;Object>*||

<!--

*Source:*
[helpers/Logger.js](../../helpers/Logger.js), [line 118](../../helpers/Logger.js#L118)

-->

<a name="PlayFxCallback"></a>
#### PlayFxCallback($element, classQueue)

Callback function used with the `each(..)` method.

##### This
- {<a href="../../helpers/ZxQuery">ZxQuery</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`$element`|*[ZxQuery](../../helpers/ZxQuery)*|Target element (same as 'this').|
|`classQueue`|*Array.&lt;string>*|Transition/animation class queue left to play, `null` if the animation ended.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 133](../../helpers/ZxQuery.js#L133)

-->

<a name="PlayFxConfig"></a>
#### PlayFxConfig

Configuration object for `playFx`, `playTransition`, `playAnimation` utility methods.

##### Properties

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`type`|*'transition'* \| *'animation'*||The type of effect to play.|
|`target`|*Element* \| *[ZxQuery](../../helpers/ZxQuery)*||Target element.|
|`classes`|*Array.&lt;string>* \| *string*||List of transition or animation classes to play.|
|`options`|*object*|*optional* |Transition/animation options ('delay', 'duration', etc..).|
|`holdState`|*boolean*|*optional* |Hold last transition/animation class.|
|`onStep`|*[PlayFxCallback](#PlayFxCallback)*|*optional* |Since class list can contain more than just two classes, this callback will be called after each pair of transition/animation ended.|
|`onEnd`|*[PlayFxCallback](#PlayFxCallback)*|*optional* |Called when all transitions/animations ended.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 120](../../helpers/ZxQuery.js#L120)

-->

<a name="Position"></a>
#### Position

Relative position.

##### Properties

|Name|Type|Description|
|----|----|-----------|
|`dx`|*number*||
|`dy`|*number*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 47](../../helpers/ZxQuery.js#L47)

-->

<a name="ResourceUsingCallback"></a>
#### ResourceUsingCallback(resourcePath, hashIdOrContext)

Callback in response to a `zuix.using` request.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`resourcePath`|*string*||
|`hashIdOrContext`|*string* \| *object*||

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 111](../../zuix/Zuix.js#L111)

-->

<a name="ZxQueryHttpBeforeSendCallback"></a>
#### ZxQueryHttpBeforeSendCallback(xhr)

The `ZxQueryHttpBeforeSendCallback` function.

##### This
- {undefined}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`xhr`|*XMLHttpRequest*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 75](../../helpers/ZxQuery.js#L75)

-->

<a name="ZxQueryHttpErrorCallback"></a>
#### ZxQueryHttpErrorCallback(xhr, statusText, statusCode)

The `ZxQueryHttpErrorCallback` function.

##### This
- {undefined}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`xhr`|*XMLHttpRequest*||
|`statusText`|*string*||
|`statusCode`|*number*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 91](../../helpers/ZxQuery.js#L91)

-->

<a name="ZxQueryHttpOptions"></a>
#### ZxQueryHttpOptions

zuix.$.http options object.

##### Properties

|Name|Type|Description|
|----|----|-----------|
|`url`|*string*||
|`beforeSend`|*[ZxQueryHttpBeforeSendCallback](#ZxQueryHttpBeforeSendCallback)* \| *undefined*||
|`success`|*[ZxQueryHttpSuccessCallback](#ZxQueryHttpSuccessCallback)* \| *undefined*||
|`error`|*[ZxQueryHttpErrorCallback](#ZxQueryHttpErrorCallback)* \| *undefined*||
|`then`|*[ZxQueryHttpThenCallback](#ZxQueryHttpThenCallback)* \| *undefined*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 109](../../helpers/ZxQuery.js#L109)

-->

<a name="ZxQueryHttpSuccessCallback"></a>
#### ZxQueryHttpSuccessCallback(responseText)

The `ZxQueryHttpSuccessCallback` function.

##### This
- {undefined}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`responseText`|*string*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 83](../../helpers/ZxQuery.js#L83)

-->

<a name="ZxQueryHttpThenCallback"></a>
#### ZxQueryHttpThenCallback(xhr)

The `ZxQueryHttpThenCallback` function.

##### This
- {undefined}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`xhr`|*XMLHttpRequest*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 101](../../helpers/ZxQuery.js#L101)

-->