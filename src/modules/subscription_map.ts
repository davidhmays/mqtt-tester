import { ISubscriptionMap } from "mqtt";
import { IClientSubscribeOptions } from "mqtt";

export default class SubscriptionMap implements ISubscriptionMap {
    resubscribe?: boolean;
    topics: { [topic: string]: IClientSubscribeOptions } = {};

    constructor() {
        // Initialize the resubscribe property
        this.resubscribe = false; // You can set a default value if needed
    }
}
