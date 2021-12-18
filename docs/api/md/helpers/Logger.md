# Class: Logger

## Logger

**Logger**

#### new Logger()

Simple Logging Helper

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 54](helpers/Logger.js#L54)

-->

---------------

### Methods

#### console(enable)

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`enable`|*boolean*||

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 136](helpers/Logger.js#L136)

-->

##### Returns

undefined

#### debug() &rarr; {[Logger](Logger.md)}

Logs debug messages.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`...args`|*Array.&lt;Object>*||

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 188](helpers/Logger.js#L188)

-->

##### Returns

`Logger`

#### error() &rarr; {[Logger](Logger.md)}

Logs error messages.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`...args`|*Array.&lt;Object>*||

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 177](helpers/Logger.js#L177)

-->

##### Returns

`Logger`

#### info() &rarr; {[Logger](Logger.md)}

Logs information messages.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`...args`|*Array.&lt;Object>*||

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 155](helpers/Logger.js#L155)

-->

##### Returns

`Logger`

#### monitor(callback)

Sets a callback function for monitoring all log messages.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`callback`|*[LoggerMonitorCallback](global.md#LoggerMonitorCallback)*||

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 126](helpers/Logger.js#L126)

-->

##### Returns

undefined

#### trace() &rarr; {[Logger](Logger.md)}

Logs trace messages.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`...args`|*Array.&lt;Object>*||

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 199](helpers/Logger.js#L199)

-->

##### Returns

`Logger`

#### warn() &rarr; {[Logger](Logger.md)}

Logs warning messages.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`...args`|*Array.&lt;Object>*||

<!--

*Source:*
[helpers/Logger.js](helpers/Logger.js), [line 166](helpers/Logger.js#L166)

-->

##### Returns

`Logger`