export declare class CategoriesService {
    private apiClient;
    private baseUrl;
    constructor(apiClient: any);
    getCategories(searchQuery?: string, token?: string): Promise<any>;
    getCategory(categoryId: string | number, token?: string): Promise<any>;
}
