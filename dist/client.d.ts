import { EventEmitter } from 'events';
import { CategoriesService } from './services/categories';
import { UsersService } from './services/users';
import { ChannelsService } from './services/channels';
import { ChatService } from './services/chat';
import { PublicKeyService } from './services/publicKey';
import { EventsService, WebhookType, WebhookHeaders } from './services/events';
import { WebhookHandler } from './webhooks/handler';
import { WebhookServer } from './webhooks/server';
interface KickClientOptions {
    webhookPort?: number;
    webhookPath?: string;
    webhookBaseUrl?: string;
    token?: string;
    [key: string]: any;
}
export declare class KickClient extends EventEmitter {
    options: Required<KickClientOptions>;
    categories: CategoriesService;
    users: UsersService;
    channels: ChannelsService;
    chat: ChatService;
    publicKey: PublicKeyService;
    events: EventsService;
    webhookHandler: WebhookHandler;
    webhookServer: WebhookServer;
    token: string;
    constructor(options?: KickClientOptions);
    searchCategories(query?: string): Promise<any>;
    getCategory(categoryId: string | number): Promise<any>;
    introspectToken(): Promise<any>;
    getUsers(userIds?: Array<string | number>): Promise<any>;
    getChannels(broadcasterIds?: Array<string | number>): Promise<any>;
    updateChannel(options: Record<string, any>): Promise<boolean>;
    sendChatMessage(options: Record<string, any>): Promise<any>;
    getPublicKey(): Promise<any>;
    validateWebhook(headers: WebhookHeaders, body: any): Promise<{
        isValid: boolean;
        eventType: WebhookType;
        version: string;
        messageId: string;
        timestamp: string;
        payload: unknown;
    }>;
    getEventSubscriptions(): Promise<unknown>;
    subscribeToEvents(events: WebhookType[], method?: string): Promise<unknown>;
    unsubscribeFromEvents(subscriptionIds: string[]): Promise<boolean>;
    startWebhookServer(): Promise<void>;
    stopWebhookServer(): Promise<void>;
    handleWebhookRequest(headers: WebhookHeaders, rawBody: any): Promise<{
        eventType: string;
        eventVersion: string;
        payload: any;
    }>;
}
export {};
