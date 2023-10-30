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

// import ClientOptions from "./modules/ClientOptions.ts";
// import ClientSubscribeOptions from "./modules/ClientSubscribeOptions.ts";

import init_custom_elements from "../ui_components/_ui.base/ui.base.ts";
import { map_print, map_to_tree, update_subscription_map, render_tree } from "./modules/MapHelpers.ts";
import UI from "./modules/UI.ts";

init_custom_elements();
console.log(mqtt);
let mqtt_client: MqttClient | null = null;
const subscription_map: ISubscriptionMap = {}; // Current subscriptions store
const ui = new UI();

ui.subscribe_btn.addEventListener("click", () => subscribe(`${ui.subscribe_topic.value}`, { qos: parseInt(`${ui.subscribe_qos.value}`) as mqtt.QoS }));
ui.open_conn_btn.addEventListener("click", () => ui.show(ui.connect_page));
ui.add_sub_btn.addEventListener("click", () => ui.show(ui.subscribe_page));

const connect_to_broker = () => {
    mqtt_client && alert("Warning: if you've already connected, refresh the page to use your new settings. Reconnecting otherwise will try over and over. (You'll see the connection logo blinking red and black)");

    const client_options: IClientOptions = {
        clientId: `${ui.client_id.value}`,
        username: `${ui.user.value}`,
        password: `${ui.password.value}`,
        will: {
            topic: `${ui.lwt_message.value}`,
            payload: ui.client_id.value + "-" + ui.user.value + ": " + ui.lwt_message.value, // The Node.js types complain here expecting a "buffer" type. The Browser version of MQTT.js handles the string fine. I just couldn't get the browser version types working.
            qos: ui.lwt_qos.value as mqtt.QoS,
            retain: ui.lwt_retain.value as boolean,
        },
        keepalive: parseInt(`${ui.keep_alive.value}`) as number,
        clean: ui.clean_session.value as boolean,
    };

    mqtt_client = mqtt.connect(`${ui.url.value}`, client_options);

    // MQTT EVENTS /////////////////////////////////////////////////

    mqtt_client!.on("connect", () => {
        ui.connection_indicators(true);

        // Set a default connection an
        subscription_map["wi/chat"] = {
            qos: 2 as mqtt.QoS,
        };

        subscription_map[`${ui.lwt_topic.value}`] = {
            qos: parseInt(`${ui.lwt_qos.value}`) as mqtt.Qos,
        };

        subscribe(subscription_map);
        mqtt_client!.publish("wi/chat", "| " + ui.user.value + " has entered the chat on client " + ui.client_id.value);
    });

    mqtt_client!.on("close", () => {
        ui.connection_indicators(false);
    });
};

ui.connect_btn.addEventListener("click", connect_to_broker);

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
            ui.subscription_list.innerHTML = "";
            const tree = map_to_tree(subscription_map);
            // map_print(tree); // for debugging tree structure.
            ui.render_tree(tree, ui.subscription_list);

            ui.render_pages(mqtt_client as MqttClient, granted);
        }
    });
}
