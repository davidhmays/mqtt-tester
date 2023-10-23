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


import * as mqtt from 'mqtt/dist/mqtt.min'
import MqttClient from "mqtt/lib/client"
import { IClientOptions } from 'mqtt/lib/client';
import { IClientSubscribeOptions } from "mqtt/lib/client";
import { ISubscriptionMap } from "mqtt/lib/client";



// import mqtt from "mqtt" //Don't import this, or you'll get non working Node version, but useful to turn on to peek at intended types.

import init_custom_elements from "../ui_components/_ui.base/ui.base.ts"
init_custom_elements();

console.log(mqtt)
let mqtt_client: MqttClient | null = null


const subscriptions: ISubscriptionMap = {};


const generate_user = () =>
{
    var a = ["Impatient", "Blue", "Ugly", "Friendly", "Sunny", "Quick", "Intelligent", "Curious", "Elegant", "Delightful", "Playful", "Vibrant", "Clever", "Lively", "Cozy", "Radiant", "Sparkling", "Adventurous", "Mysterious", "Peaceful"]
    var b = ["Banana", "Penguin", "Rock", "Pickle", "Noodle", "Giraffe", "Squirrel", "Sock", "Llama", "Wombat", "Pancake", "Unicorn", "Pajamas", "Bear", "Taco", "Tire", "Lobster", "Pineapple", "Kangaroo", "Beluga"];
    var rA = Math.floor(Math.random() * a.length);
    var rB = Math.floor(Math.random() * b.length);
    return a[rA] + b[rB];
}
const generate_id = (a) =>
    a ? (a ^ ((Math.random() * 16) >> (a / 4))).toString(16)
        : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
            /[018]/g,
            generate_id
        );


const client_id_ui: HTMLDivElement = document.getElementById("client_id");


const user_ui: HTMLDivElement = document.getElementById("user_id");
user_ui.innerHTML = generate_user();

const client_id_input: HTMLInputElement = document.getElementById("client_id_input");
client_id_input.setAttribute("value", generate_id());
client_id_ui.innerHTML = client_id_input.value
client_id_input.addEventListener("input", (event) => { client_id_ui.innerHTML = event.target.value; });

const user_input: HTMLInputElement = document.getElementById("username_input");
user_input.setAttribute("value", generate_user());
user_ui.innerHTML = user_input.value;
user_input.addEventListener("input", (event) => { user_ui.innerHTML = event.target.value; })


// Get the updated value from the input element
const url_input: HTMLInputElement = document.getElementById("url_input");
const subscribe_topic_input: HTMLInputElement = document.getElementById("subscribe_topic_input");
const password_input: HTMLInputElement = document.getElementById("password_input");
const lwt_topic_input: HTMLInputElement = document.getElementById("lwt_topic_input");
const lwt_message_input: HTMLInputElement = document.getElementById("lwt_message_input");
const lwt_qos_input: HTMLInputElement = document.getElementById("lwt_qos_input");
const lwt_retain_input: SVGElement = document.getElementById("lwt_retain_input")
const keep_alive_input: HTMLInputElement = document.getElementById("keep_alive_input");
const clean_session_input: SVGAElement = document.getElementById("clean_session_input");
const disconnected_icons = document.querySelectorAll(".plug_disconnected")
// const ssl_input: SVGElement = document.getElementById("ssl_input");

// const get_id_button = document.querySelector("#get_id")
// get_id_button.addEventListener("click", function () { window.open("https://www.hivemq.com/demos/websocket-client", "_blank") })

const open_conn_button: HTMLAnchorElement = document.getElementById("open_connection");
const add_sub_button: HTMLAnchorElement = document.getElementById("add_subscription");
const subscribe_btn: HTMLButtonElement = document.getElementById("subscribe_btn")
subscribe_btn.addEventListener("click", () => subscribe(subscribe_topic_input.value))

const connect_form = document.getElementById("connect_form");
const subscribe_form = document.getElementById("subscribe_form");
const connected_icons = document.querySelectorAll(".check_circle")


// const disconnect_icon = document.querySelector("#disconnect")


const connect_pane_toggle = () =>
{
    if (connect_form.hasAttribute("hidden"))
    {
        connect_form.removeAttribute("hidden");
        subscribe_form.setAttribute("hidden", "");
    } else
    {
        connect_form.setAttribute("hidden", "")
    }
}

