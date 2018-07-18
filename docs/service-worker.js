/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.4.1/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "app/content/api/api_template.css",
    "revision": "61474ac5fc5b338a98f960811cd01194"
  },
  {
    "url": "app/content/api/api_template.html",
    "revision": "e969389732c602102897181a8496b1ad"
  },
  {
    "url": "app/content/api/api_template.js",
    "revision": "31ebcceb3611dbe0a5cb429831485e4c"
  },
  {
    "url": "app/content/api/data/ComponentCache.json",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/api/data/ComponentContext.json",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/api/data/ContextController.json",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/api/data/Localizer.json",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/api/data/Zuix.json",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/api/data/ZxQuery.json",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "app/content/docs/examples/links.css",
    "revision": "300f68df4ae2415d93a52a566b256dbf"
  },
  {
    "url": "app/content/docs/examples/links.html",
    "revision": "b9d9dd3877f514fb4a90a4d14daef5fd"
  },
  {
    "url": "app/templates/mdl_card.css",
    "revision": "a64525215fefa93fb3c2fe40c48bea02"
  },
  {
    "url": "app/templates/mdl_card.html",
    "revision": "ecaa9aeb44f0e845c1f42a641f02b45c"
  },
  {
    "url": "config.js",
    "revision": "b3f927651bc0af878c86cbcb5e980b50"
  },
  {
    "url": "css/flex-layout-attribute.min.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "index.css",
    "revision": "f70a81e828c7a01c4c264922a12d2101"
  },
  {
    "url": "index.html",
    "revision": "f99e8bf50e3c5ba523fbbfa809f7cb3e"
  },
  {
    "url": "index.js",
    "revision": "abbbb062d9422e05520ecd6284997de0"
  },
  {
    "url": "js/animate-3.5.2.min.css",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/mdl/material.css",
    "revision": "57313781c72269db589ebea903725dcc"
  },
  {
    "url": "js/mdl/material.js",
    "revision": "d4d04abe369dc10ce86e42c00ee62ccd"
  },
  {
    "url": "js/mdl/material.min.css",
    "revision": "8ce4631006b601c6253396365879a7a9"
  },
  {
    "url": "js/mdl/material.min.js",
    "revision": "df211fcb13a5c100eeb182f14fd37b44"
  },
  {
    "url": "js/prism/clipboard.min.js",
    "revision": "3e5e0fa949e0e7c5ed5fed7b4cc0ee00"
  },
  {
    "url": "js/prism/prism.css",
    "revision": "485c9fc9787ea73d7c802822096c5dfe"
  },
  {
    "url": "js/prism/prism.js",
    "revision": "dac215c15573fb5907885ef1094829fa"
  },
  {
    "url": "js/showdown.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix-bundler.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix-bundler.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix-bundler.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix-bundler.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  },
  {
    "url": "js/zuix/zuix.min.js",
    "revision": "d41d8cd98f00b204e9800998ecf8427e"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
