class ZxContext extends HTMLElement {
  context = null;
  container = null;

  constructor(props) {
    super();
    this.shadowView = this.attachShadow({mode: 'closed'});
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
    const commonStyle = new CSSStyleSheet();
    commonStyle.replaceSync(zuix.$.find('style#zuix-global').html());
    this.shadowView.adoptedStyleSheets = [ commonStyle ];
  }

  disconnectedCallback() {
    // TODO:  ...
  }

  load(componentId, options) {
    if (this.container != null) {
      zuix.unload(this.container);
      this.shadowView.removeChild(this.container);
      this.container = null;
      this.shadowView.innerHTML = '';
    }
    this.container = document.createElement('div');
    this.container.classList.add('visible-on-ready');
    this.shadowView.append(this.container);
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
        console.error(err);
      }
    }))(options);
    delete options.container;
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
