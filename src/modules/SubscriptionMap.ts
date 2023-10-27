


import { ISubscriptionMap } from "mqtt";
import { IClientSubscribeOptions } from "mqtt";


export default class SubscriptionMap {
    [topic: string]: IClientSubscribeOptions;


    constructor(subscriptions: ISubscriptionMap) {
        for (const topic in subscriptions) {
            this[topic] = subscriptions[topic];
        }
    }
}
