interface Zuix {
    controller(handler: ContextControllerHandler): ContextControllerHandler;
    field(fieldName: String, container?: Element): ZxQuery;
    componentize(element?: Element | ZxQuery): Zuix;
    load(componentId: String, options?: ContextOptions): ComponentContext;
    unload(context: ComponentContext | Element): Zuix;
    context(contextId: Element | ZxQuery | Object, callback?: Function): ComponentContext;
    createComponent(componentId: String, options?: ContextOptions): ComponentContext;
    trigger(context: Object, eventPath: String, eventData?: Object): Zuix;
    hook(eventPath: String, eventHandler: Function): Zuix;
    lazyLoad(enable?: Boolean, threshold?: Number): Zuix | Boolean;
    httpCaching(enable?: Boolean): Zuix | Boolean;
    using(resourceType: String, resourcePath: String, callback?: Function): void;
    bundle(bundleData: BundleItem[], callback?: Function): Zuix | BundleItem[];
}
interface ContextOptions {
    contextId?: Object;
    container?: Element;
    model?: JSON;
    view?: Element;
    controller?: ContextControllerHandler;
    on?: { [k: string]: EventCallback };
    behavior?: { [k: string]: EventCallback };
    css?: Element | String | Boolean;
    cext?: String;
    html?: Boolean;
    lazyLoad?: Boolean;
    priority?: Number;
    ready?: ContextReadyCallback;
    error?: ContextErrorCallback;
}
interface ContextReadyCallback {
    (ctx: ComponentContext): void;
}
interface ContextErrorCallback {
    (error: Object): void;
}
interface EventCallback {
    (event: String, data: Object): void;
}
interface ContextOptions {
    contextId?: Object;
    container?: Element;
    model?: JSON;
    view?: Element;
    controller?: ContextControllerHandler;
    on?: { [k: string]: EventCallback };
    behavior?: { [k: string]: EventCallback };
    css?: Element | String | Boolean;
    cext?: String;
    html?: Boolean;
    lazyLoad?: Boolean;
    priority?: Number;
    ready?: ContextReadyCallback;
    error?: ContextErrorCallback;
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
}
interface ContextController {
    init: Function;
    create: Function;
    update: Function;
    destroy: Function;
}
interface ContextController {
    field(fieldName: String): ZxQuery;
    view(filter?: String): ZxQuery;
    model(model?: Object): ContextController | Object;
    options(): Object;
    trigger(eventPath: String, eventData: Object, isHook?: Boolean): ContextController;
    expose(methodName: String | JSON, handler?: Function): ContextController;
    loadCss(options?: Object): ContextController;
    loadHtml(options?: Object): ContextController;
    for(componentId: String): ContextController;
}
interface ContextControllerHandler {
    (cp: ContextController): void;
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
interface ElementPosition {
    x: Number;
    y: Number;
    visible: Boolean;
}
interface IterationCallback {
    (i: Number, item: Object): void;
}
interface InstanceIterationCallback {
    (count: Number, item: Element): void;
}
interface ZxQuery {
    length(): Number;
    parent(filter?: String): ZxQuery;
    children(filter?: String): ZxQuery;
    reverse(): ZxQuery;
    get(i?: Number): Node | Element;
    eq(i: Number): ZxQuery;
    find(selector: String): ZxQuery;
    each(iterationCallback: InstanceIterationCallback): ZxQuery;
    attr(attr: String | JSON, val?: String): String | ZxQuery;
    trigger(eventPath: String, eventData: Object): ZxQuery;
    one(eventPath: String, eventHandler: Function): ZxQuery;
    on(eventPath: String, eventHandler: Function): ZxQuery;
    off(eventPath: String, eventHandler: Function): ZxQuery;
    reset(): ZxQuery;
    isEmpty(): Boolean;
    position(): ElementPosition;
    css(attr: String | JSON, val?: String): String | ZxQuery;
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
    attach(): ZxQuery;
    detach(): ZxQuery;
    display(mode?: String): String | ZxQuery;
    visibility(mode?: String): String | ZxQuery;
    show(mode?: String): ZxQuery;
    hide(): ZxQuery;
}

declare const zuix: Zuix;
