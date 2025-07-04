import { UnauthorizedError, ForbiddenError } from '../errors';

export class ChannelsService {
    private apiClient: any;
    private baseUrl: string;

    constructor(apiClient: any) {
        this.apiClient = apiClient;
        this.baseUrl = 'https://api.kick.com/public/v1/channels';
    }

    async getChannels(broadcasterIds: (string | number)[] = [], token: string): Promise<any> {
        const url = new URL(this.baseUrl);

        if (broadcasterIds.length > 0) {
            broadcasterIds.forEach(id =>
                url.searchParams.append('broadcaster_user_id[]', id.toString())
            );
        }

        const response = await fetch(url.toString(), {
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

    async updateChannel(options: { categoryId: number | string; streamTitle: string }, token: string): Promise<boolean> {
        const response = await fetch(this.baseUrl, {
            method: 'PATCH',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                category_id: options.categoryId,
                stream_title: options.streamTitle
            })
        });

        if (response.status === 401) throw new UnauthorizedError();
        if (response.status === 403) throw new ForbiddenError();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return response.status === 204;
    }
}
