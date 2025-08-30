export class ApiClient {
    constructor(
        private baseUrl: string = process.env.REACT_APP_API_URL || "http://localhost:3001/api/v1"
    ) { }

    private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
        const res = await fetch(this.baseUrl + endpoint, {
            headers: { "Content-Type": "application/json" },
            ...options,
        });

        if (!res.ok) {
            throw new Error(`API error ${res.status} for ${endpoint}`);
        }

        return res.json() as Promise<T>;
    }

    get<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint);
    }

    post<T>(endpoint: string, body: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "POST",
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: unknown): Promise<T> {
        return this.request<T>(endpoint, {
            method: "PUT",
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: "DELETE" });
    }
}
