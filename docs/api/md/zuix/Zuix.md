# Class: Zuix

## Zuix

**Zuix**

#### new Zuix() &rarr; {[Zuix](Zuix.md)}

zUIx, Javascript library for component-based development.

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 142](zuix/Zuix.js#L142)

-->

##### Returns

`Zuix`

---------------

### Members

#### $

Helper class for querying and manipulating the DOM.

##### Properties:

|Type|Description|
|----|-----------|
|ZxQueryStatic|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1309](zuix/Zuix.js#L1309)

-->

### Methods

#### bundle(bundleData, callback) &rarr; {[Zuix](Zuix.md)|Array.&lt;<a href="global.md#BundleItem">BundleItem</a>>}

Gets/Sets the components data bundle.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`bundleData`|*Array.&lt;<a href="global.md#BundleItem">BundleItem</a>>*|  |A bundle object holding in memory all components data (cache).|
|`callback`|*function*|*optional*  ||

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1267](zuix/Zuix.js#L1267)

-->

##### Returns

`Zuix,Array.<BundleItem>`

#### componentize(element) &rarr; {[Zuix](Zuix.md)}

Searches the document, or inside the given ```element```,
for all ```data-ui-include``` and ```data-ui-load``` attributes
and processes these by loading the requested components.
This is a service function that should only be called if dynamically
adding content with elements that contain *load* or *include* directives.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`element`|*Element* \| *[ZxQuery](ZxQuery.md)*|*optional*  |Container to use as starting node for the search (**default:** *document*).|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1228](zuix/Zuix.js#L1228)

-->

##### Returns

`Zuix`
The ```{Zuix}``` object itself.

##### Example

<small>**JavaScript**</small>
 ```js
 zuix.componentize(document);
 ```

#### context(contextId, callback) &rarr; {[ComponentContext](ComponentContext.md)}

Gets a `ComponentContext` object, given its `contextId` or its container/view element.
The `contextId` is the one specified by the `ContextOptions` object or by using the HTML attribute `data-ui-context`.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`contextId`|*Element* \| *[ZxQuery](ZxQuery.md)* \| *object*|  |The `contextId` object (usually a string) or the container/view element of the component.|
|`callback`|*function*|*optional*  |The callback function that will be called once the component is loaded. The {ComponentContext} object will be passed as argument of this callback.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 964](zuix/Zuix.js#L964)

-->

##### Returns

`ComponentContext`
The matching component context or `null` if the component does not exists or it is not yet loaded.

##### Example

<small>**HTML**</small>
```html
<div data-ui-load="site/components/slideshow"
     data-ui-context="my-slide-show">...</div>
```
<small>**JavaScript**</small>
```js
var slideShowDiv = zuix.$.find('[data-ui-context="my-slide-show"]');
var ctx = zuix.context(slideShowDiv);
// or
var ctx = zuix.context('my-slide-show');
// call exposed component methods
ctx.setSlide(1);
// or
var ctx;
zuix.context('my-slide-show', function(c) {
    // call component methods
    c.setSlide(1);
    // eventually store a reference to the component for later use
    ctx = c;
});
```

#### controller(handler) &rarr; {[ContextControllerHandler](global.md#ContextControllerHandler)}

Allocates the handler for the component controller. The provided `handler` function will be called
to initialize the controller object once the component has been loaded.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`handler`|*[ContextControllerHandler](global.md#ContextControllerHandler)*|Function called to initialize the component controller that will be passed as argument of this function.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 928](zuix/Zuix.js#L928)

-->

##### Returns

`ContextControllerHandler`
The allocated controller handler.

##### Example

<small>**JavaScript**</small>
 <pre data-line="2"><code class="language-js">
 // Allocates the controller handler to be used for the component 'path/to/component_name'
 var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
 </code></pre>

#### createComponent(componentId, options) &rarr; {[ComponentContext](ComponentContext.md)}

Creates the component specified by `componentId` and returns its `{ComponentContext}` object.
The returned component it's unloaded and detached from the DOM and it must be explicitly attached.
After attaching it to the DOM, `zuix.componentize()` must be called in
order to actually load and display the component.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`componentId`|*string*|  |Identifier name of the component to create.|
|`options`|*[ContextOptions](global.md#ContextOptions)* \| *undefined*|*optional*  |Component context options.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 977](zuix/Zuix.js#L977)

-->

##### Returns

`ComponentContext`

#### dumpCache() &rarr; {Array.&lt;<a href="global.md#ComponentCache">ComponentCache</a>>}

Dumps content of the components cache. Mainly for debugging purpose.

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1318](zuix/Zuix.js#L1318)

-->

##### Returns

`Array.<ComponentCache>`

#### dumpContexts() &rarr; {Array.&lt;<a href="ComponentContext.md">ComponentContext</a>>}

Dumps allocated component contexts. Mainly for debugging purpose.

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1325](zuix/Zuix.js#L1325)

-->

##### Returns

`Array.<ComponentContext>`

#### field(fieldName, container) &rarr; {[ZxQuery](ZxQuery.md)}

Search the document or inside the given `container` for elements
with `data-ui-field` attribute matching the provided `fieldName`.
This method implements a caching mechanism and automatic
disposal of allocated objects and events.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`fieldName`|*string*|  |Value of `data-ui-field` to look for.|
|`container`|*Element*|*optional*  |Starting DOM element for this search (**default:** *document*)|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 836](zuix/Zuix.js#L836)

-->

##### Returns

`ZxQuery`
ZxQuery object with elements matching the given ```data-ui-field``` attribute.
If the matching element is just one, then it will also have the extra method `field(fieldName)`
to search for fields contained in it.

##### Example

<small>**HTML**</small>
```html
<div data-ui-field="sample-container">
   <!-- container HTML -->
</div>
```

<small>**JavaScript**</small>
```js
var container = zuix.field('sample-container');
container.html('Hello World!');
```

#### getResourcePath(path) &rarr; {string}

Get a resource path.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`path`|*string*|resource id/path|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1249](zuix/Zuix.js#L1249)

-->

##### Returns

`string`

#### hook(eventPath, eventHandler) &rarr; {[Zuix](Zuix.md)}

Registers a callback for a global zUIx event.
There can only be one callback for each kind of global hook event.
Pass null as <eventHandler> to stop listening to a previously registered callback.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|The event path.|
|`eventHandler`|*function* \| *undefined*|The handler function.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1061](zuix/Zuix.js#L1061)

-->

##### Returns

`Zuix`
The ```{Zuix}``` object itself.

##### Example

<small>**JavaScript**</small>
```js
// The context `this` in the event handlers will be
// the {ComponentContext} object that sourced the event.
// The `data` parameter passed to the handlers, is of
// variant type, depending on the type of the occurring event.
zuix
  .hook('load:begin', function(data){
    loaderMessage.html('Loading "'+data.task+'" ...');
    loaderMessage.show();

}).hook('load:next', function(data){
    loaderMessage.html('"'+data.task+'" done, loading next..');

}).hook('load:end', function(){
    loaderMessage.hide();

}).hook('html:parse', function (data) {
    // ShowDown - MarkDown syntax compiler
    if (this.options().markdown === true && typeof showdown !== 'undefined')
        data.content = new showdown.Converter()
            .makeHtml(data.content);

}).hook('css:parse', function (data) {
    // process css, eg. run a CSS pre-processor
    // eg. Sass, Less, ...

}).hook('view:process', function (view) {
    // The view DOM is now fully loaded and ready

    // Prism code syntax highlighter
    view.find('code').each(function (i, block) {
        this.addClass('language-javascript');
        Prism.highlightElement(block);
    });

    // Force opening of all non-local links in a new window
    zuix.$('a[href*="://"]').attr('target','_blank');

    // Material Design Light auto-detection
    // Call DOM upgrade on newly added view elements
    if (componentHandler)
        componentHandler.upgradeElements(view.get());

});
```

#### httpCaching(enable) &rarr; {[Zuix](Zuix.md)|boolean}

Enables/Disables HTTP caching or gets the current settings.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`enable`|*boolean*|*optional*  ||

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1203](zuix/Zuix.js#L1203)

-->

##### Returns

`Zuix,boolean`
*true* if HTTP caching is enabled, *false* otherwise.

#### lazyLoad(enable, threshold) &rarr; {[Zuix](Zuix.md)|boolean}

Enables/Disables lazy-loading or gets the current setting.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`enable`|*boolean*|*optional*  |Enable or disable lazy loading.|
|`threshold`|*number*|*optional*  |Load-ahead threshold (default is 1.0 => 100% of view size).|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1189](zuix/Zuix.js#L1189)

-->

##### Returns

`Zuix,boolean`
*true* if lazy-loading is enabled, *false* otherwise.

#### load(componentId, options) &rarr; {[ComponentContext](ComponentContext.md)}

Loads a component.
This is the programmatic equivalent of `data-ui-include`
or `data-ui-load` attributes used to
include content or load components from the HTML code.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`componentId`|*string*|  |The identifier name of the component to be loaded.|
|`options`|*[ContextOptions](global.md#ContextOptions)*|*optional*  |Options used to initialize the loaded component.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 889](zuix/Zuix.js#L889)

-->

##### Returns

`ComponentContext`
The component context.

##### Example

<small>**JavaScript**</small>
```js
// declare inline the controller for component 'example/component'
const exampleController = zuix.controller((cp) => {
    // declare `create` life-cycle callback
    cp.create = () => {
        // expose a public method
        cp.expose('test', testMethod);
        // set the content of the view
        cp.view().html('Helllo World!');
    }
    function testMethod() {
        cp.log.i("Method exposing test");
        cp.view().html('A simple test.');
    }
}).for('example/component');

// store a reference to the container
const container = zuix.field('sample-container');

 // declare loading options
const componentOptions = {
    view: container,
    // callback called after the component is loaded
    ready: (ctx) => {
        ctx..log("Loading complete.");
        ctx.log("Component instance context", this);
        // call the `test` method after 1s
        setTimeout(ctx.test, 1000);
    },
    // callback called if an error occurs
    error: (error) => {
        console.log("Loading error!", error);
    }
};
zuix.load('example/component', componentOptions);
```

#### observable(obj) &rarr; {[ObservableObject](ObservableObject.md)}

Get an observable instance of an object for detecting changes.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`obj`|*Object*|Object to observe|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1257](zuix/Zuix.js#L1257)

-->

##### Returns

`ObservableObject`
The observable object

#### store(name, value) &rarr; {object}

Gets/Sets a global store entry.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`name`|*string*|Entry name|
|`value`|*object*|Entry value|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1238](zuix/Zuix.js#L1238)

-->

##### Returns

`object`

#### trigger(context, eventPath, eventData) &rarr; {[Zuix](Zuix.md)}

Triggers the event specified by `eventPath`.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`context`|*Object*|  |The context object (`this`) passed to handler functions listening to this event.|
|`eventPath`|*string*|  |The path of the event to fire.|
|`eventData`|*object*|*optional*  |The data object of the event.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 999](zuix/Zuix.js#L999)

-->

##### Returns

`Zuix`
The ```{Zuix}``` object itself.

#### unload(context) &rarr; {[Zuix](Zuix.md)}

Unloads the given component context releasing all allocated resources.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`context`|*[ComponentContext](ComponentContext.md)* \| *Element*|The instance of the component to be unloaded or its container element. Pass *Element* type if the underlying component is lazy-loadable and it might not have been instantiated yet.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 905](zuix/Zuix.js#L905)

-->

##### Returns

`Zuix`
The ```{Zuix}``` object itself.

##### Example

<small>**JavaScript**</small>
```js
zuix.unload(ctx);
```

#### using(resourceType, resourcePath, callback) &rarr; {void}

Loads a CSS, Script or singleton Component resource. Resources loaded
with this method are available in the global scope and will be also included
in the application bundle.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`resourceType`|*string*|  |Either `style`, `script` or `component`.|
|`resourcePath`|*string*|  |Relative or absolute resource url path|
|`callback`|*function*|*optional*  |Callback function to call once resource is loaded.|

<!--

*Source:*
[zuix/Zuix.js](zuix/Zuix.js), [line 1084](zuix/Zuix.js#L1084)

-->

##### Returns

`void`

##### Example

<small>**JavaScript**</small>
 <pre><code class="language-js">
  zuix.using('script', 'https://some.cdn.js/moment.min.js', function(){
      // can start using moment.js
  });
 </code></pre>