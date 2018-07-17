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
    "revision": "a9a7088e824337d845732ba09a26a7d8"
  },
  {
    "url": "app/content/api/data/ContextController.json",
    "revision": "68eb64b0986d8f2684e59233ee70e8d0"
  },
  {
    "url": "app/content/api/data/Localizer.json",
    "revision": "64c7ececaa90db2712cafd081214023d"
  },
  {
    "url": "app/content/api/data/Zuix.json",
    "revision": "9038fefdca6421ae6631a39c3dbd8d02"
  },
  {
    "url": "app/content/api/data/ZxQuery.json",
    "revision": "00d518b8f8773153cea487336859fad9"
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
    "revision": "c55488315343d9afb4d13ebf9cc8f97b"
  },
  {
    "url": "index.css",
    "revision": "f70a81e828c7a01c4c264922a12d2101"
  },
  {
    "url": "index.html",
    "revision": "e428fb47b27b700fd80f6beaf2f7fdd7"
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
    "revision": "cd4d2491f787cab75e871ce3c7c2a1fd"
  },
  {
    "url": "js/zuix-bundler.min.js",
    "revision": "f0869de8aea2e54e9dea19fc6bf15edd"
  },
  {
    "url": "js/zuix.js",
    "revision": "750a81f35d60654e4a9391b289b6aa3b"
  },
  {
    "url": "js/zuix.min.js",
    "revision": "c41a4bbdc3dc4c0fdb4df45988b1990f"
  },
  {
    "url": "js/zuix/zuix-bundler.js",
    "revision": "cd4d2491f787cab75e871ce3c7c2a1fd"
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
