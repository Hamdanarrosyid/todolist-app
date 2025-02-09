export interface ResponseWrapper<T> {
    data: T;
    page: number,
    limit: number,
    total: number,
}