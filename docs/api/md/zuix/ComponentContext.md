---
layout: side_drawer.liquid
tags: api
options: mdl highlight
icon: construction
title: "zuix.js <i class='material-icons'>emoji_nature</i> API"
description: "zUIx.js API documentation, Class: ComponentContext"
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

## `ComponentContext` class

### Constructor

<a name="ComponentContext"></a>
#### new ComponentContext(zuixInstance, options, eventCallback) &rarr; {[ComponentContext](../../zuix/ComponentContext)}

The component context object represents the component instance itself, and it holds
all of its data such as the view template, the style, the controller, the data model.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`zuixInstance`|*[Zuix](../../zuix/Zuix)*|  ||
|`options`|*[ContextOptions](#ContextOptions)*|  |Options to create this component context|
|`eventCallback`|*function*|*optional*  |Event routing callback|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 198](../../zuix/ComponentContext.js#L198)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)*
 &dash; The component context instance.

### Properties

<a name="componentId"></a>
#### componentId &rarr; *string*

The component identifier "`[<path>/]<name>`".

<a name="path"></a>
#### path &rarr; *string*

Gets the base path of this component.

<a name="name"></a>
#### name &rarr; *string*

Gets the name of this component (last part of the path).

<a name="isReady"></a>
#### isReady &rarr; *boolean*

Gets/Sets the component's ready state.

<a name="$"></a>
#### $ &rarr; *[ZxQuery](../../helpers/ZxQuery)*

Access the view of this component. Use this to register event handlers for elements in this view to take advantage of automatic event unsubscription and view fields caching.

<a name="handlers"></a>
#### handlers &rarr; *Object.&lt;string, <a href="#ActiveRefreshHandler">ActiveRefreshHandler</a>>*

List component-local `@` handlers.

### Methods

<a name="container"></a>
#### container(container) &rarr; {[ComponentContext](../../zuix/ComponentContext)|Element}

Gets/Sets the container element of the component.
Returns the current container element if no
argument is passed, the `ComponentContext` itself
otherwise.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`container`|*Element*|*optional*  |The container element.|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 415](../../zuix/ComponentContext.js#L415)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)* \| *Element*

<a name="controller"></a>
#### controller(controller) &rarr; {[ComponentContext](../../zuix/ComponentContext)|[ContextControllerHandler](#ContextControllerHandler)}

Gets/Sets the component's controller handler.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`controller`|*[ContextControllerHandler](#ContextControllerHandler)* \| *undefined*|*optional*  |The controller's handler function|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 797](../../zuix/ComponentContext.js#L797)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)* \| *[ContextControllerHandler](#ContextControllerHandler)*

<a name="dispose"></a>
#### dispose()

Disposes the component context and all of its allocated resources.

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 337](../../zuix/ComponentContext.js#L337)

-->

<a name="field"></a>
#### field(fieldName) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Gets, within the component view, elements having the `#<field_name>` (or `z-field="<name>"`)
attribute matching the given value.
This method implements a caching mechanism and automatic
disposal of allocated objects and events.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`fieldName`|*string*|The name of the `#<field_name>` (or `z-field="name"`) attribute of the element(s) to get.|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 599](../../zuix/ComponentContext.js#L599)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A `{ZxQuery}` object wrapping the matching element(s).

##### Example

```html
<div z-load="default" z-context="field-test">
  <h1 #title>Loading context...</h1>
</div>

<script>
zuix.context('field-test', (ctx) => {
  ctx.field('title')
     .html('Context ready.');
});
</script>
```
<h5>Result</h5>
<div z-load="default" z-context="field-test">
  <h6 #title>Loading context...</h6>
</div>
<script>
zuix.context('field-test', (ctx) => {
  ctx.field('title')
     .html('Context ready.');
});
</script>

<a name="getCssId"></a>
#### getCssId() &rarr; {string}

Gets the CSS identifier of this component's style.

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 1156](../../zuix/ComponentContext.js#L1156)

-->

##### Returns

*string*
 &dash; The css-id attribute of this component.

<a name="model"></a>
#### model(model) &rarr; {object}

Gets/Sets the data model of the component. When getting `model()`,
the returned object is an *observable* wrapped instance of the
originally provided `model`, that will automatically trigger
the update of any bound field when a property in the model's
changes.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`model`|*object* \| *undefined*|*optional*  |The model object|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 764](../../zuix/ComponentContext.js#L764)

-->

##### Returns

*object*

##### Example

```html
<div z-load="default" z-context="model-test">
  <h1 #title></h1>
  <label>Update title</label>
  <input type="text" #title-input />
</div>

<script>
zuix.context('model-test', (ctx) => {
  const model = ctx.model({
    title: 'Test title'
  });
  ctx.field('title-input')
     .value(model.title)
     .on('input', (e, input) =>
        { model.title = input.value(); });
});
</script>
```

In this example, when the text in the input box is changed, the
new value is assigned to *model.title* property, and this will
automatically trigger the update of the *h1* element's content
in the view, because it is bound to the *title*'s field (`#title`).
For further info, see [Data binding](../../../view/#data_binding) in the View's chapter.

<h5>Result</h5>
<div z-load="default" z-context="model-test">
  <h6 #title style="min-height:24px"></h6>
  <label for="title_input">Update title</label>
  <input type="text" id="title_input" #title-input maxlength="30" />
</div>
<script>
zuix.context('model-test', (ctx) => {
  const model = ctx.model({
    title: 'Test title'
  });
  ctx.field('title-input')
     .value(model.title)
     .on('input', (e, input) => {
        model.title = input.value().replace(/[\u00A0-\u9999<>\&]/g, function(i) {
           return '&#'+i.charCodeAt(0)+';';
        });
     });
});
</script>

<a name="modelToView"></a>
#### modelToView() &rarr; {[ComponentContext](../../zuix/ComponentContext)}

Triggers the update of all elements in the view
that are bound to the model's fields. If the `inherits="true"` attribute
is present on a field, data can be inherited from parent component.

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 1090](../../zuix/ComponentContext.js#L1090)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)*
 &dash; The ```{ComponentContext}``` object itself.

<a name="on"></a>
#### on(eventPath, eventHandler) &rarr; {[ComponentContext](../../zuix/ComponentContext)}

Listens for a component event.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`eventPath`|*string* \| *Array.&lt;Object>* \| *JSON*|  |The event path or object with event name/handler pairs.|
|`eventHandler`|*[EventCallback](#EventCallback)*|*optional*  |The event handler function. Not used if eventPath is an object with event name/handler pairs.|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 842](../../zuix/ComponentContext.js#L842)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)*
 &dash; The ```{ComponentContext}``` object itself.

<a name="options"></a>
#### options(options) &rarr; {[ComponentContext](../../zuix/ComponentContext)|object}

Gets/Sets the component's options.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`options`|*[ContextOptions](#ContextOptions)* \| *undefined*|*optional*  |The JSON options object.|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 813](../../zuix/ComponentContext.js#L813)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)* \| *object*

<a name="style"></a>
#### style(css) &rarr; {[ComponentContext](../../zuix/ComponentContext)|Element}

Gets/Sets the style of the component's view.
The `css` argument can be a string containing all
styles definitions or a reference to a style
element.
If no argument is given, then the current style
element is returned.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`css`|*string* \| *Element* \| *undefined*|*optional*  |The CSS string or style element|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 662](../../zuix/ComponentContext.js#L662)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)* \| *Element*

##### Example

```js
ctx.style("p { font-size: 120%; } .hidden { display: 'none'; }");
```

<a name="view"></a>
#### view(view) &rarr; {[ComponentContext](../../zuix/ComponentContext)|Element}

Gets/Sets the view element of the component.
If an *HTML* string is passed, then the view element
will be a new `div` wrapping the given markup.
Returns the current view element if no
argument is passed, the *ComponentContext* itself otherwise.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`view`|*Element* \| *string* \| *undefined*|*optional*  |The *HTML* string or element of the view.|

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 435](../../zuix/ComponentContext.js#L435)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)* \| *Element*

<a name="viewToModel"></a>
#### viewToModel() &rarr; {[ComponentContext](../../zuix/ComponentContext)}

Creates the data model out of all elements with the `#<field_name>` (or `z-field="<name>"`) attribute
and that are declared in the component's view.

<!--

*Source:*
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 1049](../../zuix/ComponentContext.js#L1049)

-->

##### Returns

*[ComponentContext](../../zuix/ComponentContext)*
 &dash; The ```{ComponentContext}``` object itself.

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 87](../../zuix/Zuix.js#L87)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 96](../../zuix/Zuix.js#L96)

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
|`controllerMembers`|*Object*|Additional methods/properties to add to the context controller.|
|`on`|*Object.&lt;string, <a href="#EventCallback">EventCallback</a>>* \| *Object.&lt;string, string>* \| *undefined*|The map of event handlers for standard and component's events. An event can also be simply routed to another component's event by specifying the mapped event name string. HTML attribute equivalent: *z-on*.|
|`behavior`|*Object.&lt;string, <a href="#EventCallback">EventCallback</a>>* \| *Object.&lt;string, string>* \| *undefined*|The map of event handlers for behaviors. An event can also be simply routed to another component's event by specifying the mapped event name string. HTML attribute equivalent: *z-behavior*.|
|`css`|*HTMLStyleElement* \| *string* \| *boolean* \| *undefined*|Custom stylesheet to apply to the component's view.|
|`encapsulation`|*boolean* \| *undefined*|Whether to use style encapsulation or not (**default:** false).|
|`resetCss`|*boolean* \| *undefined*|Whether to reset view style to prevent inheriting from parent containers (**default:** false).|
|`cext`|*string* \| *undefined*|When loading content of the view, appends the specified extension instead of *.html*.|
|`html`|*boolean* \| *string* \| *undefined*|It can be set to `false`, to disable HTML template loading, or it can be set to a string containing the inline HTML template code.|
|`lazyLoad`|*boolean* \| *undefined*|Enables or disables lazy-loading (**default:** false). HTML attribute equivalent: *z-lazy*.|
|`priority`|*number* \| *undefined*|Loading priority (**default:** 0). HTML attribute equivalent: *z-priority*.|
|`fetchOptions`|*Object* \| *undefined*|Options to be used when fetching this component resources.|
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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 105](../../zuix/Zuix.js#L105)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 113](../../zuix/Zuix.js#L113)

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