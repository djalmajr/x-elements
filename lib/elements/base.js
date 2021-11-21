import { html, render } from "https://cdn.skypack.dev/uhtml?min";
import { camelCase } from "utils";

export { html };

export class BaseElement extends HTMLElement {
  // /**
  //  * @type MutationObserver
  //  */
  // #observer = null;

  constructor() {
    super();

    if (this.constructor.shadow) {
      this.attachShadow({ mode: "open" });
    }

    /**
     * @type ShadowRoot | HTMLElement
     */
    this.$el = this.shadowRoot || this;

    if (!this.shadowRoot) {
      // this.#observer = new MutationObserver((mutations) => {
      //   mutations.forEach((m) => {
      //     const attrVal = m.target.getAttribute(attr);
      //     m.target[prop] = converter(type, attrVal);
      //   });
      // });

      // this.#observer.observe(this, { childList:true, subtree: true });

      this.$slot = Array.from(this.childNodes)
        .filter(Boolean)
        .map((node) => node.cloneNode(true));

      this.$slots = Array.from(this.$$("[slot]"))
        .filter(Boolean)
        .reduce((data, node) => {
          return (data[camelCase(node.getAttribute("slot"))] = node), data;
        }, {});
    }
  }

  connectedCallback() {
    const { styles } = this.constructor;

    if (styles) {
      if (this.shadowRoot) {
        this.shadowRoot.adoptedStyleSheets = [].concat(styles);
      } else if (!document.adoptedStyleSheets.includes(styles)) {
        document.adoptedStyleSheets = document.adoptedStyleSheets.concat(styles);
      }
    }

    this.#render();
  }

  // disconnectedCallback() {
  //   this.#observer.disconnect();
  // }

  attributeChangedCallback() {
    this.#render();
  }

  setState(value) {
    const data = typeof value === "function" ? value(this.state) : value;
    this.state = { ...this.state, ...data };
    this.#render();
  }

  #render() {
    const htm = this.render?.();

    htm && render(this.$el, htm);
  }

  // Events

  emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { detail }));
  }

  // DOM

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
}
