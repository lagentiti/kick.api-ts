export declare const WEBHOOK_TYPES: {
    readonly CHAT_MESSAGE: "chat.message.sent";
    readonly CHANNEL_FOLLOWED: "channel.followed";
    readonly SUBSCRIPTION_RENEWAL: "channel.subscription.renewal";
    readonly SUBSCRIPTION_GIFTS: "channel.subscription.gifts";
    readonly SUBSCRIPTION_NEW: "channel.subscription.new";
};
export type WebhookType = (typeof WEBHOOK_TYPES)[keyof typeof WEBHOOK_TYPES];
export declare function parseWebhookPayload(type: WebhookType, payload: any): any;
