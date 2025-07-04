export class KickApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'KickApiError';
        this.status = status;
    }
}

export class UnauthorizedError extends KickApiError {
    constructor(message: string = 'Unauthorized') {
        super(message, 401);
        this.name = 'UnauthorizedError';
    }
}

export class ForbiddenError extends KickApiError {
    constructor(message: string = 'Forbidden') {
        super(message, 403);
        this.name = 'ForbiddenError';
    }
}