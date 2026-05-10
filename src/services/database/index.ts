import type {
    D1DatabaseReadResponse,
    D1DatabaseRequest,
    D1DatabaseWriteResponse
} from "../../models/database/index.js";

export interface D1Database {
    write(request: D1DatabaseRequest): Promise<D1DatabaseWriteResponse>;
    read<T>(request: D1DatabaseRequest): Promise<D1DatabaseReadResponse<T>>;
}

export class D1DatabaseService implements D1Database {
    private readonly accountId: string;
    private readonly databaseId: string;
    private readonly token: string;

    constructor(accountId: string, databaseId: string, token: string) {
        this.accountId = accountId;
        this.databaseId = databaseId;
        this.token = token;
    }

    public async write(request: D1DatabaseRequest): Promise<D1DatabaseWriteResponse> {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`
            },
            body: JSON.stringify(request)
        });

        const data: D1DatabaseWriteResponse = await response.json();

        return Promise.resolve(data);
    }

    public async read<T>(request: D1DatabaseRequest): Promise<D1DatabaseReadResponse<T>> {
        const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${this.accountId}/d1/database/${this.databaseId}/query`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${this.token}`
            },
            body: JSON.stringify(request)
        });

        const data: D1DatabaseReadResponse<T> = await response.json();

        console.warn(JSON.stringify(data));

        return Promise.resolve(data);
    }

}