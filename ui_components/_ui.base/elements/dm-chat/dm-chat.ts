import { ISubscriptionGrant, ISubscriptionMap, MqttClient } from "mqtt";
import DMElement from "../dm-element/dm-element";
import cssText from "./dm-chat.css?inline";
import htmlText from "./dm-chat.html?raw";

//TODO: containerize subscriptions into each element??
export default class DMChat extends DMElement {
    constructor(mqtt_client: MqttClient, topic: string) {
        super({
            htmlText: htmlText,
            cssText: cssText,
        });
        this.setAttribute("data-topic", topic);
        this.classList.add("none");
        this.classList.add("page");

        const title = this.shadowRoot?.querySelector("h1") as HTMLHeadingElement;
        title.innerHTML = topic;

        const message_container = this.shadowRoot?.querySelector("section") as HTMLElement;

        // would be better to run this on topics_granted, for accurate QoS levels granted.
        mqtt_client!.on("message", (topic, message) => {
            if (topic == topic) {
                const div = document.createElement("div");
                div.innerText = message;
                message_container.appendChild(div);
            }
        });

        const topic_button = document.querySelector(`li[data-topic="${topic}"]`) as HTMLLIElement;
        topic_button.addEventListener("click", () => {
            const pages = document.querySelectorAll(`.page:not([data-topic="${topic}"]`);
            this.classList.remove("none");

            pages.forEach((element) => {
                element.classList.add("none");
            });
        });
    }
}
