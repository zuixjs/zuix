# Class: ObservableListener

## ObservableListener

**ObservableListener**

#### new ObservableListener()

ObservableListener interface.

<!--

*Source:*
[observable/ObservableListener.js](observable/ObservableListener.js), [line 35](observable/ObservableListener.js#L35)

-->

---------------

### Methods

#### get(target, key, value, path)

This method does...

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`target`|*Object*|The updated object|
|`key`|*string*|The property key|
|`value`|*Object*|The value|
|`path`|*string*|Full property path|

<!--

*Source:*
[observable/ObservableListener.js](observable/ObservableListener.js), [line 46](observable/ObservableListener.js#L46)

-->

##### Returns

undefined

#### set(target, key, value, path, old)

This method does...

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`target`|*Object*|The updated object|
|`key`|*string*|The property key|
|`value`|*Object*|The value|
|`path`|*string*|Full property path|
|`old`|*Object*|A copy of the object before the update|

<!--

*Source:*
[observable/ObservableListener.js](observable/ObservableListener.js), [line 58](observable/ObservableListener.js#L58)

-->

##### Returns

undefined