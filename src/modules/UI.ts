//TODO:Pass in broker and client. Allow swtiching brokers, or from MQTT.js to Paho etc.

export const connection_indicators = (connection_state: boolean) => {
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