const subscribe_pane_toggle = () =>
{
    if (subscribe_form.hasAttribute("hidden"))
    {
        subscribe_form.removeAttribute("hidden");
        connect_form.setAttribute("hidden", "");
    } else
    {
        subscribe_form.setAttribute("hidden", "")
    }
}



open_conn_button.addEventListener("click", connect_pane_toggle);
add_sub_button.addEventListener("click", subscribe_pane_toggle);

const get_client_inputs = (): [string, IClientOptions] =>
{
    const url: string = url_input.value;
    const lwt_retain_val = () => lwt_retain_input.hasAttribute("on") ? true : false
    const clean_session_val = () => clean_session_input.hasAttribute("on") ? true : false
    // const ssl_val () => ssl_input.hasAttribute("on") ? true: false
    const options: IClientOptions = {
        clientId: client_id_input.value,
        username: user_input.value,
        password: password_input.value,
        will: {
            topic: lwt_message_input.value,
            payload: client_id_input.value + "-" + user_input.value + ": " + lwt_message_input.value, // The Node.js types complain here expecting a "buffer" type. The Browser version of MQTT.js handles the string fine. I just couldn't get the browser version types working.
            qos: lwt_qos_input.value as mqtt.QoS,
            retain: lwt_retain_val()
        },
        keepalive: parseInt(keep_alive_input.value) as number,
        clean: clean_session_val()
        // ssl ?
        // certificate based auth?
    }

    return [url, options]
}

//TODO:Pass in broker and client. Allow swtiching brokers, or from MQTT.js to Paho etc.
const connect_to_broker = () =>
{
    mqtt_client && alert("Warning: if you've already connected, refresh the page to use your new settings. Reconnecting otherwise will try over and over. (You'll see the connection logo blinking red and black)")

    const [url, options] = get_client_inputs();
    mqtt_client = mqtt.connect(url, options);

    mqtt_client.on("connect", () =>
    {

        console.log("connected")
        connected_icons.forEach(element =>
        {
            if (element.classList.contains("none"))
            {
                element.classList.remove("none")
            }
        })

        disconnected_icons.forEach(element =>
        {
            if (!element.classList.contains("none"))
            {
                element.classList.add("none")
            }
        })

        subscriptions["wi/chat"] = {
            qos: 2 as mqtt.QoS
        }

        subscriptions[lwt_topic_input.value] = {
            qos: parseInt(lwt_qos_input.value) as mqtt.Qos
        }

        bulk_subscribe()
        //subscribe("wi/chat");
        //subscribe(lwt_topic_input.value);
        mqtt_client.publish("wi/chat", client_id_input.value + " has entered the chat.")
    });

    mqtt_client.on("close", () =>
    {

        connected_icons.forEach(element =>
        {
            if (!element.classList.contains("none"))
            {
                element.classList.add("none")
            }
        })

        disconnected_icons.forEach(element =>
        {
            if (element.classList.contains("none"))
            {
                element.classList.remove("none")
            }
        })
    });

    mqtt_client.on("message", (topic, message) =>
    {
        // message is Buffer
        console.log(topic.toString() + " " + message.toString());
        // mqtt_client.end();
    });
};

const connect_btn: HTMLButtonElement = document.getElementById("connect_btn");
connect_btn.addEventListener("click", connect_to_broker)


const single_subscribe = (topic: string, qos: mqtt.QoS) =>
{
    subscriptions[topic] = {
        qos: qos
    }
}

const bulk_subscribe = () =>
{

    // This bulk subscribes to the subscriptions: ISubscriptionMap, but you can also subscribe individually as well! 
    mqtt_client.subscribe(subscriptions, (err, granted) =>
    {
        if (err)
        {
            console.error('Error subscribing to topics:', err);
        } else
        {
            console.log('Subscribed to topics:', granted);

            const dom_subscriptions = document.getElementById("sub_list")

            for (const topic in subscriptions)
            {
                const existing_dom_subscription = dom_subscriptions.querySelector(`li[data-mqtt-topic="${topic}"]`)

                if (!existing_dom_subscription)
                {
                    const dom_sub = document.createElement("li");
                    dom_sub.setAttribute("data-mqtt-topic", topic)

                    const anchor = document.createElement("a");
                    anchor.href = "#";
                    anchor.textContent = topic

                    dom_sub.appendChild(anchor);
                    dom_subscriptions.appendChild(dom_sub);

                    // now close the subscribe box? no might want to add others.
                }
            }





        }
    });
}














