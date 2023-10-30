import { IClientSubscribeOptions, ISubscriptionMap } from "mqtt/lib/client";

export const is_subscription_map = (input: any): input is ISubscriptionMap => typeof input === "object" && !Array.isArray(input);

export const update_subscription_map = (subscription_map: ISubscriptionMap, topics?: ISubscriptionMap | string[] | string, options?: IClientSubscribeOptions) => {
    // If topic is single string:
    if (typeof topics === "string") {
        subscription_map[topics] = options!;
    }
    // If topic is string[] array:
    if (Array.isArray(topics)) {
        for (const topic of topics) {
            subscription_map[topic] = options!;
        }
        // If topic is a subscription map:
    } else if (is_subscription_map(topics)) {
        for (const topic in topics) {
            subscription_map[topic] = topics[topic];
        }
    }
};

export const map_print = (map: Map<string, IClientSubscribeOptions>, depth = 0) => {
    for (const [key, value] of map) {
        const indent = "->".repeat(depth);
        console.log(indent + key);
        if (value instanceof Map) {
            map_print(value, depth + 1);
        }
    }
};

export const map_to_tree = (subscription_map: ISubscriptionMap) => {
    const tree = new Map();

    for (const key in subscription_map) {
        const parts = key.split("/");
        let currentNode = tree;

        for (const part of parts) {
            if (!currentNode.has(part)) {
                currentNode.set(part, new Map());
            }

            currentNode = currentNode.get(part);
        }
    }

    return tree;
};

export const render_tree = (tree: Map<string, IClientSubscribeOptions>, container: HTMLElement, currentTopic = "") => {
    const list = document.createElement("ul");
    container.appendChild(list);

    for (const [key, value] of tree) {
        const list_item = document.createElement("li");
        list_item.textContent = key;

        // Build the full topic path for this element
        const full_topic = currentTopic ? currentTopic + "/" + key : key;
        list_item.setAttribute("data-topic", full_topic);

        list.appendChild(list_item);

        if (value instanceof Map) {
            render_tree(value, list_item, full_topic); // Pass the current full topic path
        }
    }
};
