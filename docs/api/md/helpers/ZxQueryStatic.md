---
layout: side_drawer.liquid
tags: api
options: mdl highlight
icon: construction
title: "zuix.js <i class='material-icons'>emoji_nature</i> API"
description: "zUIx.js API documentation, Class: ZxQueryStatic"
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

## `ZxQueryStatic` class

<a name="ZxQueryStatic"></a>
#### ZxQueryStatic(what) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Creates a ZxQuery wrapped element.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`what`|*Object* \| *[ZxQuery](../../helpers/ZxQuery)* \| *Array.&lt;Node>* \| *Node* \| *NodeList* \| *string* \| *undefined*|*optional*  |Query target|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 779](../../helpers/ZxQuery.js#L779)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*

### Methods

<a name="appendCss"></a>
#### appendCss(css, target, cssId) &rarr; {Element|HTMLElement}

Appends a new stylesheet, or replaces an existing one, to the document.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`css`|*string*|Stylesheet text|
|`target`|*Element* \| *HTMLElement* \| *null*|Existing style element to replace|
|`cssId`|*string*|id to assign to the stylesheet|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 1031](../../helpers/ZxQuery.js#L1031)

-->

##### Returns

*Element* \| *HTMLElement*
 &dash; The new style element created out of the given css text.

<a name="classExists"></a>
#### classExists(className) &rarr; {boolean}

Checks if a class exists by searching for it in all document stylesheets.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 895](../../helpers/ZxQuery.js#L895)

-->

##### Returns

*boolean*

<a name="each"></a>
#### each(items, iterationCallback) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Iterates through all objects in the given `items` collection.
The context object *this*, passed to the
*iterationCallback*`(index, item)`, will be the
object corresponding the current iteration and
the `index` passed to the callback will be the iteration count.

If the callback returns *false*, the iteration loop will interrupt.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`items`|*Array.&lt;Object>* \| *JSON*|Enumerable objects collection.|
|`iterationCallback`|*[IterationCallback](#IterationCallback)*|The callback *fn* to call at each iteration|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 795](../../helpers/ZxQuery.js#L795)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; `this`.

<a name="find"></a>
#### find(selector) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Selects document elements matching the given *DOM* query selector.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`selector`|*string*|A valid *DOM* query selector.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 783](../../helpers/ZxQuery.js#L783)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A new *ZxQuery* object containing the selected elements.

<a name="getClosest"></a>
#### getClosest(elem, selector) &rarr; {Element|HTMLElement|null}

Gets the closest parent mathing the given query selector

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`elem`|*Element* \| *HTMLElement*||
|`selector`|*string*|A valid DOM query selector string expression.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 1161](../../helpers/ZxQuery.js#L1161)

-->

##### Returns

*Element* \| *HTMLElement* \| *null*

<a name="getPosition"></a>
#### getPosition(el, tolerance) &rarr; {[ElementPosition](#ElementPosition)}

Gets the position of an element.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`el`|*Element* \| *HTMLElement*|  ||
|`tolerance`|*number*|*optional*  |Distance from viewport's boundaries for the element to be considered 'visible' (this is mainly used for lazy-loading).|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 1179](../../helpers/ZxQuery.js#L1179)

-->

##### Returns

*[ElementPosition](#ElementPosition)*

<a name="hasClass"></a>
#### hasClass(el, className) &rarr; {boolean}

Checks if an element has got the specified CSS class.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`el`|*Element* \| *HTMLElement*||
|`className`|*string*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 872](../../helpers/ZxQuery.js#L872)

-->

##### Returns

*boolean*

<a name="http"></a>
#### http(options) &rarr; {[ZxQueryStatic](../../helpers/ZxQueryStatic)}

Makes an HTTP request.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`options`|*[ZxQueryHttpOptions](#ZxQueryHttpOptions)*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 834](../../helpers/ZxQuery.js#L834)

-->

##### Returns

*[ZxQueryStatic](../../helpers/ZxQueryStatic)*

<a name="replaceBraces"></a>
#### replaceBraces(html, callback) &rarr; {string|null}

Parses variables enclosed in single or double braces and calls the given callback for each parsed variable name.
If the callback returns a value, then the variable will be replaced with the given value.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`html`|*string*|The source HTML template.|
|`callback`|*function*|A callback function with one argument (the currently parsed variable name).|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 1119](../../helpers/ZxQuery.js#L1119)

-->

##### Returns

*string* \| *null*
 &dash; The new html code with variables replaced with values or null if no variable was replaced.

<a name="replaceCssVars"></a>
#### replaceCssVars(css, model) &rarr; {string}

Replaces CSS variables with provided values.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`css`|*string*|Stylesheet text|
|`model`|*object*|Object containing variables fields and values.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 1071](../../helpers/ZxQuery.js#L1071)

-->

##### Returns

*string*
 &dash; The new stylesheet text with variables replaced with values

<a name="wrapElement"></a>
#### wrapElement(containerTag, element) &rarr; {Element|HTMLElement}

Wraps an `Element` inside a container specified by a given tag name.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`containerTag`|*string*|Container element tag name|
|`element`|*Element* \| *HTMLElement*||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 934](../../helpers/ZxQuery.js#L934)

-->

##### Returns

*Element* \| *HTMLElement*
 &dash; The new wrapped element

<a name="addTransition"></a>
#### &lt;_static_&gt; addTransition(cssId, scope, className, properties, options)

Adds a CSS transition effect to the component stylesheet.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`cssId`|||
|`scope`|||
|`className`|*string*|CSS class name to assign to this transition.|
|`properties`|*Array.&lt;Object>* \| *JSON*|List of CSS properties/values to set.|
|`options`|*Array.&lt;Object>* \| *JSON*|List of transition options.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 1292](../../helpers/ZxQuery.js#L1292)

-->

<a name="playTransition"></a>
#### &lt;_static_&gt; playTransition(element, classNames, callback)

Plays transition effects or animations on a given element inside the component.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`element`|*Element* \| *[ZxQuery](../../helpers/ZxQuery)*|  |The target element.|
|`classNames`|*Array.&lt;string>*|  |List of transition/animation classes to apply.|
|`callback`|*[PlayTransitionCallback](#PlayTransitionCallback)*|*optional*  |Callback function to call when all transitions/animations ended.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 1325](../../helpers/ZxQuery.js#L1325)

-->

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
[zuix/ActiveRefresh.js](../../zuix/ActiveRefresh.js), [line 40](../../zuix/ActiveRefresh.js#L40)

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
[zuix/ActiveRefresh.js](../../zuix/ActiveRefresh.js), [line 28](../../zuix/ActiveRefresh.js#L28)

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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 62](../../zuix/ComponentContext.js#L62)

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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 72](../../zuix/ComponentContext.js#L72)

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
[zuix/ComponentCache.js](../../zuix/ComponentCache.js), [line 38](../../zuix/ComponentCache.js#L38)

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
[zuix/ComponentCache.js](../../zuix/ComponentCache.js), [line 26](../../zuix/ComponentCache.js#L26)

-->

<a name="ContextControllerCreateCallback"></a>
#### ContextControllerCreateCallback()

Function that gets called after loading, when the component is actually created and ready.

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 50](../../zuix/ContextController.js#L50)

-->

<a name="ContextControllerDisposeCallback"></a>
#### ContextControllerDisposeCallback()

Function called when the component is about to be disposed.

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 56](../../zuix/ContextController.js#L56)

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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 42](../../zuix/ComponentContext.js#L42)

-->

<a name="ContextControllerInitCallback"></a>
#### ContextControllerInitCallback()

Function that gets called after loading and before the component is created.

<!--

*Source:*
[zuix/ContextController.js](../../zuix/ContextController.js), [line 44](../../zuix/ContextController.js#L44)

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
[zuix/ContextController.js](../../zuix/ContextController.js), [line 32](../../zuix/ContextController.js#L32)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 78](../../zuix/Zuix.js#L78)

-->

<a name="ContextOptions"></a>
#### ContextOptions

This object can be supplied when loading a component. It can be either passed as argument for the
`zuix.load(...)` method in the javascript code, or in the `z-options` attribute of the HTML code
of the component container.

##### Properties

|Name|Type|Description|
|----|----|-----------|
|`contextId`|*Object* \| *undefined*|The context id. HTML attribute equivalent: *z-context*. If not specified it will be randomly generated.|
|`container`|*Element* \| *undefined*|The container element.|
|`model`|*JSON* \| *undefined*|The data model.  HTML attribute equivalent: *z-model*.|
|`view`|*Element* \| *undefined*|The view element. HTML attribute equivalent: *z-view*.|
|`controller`|*[ContextControllerHandler](#ContextControllerHandler)* \| *undefined*|The controller handler.|
|`on`|*Object.&lt;string, <a href="#EventCallback">EventCallback</a>>* \| *Object.&lt;string, string>* \| *undefined*|The map of event handlers for standard and component's events. An event can also be simply routed to another component's event by specifying the mapped event name string.|
|`behavior`|*Object.&lt;string, <a href="#EventCallback">EventCallback</a>>* \| *Object.&lt;string, string>* \| *undefined*|The map of event handlers for behaviors. An event can also be simply routed to another component's event by specifying the mapped event name string.|
|`css`|*HTMLStyleElement* \| *string* \| *boolean* \| *undefined*|Custom stylesheet to apply to the component's view.|
|`encapsulation`|*boolean* \| *undefined*|Whether to use style encapsulation or not (**default:** false).|
|`resetCss`|*boolean* \| *undefined*|Whether to reset view style to prevent inheriting from parent containers (**default:** false).|
|`cext`|*string* \| *undefined*|When loading content of the view, appends the specified extension instead of *.html*.|
|`html`|*boolean* \| *undefined*|Enables or disables HTML template loading (**default:** true).|
|`lazyLoad`|*boolean* \| *undefined*|Enables or disables lazy-loading (**default:** false).|
|`priority`|*number* \| *undefined*|Loading priority (**default:** 0).|
|`ready`|*[ContextReadyCallback](#ContextReadyCallback)* \| *undefined*|The ready callback, triggered once the component is successfully loaded.|
|`error`|*[ContextErrorCallback](#ContextErrorCallback)* \| *undefined*|The error callback, triggered when an error occurs.|

<!--

*Source:*
[zuix/Zuix.js](../../zuix/Zuix.js), [line 54](../../zuix/Zuix.js#L54)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 87](../../zuix/Zuix.js#L87)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 54](../../helpers/ZxQuery.js#L54)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 36](../../helpers/ZxQuery.js#L36)

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
[zuix/ComponentContext.js](../../zuix/ComponentContext.js), [line 51](../../zuix/ComponentContext.js#L51)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 65](../../helpers/ZxQuery.js#L65)

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
[helpers/Logger.js](../../helpers/Logger.js), [line 121](../../helpers/Logger.js#L121)

-->

<a name="PlayTransitionCallback"></a>
#### PlayTransitionCallback($element, transitionQueue)

Callback function used with the `each(..)` method.

##### This
- {<a href="../../helpers/ZxQuery">ZxQuery</a>}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`$element`|*[ZxQuery](../../helpers/ZxQuery)*|Target element (same as 'this').|
|`transitionQueue`|*Array.&lt;string>*|Transition class queue left to animate, `null` if the animation ended.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 119](../../helpers/ZxQuery.js#L119)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 46](../../helpers/ZxQuery.js#L46)

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
[zuix/Zuix.js](../../zuix/Zuix.js), [line 95](../../zuix/Zuix.js#L95)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 74](../../helpers/ZxQuery.js#L74)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 90](../../helpers/ZxQuery.js#L90)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 108](../../helpers/ZxQuery.js#L108)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 82](../../helpers/ZxQuery.js#L82)

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
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 100](../../helpers/ZxQuery.js#L100)

-->