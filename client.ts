import { EventEmitter } from 'events';
import { CategoriesService } from './services/categories';
import { UsersService } from './services/users';
import { ChannelsService } from './services/channels';
import { ChatService } from './services/chat';
import { PublicKeyService } from './services/publicKey';
import { EventsService, WebhookType, WebhookHeaders } from './services/events'; // ✅ Ajout
import { WebhookHandler } from './webhooks/handler';
import { WebhookServer } from './webhooks/server';

interface KickClientOptions {
    webhookPort?: number;
    webhookPath?: string;
    webhookBaseUrl?: string;
    token?: string;
    [key: string]: any; // pour accepter d’autres options dynamiques
}

export class KickClient extends EventEmitter {
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

    constructor(options: KickClientOptions = {}) {
        super();
        this.options = {
            webhookPort: options.webhookPort || 3000,
            webhookPath: options.webhookPath || '/webhook',
            webhookBaseUrl: options.webhookBaseUrl || 'http://localhost',
            token: options.token ?? '',
            ...options
        };

        this.categories = new CategoriesService(this);
        this.users = new UsersService(this);
        this.channels = new ChannelsService(this);
        this.chat = new ChatService(this);
        this.publicKey = new PublicKeyService(this);
        this.events = new EventsService(this);
        this.webhookHandler = new WebhookHandler(this);
        this.webhookServer = new WebhookServer(this, {
            port: this.options.webhookPort,
            path: this.options.webhookPath
        });
        this.token = options.token || '';
    }

    async searchCategories(query: string = '') {
        return await this.categories.getCategories(query, this.token);
    }

    async getCategory(categoryId: string | number) {
        return await this.categories.getCategory(categoryId, this.token);
    }

    async introspectToken() {
        if (!this.token) throw new Error('No token provided');
        return await this.users.introspectToken(this.token);
    }

    async getUsers(userIds: Array<string | number> = []) {
        return await this.users.getUsers(userIds.map(String), this.token);
    }

    async getChannels(broadcasterIds: Array<string | number> = []) {
        return await this.channels.getChannels(broadcasterIds.map(String), this.token);
    }

    async updateChannel(options: Record<string, any>) {
        if (!this.token) throw new Error('No token provided');
        const typedOptions = options as { categoryId: string | number; streamTitle: string };
        return await this.channels.updateChannel(typedOptions, this.token);
    }

    async sendChatMessage(options: Record<string, any>) {
        return await this.chat.sendMessage({
            ...options,
            token: this.token,
            content: options.content // Assure-toi que content existe
        });
    }

    async getPublicKey() {
        return await this.publicKey.getPublicKey();
    }

    async validateWebhook(headers: WebhookHeaders, body: any) {
        await this.events.initializeVerifier();
        return this.events.validateWebhook(headers, body);
    }

    async getEventSubscriptions() {
        if (!this.token) throw new Error('No token provided');
        return await this.events.getSubscriptions(this.token);
    }

    async subscribeToEvents(events: WebhookType[], method: string = 'webhook') {
        if (!this.token) throw new Error('No token provided');
        return await this.events.subscribe(events, method, this.token);
    }

    async unsubscribeFromEvents(subscriptionIds: string[]) {
        if (!this.token) throw new Error('No token provided');
        return await this.events.unsubscribe(subscriptionIds, this.token);
    }

    async startWebhookServer() {
        return await this.webhookServer.start();
    }

    async stopWebhookServer() {
        return await this.webhookServer.stop();
    }

    async handleWebhookRequest(headers: WebhookHeaders, rawBody: any) {
        return await this.webhookHandler.handleWebhook(headers, rawBody);
    }
}
