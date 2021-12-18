# Class: ContextController

## ContextController

#### new ContextController(context) &rarr; {[ContextController](ContextController.md)}

ContextController constructor.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`context`|*[ComponentContext](ComponentContext.md)*||

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 69](zuix/ContextController.js#L69)

-->

##### Returns

`ContextController`

---------------

### Members

#### &lt;_protected_&gt; _childNodes :Array.&lt;Element>

##### Type:
_*Array.&lt;Element>*
_

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 86](zuix/ContextController.js#L86)

-->

#### &lt;_package_&gt; _fieldCache :Array.&lt;<a href="ZxQuery.md">ZxQuery</a>>

##### Type:
_*Array.&lt;<a href="ZxQuery.md">ZxQuery</a>>*
_

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 80](zuix/ContextController.js#L80)

-->

#### create :[ContextControllerCreateCallback](global.md#ContextControllerCreateCallback)

If set, this function gets called after loading, when the component is created and its view (if provided) is loaded.

##### Type:
_*[ContextControllerCreateCallback](global.md#ContextControllerCreateCallback)*
_

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 165](zuix/ContextController.js#L165)

-->

#### destroy :[ContextControllerDestroyCallback](global.md#ContextControllerDestroyCallback)

If set, this function gets called each time the data model is updated.

##### Type:
_*[ContextControllerDestroyCallback](global.md#ContextControllerDestroyCallback)*
_

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 175](zuix/ContextController.js#L175)

-->

#### init :[ContextControllerInitCallback](global.md#ContextControllerInitCallback)

If set, this function gets called before component is created and before applying context options.

##### Type:
_*[ContextControllerInitCallback](global.md#ContextControllerInitCallback)*
_

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 160](zuix/ContextController.js#L160)

-->

#### log :[Logger](Logger.md)

The component logger instance.

##### Type:
_*[Logger](Logger.md)*
_

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 448](zuix/ContextController.js#L448)

-->

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
// same as log.info (...)
log.i('Component view', ctx.view());
// same as log.error(...)
log.e('Error loading data', dataUrl);
// other methods are:
// log.w(...) / log.warn (...)
// log.d(...) / log.debug(...)
// log.t(...) / log.trace(...)
</code></pre>

#### update :[ContextControllerUpdateCallback](global.md#ContextControllerUpdateCallback)

If set, this function gets called when the component is destroyed.

##### Type:
_*[ContextControllerUpdateCallback](global.md#ContextControllerUpdateCallback)*
_

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 170](zuix/ContextController.js#L170)

-->

### Methods

#### &lt;_protected_&gt; eventRouter()

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 119](zuix/ContextController.js#L119)

-->

#### expose(methodName, handler) &rarr; {[ContextController](ContextController.md)}

Exposes a method or property declared in the private
scope of the controller as a public member of the
component context object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`methodName`|*string* \| *JSON*|  |Name of the exposed function, or list of method-name/function pairs.|
|`handler`|*function*|*optional*  |Reference to the controller member to expose.|

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 365](zuix/ContextController.js#L365)

-->

##### Returns

`ContextController`
The `{ContextController}` itself.

##### Example

<small>Example - JavaScript</small>
<pre data-line="5"><code class="language-js">
// somewhere in the `create` method of the {ContextController}
zuix.controller(function(cp){
  cp.create = function() {
    // ....
    cp.expose('setSlide', slide);
  }
  // ...
  function slide(slideIndex) { ... }
  // ...
});
// ...
// calling the exposed method
// from the component context
var ctx = zuix.context('my-slide-show');
ctx.setSlide(2);
</code></pre>

#### field(fieldName) &rarr; {[ZxQuery](ZxQuery.md)}

Gets elements in the component view with `data-ui-field`
matching the given `fieldName`.
This method implements a caching mechanism and automatic
disposal of allocated objects and events.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`fieldName`|*string*|Value to match in the `data-ui-field` attribute.|

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 215](zuix/ContextController.js#L215)

-->

##### Returns

`ZxQuery`
A `{ZxQuery}` object wrapping the matching element.

##### Example

<small>**Example - HTML code of the view**</small>
<pre><code class="language-html">
<h1 data-ui-field="title">...</h1>
<p data-ui-field="description">...</p>
</code></pre>

<small>**Example - JavaScript**</small>
<pre><code class="language-js">
cp.field('title')
  .html('Hello World!');
var desc = cp.field('description');
desc.html('The spectacle before us was indeed sublime.');
</code></pre>

#### for(componentId) &rarr; {[ContextController](ContextController.md)}

Register this one as the default controller
for the given component type.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`componentId`|*string*|Component identifier.|

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 468](zuix/ContextController.js#L468)

-->

##### Returns

`ContextController`
The `{ContextController}` itself.

##### Example

<small>**Example - JavaScript**</small>
<pre data-line="6"><code class="language-js">
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.destroy = function() { ... }
}).for('path/to/component_name');
</pre></code>

#### loadCss(options) &rarr; {[ContextController](ContextController.md)}

Loads the `.css` file and replace the current view style of the component.
If no `options.path` is specified, it will try to load
the file with the same base-name as the `componentId`.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`options`|*object*|*optional*  |The options object.|

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 397](zuix/ContextController.js#L397)

-->

##### Returns

`ContextController`
The ```{ContextController}``` object itself.

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
// loads 'path/to/component_name.css' by default
cp.loadCss();
// or loads the view css with provided options
cp.loadCss({
    path: 'url/of/style/file.css',
    success: function() { ... },
    error: function(err) { ... },
    then: function() { ... }
});
</code></pre>

#### loadHtml(options) &rarr; {[ContextController](ContextController.md)}

Loads the `.html` file and replace the view markup of the component.
If no `options.path` is specified, it will try to load the
file with the same base-name as the `componentId`.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`options`|*object*|*optional*  |The options object.|

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 424](zuix/ContextController.js#L424)

-->

##### Returns

`ContextController`
The ```{ContextController}``` object itself.

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
// loads 'path/to/component_name.html' by default
cp.loadHtml();
// or loads the view html with provided options
cp.loadHtml({
    path: 'url/of/view/file.html',
    success: function() { ... },
    error: function(err) { ... },
    then: function() { ... }
});
</code></pre>

#### &lt;_protected_&gt; mapEvent()

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 109](zuix/ContextController.js#L109)

-->

#### model(model) &rarr; {[ContextController](ContextController.md)|object}

Gets/Sets the data model of the component.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`model`|*object* \| *undefined*|*optional*  |The model object.|

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 277](zuix/ContextController.js#L277)

-->

##### Returns

`ContextController,object`

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
var m = {
     title: 'Thoughts',
     message: 'She stared through the window at the stars.'
 };
cp.model(m);
cp.model().title = 'Changes';
console.log(cp.model().title);
</code></pre>

#### options() &rarr; {object}

Gets the component options.

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 288](zuix/ContextController.js#L288)

-->

##### Returns

`object`
The component options.

#### saveView()

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 88](zuix/ContextController.js#L88)

-->

#### trigger(eventPath, eventData, isHook) &rarr; {[ContextController](ContextController.md)}

Triggers the component event `eventPath` with the given
`eventData` object. To listen to a component event use the
`{ComponentContext}.on(eventPath, handler)` method or
in case `isHook` is set to true, use the
`zuix.hook(eventPath, handler)` method (global hook event).

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`eventPath`|*string*|  |The event path.|
|`eventData`|*object*|  |The event data.|
|`isHook`|*boolean*|*optional*  |Trigger as global hook event.|

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 317](zuix/ContextController.js#L317)

-->

##### Returns

`ContextController`

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
// somewhere inside the slide-show component controller
cp.trigger('slide:change', slideIndex);

// somewhere in a page hosting the slide-show component
// set component event listeners
zuix.context('my-slide-show')
  .on('slide:change', function(slideIndex) { ... })
  .on(...);
</code></pre>

#### view(filter) &rarr; {[ZxQuery](ZxQuery.md)}

Gets the component view or if `filter` argument is passed,
gets the view elements matching the given `filter`
(shorthand for `cp.view().find(filter)`).

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`filter`|*string* \| *undefined*|*optional*  ||

<!--

*Source:*
[zuix/ContextController.js](zuix/ContextController.js), [line 241](zuix/ContextController.js#L241)

-->

##### Returns

`ZxQuery`

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
// get all `checkbox` elements with `.checked` class.
var choices = cp.view('input[type="checkbox"].checked');
choices.removeClass('.checked');
// hide the component's view
cp.view().hide();
</code></pre>