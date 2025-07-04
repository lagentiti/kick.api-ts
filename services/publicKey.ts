import { UnauthorizedError } from '../errors';

export class PublicKeyService {
    private apiClient: any;
    private baseUrl: string;

    constructor(apiClient: any) {
        this.apiClient = apiClient;
        this.baseUrl = 'https://api.kick.com/public/v1/public-key';
    }

    async getPublicKey(): Promise<any> {
        const response = await fetch(this.baseUrl, {
            method: 'GET'
        });

        if (response.status === 401) throw new UnauthorizedError();
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        return await response.json();
    }
}
