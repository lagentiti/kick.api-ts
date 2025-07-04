export declare class UsersService {
    private apiClient;
    private baseUrl;
    constructor(apiClient: any);
    introspectToken(token: string): Promise<any>;
    getUsers(userIds: string[] | undefined, token: string): Promise<any>;
}
