import { BaseElement, html } from "./base.js";
import styles from "./space.css";

// TODO: checar como definir types de atributos de CustomElement
export class Space extends BaseElement {
  static styles = styles;

  static get observedAttributes() {
    return ["align", "direction", "size"];
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
}

if (!customElements.get("x-space")) {
  customElements.define("x-space", Space);
}
