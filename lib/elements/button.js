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

  get disabled() {
    return this.attr("disabled") !== null;
  }

  render() {
    return html.node`${this.$slot}`;
  }
}

if (!customElements.get("x-button")) {
  customElements.define("x-button", Button);
}
