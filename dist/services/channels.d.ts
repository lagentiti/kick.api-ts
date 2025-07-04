export declare class ChannelsService {
    private apiClient;
    private baseUrl;
    constructor(apiClient: any);
    getChannels(broadcasterIds: (string | number)[] | undefined, token: string): Promise<any>;
    updateChannel(options: {
        categoryId: number | string;
        streamTitle: string;
    }, token: string): Promise<boolean>;
}
