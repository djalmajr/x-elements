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
      <x-space direction="vertical">
        <x-space align="center" size="mini">
          <x-button @click=${this.handleDecrease}>-</x-button>
          <span class="counter">${this.state.count}</span>
          <x-button @click=${this.handleIncrease}>+</x-button>
        </x-space>
        <form @submit=${(e) => e.preventDefault()}>
          <x-space align="center">
            <input name="name" @input=${this.handleChange} />
            <span>Hello ${this.state.name || "Djalma Júnior"}!</span>
          </x-space>
        </form>
      </x-space>
    `;
  }
}

if (!customElements.get("x-app")) {
  customElements.define("x-app", App);
}
