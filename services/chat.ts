import { UnauthorizedError, ForbiddenError } from '../errors';

interface SendMessageOptions {
    content: string;
    type?: 'user' | 'bot';
    broadcasterUserId?: number | string;
    token: string;
}

export class ChatService {
    private apiClient: any; // Remplace `any` par le type réel de ton apiClient si tu l’as
    private baseUrl: string;

    constructor(apiClient: any) {
        this.apiClient = apiClient;
        this.baseUrl = 'https://api.kick.com/public/v1/chat';
    }

    async sendMessage(options: SendMessageOptions): Promise<any> {
        const payload: any = {
            content: options.content,
            type: options.type || 'bot'
        };

        if (payload.type === 'user') {
            if (!options.broadcasterUserId) {
                throw new Error('broadcaster_user_id is required for user type messages');
            }
            payload.broadcaster_user_id = options.broadcasterUserId;
        }

        if (payload.content.length > 500) {
            throw new Error('Message content cannot exceed 500 characters');
        }

        if (!['user', 'bot'].includes(payload.type)) {
            throw new Error('Message type must be either "user" or "bot"');
        }

        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${options.token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (response.status === 401) throw new UnauthorizedError();
        if (response.status === 403) throw new ForbiddenError();
        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(`HTTP error! status: ${response.status}, message: ${error.message || 'Unknown error'}`);
        }

        const result = await response.json();
        return result.data || result;
    }
}
