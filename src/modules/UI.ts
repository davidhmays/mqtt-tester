import FormInput from "./FormInput";
import * as DataGenerator from "../modules/DataGenerator.ts";
import MqttClient, { IClientSubscribeOptions, ISubscriptionMap } from "mqtt/lib/client";
import { ISubscriptionGrant } from "mqtt/lib/client";
import DMChat from "../../ui_components/_ui.base/elements/dm-chat/dm-chat.ts";

export default class UI {
    public body: HTMLBodyElement = document.getElementById("body") as HTMLBodyElement;

    // Connection page
    public connect_page: HTMLDivElement = document.getElementById("connect_page") as HTMLDivElement;
    public connect_form: HTMLFormElement = document.getElementById("connect_form") as HTMLFormElement;
    public url = new FormInput("url_input", "mqtt://broker.hivemq.com:8000/mqtt"); // Note: some brokers might expect "ws://, not mqtt:// as this is a websocket connection"
    public user = new FormInput("user_id_input", DataGenerator.user(), "user_id_output");
    public client_id = new FormInput("client_id_input", DataGenerator.id(), "client_id_output");
    public password = new FormInput("password_input");
    public lwt_topic = new FormInput("lwt_topic_input", "wi/disconnect"); //auto update topic name?
    public lwt_message = new FormInput("lwt_message_input", "So long, and thanks for all the fish.");
    public lwt_qos = new FormInput("lwt_qos_input");
    public lwt_retain = new FormInput("lwt_retain_input");
    public keep_alive = new FormInput("keep_alive_input", "60");
    public clean_session = new FormInput("clean_session_input");
    public connect_btn: HTMLButtonElement = document.getElementById("connect_btn")! as HTMLButtonElement;

    // Subscription page
    public subscribe_page: HTMLDivElement = document.getElementById("subscribe_page") as HTMLDivElement;
    public subscribe_form: HTMLFormElement = document.getElementById("subscribe_form") as HTMLFormElement;
    public subscribe_topic = new FormInput("subscribe_topic_input");
    public subscribe_qos = new FormInput("subscribe_qos_input");
    public subscribe_btn: HTMLButtonElement = document.getElementById("subscribe_btn") as HTMLButtonElement;

    //Sidebar
    public add_sub_btn: HTMLAnchorElement = document.getElementById("add_subscription") as HTMLAnchorElement;
    public open_conn_btn: HTMLAnchorElement = document.getElementById("open_connection") as HTMLAnchorElement;
    public subscription_list: HTMLUListElement = document.getElementById("sub_list") as HTMLUListElement;

    public connection_indicators = (connection_state: boolean) => {
        // Icons
        const disconnected_icons = document.querySelectorAll(".plug_disconnected");
        const connected_icons = document.querySelectorAll(".check_circle");

        if (connection_state === true) {
            console.log("connected");
            connected_icons.forEach((element) => {
                if (element.classList.contains("none")) {
                    element.classList.remove("none");
                }
            });

            disconnected_icons.forEach((element) => {
                if (!element.classList.contains("none")) {
                    element.classList.add("none");
                }
            });
        } else if (connection_state === false) {
            console.log("disconnected");
            connected_icons.forEach((element) => {
                if (!element.classList.contains("none")) {
                    element.classList.add("none");
                }
            });
            disconnected_icons.forEach((element) => {
                if (element.classList.contains("none")) {
                    element.classList.remove("none");
                }
            });
        }
    };

    public show = (to_show: HTMLElement | DMChat | string) => {
        let id = "";
        let pages = undefined;
        if (typeof to_show === "string") {
            id = to_show;
            pages = document.querySelectorAll(".page:not(#" + id + ")");
        } else if (to_show instanceof HTMLDivElement) {
            id = to_show.id;
            pages = document.querySelectorAll(".page:not(#" + id + ")");
        } else if (to_show instanceof DMChat) {
            const topic = to_show.getAttribute("data-topic");
            pages = document.querySelectorAll(`.page:not([data-topic="${topic}"]`);
            to_show.classList.remove("none");
        }

        pages.forEach((element) => {
            element.classList.add("none");
        });
        document.getElementById(id)?.classList.remove("none");
    };

    public render_tree = (tree: Map<string, IClientSubscribeOptions>, container: HTMLElement, currentTopic = "") => {
        const list = document.createElement("ul");
        container.appendChild(list);

        for (const [key, value] of tree) {
            const list_item = document.createElement("li");
            list_item.textContent = key;

            // Build the full topic path for this element
            const full_topic = currentTopic ? currentTopic + "/" + key : key;
            list_item.setAttribute("data-topic", full_topic);

            list.appendChild(list_item);

            if (value instanceof Map) {
                this.render_tree(value, list_item, full_topic); // Pass the current full topic path
            }
        }
    };

    // Would be best to use ISubscriptionGrant for accurate QoS levels granted.
    public render_pages = (mqtt_client: MqttClient, subscriptions: ISubscriptionMap) => {
        for (const topic in subscriptions) {
            this.body.appendChild(new DMChat(mqtt_client, topic));
        }
    };

    //kludge: could remove all page elements...
}
