import DMSwitch from "./elements/dm-switch/dm-switch";
import DMChat from "./elements/dm-chat/dm-chat";

export default function init_custom_elements(): void {
    const customElements = new Map<string, unknown>([
        ["dm-switch", DMSwitch],
        ["dm-chat", DMChat],
    ]);

    // Check if elements are already defined before registering.
    customElements.forEach((value: CustomElementConstructor, key) => {
        if (!window.customElements.get(key)) {
            window.customElements.define(key, value);
        }
    });
}
