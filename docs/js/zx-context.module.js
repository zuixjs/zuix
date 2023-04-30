class ZxContext extends HTMLElement {
  constructor(props) {
    super();

    this.container = document.createElement('div');
    this.context = null;

    this.attachShadow({mode: 'closed'})
        .append(this.container);

    const loadComponent = this.attributes.getNamedItem('load');
    if (loadComponent) {
      const parentComponent = zuix.$(this).parent('[z-load]');
      zuix.context(parentComponent, (ctx) => {
        let options = this.attributes.getNamedItem('options');
        options = zuix.runScriptlet(`(${options.value})`, parentComponent, parentComponent);
        let componentId = loadComponent.value;
        if (!componentId.startsWith('/') && componentId.indexOf('://') === -1) {
          componentId = `/widgets/${componentId}`;
        }
        this.load(componentId, options);
      });
    }
  }

  connectedCallback() {
    // TODO:  ...
  }

  disconnectedCallback() {
    // TODO:  ...
  }

  load(componentId, options) {
    options = options || {};
    let contextOptions = ((o) => ({
      container: this.shadowRoot,
      ready: (ctx) => {
        this.context = ctx;
        if (o.css) {
          ctx.style(o.css);
        }
        if (typeof o.ready === 'function') {
          o.ready(ctx);
        }
      },
      error: (err) => {
        if (typeof o.error === 'function') {
          o.error(err);
        }
        throw err;
      }
    }))(options);
    delete options.container;
    delete options.ready;
    delete options.error;
    contextOptions = Object.assign(contextOptions, options);
    zuix.loadComponent(this.container, componentId, null, contextOptions);
  }

  unload() {
    if (this.context) {
      // unload and dispose context
      zuix.unload(this.context);
      this.context = undefined;
    }
  }
}

if (customElements.get('zx-context') === undefined) {
  customElements.define('zx-context', ZxContext);
}
