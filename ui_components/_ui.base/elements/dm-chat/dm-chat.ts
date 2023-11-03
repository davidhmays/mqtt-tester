import { ISubscriptionGrant, ISubscriptionMap, MqttClient } from "mqtt";
import DMElement from "../dm-element/dm-element";
import cssText from "./dm-chat.css?inline";
import htmlText from "./dm-chat.html?raw";

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

        const title = this.shadowRoot?.querySelector("h1") as HTMLHeadingElement;
        title.innerHTML = topic_input;

        const message_container = this.shadowRoot?.querySelector("section") as HTMLElement;

        // would be better to run this on topics_granted, for accurate QoS levels granted.
        mqtt_client!.on("message", (topic, message) => {
            if (topic == topic_input) {
                const div = document.createElement("div");
                div.innerText = message;
                message_container.appendChild(div);
            }
        });

        const show_self = () => {
            const pages = document.querySelectorAll(`.page:not([data-topic="${topic_input}"]`);
            pages.forEach((element) => {
                element.classList.add("none");
            });
            this.classList.remove("none");
        };

        const topic_button = document.querySelector(`li[data-topic="${topic_input}"]`) as HTMLLIElement;
        topic_button.addEventListener("click", (event) => {
            alert(event.target.getAttribute("data-topic"));
            console.log(topic_input + "|" + this.getAttribute("data-topic"));
            show_self();
        });
    }
}
