import { BaseElement, html } from "x-elements";
import styles from "./app.css";

export class App extends BaseElement {
  static styles = styles;

  state = {
    count: 0,
    name: ""
  };

  handleChange = (evt) => {
    this.setState({ name: evt.target.value });
  };

  handleDecrease = () => {
    this.setState((s) => ({ count: s.count - 1 }));
  };

  handleIncrease = () => {
    this.setState((s) => ({ count: s.count + 1 }));
  };

  render() {
    return html`
      <h3>Buttons</h3>
      <p>
        Buttons include simple button styles for actions in different types and sizes.
      </p>
      <x-button>default button</x-button>
      <x-button intent="primary">primary button</x-button>
      <div>
        ${["primary", "secondary", "gray"].map((color) => {
          return html`
            <div style="display: flex; flex-direction: row">
              ${Array(9)
                .fill(1)
                .map((_, i) => {
                  const style = `
                    background: var(--${color}-color-${i + 1});
                    height: 1.5rem;
                    width: 1.5rem;
                  `;

                  return html`<div class="box" style=${style}></div>`;
                })}
            </div>
          `;
        })}
      </div>
    `;
  }
}

if (!customElements.get("x-app")) {
  customElements.define("x-app", App);
}
