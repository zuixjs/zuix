# Class: Componentizer

## Componentizer

**Componentizer**

#### new Componentizer()

<!--

*Source:*
[zuix/Componentizer.js](zuix/Componentizer.js), [line 191](zuix/Componentizer.js#L191)

-->

---------------

### Methods

#### componentize(element, child) &rarr; {[Componentizer](Componentizer.md)}

TODO: describe this...

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`element`|*Element* \| *[ZxQuery](ZxQuery.md)* \| *undefined*|*optional*  |Scan and process loadable elements inside `element`.|
|`child`|*Element* \| *undefined*|*optional*  |Process only the specified `child` of `element`.|

<!--

*Source:*
[zuix/Componentizer.js](zuix/Componentizer.js), [line 41](zuix/Componentizer.js#L41)

-->

##### Returns

`Componentizer`

#### lazyLoad(enable, threshold) &rarr; {boolean}

Enable/Disable lazy-loading, or get current value.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`enable`|*boolean*|*optional*  |Enable or disable lazy loading.|
|`threshold`|*number*|*optional*  |Load-ahead threshold (default is 1.0 => 100% of view size).|

<!--

*Source:*
[zuix/Componentizer.js](zuix/Componentizer.js), [line 79](zuix/Componentizer.js#L79)

-->

##### Returns

`boolean`
*true* if lazy-loading is enabled, *false* otherwise.

#### setHost(zuixInstance) &rarr; {[Componentizer](Componentizer.md)}

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`zuixInstance`|*[Zuix](Zuix.md)*||

<!--

*Source:*
[zuix/Componentizer.js](zuix/Componentizer.js), [line 100](zuix/Componentizer.js#L100)

-->

##### Returns

`Componentizer`

#### willLoadMore() &rarr; {boolean}

<!--

*Source:*
[zuix/Componentizer.js](zuix/Componentizer.js), [line 68](zuix/Componentizer.js#L68)

-->

##### Returns

`boolean`