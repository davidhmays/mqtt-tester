import { IClientSubscribeOptions, ISubscriptionMap } from "mqtt/lib/client";

export const map_print = (map: Map<string, IClientSubscribeOptions>, depth = 0) => {
    for (const [key, value] of map) {
        const indent = "->".repeat(depth);
        console.log(indent + key);
        if (value instanceof Map) {
            map_print(value, depth + 1);
        }
    }
};

export const map_to_tree = (topicMap: ISubscriptionMap) => {
    const tree = new Map();
    for (const key in topicMap) {
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
