export * from './entities';
export * from './requests';
export * from './responses';

export type ApiError = {
    message: string;
    statusCode: number;
    errors?: Record<string, string[]>;
}

export type QueryParams = {
    page?: number;
    limit?: number;
    search?: string;
    sort?: string;
    order?: 'asc' | 'desc';
    [key: string]: any;
} 