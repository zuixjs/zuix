# Implementation notes and code structure

Main library source code files are located in the `/src/js` folder.
The *OOP* paradigm is adopted, though this project does not make use of transpilers,
and the source code is written in a *compatible* way, so that just merging the files
will create a valid image of the library.
Each file in the `src` folder implements a *Class* obtained by the use of *Prototypes*
and *Closures*.

The build process is automated by the scripts found in the `/build` folder. The build
script uses *webpack*.

The code must guarantee compatibility against the following browsers:

- Chrome (and all Chromium based browsers)
- FireFox
- Edge
- Internet Explorer 11
- Safari
- Mobile browsers

Some polyfills are being used mainly due to *IE11* compatibility:

- src/js/helpers/ZxQuery.js
  - window.CustomEvent
  - Element.prototype.matches
  - String.prototype.startsWith

For the same reason the use of ES6 features not supported by *IE11* is prevented.
This constraint is only limited to the library itself but any project using the
library can take advantage of all features in modern JavaScript.

Callback functions implemented by the library must guarantee proper functioning
when used with *arrow functions*.
So a project using *zuix.js* can implement a callback either with a `function`
and reference the `this` context object inside its body, or with an `=>` *arrow function*
and use the last argument in place of the `this` object.

Anyway everything is written and structured so that when it will come the right
time to drop support for IE11, migrating to the use of the `class` facility and
other ES>=6 features and will be straightforward.
