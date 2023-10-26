import { AckHandler, IClientOptions, IStore, MqttClient, MqttProtocol } from "mqtt";
import { IAuthPacket, IConnectPacket } from "mqtt-packet";
import { IMessageIdProvider } from "mqtt/lib/default-message-id-provider";
import { ClientRequestArgs } from "http";
import { DuplexOptions } from "readable-stream";

export default class ClientOptions implements IClientOptions {
    // Basic:
    clientId?: string;
    username?: string;
    password?: Buffer | string;
    will?: IConnectPacket["will"];
    keepalive?: number;
    clean?: boolean;

    /// Advanced:
    encoding?: BufferEncoding;
    browserBufferSize?: number;
    binary?: boolean;
    my?: any;
    manualConnect?: boolean;
    authPacket?: Partial<IAuthPacket>;
    writeCache?: boolean;
    servername?: string;
    defaultProtocol?: MqttProtocol;
    query?: Record<string, string>;
    auth?: string;
    customHandleAcks?: AckHandler;
    host?: string;
    wsOptions?: ClientOptions | ClientRequestArgs | DuplexOptions;
    reconnectPeriod?: number;
    connectTimeout?: number;
    incomingStore?: IStore;
    outgoingStore?: IStore;
    queueQoSZero?: boolean;
    log?: (...args: any[]) => void;
    autoUseTopicAlias?: boolean;
    autoAssignTopicAlias?: boolean;
    reschedulePings?: boolean;
    servers?: Array<{
        host: string;
        port: number;
        protocol?: "wss" | "ws" | "mqtt" | "mqtts" | "tcp" | "ssl" | "wx" | "wxs";
    }>;
    resubscribe?: boolean;
    transformWsUrl?: (url: string, options: IClientOptions, client: MqttClient) => string;
    createWebsocket?: (url: string, websocketSubProtocols: string[], options: IClientOptions) => any;
    messageIdProvider?: IMessageIdProvider;
    browserBufferTimeout?: number;
    objectMode?: boolean;
    protocolVersion?: IConnectPacket["protocolVersion"];
    protocolId?: IConnectPacket["protocolId"];
    properties?: IConnectPacket["properties"];

    ////////////////////////////////////////////////////////////////////////
    ////////////////////////////////////////////////////////////////////////
    // Dave Mays: THESE BREAK CONNECTION (Might be browser vs node issue?)
    //
    // port?: number; // PORT BREAKS CONNECTION
    // hostname?: string; //HOSTNAME BREAKS CONNECTION
    // path?: string; // PATH BREAKS CONNECTION
    // protocol?: MqttProtocol; // PROTOCOL BREAKS CONNECTION
    //////////////////////////////////////////////////////////////////////

    constructor(client_options: IClientOptions) {
        Object.assign(this, client_options);
    }
}
