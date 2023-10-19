// To build: npm run build. How do we tutn off the npm build debugger?
// How to add type definitions? Here somewhere: 
// To use client side directly, would need some kind of 
// Notice the URL starts with ws:// for web socket, not mqtt:// or http://
// If connecting to HiveMQ's test server, find a client ID here: https://www.hivemq.com/demos/websocket-client/
// Can see overall here: https://www.mqtt-dashboard.com/

// Connect packet definiton: https://github.com/mqttjs/mqtt-packet#connect

//YES this is all spaghetti. It was made quickly for tesing..

let url = "ws://broker.hivemq.com:8000/mqtt";
let client_id = "clientId-54t4sP6pzs";


const subscriptions: any[] = [];

// const options: mqtt.IClientOptions = {
// }



console.log(mqtt)
const client: MqttClient = mqtt.connect(url);




// // const client = mqtt.connect(url, {
// //     clientId: client_id,

// // });

// const client_id_input = document.querySelector("#client_id_input")
// client_id_input.setAttribute("value", client_id)
// client_id_input.addEventListener("input", function (event) { client_id = event.target.value })

// const url_input = document.querySelector("#url_input")
// url_input.setAttribute("value", url)
// url_input.addEventListener("input", function (event) { url = event.target.value })

// const get_id_button = document.querySelector("#get_id")
// get_id_button.addEventListener("click", function () { window.open("https://www.hivemq.com/demos/websocket-client", "_blank") })

// const generate_user = () =>
// {
//   var a = ["Impatient", "Blue", "Ugly", "Friendly", "Sunny", "Quick", "Intelligent", "Curious", "Elegant", "Delightful", "Playful", "Vibrant", "Clever", "Lively", "Cozy", "Radiant", "Sparkling", "Adventurous", "Mysterious", "Peaceful"]
//   var b = ["Banana", "Penguin", "Rock", "Pickle", "Noodle", "Giraffe", "Squirrel", "Sock", "Llama", "Wombat", "Pancake", "Unicorn", "Pajamas", "Bear", "Taco", "Tire", "Lobster", "Pineapple", "Kangaroo", "Beluga"];
//   var rA = Math.floor(Math.random() * a.length);
//   var rB = Math.floor(Math.random() * b.length);
//   return a[rA] + b[rB];
// }
// const user = generate_user();
// const open_conn_button = document.querySelector("#open_connection");
// const add_sub_button = document.querySelector("#add_subscription");
// const connect_form = document.querySelector("#connect_form");
// const subscribe_form = document.querySelector("#subscribe_form");
// const checkmark = document.querySelector("#checkmark")
// // const disconnect_icon = document.querySelector("#disconnect")

// const refresh_user = () => document.querySelector("#current_user").innerHTML = user
// const toggle_connect = () =>
// {
//   if (connect_form.hasAttribute("hidden"))
//   {
//     connect_form.removeAttribute("hidden");
//     subscribe_form.setAttribute("hidden", "");
//   } else
//   {
//     connect_form.setAttribute("hidden", "")
//   }
// }

// const toggle_subscribe = () =>
// {
//   if (subscribe_form.hasAttribute("hidden"))
//   {
//     subscribe_form.removeAttribute("hidden");
//     connect_form.setAttribute("hidden", "");
//   } else
//   {
//     subscribe_form.setAttribute("hidden", "")
//   }
// }


// open_conn_button.addEventListener("click", toggle_connect);
// add_sub_button.addEventListener("click", toggle_subscribe);

// refresh_user()

// const subscribe = (topic) =>
// {
//   client.subscribe(topic, (err) =>
//   {
//     if (err)
//     {
//       alert('Error subscribing to the topic:', err);
//     } else
//     {
//       if (!subscriptions.includes(topic))
//       {
//         subscriptions.push(topic);
//       }

//       const dom_subscriptions = document.getElementById("sub_list")
//       const existing_sub = dom_subscriptions.querySelector(`li#${topic}`)

//       if (!existing_sub)
//       {
//         const dom_sub = document.createElement("li");
//         dom_sub.id = topic

//         const anchor = document.createElement("a");
//         anchor.href = "#";
//         anchor.textContent = topic

//         dom_sub.appendChild(anchor);
//         dom_subscriptions.appendChild(dom_sub);

//         // now close the subscribe box? no might want to add others.
//       }
//     }
//   });
// }


// client.on("connect", () =>
// {

//   if (checkmark.hasAttribute("hidden"))
//   {
//     checkmark.removeAttribute("hidden")
//   };

//   //Post username to 
//   client.publish("participants", user)
//   subscribe("participants");
//   client.publish("participants", user)
// });

// client.on("disconnect", () =>
// {

//   if (!checkmark.hasAttribute("hidden"))
//   {
//     checkmark.setAttribute("hidden", "")
//   };
// });

// client.on("message", (topic, message) =>
// {
//   // message is Buffer
//   console.log(message.toString());
//   client.end();
// });



