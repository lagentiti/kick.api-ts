import { SignatureVerifier } from '../utils/signature';
import { UnauthorizedError, ForbiddenError } from '../errors';
import { parseWebhookPayload, WebhookType } from '../types/webhooks';

export type { WebhookType }; // <-- Ajouté pour l’export
export interface WebhookHeaders {
    'kick-event-message-id': string;
    'kick-event-message-timestamp': string;
    'kick-event-signature': string;
    'kick-event-type': WebhookType;
    'kick-event-version': string;
    [key: string]: string; // pour d'autres headers éventuels
}

interface ApiClient {
    getPublicKey: () => Promise<{ data: { public_key: string } }>;
    options: {
        webhookBaseUrl: string;
        webhookPort: number;
        webhookPath: string;
    };
}

interface SubscriptionEvent {
    name: WebhookType;
    version: number;
}

export class EventsService {
    private apiClient: ApiClient;
    private verifier: SignatureVerifier | null = null;
    private baseUrl = 'https://api.kick.com/public/v1/events';

    constructor(apiClient: ApiClient) {
        this.apiClient = apiClient;
    }

    async initializeVerifier(): Promise<void> {
        if (!this.verifier) {
            const publicKeyResponse = await this.apiClient.getPublicKey();
            this.verifier = new SignatureVerifier(publicKeyResponse.data.public_key);
        }
    }

    validateWebhook(headers: WebhookHeaders, body: string): {
        isValid: boolean;
        eventType: WebhookType;
        version: string;
        messageId: string;
        timestamp: string;
        payload: unknown;
    } {
        if (!this.verifier) {
            throw new Error('Signature verifier not initialized');
        }

        const messageId = headers['kick-event-message-id'];
        const timestamp = headers['kick-event-message-timestamp'];
        const signature = headers['kick-event-signature'];
        const eventType = headers['kick-event-type'];
        const version = headers['kick-event-version'];

        if (!messageId || !timestamp || !signature) {
            throw new Error('Missing required webhook headers');
        }

        const isValid = this.verifier.verify(messageId, timestamp, body, signature);
        const parsedPayload = parseWebhookPayload(eventType, JSON.parse(body));

        return {
            isValid,
            eventType,
            version,
            messageId,
            timestamp,
            payload: parsedPayload
        };
    }

    async getSubscriptions(token: string): Promise<unknown> {
        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) throw new UnauthorizedError();
        if (response.status === 403) throw new ForbiddenError();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    }

    async subscribe(
        events: WebhookType[],
        method: 'webhook' | string = 'webhook',
        token: string
    ): Promise<unknown> {
        const webhookUrl = `${this.apiClient.options.webhookBaseUrl}:${this.apiClient.options.webhookPort}${this.apiClient.options.webhookPath}`;

        const payload = {
            method: method,
            url: webhookUrl,
            types: events.map((eventName): SubscriptionEvent => ({
                name: eventName as WebhookType,
                version: 1
            }))
        };

        const response = await fetch(`${this.baseUrl}/subscriptions`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 401) throw new UnauthorizedError();
        if (response.status === 403) throw new ForbiddenError();
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${JSON.stringify(error)}`);
        }

        return await response.json();
    }

    async unsubscribe(subscriptionIds: string[], token: string): Promise<boolean> {
        const url = new URL(`${this.baseUrl}/subscriptions`);
        subscriptionIds.forEach(id => url.searchParams.append('id[]', id));

        const response = await fetch(url.toString(), {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (response.status === 401) throw new UnauthorizedError();
        if (response.status === 403) throw new ForbiddenError();
        if (!response.ok && response.status !== 204) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return response.status === 204;
    }
}
