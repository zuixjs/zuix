---
layout: side_drawer.liquid
tags: api
options: mdl highlight
icon: construction
title: "zuix.js <i class='material-icons'>emoji_nature</i> API"
description: "zUIx.js API documentation, Class: ZxQuery"
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

## `ZxQuery` class

### Constructor

<a name="ZxQuery"></a>
#### new ZxQuery(element) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

The constructor takes one optional argument that can be
a DOM element, a node list or a valid DOM query selector string expression.
If no parameter is given, the resulting ZxQuery object will wrap the
root *document* element.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`element`|*Object* \| *[ZxQuery](../../helpers/ZxQuery)* \| *Array.&lt;Node>* \| *Node* \| *NodeList* \| *string* \| *undefined*|*optional*  |Element or list of elements to include in the ZxQuery object or any valid DOM query selector string|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 226](../../helpers/ZxQuery.js#L226)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object containing the given element(s).

### Methods

<a name="addClass"></a>
#### addClass(className) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Adds the given CSS class to the class list of all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*|The CSS class name.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 564](../../helpers/ZxQuery.js#L564)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="append"></a>
#### append(el) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Appends the given element or HTML string to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`el`|*Object* \| *[ZxQuery](../../helpers/ZxQuery)* \| *Array.&lt;Node>* \| *Node* \| *NodeList* \| *string*|Element or HTML to append.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 643](../../helpers/ZxQuery.js#L643)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="attach"></a>
#### attach() &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Re-attaches to its parent the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 705](../../helpers/ZxQuery.js#L705)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*

<a name="attr"></a>
#### attr(attr, val) &rarr; {string|[ZxQuery](../../helpers/ZxQuery)}

Gets the value of an attribute for the first element in the ZxQuery object,
or sets one or more attributes for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`attr`|*string* \| *JSON*|  |The attribute name.|
|`val`|*string* \| *undefined*|*optional*  |The attribute value.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 405](../../helpers/ZxQuery.js#L405)

-->

##### Returns

*string* \| *[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself.

<a name="checked"></a>
#### checked(check) &rarr; {[ZxQuery](../../helpers/ZxQuery)|boolean}

Gets the `checked` attribute of the first element in the ZxQuery object,
or sets the `checked` attribute value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`check`|*boolean* \| *undefined*|*optional*  |Value to assign to the 'checked' attribute.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 615](../../helpers/ZxQuery.js#L615)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)* \| *boolean*

<a name="children"></a>
#### children(filter) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Gets the children matching the given selector filter.
This only applies to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`filter`|*string*|*optional*  |A valid DOM query selector filter (**default:** *all children*).|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 284](../../helpers/ZxQuery.js#L284)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A new *ZxQuery* object containing the selected *children*.

<a name="css"></a>
#### css(prop, val) &rarr; {string|[ZxQuery](../../helpers/ZxQuery)}

Gets the value of a CSS property for the first element in the ZxQuery object,
or sets one or more CSS property for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`prop`|*string* \| *JSON*|  |The CSS property name or JSON list of property/value pairs.|
|`val`|*string* \| *undefined*|*optional*  |The CSS property value.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 545](../../helpers/ZxQuery.js#L545)

-->

##### Returns

*string* \| *[ZxQuery](../../helpers/ZxQuery)*
 &dash; The CSS property value when no *val* specified, otherwise the *ZxQuery* object itself.

<a name="detach"></a>
#### detach() &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Detaches from its parent the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 688](../../helpers/ZxQuery.js#L688)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*

<a name="display"></a>
#### display(mode) &rarr; {string|[ZxQuery](../../helpers/ZxQuery)}

Gets the CSS `display` property of the first element in the ZxQuery object,
or sets the `display` property value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`mode`|*string* \| *undefined*|*optional*  |The display value.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 726](../../helpers/ZxQuery.js#L726)

-->

##### Returns

*string* \| *[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *display* value when no *mode* specified, otherwise the *ZxQuery* object itself.

<a name="each"></a>
#### each(iterationCallback) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Iterates through all *DOM* elements in the selection.
The context object *this*, passed to the
*iterationCallback*`(index, item)` function, will be the
*DOM* element corresponding the current iteration.
`index` will be the iteration count, and `item`
the current Element. The function context `this` will be a
`{ZxQuery}` instance containing the current `item`.
To interrupt the iteration loop, return `false` in the callback
function or return `true` to continue to the next iteration.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`iterationCallback`|*[ElementsIterationCallback](#ElementsIterationCallback)*|The callback function to call for each element in the ZxQuery object.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 393](../../helpers/ZxQuery.js#L393)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="eq"></a>
#### eq(i) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Gets a new ZxQuery object containing the element
located at the given position in the current ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`i`|*number*|Position of element.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 319](../../helpers/ZxQuery.js#L319)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A new *ZxQuery* object containing the selected element.

<a name="find"></a>
#### find(selector) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Selects all descendants matching the given *DOM* query selector filter.
This only applies to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`selector`|*string*|A valid *DOM* query selector.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 375](../../helpers/ZxQuery.js#L375)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A new *ZxQuery* object containing the selected elements.

<a name="get"></a>
#### get(i) &rarr; {Node|Element|HTMLElement}

Gets the DOM Element located at the given position in the ZxQuery object.
If no index is provided, the default element will be returned.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`i`|*number*|*optional*  |Position of element (**default:** 0).|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 308](../../helpers/ZxQuery.js#L308)

-->

##### Returns

*Node* \| *Element* \| *HTMLElement*
 &dash; The *DOM* element.

<a name="hasClass"></a>
#### hasClass(className) &rarr; {boolean}

Returns *true* if the first element in the ZxQuery object contains the given CSS class.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*|The CSS class name.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 577](../../helpers/ZxQuery.js#L577)

-->

##### Returns

*boolean*
 &dash; *true* if the element contains the given CSS class, *false* otherwise.

<a name="hide"></a>
#### hide() &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Sets the CSS `display` property to 'none'.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 765](../../helpers/ZxQuery.js#L765)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="html"></a>
#### html(htmlText) &rarr; {[ZxQuery](../../helpers/ZxQuery)|string}

Gets the HTML string of the first element in the ZxQuery object,
or sets the HTML string for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`htmlText`|*string* \| *undefined*|*optional*  |HTML text.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 601](../../helpers/ZxQuery.js#L601)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)* \| *string*

<a name="index"></a>
#### index(el) &rarr; {number}

If no `el` is given, returns the position of the first element in the ZxQuery object
relative to its parent's children list, otherwise the position of the given `el` in the
ZxQuery object selection.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`el`|*[ZxQuery](../../helpers/ZxQuery)*|*optional*  ||

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 358](../../helpers/ZxQuery.js#L358)

-->

##### Returns

*number*

<a name="insert"></a>
#### insert(index, el) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Inserts the given child element before the one located at the specified index
to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`index`|*number*|Position where to insert `el` Element.|
|`el`|*Object* \| *[ZxQuery](../../helpers/ZxQuery)* \| *Array.&lt;Node>* \| *Node* \| *NodeList*|Element to insert.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 659](../../helpers/ZxQuery.js#L659)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="isEmpty"></a>
#### isEmpty() &rarr; {boolean}

Returns *true* if the first element markup code is empty.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 525](../../helpers/ZxQuery.js#L525)

-->

##### Returns

*boolean*
 &dash; *true* if the element is empty, *false* otherwise.

<a name="isPlaying"></a>
#### isPlaying() &rarr; {boolean|*}

Returns true if a transition or animation is running.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 794](../../helpers/ZxQuery.js#L794)

-->

##### Returns

*boolean* \| ***

<a name="length"></a>
#### length() &rarr; {Number}

Gets the number of elements in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 261](../../helpers/ZxQuery.js#L261)

-->

##### Returns

*Number*
 &dash; Number of DOM elements.

<a name="next"></a>
#### next() &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Moves to the next sibling in the DOM.
This only applies to the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 347](../../helpers/ZxQuery.js#L347)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A new *ZxQuery* object containing the next sibling element.

<a name="off"></a>
#### off(eventPath, eventHandler) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Stops listening for the given event.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`eventPath`|*string* \| *Array.&lt;Object>* \| *JSON*|  |Event path or object with event/handler pairs.|
|`eventHandler`|*function*|*optional*  |Event handler. Not used if eventPath is an object with event/handler pairs.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 498](../../helpers/ZxQuery.js#L498)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="on"></a>
#### on(eventPath, eventHandler) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Listens to the given event for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`eventPath`|*string* \| *Array.&lt;Object>* \| *JSON*|  |Event path or object with event/handler pairs.|
|`eventHandler`|*function*|*optional*  |Event handler. Not used if eventPath is an object with event/handler pairs.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 473](../../helpers/ZxQuery.js#L473)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="one"></a>
#### one(eventPath, eventHandler) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Listens once to the given event for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`eventPath`|*string* \| *Array.&lt;Object>* \| *JSON*|  |Event path or object with event/handler pairs.|
|`eventHandler`|*function*|*optional*  |Event handler. Not used if eventPath is an object with event/handler pairs.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 443](../../helpers/ZxQuery.js#L443)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="parent"></a>
#### parent(filter) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Gets the closest parent matching the given selector filter.
This only applies to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`filter`|*string*|*optional*  |A valid DOM query selector filter (**default:** *first parent*).|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 271](../../helpers/ZxQuery.js#L271)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A new *ZxQuery* object containing the matching parent element.

<a name="playAnimation"></a>
#### playAnimation(options) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Plays the animation specified by the given animation class list. If no class list is provided,
the callback function can be used to wait for the end of any currently running animation.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`options`|*Array.&lt;string>* \| *string* \| *[PlayFxConfig](#PlayFxConfig)*|This parameter can be either: a list of classes (Array<string>), or a string with whitespace-separated class names, or a {PlayFxConfig} object.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 786](../../helpers/ZxQuery.js#L786)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*

<a name="playTransition"></a>
#### playTransition(options) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Plays the transition effect specified by the given transition class list. If no class list is provided,
the callback function can be used to wait for the end of any currently running animation.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`options`|*Array.&lt;string>* \| *string* \| *[PlayFxConfig](#PlayFxConfig)*|This parameter can be either: a list of classes (Array<string>), or a string with whitespace-separated class names, or a {PlayFxConfig} object.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 775](../../helpers/ZxQuery.js#L775)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*

<a name="position"></a>
#### position() &rarr; {[ElementPosition](#ElementPosition)}

Gets coordinates and visibility status of the first element.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 533](../../helpers/ZxQuery.js#L533)

-->

##### Returns

*[ElementPosition](#ElementPosition)*

<a name="prepend"></a>
#### prepend(el) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Prepends the given element or HTML string to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`el`|*Object* \| *[ZxQuery](../../helpers/ZxQuery)* \| *Array.&lt;Node>* \| *Node* \| *NodeList* \| *string*|Element to append.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 675](../../helpers/ZxQuery.js#L675)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="prev"></a>
#### prev() &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Moves to the previous sibling in the DOM.
This only applies to the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 338](../../helpers/ZxQuery.js#L338)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; A new *ZxQuery* object containing the previous sibling element.

<a name="removeClass"></a>
#### removeClass(className) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Removes the given CSS class from all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*|The CSS class name.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 586](../../helpers/ZxQuery.js#L586)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="reset"></a>
#### reset() &rarr; {[ZxQuery](../../helpers/ZxQuery)}

De-registers all event handlers of all elements in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 516](../../helpers/ZxQuery.js#L516)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="reverse"></a>
#### reverse() &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Reverses order of the elements in the current set.

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 296](../../helpers/ZxQuery.js#L296)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="show"></a>
#### show(mode) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Sets the CSS `display` property to '' if no argument value is provided, otherwise set it to the given value.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`mode`|*string*|*optional*  |Set the display mode to be used to show element (eg. block, inline, etc..).|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 757](../../helpers/ZxQuery.js#L757)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="trigger"></a>
#### trigger(eventPath, eventData) &rarr; {[ZxQuery](../../helpers/ZxQuery)}

Triggers the given event for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|Path of the event to trigger.|
|`eventData`|*object*|Value of the event.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 429](../../helpers/ZxQuery.js#L429)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *ZxQuery* object itself.

<a name="value"></a>
#### value(value) &rarr; {[ZxQuery](../../helpers/ZxQuery)|string}

Gets the `value` attribute of the first element in the ZxQuery object,
or sets the `value` attribute value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`value`|*string* \| *undefined*|*optional*  |Value to assign to the 'value' attribute.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 630](../../helpers/ZxQuery.js#L630)

-->

##### Returns

*[ZxQuery](../../helpers/ZxQuery)* \| *string*

<a name="visibility"></a>
#### visibility(mode) &rarr; {string|[ZxQuery](../../helpers/ZxQuery)}

Gets the CSS `visibility` property of the first element in the ZxQuery object,
or sets the `visibility` property value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`mode`|*string* \| *undefined*|*optional*  |The visibility value.|

<!--

*Source:*
[helpers/ZxQuery.js](../../helpers/ZxQuery.js), [line 742](../../helpers/ZxQuery.js#L742)

-->

##### Returns

*string* \| *[ZxQuery](../../helpers/ZxQuery)*
 &dash; The *visibility* value when no *mode* specified, otherwise the *ZxQuery* object itself.

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