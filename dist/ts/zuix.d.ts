interface ContextOptions {
    contextId?: Object;
    container?: Element;
    model?: JSON;
    view?: Element;
    controller?: ContextControllerHandler;
    on?: { [k: string]: EventCallback };
    behavior?: { [k: string]: EventCallback };
    css?: Element | String | Boolean;
    encapsulation?: Boolean;
    resetCss?: Boolean;
    cext?: String;
    html?: Boolean;
    lazyLoad?: Boolean;
    priority?: Number;
    ready?: ContextReadyCallback;
    error?: ContextErrorCallback;
}
interface ContextErrorCallback {
    (error: Object, ctx: ComponentContext): void;
}
interface ContextReadyCallback {
    (ctx: ComponentContext): void;
}
interface Zuix {
    field(fieldName: String, container?: Element): ZxQuery;
    load(componentId: String, options?: ContextOptions): ComponentContext;
    unload(context: ComponentContext | Element): Zuix;
    controller(handler: ContextControllerHandler): ContextControllerHandler;
    context(contextId: Element | ZxQuery | Object, callback?: Function): ComponentContext;
    createComponent(componentId: String, options?: ContextOptions): ComponentContext;
    trigger(context: Object, eventPath: String, eventData?: Object): Zuix;
    hook(eventPath: String, eventHandler: Function): Zuix;
    using(resourceType: String, resourcePath: String, callback?: Function): void;
    lazyLoad(enable?: Boolean, threshold?: Number): Zuix | Boolean;
    httpCaching(enable?: Boolean): Zuix | Boolean;
    componentize(element?: Element | ZxQuery): Zuix;
    store(name: String, value: Object): Object;
    getResourcePath(path: String): String;
    observable(obj: Object): ObservableObject;
    bundle(bundleData: BundleItem[], callback?: Function): Zuix | BundleItem[];
    $: ZxQueryStatic;
    dumpCache(): ComponentCache[];
    dumpContexts(): ComponentContext[];
}
interface ContextControllerHandler {
    (cp: ContextController): void;
}
interface EventCallback {
    (event: String, data: Object, $el: ZxQuery): void;
}
interface ComponentContext {
    container(container?: Element): ComponentContext | Element;
    view(view?: Element | String): ComponentContext | Element;
    style(css?: String | Element): ComponentContext | Element;
    model(model?: Object): ComponentContext | Object;
    controller(controller?: ContextControllerHandler): ComponentContext | ContextControllerHandler;
    options(options: ContextOptions): ComponentContext | Object;
    on(eventPath: String, eventHandler: EventCallback): ComponentContext;
    loadCss(options?: Object, enableCaching?: Boolean): ComponentContext;
    loadHtml(options?: Object, enableCaching?: Boolean): ComponentContext;
    viewToModel(): ComponentContext;
    modelToView(): ComponentContext;
    getCssId(): String;
}
interface ContextControllerUpdateCallback {
    (target: Object, key: String, value: Object, path: String, old: Object): void;
}
interface ContextControllerInitCallback {
    (): void;
}
interface ContextControllerCreateCallback {
    (): void;
}
interface ContextControllerDestroyCallback {
    (): void;
}
interface ContextController {
    init: ContextControllerInitCallback;
    create: ContextControllerCreateCallback;
    update: ContextControllerUpdateCallback;
    destroy: ContextControllerDestroyCallback;
    field(fieldName: String): ZxQuery;
    view(filter?: String): ZxQuery;
    model(model?: Object): ContextController | Object;
    options(): Object;
    trigger(eventPath: String, eventData: Object, isHook?: Boolean): ContextController;
    expose(methodName: String | JSON, handler?: Function): ContextController;
    loadCss(options?: Object): ContextController;
    loadHtml(options?: Object): ContextController;
    log: Logger;
    for(componentId: String): ContextController;
}
interface ComponentCache {
    componentId: String;
    view: Element;
    css: String;
    css_applied: Boolean;
    controller: ContextControllerHandler;
    using: String;
}
interface BundleItem {
    view: Element;
    css: String;
    controller: ContextControllerHandler;
}
interface ElementsIterationCallback {
    (count: Number, item: Element, $item: ZxQuery): void;
}
interface Position {
    dx: Number;
    dy: Number;
}
interface ElementPosition {
    x: Number;
    y: Number;
    frame: Position;
    event: String;
    visible: Boolean;
}
interface IterationCallback {
    (i: Number, item: Object): void;
}
interface ZxQueryHttpBeforeSendCallback {
    (xhr: XMLHttpRequest): void;
}
interface ZxQueryHttpSuccessCallback {
    (responseText: String): void;
}
interface ZxQueryHttpErrorCallback {
    (xhr: XMLHttpRequest, statusText: String, statusCode: Number): void;
}
interface ZxQueryHttpThenCallback {
    (xhr: XMLHttpRequest): void;
}
interface ZxQueryHttpOptions {
    url: String;
    beforeSend?: ZxQueryHttpBeforeSendCallback;
    success?: ZxQueryHttpSuccessCallback;
    error?: ZxQueryHttpErrorCallback;
    then?: ZxQueryHttpThenCallback;
}
interface ZxQuery {
    length(): Number;
    parent(filter?: String): ZxQuery;
    children(filter?: String): ZxQuery;
    reverse(): ZxQuery;
    get(i?: Number): Node | Element;
    eq(i: Number): ZxQuery;
    find(selector: String): ZxQuery;
    each(iterationCallback: ElementsIterationCallback): ZxQuery;
    attr(attr: String | JSON, val?: String): String | ZxQuery;
    trigger(eventPath: String, eventData: Object): ZxQuery;
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
    append(el: Object | ZxQuery | Node[] | Node | NodeList | String): ZxQuery;
    insert(index: Number, el: Object | ZxQuery | Node[] | Node | NodeList): ZxQuery;
    prepend(el: Object | ZxQuery | Node[] | Node | NodeList | String): ZxQuery;
    detach(): ZxQuery;
    attach(): ZxQuery;
    display(mode?: String): String | ZxQuery;
    visibility(mode?: String): String | ZxQuery;
    show(mode?: String): ZxQuery;
    hide(): ZxQuery;
}
interface ZxQueryStatic {
    (what?: Object | ZxQuery | Node[] | Node | NodeList | String): ZxQuery;
    find(selector: String): ZxQuery;
    each(items: Object[] | JSON, iterationCallback: IterationCallback): ZxQuery;
    http(options: ZxQueryHttpOptions): ZxQueryStatic;
    hasClass(el: Element, className: String): Boolean;
    classExists(className: String): Boolean;
    wrapElement(containerTag: String, element: Element): Element;
    appendCss(css: String, target: Element, cssId: String): Element;
    replaceCssVars(css: String, model: Object): String;
    replaceBraces(html: String, callback: Function): String;
    getClosest(elem: Element, selector: String): Element;
    getPosition(el: Element, tolerance?: Number): ElementPosition;
}
interface ObjectObserver {
    observable(obj: Object): ObservableObject;
}
interface ObservableObject {
    subscribe(observableListener: ObservableListener): void;
    unsubscribe(observableListener: ObservableListener): void;
}
interface ObservableListener {
    get(target: Object, key: String, value: Object, path: String): void;
    set(target: Object, key: String, value: Object, path: String, old: Object): void;
}
interface LoggerMonitorCallback {
    (ctx: Object, level: String, ...args: Object[]): void;
}
interface Logger {
    monitor(callback: LoggerMonitorCallback): void;
    console(enable: Boolean): void;
    info(...args: Object[]): Logger;
    warn(...args: Object[]): Logger;
    error(...args: Object[]): Logger;
    debug(...args: Object[]): Logger;
    trace(...args: Object[]): Logger;
}

declare const zuix: Zuix;
