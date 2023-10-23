import DMSwitch from "./elements/dm-switch/dm-switch"

export default function init_custom_elements(): void
{

    const customElements = new Map<string, unknown>([
        ["dm-switch", DMSwitch]]);

    // Check if elements are already defined before registering.
    customElements.forEach((value: CustomElementConstructor, key) =>
    {
        if (!window.customElements.get(key))
        {
            window.customElements.define(key, value);
        }
    });
}