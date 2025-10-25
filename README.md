<p align="center">
    <a href="https://zuixjs.github.io/zuixjs.org" target="_blank" rel="noopener noreferrer">
        <img width="96" src="https://zuixjs.github.io/zuix/images/zuix-logo.svg" alt="zUIx.js logo">
    </a>
</p>

<h1 align="center">zUIx.js</h1>

<p align="center">
  A lightweight JavaScript library for creating amazing component-based websites and applications.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/zuix-dist"><img src="https://img.shields.io/npm/v/zuix-dist.svg" alt="NPM Version"></a>
  <a href="https://github.com/zuixjs/zuix/blob/master/LICENSE.TXT"><img src="https://img.shields.io/npm/l/zuix-dist.svg" alt="License"></a>
  <a href="https://zuixjs.github.io/zuixjs.org"><img src="https://img.shields.io/badge/docs-website-green.svg" alt="Documentation"></a>
</p>

---

## [zuix.js v1.2.3](https://zuixjs.github.io/zuixjs.org)

**zUIx.js** is a component-based JavaScript framework for building modern web user interfaces. It's designed to be lightweight, fast, and easy to learn, allowing you to create reusable components with clean HTML, CSS, and JavaScript.

- **Website and Documentation:** [zuixjs.github.io/zuixjs.org](https://zuixjs.github.io/zuixjs.org)
- **Ask questions:** [![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/zuixjs/zuix)

## Features

- **Component-Based:** Build encapsulated components that manage their own state and logic.
- **Lazy Loading:** Components are loaded on-demand, improving initial page load performance.
- **Lightweight:** A small footprint keeps your application fast and lean.
- **No Build Step Required:** Can be used directly in the browser without a complex build setup.
- **TypeScript Support:** Full type definitions for a better development experience with IntelliSense.

## Installation

You can add `zuix-dist` to your project using npm:

```bash
npm install zuix-dist
```

## Quick Start

### 1. In Plain JavaScript (Browser)

Include the library in your HTML file and start creating components.

```html
<!DOCTYPE html>
<html>
<head>
  <!-- ... -->
  <script src="path/to/zuix-dist/js/zuix.min.js"></script>
</head>
<body>
  
  <div z-load="path/to/my-component"></div>

</body>
</html>
```

### 2. With a Bundler (like Webpack) and TypeScript

`zuix-dist` includes full TypeScript definitions. You can import it as an ES module.

```typescript
import zuix from 'zuix-dist';

// Now you can use the 'zuix' global object with full type support
// For example, to load a component dynamically:

const myComponent = zuix.load('path/to/my-component', {
  view: document.getElementById('my-container'),
  model: {
    message: 'Hello from TypeScript!'
  }
});
```

## Contributing

We welcome contributions! Please see the [CONTRIBUTING.md](https://github.com/zuixjs/zuix/blob/master/CONTRIBUTING.md#contributing) document
for guidelines on how to submit bug reports, feature requests, and pull requests.
