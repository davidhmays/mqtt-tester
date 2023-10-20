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

import MqttClient from "mqtt/lib/client"
import { connect } from "mqtt";
import { IClientOptions } from 'mqtt/lib/client';
import * as mqtt from 'mqtt/dist/mqtt.min'

console.log(mqtt)
let mqtt_client: MqttClient | null = null


const subscriptions: any[] = [];
const generate_id = () =>
{
    var a = ["Impatient", "Blue", "Ugly", "Friendly", "Sunny", "Quick", "Intelligent", "Curious", "Elegant", "Delightful", "Playful", "Vibrant", "Clever", "Lively", "Cozy", "Radiant", "Sparkling", "Adventurous", "Mysterious", "Peaceful"]
    var b = ["Banana", "Penguin", "Rock", "Pickle", "Noodle", "Giraffe", "Squirrel", "Sock", "Llama", "Wombat", "Pancake", "Unicorn", "Pajamas", "Bear", "Taco", "Tire", "Lobster", "Pineapple", "Kangaroo", "Beluga"];
    var rA = Math.floor(Math.random() * a.length);
    var rB = Math.floor(Math.random() * b.length);
    return a[rA] + b[rB];
}

const client_id_ui: HTMLSpanElement = document.getElementById("current_user")
client_id_ui.innerHTML = generate_id()
const client_id_input: HTMLInputElement = document.getElementById("client_id_input")
client_id_input.addEventListener("input", (event) =>
{
    client_id_ui.innerHTML = event.target.valule;
});
// Get the updated value from the input element
const url_input: HTMLInputElement = document.getElementById("url_input")

// const get_id_button = document.querySelector("#get_id")
// get_id_button.addEventListener("click", function () { window.open("https://www.hivemq.com/demos/websocket-client", "_blank") })

const open_conn_button = document.getElementById("open_connection");
const add_sub_button = document.getElementById("add_subscription");
const connect_form = document.getElementById("connect_form");
const subscribe_form = document.getElementById("subscribe_form");
const checkmark = document.getElementById("checkmark")
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
    const url = url_input.value;
    const options = {
        clientId: client_id_input.value
    }

    return [url, options]
}

const connect_to_broker = () =>
{
    const [url, options] = get_client_inputs();
    mqtt_client && mqtt_client.end() //Disconnect if client exists.
    mqtt_client = mqtt.connect(url, options);
}

connect_to_broker();

mqtt_client.on("connect", () =>
{

    if (checkmark.hasAttribute("hidden"))
    {
        checkmark.removeAttribute("hidden")
    };

    //Post username to 
    mqtt_client.publish("participants", client_id_input.value)
    mqtt_client.subscribe("participants");
    mqtt_client.publish("participants", client_id_input.value)
});


const subscribe = (topic: string) =>
{
    mqtt_client.subscribe(topic, (err) =>
    {
        if (err)
        {
            alert('Error subscribing to the topic:' + err);
        } else
        {
            if (!subscriptions.includes(topic))
            {
                subscriptions.push(topic);
            }

            const dom_subscriptions = document.getElementById("sub_list")
            const existing_sub = dom_subscriptions.querySelector(`li#${topic}`)

            if (!existing_sub)
            {
                const dom_sub = document.createElement("li");
                dom_sub.id = topic

                const anchor = document.createElement("a");
                anchor.href = "#";
                anchor.textContent = topic

                dom_sub.appendChild(anchor);
                dom_subscriptions.appendChild(dom_sub);

                // now close the subscribe box? no might want to add others.
            }
        }
    });
}




mqtt_client.on("disconnect", () =>
{

    if (!checkmark.hasAttribute("hidden"))
    {
        checkmark.setAttribute("hidden", "")
    };
});

mqtt_client.on("message", (topic, message) =>
{
    // message is Buffer
    console.log(message.toString());
    // mqtt_client.end();
});

class MqttConnectionManager
{
    constructor()
    {

    }
}


