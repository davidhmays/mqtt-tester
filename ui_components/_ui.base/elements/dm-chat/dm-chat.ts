import { ISubscriptionGrant, MqttClient } from "mqtt";
import DMElement from "../dm-element/dm-element";
import cssText from "./dm-chat.css?inline";
import htmlText from "./dm-chat.html?raw";

export default class DMChat extends DMElement {
    constructor(mqtt_client: MqttClient, topic: ISubscriptionGrant) {
        super({
            htmlText: htmlText,
            cssText: cssText,
        });
        this.id = topic.topic;

        const header1 = this.shadowRoot?.querySelector("header") as HTMLElement;
        header1.innerHTML = topic.topic;

        mqtt_client!.on("message", (topic, message) => {
            console.log(topic.toString() + " " + message.toString());
        });
    }
}
