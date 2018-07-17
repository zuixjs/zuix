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
    "revision": "32ae65562c7d0f14dd071833a5ea8194"
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
    "revision": "1f8f89534e9e790099c6bb99d9b1390b"
  },
  {
    "url": "css/flex-layout-attribute.min.css",
    "revision": "c55488315343d9afb4d13ebf9cc8f97b"
  },
  {
    "url": "index.css",
    "revision": "f70a81e828c7a01c4c264922a12d2101"
  },
  {
    "url": "index.html",
    "revision": "c0eb1bf634c2c4fdfa701547fd07f109"
  },
  {
    "url": "index.js",
    "revision": "abbbb062d9422e05520ecd6284997de0"
  },
  {
    "url": "js/animate-3.5.2.min.css",
    "revision": "178b651958ceff556cbc5f355e08bbf1"
  },
  {
    "url": "js/showdown.min.js",
    "revision": "ab769b69bf049ba617d4743529b58536"
  },
  {
    "url": "js/zuix-bundler.js",
    "revision": "836bfd290636d351913dc8628a21adfc"
  },
  {
    "url": "js/zuix-bundler.min.js",
    "revision": "1eb03638ed7f9eb2006103ab47b70d01"
  },
  {
    "url": "js/zuix.js",
    "revision": "7979d4390ae98d960bb6db44982d2faf"
  },
  {
    "url": "js/zuix.min.js",
    "revision": "ddcf816a989c24f0450d3e2947fe95f5"
  },
  {
    "url": "js/zuix/zuix-bundler.js",
    "revision": "eb1e6896190dc168976e3bfade74e1dc"
  },
  {
    "url": "js/zuix/zuix-bundler.min.js",
    "revision": "b35b5244abbd5fa7d894d5bdba111209"
  },
  {
    "url": "js/zuix/zuix.js",
    "revision": "e7d6413f6719ddfeed138c8c6af8d231"
  },
  {
    "url": "js/zuix/zuix.min.js",
    "revision": "dc79b0b96fe17402eaab5261e07f48e6"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
