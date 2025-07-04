import { EventEmitter } from 'events';
interface WebhookServerOptions {
    port?: number;
    path?: string;
}
export declare class WebhookServer {
    private client;
    private port;
    private path;
    private app;
    private server;
    constructor(client: EventEmitter, options?: WebhookServerOptions);
    private setup;
    start(): Promise<void>;
    stop(): Promise<void>;
}
export {};
