interface SendMessageOptions {
    content: string;
    type?: 'user' | 'bot';
    broadcasterUserId?: number | string;
    token: string;
}
export declare class ChatService {
    private apiClient;
    private baseUrl;
    constructor(apiClient: any);
    sendMessage(options: SendMessageOptions): Promise<any>;
}
export {};
