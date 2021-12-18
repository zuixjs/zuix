# Class: ZxQuery

## ZxQuery

**ZxQuery**

#### new ZxQuery(element) &rarr; {[ZxQuery](ZxQuery.md)}

ZxQuery, a very lite subset of jQuery-like functions
internally used in Zuix for DOM operations.

The constructor takes one optional argument that can be
a DOM element, a node list or a valid DOM query selector string expression.
If no parameter is given, the resulting ZxQuery object will wrap the
root *document* element.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`element`|*Object* \| *[ZxQuery](ZxQuery.md)* \| *Array.&lt;Node>* \| *Node* \| *NodeList* \| *string* \| *undefined*|*optional*  |Element or list of elements to include in the ZxQuery object.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 197](helpers/ZxQuery.js#L197)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object containing the given element(s).

---------------

### Members

#### &lt;_protected_&gt; _selection

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 199](helpers/ZxQuery.js#L199)

-->

### Methods

#### addClass(className) &rarr; {[ZxQuery](ZxQuery.md)}

Adds the given CSS class to the class list of all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*|The CSS class name.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 492](helpers/ZxQuery.js#L492)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### append(el) &rarr; {[ZxQuery](ZxQuery.md)}

Appends the given element or HTML string to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`el`|*Object* \| *[ZxQuery](ZxQuery.md)* \| *Array.&lt;Node>* \| *Node* \| *NodeList* \| *string*|Element or HTML to append.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 602](helpers/ZxQuery.js#L602)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### attach() &rarr; {[ZxQuery](ZxQuery.md)}

Re-attach to its parent the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 662](helpers/ZxQuery.js#L662)

-->

##### Returns

`ZxQuery`

#### attr(attr, val) &rarr; {string|[ZxQuery](ZxQuery.md)}

Gets the value of an attribute for the first element in the ZxQuery object,
or sets one or more attributes for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`attr`|*string* \| *JSON*|  |The attribute name.|
|`val`|*string* \| *undefined*|*optional*  |The attribute value.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 338](helpers/ZxQuery.js#L338)

-->

##### Returns

`string,ZxQuery`
The *attr* attribute value when no *val* specified, otherwise the *ZxQuery* object itself.

#### checked(check) &rarr; {[ZxQuery](ZxQuery.md)|boolean}

Gets the `checked` attribute of the first element in the ZxQuery object,
or sets the `checked` attribute value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`check`|*boolean* \| *undefined*|*optional*  |Value to assign to the 'checked' attribute.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 570](helpers/ZxQuery.js#L570)

-->

##### Returns

`ZxQuery,boolean`

#### children(filter) &rarr; {[ZxQuery](ZxQuery.md)}

Gets the children matching the given selector filter.
This only applies to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`filter`|*string*|*optional*  |A valid DOM query selector filter (**default:** *all children*).|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 254](helpers/ZxQuery.js#L254)

-->

##### Returns

`ZxQuery`
A new *ZxQuery* object containing the selected *children*.

#### css(prop, val) &rarr; {string|[ZxQuery](ZxQuery.md)}

Gets the value of a CSS property for the first element in the ZxQuery object,
or sets one or more CSS property for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`prop`|*string* \| *JSON*|  |The CSS property name or JSON list of property/value pairs.|
|`val`|*string* \| *undefined*|*optional*  |The CSS property value.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 469](helpers/ZxQuery.js#L469)

-->

##### Returns

`string,ZxQuery`
The CSS property value when no *val* specified, otherwise the *ZxQuery* object itself.

#### detach() &rarr; {[ZxQuery](ZxQuery.md)}

Detach from its parent the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 646](helpers/ZxQuery.js#L646)

-->

##### Returns

`ZxQuery`

#### display(mode) &rarr; {string|[ZxQuery](ZxQuery.md)}

Gets the CSS `display` property of the first element in the ZxQuery object,
or sets the `display` property value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`mode`|*string* \| *undefined*|*optional*  |The display value.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 682](helpers/ZxQuery.js#L682)

-->

##### Returns

`string,ZxQuery`
The *display* value when no *mode* specified, otherwise the *ZxQuery* object itself.

#### each(iterationCallback) &rarr; {[ZxQuery](ZxQuery.md)}

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
|`iterationCallback`|*[ElementsIterationCallback](global.md#ElementsIterationCallback)*|The callback function to call for each element in the ZxQuery object.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 326](helpers/ZxQuery.js#L326)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### eq(i) &rarr; {[ZxQuery](ZxQuery.md)}

Gets a new ZxQuery object containing the element
located at the given position in the current ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`i`|*number*|Position of element.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 289](helpers/ZxQuery.js#L289)

-->

##### Returns

`ZxQuery`
A new *ZxQuery* object containing the selected element.

#### find(selector) &rarr; {[ZxQuery](ZxQuery.md)}

Selects all descendants matching the given *DOM* query selector filter.
This only applies to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`selector`|*string*|A valid *DOM* query selector.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 309](helpers/ZxQuery.js#L309)

-->

##### Returns

`ZxQuery`
A new *ZxQuery* object containing the selected elements.

#### get(i) &rarr; {Node|Element}

Gets the DOM Element located at the given position in the ZxQuery object.
If no index is provided, the default element will be returned.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`i`|*number*|*optional*  |Position of element (**default:** 0).|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 278](helpers/ZxQuery.js#L278)

-->

##### Returns

`Node,Element`
The *DOM* element.

#### hasClass(className) &rarr; {boolean}

Returns *true* if the first element in the ZxQuery object contains the given CSS class.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*|The CSS class name.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 509](helpers/ZxQuery.js#L509)

-->

##### Returns

`boolean`
*true* if the element contains the given CSS class, *false* otherwise.

#### hide() &rarr; {[ZxQuery](ZxQuery.md)}

Sets the CSS `display` property to 'none'.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 721](helpers/ZxQuery.js#L721)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### html(htmlText) &rarr; {[ZxQuery](ZxQuery.md)|string}

Gets the HTML string of the first element in the ZxQuery object,
or sets the HTML string for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`htmlText`|*string* \| *undefined*|*optional*  |HTML text.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 554](helpers/ZxQuery.js#L554)

-->

##### Returns

`ZxQuery,string`

#### insert(index, el) &rarr; {[ZxQuery](ZxQuery.md)}

Inserts the given child element before the one located at the specified index
to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`index`|*number*|Position where to insert `el` Element.|
|`el`|*Object* \| *[ZxQuery](ZxQuery.md)* \| *Array.&lt;Node>* \| *Node* \| *NodeList*|Element to insert.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 618](helpers/ZxQuery.js#L618)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### isEmpty() &rarr; {boolean}

Returns *true* if the first element markup code is empty.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 444](helpers/ZxQuery.js#L444)

-->

##### Returns

`boolean`
*true* if the element is empty, *false* otherwise.

#### length() &rarr; {Number}

Gets the number of elements in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 231](helpers/ZxQuery.js#L231)

-->

##### Returns

`Number`
Number of DOM elements.

#### next() &rarr; {[ZxQuery](ZxQuery.md)}

Moves to the next sibling in the DOM.
This only applies to the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 544](helpers/ZxQuery.js#L544)

-->

##### Returns

`ZxQuery`
A new *ZxQuery* object containing the next sibling element.

#### off(eventPath, eventHandler) &rarr; {[ZxQuery](ZxQuery.md)}

Stops listening for the given event.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|Event path.|
|`eventHandler`|*function*|Event handler.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 419](helpers/ZxQuery.js#L419)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### on(eventPath, eventHandler) &rarr; {[ZxQuery](ZxQuery.md)}

Listens to the given event for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|Event path.|
|`eventHandler`|*function*|Event handler.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 399](helpers/ZxQuery.js#L399)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### one(eventPath, eventHandler) &rarr; {[ZxQuery](ZxQuery.md)}

Listens once to the given event for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|Event path.|
|`eventHandler`|*function*|Event handler.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 382](helpers/ZxQuery.js#L382)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### parent(filter) &rarr; {[ZxQuery](ZxQuery.md)}

Gets the closest parent matching the given selector filter.
This only applies to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`filter`|*string*|*optional*  |A valid DOM query selector filter (**default:** *first parent*).|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 241](helpers/ZxQuery.js#L241)

-->

##### Returns

`ZxQuery`
A new *ZxQuery* object containing the matching parent element.

#### position() &rarr; {ElementPosition}

Gets coordinates and visibility status of the first element.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 452](helpers/ZxQuery.js#L452)

-->

##### Returns

`ElementPosition`

#### prepend(el) &rarr; {[ZxQuery](ZxQuery.md)}

Prepends the given element or HTML string to the first element in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`el`|*Object* \| *[ZxQuery](ZxQuery.md)* \| *Array.&lt;Node>* \| *Node* \| *NodeList* \| *string*|Element to append.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 633](helpers/ZxQuery.js#L633)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### prev() &rarr; {[ZxQuery](ZxQuery.md)}

Moves to the previous sibling in the DOM.
This only applies to the first element in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 535](helpers/ZxQuery.js#L535)

-->

##### Returns

`ZxQuery`
A new *ZxQuery* object containing the previous sibling element.

#### removeClass(className) &rarr; {[ZxQuery](ZxQuery.md)}

Removes the given CSS class from all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`className`|*string*|The CSS class name.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 518](helpers/ZxQuery.js#L518)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### reset() &rarr; {[ZxQuery](ZxQuery.md)}

De-register all event handlers of all elements in the ZxQuery object.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 433](helpers/ZxQuery.js#L433)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### reverse() &rarr; {[ZxQuery](ZxQuery.md)}

Reverses order of the elements in the current set.

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 266](helpers/ZxQuery.js#L266)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### show(mode) &rarr; {[ZxQuery](ZxQuery.md)}

Sets the CSS `display` property to '' if no argument value is provided, otherwise set it to the given value.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`mode`|*string*|*optional*  |Set the display mode to be used to show element (eg. block, inline, etc..).|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 713](helpers/ZxQuery.js#L713)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### trigger(eventPath, eventData) &rarr; {[ZxQuery](ZxQuery.md)}

Triggers the given event for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|Path of the event to trigger.|
|`eventData`|*object*|Value of the event.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 362](helpers/ZxQuery.js#L362)

-->

##### Returns

`ZxQuery`
The *ZxQuery* object itself.

#### value(value) &rarr; {[ZxQuery](ZxQuery.md)|string}

Gets the `value` attribute of the first element in the ZxQuery object,
or sets the `value` attribute value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`value`|*string* \| *undefined*|*optional*  |Value to assign to the 'value' attribute.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 587](helpers/ZxQuery.js#L587)

-->

##### Returns

`ZxQuery,string`

#### visibility(mode) &rarr; {string|[ZxQuery](ZxQuery.md)}

Gets the CSS `visibility` property of the first element in the ZxQuery object,
or sets the `visibility` property value for all elements in the ZxQuery object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`mode`|*string* \| *undefined*|*optional*  |The visibility value.|

<!--

*Source:*
[helpers/ZxQuery.js](helpers/ZxQuery.js), [line 698](helpers/ZxQuery.js#L698)

-->

##### Returns

`string,ZxQuery`
The *visibility* value when no *mode* specified, otherwise the *ZxQuery* object itself.