import FormInput from "./FormInput";
import * as DataGenerator from "../modules/DataGenerator.ts";

export default class UI {
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
    public add_sub_button: HTMLAnchorElement = document.getElementById("add_subscription") as HTMLAnchorElement;
    public open_conn_button: HTMLAnchorElement = document.getElementById("open_connection") as HTMLAnchorElement;
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
}
