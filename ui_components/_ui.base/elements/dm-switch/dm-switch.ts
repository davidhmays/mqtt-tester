import DMElement from "../dm-element/dm-element";
import cssText from "./dm-switch.css?inline";
import htmlText from "./dm-switch.svg?raw";

export default class DMSwitch extends DMElement {
    constructor() {
        super({
            htmlText: htmlText,
            cssText: cssText,
        });
    }

    protected connectedCallback(): void {
        this.shadowRoot.host.addEventListener("click", () => {
            if (this.hasAttribute("on")) {
                this.removeAttribute("on");
            } else {
                this.setAttribute("on", "");
            }
        });
    }

    static get observedAttributes(): string[] {
        return ["on"];
    }

    protected attributeChangedCallback(name, oldValue, newValue): void {
        if (name === "on") {
            if (this.hasAttribute("on")) {
                this.dispatchEvent(new CustomEvent("on"));
            } else {
                this.dispatchEvent(new CustomEvent("off"));
            }
        }
    }
}
