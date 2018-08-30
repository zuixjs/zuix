# Implementation notes and code structure

Main library source code files are located in the `/src/js` folder.
The *OOP* paradigm is adopted, though this project does not make use of transpilers and the source code is written in a *compatible* way, so that just merging the files will create a valid image of the library.
Each file in the `src` folder implements a *Class* obtained by the use of *Prototypes* and *Closures*.

The build process is automated by the scripts found in the `/build` folder. Those scripts make use of:

- **browserify**
to merge source files and generate `zuix.js` and `zuix-bundler.js`. The starting point for the first one is `./src/main.js`, while for the latter is `./src/bundler.js`.
- **google-closure**
to make code verification against `ECMASCRIPT6_STRICT` and to generate minified versions of the libraries with relative `.map` files.
- **dox**
to generate the JSON files out of JSDoc comments used in the source code. These files are used to display the API documentation in the website. It also generate the *TypeScript* definition file.

The code must guarantee compatibility against the following browsers:

- Chrome (and all Chromium based browsers)
- FireFox
- Edge
- Internet Explorer 11
- Safari

Some polyfills are being used mainly due to *IE11* compatibility:

- src/js/helpers/ZxQuery.js
  - window.CustomEvent
  - Element.prototype.matches
  - String.prototype.startsWith

For the same reason the use of ES6 features not supported by *IE11* is prevented.
This constraint is only limited to the library itself but any project using the library can take advantage of all features in modern JavaScript.
For this reason, callback function must guarantee proper functioning when using arrow functions.
So a callback can be either implemented using `function` and referencing the `this` context object, or using `arrow function` and using the last argument in place of the `this` object.

Anyway everything is written and structured so that when it will come the right time to drop support for IE11, migrating to the use of the `class` facility and other ES>=6 features and will be straightforward.
