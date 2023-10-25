import DMSwitch from "../../ui_components/_ui.base/elements/dm-switch/dm-switch";

export default class FormInput {
    public input_element: HTMLInputElement | SVGElement;
    public target_element: HTMLElement | null;
    public value: string | boolean | null = null;

    constructor(input_id: string, target_id?: string, initial_value?: string) {
        this.input_element = document.getElementById(input_id) as HTMLInputElement;
        this.target_element = target_id ? document.getElementById(target_id) : (null as HTMLElement | null);

        this.update_value(initial_value);
        this.bind_target();
    }

    private update_value(input_value: string | boolean | undefined) {
        if (input_value !== undefined) {
            if (this.input_element instanceof HTMLElement) {
                this.value = input_value;
                this.input_element.value = `${this.value}`;
            } else if (this.input_element instanceof DMSwitch) {
                if (input_value === "on" || input_value === true) {
                    this.value = true;
                    this.input_element.setAttribute("on", "");
                } else {
                    this.value = false;
                    this.input_element.removeAttribute("on");
                }
            }

            if (this.target_element) {
                this.target_element.textContent = `${this.value}`;
            }
        }
    }

    private bind_target() {
        if (this.input_element instanceof HTMLInputElement) {
            this.input_element.addEventListener("input", (event) => {
                this.update_value((event.target as HTMLInputElement).value);
            });
        } else if (this.input_element instanceof DMSwitch) {
            this.input_element.addEventListener("on", () => {
                this.update_value(true);
            });
            this.input_element.addEventListener("off", () => {
                this.update_value(false);
            });
        }
    }
}
