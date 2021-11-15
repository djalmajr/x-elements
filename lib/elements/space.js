import { BaseElement, html } from "./base.js";
import styles from "./space.css";

export class Space extends BaseElement {
  static styles = styles;

  static get observedAttributes() {
    return ["align", "direction", "size", "variant"];
  }

  static Align = {
    END: "end",
    START: "start",
    CENTER: "center"
  };

  static Direction = {
    HORIZONTAL: "horizontal",
    HORIZONTAL_REV: "horizontal-reverse",
    VERTICAL: "vertical",
    VERTICAL_REV: "vertical-reverse"
  };

  static Size = {
    TINY: "tiny",
    MINI: "mini",
    SMALL: "small",
    MEDIUM: "medium",
    LARGE: "large",
    BIG: "big",
    HUGE: "huge",
    JUMBO: "jumbo",
    GIANT: "giant"
  };

  static Variant = {
    LAYOUT: "layout",
    SPACING: "spacing"
  };

  constructor() {
    super();

    if (!this.has("align")) this.attr("align", Space.Align.START);
    if (!this.has("direction")) this.attr("direction", Space.Direction.HORIZONTAL);
    if (!this.has("size")) this.attr("size", Space.Size.MEDIUM);
    if (!this.has("variant")) this.attr("variant", Space.Variant.SPACING);
  }

  render() {
    return html`<slot></slot>`;
  }
}

if (!customElements.get("x-space")) {
  customElements.define("x-space", Space);
}
