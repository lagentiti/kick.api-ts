import { EventEmitter } from 'events';
import { CategoriesService } from './services/categories';
import { UsersService } from './services/users';
import { ChannelsService } from './services/channels';
import { ChatService } from './services/chat';
import { PublicKeyService } from './services/publicKey';
import { EventsService } from './services/events'; // ✅ Ajout
import { WebhookHandler } from './webhooks/handler';
import { WebhookServer } from './webhooks/server';
export class KickClient extends EventEmitter {
    constructor(options = {}) {
        var _a;
        super();
        this.options = Object.assign({ webhookPort: options.webhookPort || 3000, webhookPath: options.webhookPath || '/webhook', webhookBaseUrl: options.webhookBaseUrl || 'http://localhost', token: (_a = options.token) !== null && _a !== void 0 ? _a : '' }, options);
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
    async searchCategories(query = '') {
        return await this.categories.getCategories(query, this.token);
    }
    async getCategory(categoryId) {
        return await this.categories.getCategory(categoryId, this.token);
    }
    async introspectToken() {
        if (!this.token)
            throw new Error('No token provided');
        return await this.users.introspectToken(this.token);
    }
    async getUsers(userIds = []) {
        return await this.users.getUsers(userIds.map(String), this.token);
    }
    async getChannels(broadcasterIds = []) {
        return await this.channels.getChannels(broadcasterIds.map(String), this.token);
    }
    async updateChannel(options) {
        if (!this.token)
            throw new Error('No token provided');
        const typedOptions = options;
        return await this.channels.updateChannel(typedOptions, this.token);
    }
    async sendChatMessage(options) {
        return await this.chat.sendMessage(Object.assign(Object.assign({}, options), { token: this.token, content: options.content // Assure-toi que content existe
         }));
    }
    async getPublicKey() {
        return await this.publicKey.getPublicKey();
    }
    async validateWebhook(headers, body) {
        await this.events.initializeVerifier();
        return this.events.validateWebhook(headers, body);
    }
    async getEventSubscriptions() {
        if (!this.token)
            throw new Error('No token provided');
        return await this.events.getSubscriptions(this.token);
    }
    async subscribeToEvents(events, method = 'webhook') {
        if (!this.token)
            throw new Error('No token provided');
        return await this.events.subscribe(events, method, this.token);
    }
    async unsubscribeFromEvents(subscriptionIds) {
        if (!this.token)
            throw new Error('No token provided');
        return await this.events.unsubscribe(subscriptionIds, this.token);
    }
    async startWebhookServer() {
        return await this.webhookServer.start();
    }
    async stopWebhookServer() {
        return await this.webhookServer.stop();
    }
    async handleWebhookRequest(headers, rawBody) {
        return await this.webhookHandler.handleWebhook(headers, rawBody);
    }
}
