# Class: ComponentContext

## ComponentContext

#### new ComponentContext(zuixInstance, options, eventCallback) &rarr; {[ComponentContext](ComponentContext.md)}

The component context object.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`zuixInstance`|*[Zuix](Zuix.md)*|  ||
|`options`|*[ContextOptions](global.md#ContextOptions)*|  |The context options.|
|`eventCallback`|*function*|*optional*  |Event routing callback.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 134](zuix/ComponentContext.js#L134)

-->

##### Returns

`ComponentContext`
The component context instance.

---------------

### Members

#### &lt;_package_&gt; _behaviorMap

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 174](zuix/ComponentContext.js#L174)

-->

#### &lt;_protected_&gt; _c :[ContextController](ContextController.md)

##### Type:
_*[ContextController](ContextController.md)*
_

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 180](zuix/ComponentContext.js#L180)

-->

#### &lt;_protected_&gt; _container

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 146](zuix/ComponentContext.js#L146)

-->

#### &lt;_protected_&gt; _controller :[ContextControllerHandler](global.md#ContextControllerHandler)

##### Type:
_*[ContextControllerHandler](global.md#ContextControllerHandler)*
_

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 160](zuix/ComponentContext.js#L160)

-->

#### &lt;_protected_&gt; _css

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 153](zuix/ComponentContext.js#L153)

-->

#### &lt;_package_&gt; _eventMap

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 172](zuix/ComponentContext.js#L172)

-->

#### &lt;_protected_&gt; _model

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 149](zuix/ComponentContext.js#L149)

-->

#### &lt;_protected_&gt; _modelListener :[ObservableListener](ObservableListener.md)

##### Type:
_*[ObservableListener](ObservableListener.md)*
_

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 186](zuix/ComponentContext.js#L186)

-->

#### &lt;_protected_&gt; _style

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 155](zuix/ComponentContext.js#L155)

-->

#### &lt;_protected_&gt; _view

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 151](zuix/ComponentContext.js#L151)

-->

### Methods

#### container(container) &rarr; {[ComponentContext](ComponentContext.md)|Element}

Gets/Sets the container element of the component.
Returns the current container element if no
argument is passed, the {ComponentContext} itself
otherwise.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`container`|*Element*|*optional*  |The container element.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 299](zuix/ComponentContext.js#L299)

-->

##### Returns

`ComponentContext,Element`

#### controller(controller) &rarr; {[ComponentContext](ComponentContext.md)|[ContextControllerHandler](global.md#ContextControllerHandler)}

Gets/Sets the handler function of the controller.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`controller`|*[ContextControllerHandler](global.md#ContextControllerHandler)* \| *undefined*|*optional*  |The handler function of the controller.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 574](zuix/ComponentContext.js#L574)

-->

##### Returns

`ComponentContext,ContextControllerHandler`

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
ctx.controller(function(cp) {
     cp.create = function() {
          cp.view().html('Hello World!');
     };
     // ...
 });
</code></pre>

#### getCssId() &rarr; {string}

Gets the CSS identifier attribute.

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 906](zuix/ComponentContext.js#L906)

-->

##### Returns

`string`
The css-id attribute of this component

#### model(model) &rarr; {[ComponentContext](ComponentContext.md)|object}

Gets/Sets the data model of the component.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`model`|*object* \| *undefined*|*optional*  |The model object.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 533](zuix/ComponentContext.js#L533)

-->

##### Returns

`ComponentContext,object`

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
ctx.model({
     title: 'Thoughts',
     message: 'She stared through the window at the stars.'
 });
</code></pre>

#### modelToView() &rarr; {[ComponentContext](ComponentContext.md)}

Copies values from the data model to the ```data-ui-field```
elements declared in the component view.

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 872](zuix/ComponentContext.js#L872)

-->

##### Returns

`ComponentContext`
The ```{ComponentContext}``` object itself.

#### name() &rarr; {string}

Gets the name of this component (last part of the path)

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 927](zuix/ComponentContext.js#L927)

-->

##### Returns

`string`
The name of this component

#### on(eventPath, eventHandler) &rarr; {[ComponentContext](ComponentContext.md)}

Listens for a component event.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`eventPath`|*string*|The event path.|
|`eventHandler`|*[EventCallback](global.md#EventCallback)*|The event handling function.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 623](zuix/ComponentContext.js#L623)

-->

##### Returns

`ComponentContext`
The ```{ComponentContext}``` object itself.

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
ctx.on('item:share', function(evt, data) { ... });
</code></pre>

#### options(options) &rarr; {[ComponentContext](ComponentContext.md)|object}

Gets/Sets the component options.

##### Parameters

|Name|Type|Description|
|----|----|-----------|
|`options`|*[ContextOptions](global.md#ContextOptions)* \| *undefined*|The JSON options object.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 588](zuix/ComponentContext.js#L588)

-->

##### Returns

`ComponentContext,object`

#### path() &rarr; {string}

Gets the base path of this component

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 914](zuix/ComponentContext.js#L914)

-->

##### Returns

`string`
The base path of this component

#### style(css) &rarr; {[ComponentContext](ComponentContext.md)|Element}

Gets/Sets the view style of the component.
The `css` argument can be a string containing all
styles definitions or a reference to a style
element. When a string is passed the css
is linked to the `componentId` attribute so that
its styles will be only applied to the component
container.
If no argument is given, then the current style
element is returned.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`css`|*string* \| *Element* \| *undefined*|*optional*  |The CSS string or element.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 481](zuix/ComponentContext.js#L481)

-->

##### Returns

`ComponentContext,Element`

##### Example

<small>Example - JavaScript</small>
<pre><code class="language-js">
ctx.style("p { font-size: 120%; } .hidden { display: 'none'; }");
</code></pre>

#### view(view) &rarr; {[ComponentContext](ComponentContext.md)|Element}

Gets/Sets the view element of the component.
If an *HTML* string is passed, then the view element
will be a new `div` wrapping the given markup.
Returns the current view element if no
argument is passed, the {ComponentContext} itself otherwise.

##### Parameters

|Name|Type|Argument|Description|
|----|----|--------|-----------|
|`view`|*Element* \| *string* \| *undefined*|*optional*  |The *HTML* string or element of the view.|

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 319](zuix/ComponentContext.js#L319)

-->

##### Returns

`ComponentContext,Element`

#### viewToModel() &rarr; {[ComponentContext](ComponentContext.md)}

Creates the data model starting from ```data-ui-field```
elements declared in the component view.

<!--

*Source:*
[zuix/ComponentContext.js](zuix/ComponentContext.js), [line 829](zuix/ComponentContext.js#L829)

-->

##### Returns

`ComponentContext`
The ```{ComponentContext}``` object itself.