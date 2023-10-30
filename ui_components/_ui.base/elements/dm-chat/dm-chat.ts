import { ISubscriptionGrant, MqttClient } from "mqtt";
import DMElement from "../dm-element/dm-element";
import cssText from "./dm-chat.css?inline";
import htmlText from "./dm-chat.html?raw";

//TODO: containerize subscriptions into each element??
export default class DMChat extends DMElement {
    constructor(mqtt_client: MqttClient, subscription: ISubscriptionGrant) {
        super({
            htmlText: htmlText,
            cssText: cssText,
        });
        this.setAttribute("data-topic", subscription.topic);
        this.classList.add("none");
        this.classList.add("page");

        const header = this.shadowRoot?.querySelector("header") as HTMLElement;
        header.innerHTML = subscription.topic;

        const message_container = this.shadowRoot?.querySelector("section") as HTMLElement;

        mqtt_client!.on("message", (topic, message) => {
            if (topic === subscription.topic) {
                const div = document.createElement("div");
                div.innerText = message;
                message_container.appendChild(div);
            }
        });
    }
}
