// import { html } from "html";
import { html, render, svg } from "https://cdn.skypack.dev/uhtml";

export { html, svg };

export class BaseElement extends HTMLElement {
  constructor() {
    super();
    !this.noShadow && this.attachShadow({ mode: "open" });
    // this.html = html.bind(this.$el);
  }

  connectedCallback() {
    this._render();

    const { styles } = this.constructor;

    if (styles) {
      if (this.shadowRoot) {
        this.shadowRoot.adoptedStyleSheets = [].concat(styles);
      } else if (!document.adoptedStyleSheets.includes(styles)) {
        document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styles);
      }
    }
  }

  attributeChangedCallback() {
    this._render();
  }

  _render() {
    render(this.$el, this.render());
  }

  // DOM

  get $el() {
    return this.shadowRoot || this;
  }

  $(selector) {
    return this.$el.querySelector(selector);
  }

  $$(selector) {
    return this.$el.querySelectorAll(selector);
  }

  attr(name, value) {
    if (value !== void 0) {
      value === null ? this.removeAttribute(name) : this.setAttribute(name, value);
    }

    return this.getAttribute(name);
  }

  has(name) {
    return this.hasAttribute(name);
  }

  // Events

  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }
}
