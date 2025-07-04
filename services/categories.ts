export class CategoriesService {
    private apiClient: any; // tu peux remplacer `any` par le vrai type de ton client si nécessaire
    private baseUrl: string;

    constructor(apiClient: any) {
        this.apiClient = apiClient;
        this.baseUrl = 'https://api.kick.com/public/v1/categories';
    }

    async getCategories(searchQuery: string = '', token: string = ''): Promise<any> {
        const url = new URL(this.baseUrl);
        if (searchQuery) {
            url.searchParams.append('q', searchQuery);
        }

        const response = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }

    async getCategory(categoryId: string | number, token: string = ''): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${categoryId}`, {
            method: 'GET',
            headers: {
                ...(token && { Authorization: `Bearer ${token}` })
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        return await response.json();
    }
}
