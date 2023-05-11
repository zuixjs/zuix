export interface ContextOptions {
  contextId?: any;
  container?: Element;
  model?: JSON;
  view?: Element;
  controller?: ContextControllerHandler;
  controllerMembers: any;
  on?: { [k: string]: EventCallback };
  behavior?: { [k: string]: EventCallback };
  css?: Element | String | Boolean;
  encapsulation?: Boolean;
  resetCss?: Boolean;
  cext?: String;
  html?: Boolean;
  lazyLoad?: Boolean;
  priority?: Number;
  loaded?: ContextLoadedCallback;
  ready?: ContextReadyCallback;
  error?: ContextErrorCallback;
}
export interface ContextErrorCallback {
  (error: any, ctx: ComponentContext): void;
}
export interface ContextLoadedCallback {
  (ctx: ComponentContext): void;
}
export interface ContextReadyCallback {
  (ctx: ComponentContext): void;
}
export interface Zuix {
  field(fieldName: String, container?: Element): ZxQuery;
  load(componentId: String, options?: ContextOptions): ComponentContext;
  unload(context: ComponentContext | Element): Zuix;
  controller(handler: ContextControllerHandler | string, callback?: {error?: Function, componentId?: string}): ContextControllerHandler;
  context(contextId: Element | ZxQuery | any, callback?: Function): ComponentContext;
  createComponent(componentId: String, options?: ContextOptions): ComponentContext;
  loadComponent(elements: Element | ZxQuery, componentId: string, type?: 'view' | 'ctrl', options?: ContextOptions);
  trigger(context: any, eventPath: String, eventData?: any): Zuix;
  hook(eventPath: String, eventHandler: Function): Zuix;
  using(resourceType: String, resourcePath: String, callback?: Function): void;
  lazyLoad(enable?: Boolean, threshold?: Number): Zuix | Boolean;
  httpCaching(enable?: Boolean): Zuix | Boolean;
  componentize(element?: Element | ZxQuery): Zuix;
  store(name: String, value: any): any;
  getResourcePath(path: String): String;
  observable(obj: any): ObservableObject;
  bundle(bundleData: BundleItem[], callback?: Function): Zuix | BundleItem[];
  $: ZxQueryStatic;
  dumpContexts(): ComponentContext[];
  dumpCache(): ComponentCache[];
  setComponentCache(cache: ComponentCache[]): void;
}
export interface ContextControllerHandler {
  (cp: ContextController): void;
}
export interface EventCallback {
  (event: String, data: any, $el: ZxQuery): void;
}
export interface ComponentContext {
  container(container?: Element): ComponentContext | Element;
  view(view?: Element | String): ComponentContext | Element;
  style(css?: String | Element): ComponentContext | Element;
  model(model?: any): ComponentContext | any;
  controller(controller?: ContextControllerHandler): ComponentContext | ContextControllerHandler;
  options(options?: ContextOptions): ComponentContext | any;
  on(eventPath: String, eventHandler: EventCallback): ComponentContext;
  loadCss(options?: any, enableCaching?: Boolean): ComponentContext;
  loadHtml(options?: any, enableCaching?: Boolean): ComponentContext;
  viewToModel(): ComponentContext;
  modelToView(): ComponentContext;
  getCssId(): String;
}
export interface ContextControllerUpdateCallback {
  (target: any, key: String, value: any, path: String, old: any): void;
}
export interface ContextControllerInitCallback {
  (): void;
}
export interface ContextControllerCreateCallback {
  (): void;
}
export interface ContextControllerDisposeCallback {
  (): void;
}
export interface ContextController {
  init: ContextControllerInitCallback;
  create: ContextControllerCreateCallback;
  update: ContextControllerUpdateCallback;
  dispose: ContextControllerDisposeCallback;
  field(fieldName: String): ZxQuery;
  view(filter?: String): ZxQuery;
  model(model?: any): ContextController | any;
  options(): any;
  trigger(eventPath: String, eventData: any, isHook?: Boolean): ContextController;
  expose(name: String | JSON, handler?: Function): ContextController;
  declare(name: String | JSON, handler?: Function): ContextController;
  loadCss(options?: any): ContextController;
  loadHtml(options?: any): ContextController;
  log: Logger;
  for(componentId: String): ContextController;
}
export interface ControllerInstance extends ContextController {
  onInit: ContextControllerInitCallback;
  onCreate: ContextControllerCreateCallback;
  onUpdate: ContextControllerUpdateCallback;
  onDispose: ContextControllerDisposeCallback;
}
export interface ComponentCache {
  componentId: String;
  view: Element;
  css: String;
  css_applied: Boolean;
  controller: ContextControllerHandler;
  using: String;
}
export interface BundleItem {
  view: Element;
  css: String;
  controller: ContextControllerHandler;
}
export interface ElementsIterationCallback {
  (count: Number, item: Element, $item: ZxQuery): void;
}
export interface Position {
  dx: Number;
  dy: Number;
}
export interface ElementPosition {
  x: Number;
  y: Number;
  frame: Position;
  event: String;
  visible: Boolean;
}
export interface IterationCallback {
  (i: Number, item: any): void;
}
export interface ZxQueryHttpBeforeSendCallback {
  (xhr: XMLHttpRequest): void;
}
export interface ZxQueryHttpSuccessCallback {
  (responseText: String): void;
}
export interface ZxQueryHttpErrorCallback {
  (xhr: XMLHttpRequest, statusText: String, statusCode: Number): void;
}
export interface ZxQueryHttpThenCallback {
  (xhr: XMLHttpRequest): void;
}
export interface ZxQueryHttpOptions {
  url: String;
  beforeSend?: ZxQueryHttpBeforeSendCallback;
  success?: ZxQueryHttpSuccessCallback;
  error?: ZxQueryHttpErrorCallback;
  then?: ZxQueryHttpThenCallback;
}
export interface ZxQuery {
  length(): Number;
  parent(filter?: String): ZxQuery;
  children(filter?: String): ZxQuery;
  reverse(): ZxQuery;
  get(i?: Number): Node | Element;
  eq(i: Number): ZxQuery;
  find(selector: String): ZxQuery;
  each(iterationCallback: ElementsIterationCallback): ZxQuery;
  attr(attr: String | JSON, val?: String): String | ZxQuery;
  trigger(eventPath: String, eventData: any): ZxQuery;
  one(eventPath: String, eventHandler: Function): ZxQuery;
  on(eventPath: String, eventHandler: Function): ZxQuery;
  off(eventPath: String, eventHandler: Function): ZxQuery;
  reset(): ZxQuery;
  isEmpty(): Boolean;
  position(): ElementPosition;
  css(prop: String | JSON, val?: String): String | ZxQuery;
  addClass(className: String): ZxQuery;
  hasClass(className: String): Boolean;
  removeClass(className: String): ZxQuery;
  prev(): ZxQuery;
  next(): ZxQuery;
  html(htmlText?: String): ZxQuery | String;
  checked(check?: Boolean): ZxQuery | Boolean;
  value(value?: String): ZxQuery | String;
  append(el: ZxQuery | Node[] | Node | NodeList | String | any): ZxQuery;
  insert(index: Number, el: ZxQuery | Node[] | Node | NodeList | any): ZxQuery;
  prepend(el: ZxQuery | Node[] | Node | NodeList | String | any): ZxQuery;
  detach(): ZxQuery;
  attach(): ZxQuery;
  display(mode?: String): String | ZxQuery;
  visibility(mode?: String): String | ZxQuery;
  show(mode?: String): ZxQuery;
  hide(): ZxQuery;
  playAnimation(options: string[] | string | PlayFxConfig);
  playTransition(options: string[] | string | PlayFxConfig);
}
export interface ZxQueryStatic {
  (what?: ZxQuery | Node[] | Node | NodeList | String | any);
  find(selector: String): ZxQuery;
  each(items: JSON | any[], iterationCallback: IterationCallback): ZxQuery;
  http(options: ZxQueryHttpOptions): ZxQueryStatic;
  hasClass(el: Element, className: String): Boolean;
  classExists(className: String): Boolean;
  wrapElement(containerTag: String, element: Element): Element;
  appendCss(css: String, target: Element, cssId: String): Element;
  replaceBraces(html: String, callback: Function): String;
  getClosest(elem: Element, selector: String): Element;
  getPosition(el: Element, tolerance?: Number): ElementPosition;
}
export interface PlayFxConfig {
  type: 'transition' | 'animation';
  target: Element | ZxQuery;
  classes: string[] | string;
  options?: any;
  holdState?: boolean;
  onStep?: PlayFxCallback;
  onEnd?: PlayFxCallback;
}
export interface PlayFxCallback {
  ($element: ZxQuery, classQueue: string[]): void
}
export interface ObjectObserver {
  observable(obj: any): ObservableObject;
}
export interface ObservableObject {
  subscribe(observableListener: ObservableListener): void;
  unsubscribe(observableListener: ObservableListener): void;
}
export interface ObservableListener {
  get(target: any, key: String, value: any, path: String): void;
  set(target: any, key: String, value: any, path: String, old: any): void;
}
export interface LoggerMonitorCallback {
  (ctx: any, level: String, ...args: any[]): void;
}
export interface Logger {
  monitor(callback: LoggerMonitorCallback): void;
  console(enable: Boolean): void;
  info(...args: any[]): Logger;
  warn(...args: any[]): Logger;
  error(...args: any[]): Logger;
  debug(...args: any[]): Logger;
  trace(...args: any[]): Logger;
}

declare const zuix: Zuix;
export default zuix;
