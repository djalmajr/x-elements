import { BaseElement, html } from "./base.js";
import styles from "./button.css";
import "./space.js";

export class Button extends BaseElement {
  static styles = styles;

  static get observedAttributes() {
    return ["disabled", "intent", "size", "variant"];
  }

  static Intent = {
    DANGER: "danger",
    PRIMARY: "primary"
  };

  static Size = {
    TINY: "tiny",
    MINI: "mini",
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large"
  };

  static Variant = {
    GHOST: "ghost",
    OUTLINE: "outline"
  };

  _button = null;

  _slot = null;

  get disabled() {
    return this.attr("disabled") !== null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener("click", this);
    this._button = this.$("button");
    this._slot = this.$("slot");

    if (!this._slot.assignedNodes().length) {
      this._slot.parentElement.setAttribute("hidden", "");
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener("click", this);
  }

  handleEvent(evt) {
    evt.stopPropagation();
    this._button.focus();
    if (this.disabled) evt.stopImmediatePropagation();
  }

  render() {
    return html`
      <button ?disabled=${this.disabled}>
        <x-space align="center" size="mini">
          <div><slot></slot></div>
        </x-space>
      </button>
    `;
  }
}

if (!customElements.get("x-button")) {
  customElements.define("x-button", Button);
}
