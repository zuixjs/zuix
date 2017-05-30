## ZUIX.js - Content and Component Manager

ZUIX is a JavaScript library for creating component-based sites and web apps.


### Getting Started

Install and include `zuix.min.js` library using one of the following methods.

###### Local copy

Download and copy the `.js` file to your project folder and include it in your HTML page:

```html
<script src="js/zuix.min.js"></script>
```

[Download **ZUIX v0.4.9-8**](https://genielabs.github.io/zuix/js/zuix.min.js)
*~11 kB (gzipped)*

###### Hosted

Link the `.js` file as an external resource from *GitHub* site:

```html
<script src="https://genielabs.github.io/zuix/js/zuix.min.js"></script>
```

###### NPM

Install from *NPM* for using in your project

    npm install zuix --save

This is currently same as development package (with full source code and docs included), in the future a production ready
`zuix-dist` package will be added instead.

Include the library from *node_modules* folder in your HTML project files:

```html
    <script src="node_modules/zuix/build/js/zuix.min.js"></script>
```


### Examples

The following online examples can also be downloaded as a **.zip** file
containing everything is needed to get you started.

- [**TodoMVC**](https://genielabs.github.io/zuix/examples/todomvc)
*the classic To-Do MVC application implemented as a loadable component*
- [**Hacker News Web**](https://genielabs.github.io/zuix/examples/hackernews)
*example of using* **list_view** *component with progressive/lazy loading*


### Contributing

Clone [**ZUIX repository**](https://github.com/genielabs/zuix) or install
`zuix` development package from *NPM*

    npm install zuix

Start local web server (default on port 8080)

    npm run start

###### Build

Build source and create minified version in ```./build/js``` folder:

    gulp browserify ; gulp compile ; gulp dox ; gulp dist


### Documentation and API

[ZUIX Home](https://genielabs.github.io/zuix/)

