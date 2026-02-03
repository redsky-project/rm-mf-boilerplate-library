/**
 * Generic API error type
 */
export interface ApiError {
	message: string;
	code?: string;
	status?: number;
	details?: unknown;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
	page: number;
	pageSize: number;
	totalPages: number;
	totalItems: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
	data: T[];
	meta: PaginationMeta;
}

/**
 * Generic API response wrapper
 */
export interface ApiResponseWrapper<T> {
	success: boolean;
	data?: T;
	error?: ApiError;
}
