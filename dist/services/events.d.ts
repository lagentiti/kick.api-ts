import { WebhookType } from '../types/webhooks';
export type { WebhookType };
export interface WebhookHeaders {
    'kick-event-message-id': string;
    'kick-event-message-timestamp': string;
    'kick-event-signature': string;
    'kick-event-type': WebhookType;
    'kick-event-version': string;
    [key: string]: string;
}
interface ApiClient {
    getPublicKey: () => Promise<{
        data: {
            public_key: string;
        };
    }>;
    options: {
        webhookBaseUrl: string;
        webhookPort: number;
        webhookPath: string;
    };
}
export declare class EventsService {
    private apiClient;
    private verifier;
    private baseUrl;
    constructor(apiClient: ApiClient);
    initializeVerifier(): Promise<void>;
    validateWebhook(headers: WebhookHeaders, body: string): {
        isValid: boolean;
        eventType: WebhookType;
        version: string;
        messageId: string;
        timestamp: string;
        payload: unknown;
    };
    getSubscriptions(token: string): Promise<unknown>;
    subscribe(events: WebhookType[], method: "webhook" | string | undefined, token: string): Promise<unknown>;
    unsubscribe(subscriptionIds: string[], token: string): Promise<boolean>;
}
