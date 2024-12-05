export interface ApiResponse<T> {
    success: boolean,
    status: number,
    data?: T,
    error?: string 
}

export function createErrorResponse(status: number, error: string): ApiResponse<null> {
    return {
        success: false,
        status: status,
        error: error,
    };
}

export function createResponse<T>(status: number, data: T): ApiResponse<T> {
    return {
        success: true,
        status: status,
        data: data
    };
}

export function handleFetchException<T>(error: any, status: any): ApiResponse<T | null> {
    if (error instanceof TypeError) {
        return createErrorResponse(503, "Network Error");
    }
    const errorMessage = error instanceof Error ? error.message : "Unexpected error";
    return createErrorResponse(status || 0, errorMessage);
}