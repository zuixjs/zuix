---
layout: side_drawer.liquid
tags: api
options: mdl highlight
icon: construction
title: "zuix.js <i class='material-icons'>emoji_nature</i> API"
description: "zUIx.js API documentation, Class: ContextController"
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

## `ContextController` class

### Constructor

<a name="ContextController"></a>
#### new ContextController(context) &rarr; {[ContextController](../../zuix/ContextController)}

ContextController constructor.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`context`|*[ComponentContext](../../zuix/ComponentContext)*||

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 79](../../zuix/ContextController.js#L79)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*

### Properties

<a name="log"></a>
#### log &rarr; *[Logger](../../helpers/Logger)*

The component's built-in logger.

<a name="init"></a>
#### init &rarr; *[ContextControllerInitCallback](#ContextControllerInitCallback)*

If set, this function gets called before component is created and before applying context options.

<a name="create"></a>
#### create &rarr; *[ContextControllerCreateCallback](#ContextControllerCreateCallback)*

If set, this function gets called after loading, when the component is created and its view (if provided) is loaded.

<a name="update"></a>
#### update &rarr; *[ContextControllerUpdateCallback](#ContextControllerUpdateCallback)*

If set, this function gets called each time the data model is updated.

<a name="dispose"></a>
#### dispose &rarr; *[ContextControllerDisposeCallback](#ContextControllerDisposeCallback)*

If set, this function gets called when the component is about to be disposed.

### Methods

<a name="addBehavior"></a>
#### addBehavior(eventPath, handler) &rarr; {[ContextController](../../zuix/ContextController)}

Adds a behavior handler.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|Event path.|
|`handler`|*[EventCallback](#EventCallback)*|Behavior handler.|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 196](../../zuix/ContextController.js#L196)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*

<a name="addEvent"></a>
#### addEvent(eventPath, handler) &rarr; {[ContextController](../../zuix/ContextController)}

Adds an event handler.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|Event path.|
|`handler`|*[EventCallback](#EventCallback)*|Event hanler.|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 185](../../zuix/ContextController.js#L185)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*

<a name="addTransition"></a>
#### addTransition(className, properties, options)

Adds a CSS transition effect to the component stylesheet.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*|CSS class name to assign to this transition.|
|`properties`|*Array.&lt;Object>* \| *JSON*|List of CSS properties/values to set.|
|`options`|*Array.&lt;Object>* \| *JSON*|List of transition options.|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 207](../../zuix/ContextController.js#L207)

-->

<a name="clearCache"></a>
#### clearCache()

Clears the fields cache.

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 234](../../zuix/ContextController.js#L234)

-->

<a name="expose"></a>
#### expose(name, handler) &rarr; {[ContextController](../../zuix/ContextController)}

Exposes a method or property declared in the private
scope of the controller, as a public member of the
component context object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`name`|*string* \| *JSON*|  |Name of the exposed method/property, or list of name/value pairs|
|`handler`|*function*|*optional*  |Function or property descriptor.|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 348](../../zuix/ContextController.js#L348)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*
 &dash; The `{ContextController}` itself.

<a name="field"></a>
#### field(fieldName) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Gets view's field(s) with the specified name.
Same as [ComponentContext&ndash;field](../ComponentContext/#field).

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`fieldName`|*string*|Value to match in the *z-field* attribute|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 228](../../zuix/ContextController.js#L228)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A `{ZxQuery}` object wrapping the matching element(s).

<a name="for"></a>
#### for(componentId) &rarr; {[ContextController](../../zuix/ContextController)}

Registers this one as the default controller
for the given component type.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`componentId`|*string*|Component identifier|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 441](../../zuix/ContextController.js#L441)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*
 &dash; The `{ContextController}` itself.

##### Example

```js
// Controller of component 'path/to/component_name'
var ctrl = zuix.controller(function(cp) {
    // `cp` is the {ContextController}
    cp.create = function() { ... };
    cp.dispose = function() { ... }
}).for('path/to/component_name');
```

<a name="loadCss"></a>
#### loadCss(options) &rarr; {[ContextController](../../zuix/ContextController)}

Loads the `.css` file and replace the current view style of the component.
If no `options.path` is specified, it will try to load
the file with the same base-name as the `componentId`.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`options`|*object*|*optional*  |The options object|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 384](../../zuix/ContextController.js#L384)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*
 &dash; The ```{ContextController}``` object itself.

##### Example

```js
// loads 'path/to/component_name.css' by default
cp.loadCss();
// or loads the view css with provided options
cp.loadCss({
    path: 'url/of/style/file.css',
    success: function() { ... },
    error: function(err) { ... },
    then: function() { ... }
});
```

<a name="loadHtml"></a>
#### loadHtml(options) &rarr; {[ContextController](../../zuix/ContextController)}

Loads the `.html` file and replace the view markup of the component.
If no `options.path` is specified, it will try to load the
file with the same base-name as the `componentId`.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`options`|*object*|*optional*  |The options object|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 410](../../zuix/ContextController.js#L410)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*
 &dash; The ```{ContextController}``` object itself.

##### Example

```js
// loads 'path/to/component_name.html' by default
cp.loadHtml();
// or loads the view html with provided options
cp.loadHtml({
    path: 'url/of/view/file.html',
    success: function() { ... },
    error: function(err) { ... },
    then: function() { ... }
});
```

<a name="model"></a>
#### model(model) &rarr; {[ContextController](../../zuix/ContextController)|object}

Gets/Sets the data model of the component.
Same as [ComponentContext&ndash;model](../ComponentContext/#model).

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`model`|*object* \| *undefined*|*optional*  |The model object|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 282](../../zuix/ContextController.js#L282)

-->

##### Returns

*[ContextController](../../zuix/ContextController)* \| *object*

<a name="options"></a>
#### options() &rarr; {[ContextOptions](#ContextOptions)|any}

Gets the component options.
Same as [ComponentContext&ndash;options](../ComponentContext/#options).

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 294](../../zuix/ContextController.js#L294)

-->

##### Returns

*[ContextOptions](#ContextOptions)* \| *any*
 &dash; The component options.

<a name="trigger"></a>
#### trigger(eventPath, eventData, isHook) &rarr; {[ContextController](../../zuix/ContextController)}

Triggers the component event `eventPath` with the given
`eventData` object. To listen to a component event use the
`{ComponentContext}.on(eventPath, handler)` method or
in case `isHook` is set to true, use the
`zuix.hook(eventPath, handler)` method (global hook event).

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`eventPath`|*string*|  |The event path|
|`eventData`|*object*|  |The event data|
|`isHook`|*boolean*|*optional*  |Trigger as global hook event|

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 321](../../zuix/ContextController.js#L321)

-->

##### Returns

*[ContextController](../../zuix/ContextController)*

##### Example

```js
// somewhere inside the slide-show component controller
cp.trigger('slide:change', slideIndex);

// somewhere in a page hosting the slide-show component
// set component event listeners
zuix.context('my-slide-show')
  .on('slide:change', function(slideIndex) { ... })
  .on(...);
```

<a name="view"></a>
#### view(filter) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Gets the component view or if `filter` argument is passed,
gets the view elements matching the given `filter`
(shorthand for `cp.view().find(filter)`).

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`filter`|*string* \| *undefined*|*optional*  ||

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 255](../../zuix/ContextController.js#L255)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*

##### Example

```js
// get all `checkbox` elements with `.checked` class.
var choices = cp.view('input[type="checkbox"].checked');
choices.removeClass('.checked');
// ...
// hide the component's view
cp.view().hide();
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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 63](../../zuix/ComponentContext.js#L63)

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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 73](../../zuix/ComponentContext.js#L73)

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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 43](../../zuix/ComponentContext.js#L43)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 83](../../zuix/Zuix.js#L83)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 92](../../zuix/Zuix.js#L92)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 57](../../zuix/Zuix.js#L57)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 101](../../zuix/Zuix.js#L101)

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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 52](../../zuix/ComponentContext.js#L52)

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
|`type`|*'transition'* \| *'animation'*||
           |The type of effect to play.|
|`target`|*Element* \| *[ZxQuery](../../helpers/ZxQuery)*||
           |Target element.|
|`classes`|*Array.&lt;string>* \| *string*||
           |List of transition or animation classes to play.|
|`options`|*object*||*optional*<br>
           |Transition/animation options ('delay', 'duration', etc..).|
|`holdState`|*boolean*||*optional*<br>
           |Hold last transition/animation class.|
|`onStep`|*[PlayFxCallback](#PlayFxCallback)*||*optional*<br>
           |Since class list can contain more than just two classes, this callback will be called after each pair of transition/animation ended.|
|`onEnd`|*[PlayFxCallback](#PlayFxCallback)*||*optional*<br>
           |Called when all transitions/animations ended.|

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 109](../../zuix/Zuix.js#L109)

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