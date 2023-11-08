import { ISubscriptionGrant, ISubscriptionMap, MqttClient } from "mqtt";
import DMElement from "../dm-element/dm-element";
import cssText from "./dm-chat.css?inline";
import htmlText from "./dm-chat.html?raw";
import FormInput from "../../../../src/modules/FormInput";

//TODO: containerize subscriptions into each element??
export default class DMChat extends DMElement {
    constructor(mqtt_client: MqttClient, topic_input: string) {
        super({
            htmlText: htmlText,
            cssText: cssText,
        });
        this.setAttribute("data-topic", topic_input);
        this.classList.add("none");
        this.classList.add("page");

        const topic_btn = document.querySelector(`li[data-topic="${topic_input}"]`) as HTMLLIElement;
        const title = this.shadowRoot?.querySelector("h1") as HTMLHeadingElement;
        const message_container = this.shadowRoot?.querySelector("section") as HTMLElement;
        const submit_btn = this.shadowRoot?.querySelector("button") as HTMLButtonElement;
        const input_text = (): string | undefined => this.shadowRoot?.querySelector("input")?.value;

        const show_self = () => {
            const pages = document.querySelectorAll(`.page:not([data-topic="${topic_input}"]`);
            pages.forEach((element) => {
                element.classList.add("none");
            });
            this.classList.remove("none");
        };

        title.innerHTML = topic_input;
        // would be better to run this on topics_granted, for accurate QoS levels granted.
        mqtt_client!.on("message", (topic, message) => {
            if (topic == topic_input) {
                const div = document.createElement("div");
                div.innerText = message;
                message_container.appendChild(div);
            }
        });

        topic_btn.addEventListener("click", (event) => {
            event.stopPropagation();
            console.log(topic_input + "|" + this.getAttribute("data-topic"));
            show_self();
        });

        submit_btn.addEventListener("click", (event) => {
            mqtt_client.publish(topic_input, input_text());
        });
    }
}
