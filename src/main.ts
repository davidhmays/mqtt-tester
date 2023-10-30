// To build: npm run build. How do we tutn off the npm build debugger?
// How to add type definitions? Here somewhere:
// To use client side directly, would need some kind of
// Notice the URL starts with ws:// for web socket, not mqtt:// or http://
// If connecting to HiveMQ's test server, find a client ID here: https://www.hivemq.com/demos/websocket-client/
// Can see overall here: https://www.mqtt-dashboard.com/

// Connect packet definiton: https://github.com/mqttjs/mqtt-packet#connect

//YES this is all spaghetti. It was made quickly for tesing..

// NOTE: Types not working for browser version (mqtt.min).
// I wanted at least the definitions for what IClientOptions and MQTTClient can do,
// so pulled those from the Node version (lib/client) but that's not a great idea, but we can see
// the types while developing then turn off the node imports.

import * as mqtt from "mqtt/dist/mqtt.min";
import MqttClient from "mqtt/lib/client";
import { ISubscriptionMap } from "mqtt/lib/client";
import { IClientOptions } from "mqtt/lib/client";
import { IClientSubscribeOptions } from "mqtt/lib/client";
import ClientOptions from "./modules/ClientOptions.ts";
import ClientSubscribeOptions from "./modules/ClientSubscribeOptions.ts";

import * as DataGenerator from "./modules/DataGenerator.ts";
import FormInput from "./modules/FormInput.ts";
import init_custom_elements from "../ui_components/_ui.base/ui.base.ts";
import SubscriptionMap from "./modules/SubscriptionMap.ts";
import { map_print, map_to_tree, update_subscription_map, render_tree } from "./modules/MapHelpers.ts";
import { connection_indicators } from "./modules/UI.ts";

init_custom_elements();
console.log(mqtt);
let mqtt_client: MqttClient | null = null;

// Current subscriptions store
const subscription_map: ISubscriptionMap = {};

// Connection page
const connect_page: HTMLDivElement = document.getElementById("connect_page") as HTMLDivElement;
const connect_form: HTMLFormElement = document.getElementById("connect_form") as HTMLFormElement;
const url = new FormInput("url_input", "mqtt://broker.hivemq.com:8000/mqtt"); // Note: some brokers might expect "ws://, not mqtt:// as this is a websocket connection"
const user = new FormInput("user_id_input", DataGenerator.user(), "user_id_output");
const client_id = new FormInput("client_id_input", DataGenerator.id(), "client_id_output");
const password = new FormInput("password_input");
const lwt_topic = new FormInput("lwt_topic_input", "wi/disconnect"); //auto update topic name?
const lwt_message = new FormInput("lwt_message_input", "So long, and thanks for all the fish.");
const lwt_qos = new FormInput("lwt_qos_input");
const lwt_retain = new FormInput("lwt_retain_input");
const keep_alive = new FormInput("keep_alive_input", "60");
const clean_session = new FormInput("clean_session_input");
const connect_btn: HTMLButtonElement = document.getElementById("connect_btn")! as HTMLButtonElement;

// Subscription page
const subscribe_page: HTMLDivElement = document.getElementById("subscribe_page") as HTMLDivElement;
const subscribe_form: HTMLFormElement = document.getElementById("subscribe_form") as HTMLFormElement;
const subscribe_topic = new FormInput("subscribe_topic_input");
const subscribe_qos = new FormInput("subscribe_qos_input");
const subscribe_btn: HTMLButtonElement = document.getElementById("subscribe_btn") as HTMLButtonElement;

//Sidebar
const add_sub_button: HTMLAnchorElement = document.getElementById("add_subscription") as HTMLAnchorElement;
const open_conn_button: HTMLAnchorElement = document.getElementById("open_connection") as HTMLAnchorElement;
const subscription_list: HTMLUListElement = document.getElementById("sub_list") as HTMLUListElement;

// TODO: add topic to subscriptions. Or sub individually.
subscribe_btn.addEventListener("click", () => subscribe(`${subscribe_topic.value}`, { qos: parseInt(`${subscribe_qos.value}`) as mqtt.QoS }));

// const disconnect_icon = document.querySelector("#disconnect")

const show = (to_show: HTMLElement | string) => {
    let id = "";
    if (typeof to_show === "string") {
        id = to_show;
    } else if (to_show instanceof HTMLElement) {
        id = to_show.id;
    }
    const pages = document.querySelectorAll(".page:not(#" + id + ")");
    pages.forEach((element) => {
        element.classList.add("none");
    });
    document.getElementById(id)?.classList.remove("none");
};

open_conn_button.addEventListener("click", () => show(connect_page));
add_sub_button.addEventListener("click", () => show(subscribe_page));

const connect_to_broker = () => {
    mqtt_client &&
        alert(
            "Warning: if you've already connected, refresh the page to use your new settings. Reconnecting otherwise will try over and over. (You'll see the connection logo blinking red and black)"
        );

    const client_options: IClientOptions = {
        clientId: `${client_id.value}`,
        username: `${user.value}`,
        password: `${password.value}`,
        will: {
            topic: `${lwt_message.value}`,
            payload: client_id.value + "-" + user.value + ": " + lwt_message.value, // The Node.js types complain here expecting a "buffer" type. The Browser version of MQTT.js handles the string fine. I just couldn't get the browser version types working.
            qos: lwt_qos.value as mqtt.QoS,
            retain: lwt_retain.value as boolean,
        },
        keepalive: parseInt(`${keep_alive.value}`) as number,
        clean: clean_session.value as boolean,
    };

    mqtt_client = mqtt.connect(`${url.value}`, client_options);

    mqtt_client!.on("connect", () => {
        connection_indicators(true);

        subscription_map["wi/chat"] = {
            qos: 2 as mqtt.QoS,
        };

        subscription_map[`${lwt_topic.value}`] = {
            qos: parseInt(`${lwt_qos.value}`) as mqtt.Qos,
        };

        subscribe(subscription_map);

        mqtt_client!.publish("wi/chat", "| " + user.value + " has entered the chat on client " + client_id.value);
    });

    mqtt_client!.on("close", () => {
        connection_indicators(false);
    });

    mqtt_client!.on("message", (topic, message) => {
        console.log(topic.toString() + " " + message.toString());
    });
};

connect_btn.addEventListener("click", connect_to_broker);

const refresh_dom_subscriptions = (subscription_map: ISubscriptionMap) => {
    const tree = map_to_tree(subscription_map);
    render_tree(tree, subscription_list);

    map_print(tree); // for debugging tree structure.
};

function subscribe(topics: string[] | string, options: IClientSubscribeOptions): void;
function subscribe(topics: ISubscriptionMap): void;
function subscribe(topics: ISubscriptionMap | string[] | string, options?: IClientSubscribeOptions) {
    // This bulk subscribes to the subscriptions: ISubscriptionMap, but you can also subscribe individually as well!
    // let to_subscribe: ISubscriptionMap | string[] = undefined;

    mqtt_client!.subscribe(topics, options, (err, granted) => {
        if (err) {
            console.error("Error subscribing to topics:", err);
        } else {
            console.log("Subscribed to topics:", granted);
            update_subscription_map(subscription_map, topics, options);
            subscription_list.innerHTML = "";
            refresh_dom_subscriptions(subscription_map);
        }
    });
}
