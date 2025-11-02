---
layout: side_drawer.liquid
tags: api
options: mdl highlight
icon: construction
title: "zuix.js <i class='material-icons'>emoji_nature</i> API"
description: "zUIx.js API documentation, Namespace: Utils"
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

## `Utils` namespace

Common utility functions.

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 36](../../helpers/Util.js#L36)

-->

### Namespaces
[[dom](../../helpers/Utils.dom)](namespaces.html#Utils.dom)||

### Methods

<a name="camelCaseToHyphens"></a>
#### &lt;_static_&gt; camelCaseToHyphens(s) &rarr; {string}

Converts the given string to `kebab-case`.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`s`|*string*|The string to convert.|

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 165](../../helpers/Util.js#L165)

-->

##### Returns

*string*
 &dash; The converted string.

<a name="catchContextError"></a>
#### &lt;_static_&gt; catchContextError(ctx, fn, errorCallback)

Catches errors occurred in the specified component context.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`ctx`|*[ComponentContext](../../zuix/ComponentContext)*|The component context.|
|`fn`|*function*|Function code to execute.|
|`errorCallback`|*function*|Error callback.|

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 251](../../helpers/Util.js#L251)

-->

<a name="cloneObject"></a>
#### &lt;_static_&gt; cloneObject(obj) &rarr; {object}

Creates a copy of a given object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`obj`|*object*|The source object.|

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 107](../../helpers/Util.js#L107)

-->

##### Returns

*object*
 &dash; The object copy.

<a name="hasPassiveEvents"></a>
#### &lt;_static_&gt; hasPassiveEvents() &rarr; {boolean}

Returns true if browser supports passive events.

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 132](../../helpers/Util.js#L132)

-->

##### Returns

*boolean*
 &dash; True if supported, otherwise false.

<a name="hyphensToCamelCase"></a>
#### &lt;_static_&gt; hyphensToCamelCase(s) &rarr; {string}

Converts the given string to `camelCase`

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`s`|*string*|The string to convert.|

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 152](../../helpers/Util.js#L152)

-->

##### Returns

*string*
 &dash; The converted string.

<a name="isNoU"></a>
#### &lt;_static_&gt; isNoU(obj) &rarr; {boolean}

Returns true only if object is null || undefined

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`obj`|*object*|The object to test.|

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 48](../../helpers/Util.js#L48)

-->

##### Returns

*boolean*
 &dash; True if null or undefined, otherwise false.

<a name="normalizeControllerCode"></a>
#### &lt;_static_&gt; normalizeControllerCode(javascriptCode) &rarr; {string}

Normalizes controller code (ES5/ES6+) to be wrapped in a function
that returns the controller class, function, or object.

This function is designed to be robust against common code formatting styles,
such as leading comments and global variable declarations before the main export.

ALGORITHM:
1.  The code is "stripped" of all comments to create a clean version for analysis.
2.  It finds the first top-level declaration keyword ('class', 'function', or 'zuix.controller')
    that starts on a new line.
3.  For 'class' or 'function', it extracts a unique "marker" signature from the keyword
    up to the opening brace '{' (e.g., "class MyController extends Base").
4.  It finds this unique marker in the original, unmodified code.
5.  It inserts the 'return' keyword right before the marker in the original code,
    preserving all leading content (comments, global consts, etc.).

KNOWN LIMITATION:
This parser will fail if the exact signature of the class/function declaration
(e.g., "class MyController extends Base") is present inside a comment *before*
the actual code declaration. This is considered a rare edge case.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`javascriptCode`|*string*|The JS code to normalize.|

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 199](../../helpers/Util.js#L199)

-->

##### Returns

*string*
 &dash; Normalized JS controller code.

<a name="propertyFromPath"></a>
#### &lt;_static_&gt; propertyFromPath(o, s) &rarr; {object|undefined}

Gets object property given its name

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`o`|*object*|The object to get property from.|
|`s`|*string*|The property path (dotted/indexed form).|

<!--

*Source:*
[helpers/Util.js](../../helpers/Util.js), [line 58](../../helpers/Util.js#L58)

-->

##### Returns

*object* \| *undefined*
 &dash; The property matching the given path.

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