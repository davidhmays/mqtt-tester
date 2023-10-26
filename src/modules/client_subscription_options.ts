import { IClientSubscribeOptions } from "mqtt";
import { QoS, UserProperties } from "mqtt-packet";

export default class ClientSubscribeOptions implements IClientSubscribeOptions {
    qos: QoS;
    nl?: boolean | undefined;
    rap?: boolean | undefined;
    rh?: number | undefined;
    properties?: { reasonString?: string | undefined; subscriptionIdentifier?: number | undefined; userProperties?: UserProperties | undefined } | undefined;

    constructor(client_subscribe_options: IClientSubscribeOptions) {
        this.qos = client_subscribe_options.qos || 0; // Set a default value (e.g., 0) if qos is not provided
        this.nl = client_subscribe_options.nl;
        this.rap = client_subscribe_options.rap;
        this.rh = client_subscribe_options.rh;
        this.properties = client_subscribe_options.properties;
    }
}
