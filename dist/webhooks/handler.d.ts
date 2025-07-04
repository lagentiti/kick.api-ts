import { EventEmitter } from 'events';
export declare class WebhookHandler {
    private client;
    constructor(client: EventEmitter);
    handleWebhook(headers: Record<string, string>, rawBody: Buffer | string | object): Promise<{
        eventType: string;
        eventVersion: string;
        payload: any;
    }>;
}
