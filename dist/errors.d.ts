export declare class KickApiError extends Error {
    status: number;
    constructor(message: string, status: number);
}
export declare class UnauthorizedError extends KickApiError {
    constructor(message?: string);
}
export declare class ForbiddenError extends KickApiError {
    constructor(message?: string);
}
