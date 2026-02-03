export interface ApiClientConfig {
	baseURL: string;
	timeout?: number;
	headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
	data: T;
	status: number;
	statusText: string;
}

export class ApiClient {
	private config: ApiClientConfig;

	constructor(config: ApiClientConfig) {
		this.config = {
			timeout: 10000,
			headers: {
				'Content-Type': 'application/json',
			},
			...config,
		};
	}

	private async request<T>(url: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), this.config.timeout);

		try {
			const response = await fetch(`${this.config.baseURL}${url}`, {
				...options,
				headers: {
					...this.config.headers,
					...options.headers,
				},
				signal: controller.signal,
			});

			clearTimeout(timeout);

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const data = await response.json();

			return {
				data,
				status: response.status,
				statusText: response.statusText,
			};
		} catch (error) {
			clearTimeout(timeout);
			throw error;
		}
	}

	async get<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
		return this.request<T>(url, { ...options, method: 'GET' });
	}

	async post<T>(url: string, data: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
		return this.request<T>(url, {
			...options,
			method: 'POST',
			body: JSON.stringify(data),
		});
	}

	async put<T>(url: string, data: unknown, options?: RequestInit): Promise<ApiResponse<T>> {
		return this.request<T>(url, {
			...options,
			method: 'PUT',
			body: JSON.stringify(data),
		});
	}

	async delete<T>(url: string, options?: RequestInit): Promise<ApiResponse<T>> {
		return this.request<T>(url, { ...options, method: 'DELETE' });
	}
}
