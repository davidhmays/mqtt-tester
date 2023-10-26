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
import { IClientOptions } from "mqtt/lib/client";
import { IClientSubscribeOptions } from "mqtt/lib/client";
import { ISubscriptionMap } from "mqtt/lib/client";
import * as DataGenerator from "./modules/data_generator.ts";
import FormInput from "./modules/form_input.ts";
import init_custom_elements from "../ui_components/_ui.base/ui.base.ts";

init_custom_elements();
console.log(mqtt);
let mqtt_client: MqttClient | null = null;
const subscriptions: ISubscriptionMap = {};

// Connection form
const connect_form = document.getElementById("connect_form");
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
const open_conn_button: HTMLAnchorElement = document.getElementById("open_connection");

// Subscription form
const subscribe_form = document.getElementById("subscribe_form");
const subscribe_topic = new FormInput("subscribe_topic_input");

const disconnected_icons = document.querySelectorAll(".plug_disconnected");

// const ssl_input: SVGElement = document.getElementById("ssl_input");

// const get_id_button = document.querySelector("#get_id")
// get_id_button.addEventListener("click", function () { window.open("https://www.hivemq.com/demos/websocket-client", "_blank") })

const add_sub_button: HTMLAnchorElement = document.getElementById("add_subscription");
const subscribe_btn: HTMLButtonElement = document.getElementById("subscribe_btn");

// TODO: add topic to subscriptions. Or sub individually.
subscribe_btn.addEventListener("click", () => subscribe(subscribe_topic.value));

const connected_icons = document.querySelectorAll(".check_circle");

// const disconnect_icon = document.querySelector("#disconnect")

const connect_pane_toggle = () => {
    if (connect_form.hasAttribute("hidden")) {
        connect_form.removeAttribute("hidden");
        subscribe_form.setAttribute("hidden", "");
    } else {
        connect_form.setAttribute("hidden", "");
    }
};

const subscribe_pane_toggle = () => {
    if (subscribe_form.hasAttribute("hidden")) {
        subscribe_form.removeAttribute("hidden");
        connect_form.setAttribute("hidden", "");
    } else {
        subscribe_form.setAttribute("hidden", "");
    }
};

open_conn_button.addEventListener("click", connect_pane_toggle);
add_sub_button.addEventListener("click", subscribe_pane_toggle);

//TODO:Pass in broker and client. Allow swtiching brokers, or from MQTT.js to Paho etc.
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
            payload: client_id.value + "-" + user.value + ": " + lwt_message_input.value, // The Node.js types complain here expecting a "buffer" type. The Browser version of MQTT.js handles the string fine. I just couldn't get the browser version types working.
            qos: lwt_qos.value as mqtt.QoS,
            retain: lwt_retain.value as boolean,
        },
        keepalive: parseInt(`${keep_alive.value}`) as number,
        clean: clean_session.value as boolean,
        // press spacebar and . to see other client_options
        // certificate based auth?
    };

    mqtt_client = mqtt.connect(`${url.value}`, client_options);

    mqtt_client.on("connect", () => {
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

        subscriptions["wi/chat"] = {
            qos: 2 as mqtt.QoS,
        };

        subscriptions[`${lwt_topic.value}`] = {
            qos: parseInt(lwt_qos_input.value) as mqtt.Qos,
        };

        bulk_subscribe();

        mqtt_client.publish("wi/chat", "| " + user.value + " has entered the chat on client " + client_id.value);
    });

    mqtt_client.on("close", () => {
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
    });

    mqtt_client.on("message", (topic, message) => {
        // message is Buffer
        console.log(topic.toString() + " " + message.toString());
        // mqtt_client.end();
    });
};

const connect_btn: HTMLButtonElement = document.getElementById("connect_btn");
connect_btn.addEventListener("click", connect_to_broker);

const single_subscribe = (topic: string, qos: mqtt.QoS) => {
    subscriptions[topic] = {
        qos: qos,
    };
};

const bulk_subscribe = () => {
    // This bulk subscribes to the subscriptions: ISubscriptionMap, but you can also subscribe individually as well!
    mqtt_client.subscribe(subscriptions, (err, granted) => {
        if (err) {
            console.error("Error subscribing to topics:", err);
        } else {
            console.log("Subscribed to topics:", granted);

            const dom_subscriptions = document.getElementById("sub_list");

            for (const topic in subscriptions) {
                const existing_dom_subscription = dom_subscriptions.querySelector(`li[data-mqtt-topic="${topic}"]`);

                if (!existing_dom_subscription) {
                    const dom_sub = document.createElement("li");
                    dom_sub.setAttribute("data-mqtt-topic", topic);

                    const anchor = document.createElement("a");
                    anchor.href = "#";
                    anchor.textContent = topic;

                    dom_sub.appendChild(anchor);
                    dom_subscriptions.appendChild(dom_sub);

                    // now close the subscribe box? no might want to add others.
                }
            }
        }
    });
};
