# Class: ObservableObject

## ObservableObject

**ObservableObject**

#### new ObservableObject(context, target, handler)

ObservableObject class.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`context`|*Object*|The observer context|
|`target`|*Object*|The target object to observe|
|`handler`|*ProxyHandler*|Handler for get/set callbacks|

<!--

*Source:*
[observable/ObservableObject.js](observable/ObservableObject.js), [line 41](observable/ObservableObject.js#L41)

-->

---------------

### Methods

#### subscribe(observableListener)

Subscribe a listener to this observable events

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`observableListener`|*[ObservableListener](ObservableListener.md)*||

<!--

*Source:*
[observable/ObservableObject.js](observable/ObservableObject.js), [line 63](observable/ObservableObject.js#L63)

-->

##### Returns

ObservableObject

#### unsubscribe(observableListener)

Unsubscribe a listener

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`observableListener`|*[ObservableListener](ObservableListener.md)*||

<!--

*Source:*
[observable/ObservableObject.js](observable/ObservableObject.js), [line 80](observable/ObservableObject.js#L80)

-->

##### Returns

ObservableObject