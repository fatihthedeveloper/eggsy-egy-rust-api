import type {D1Database} from "../d1database/index.js";
import {generateSecret} from "../../utils/secret.js";

export interface AccountRepository {
    createAccount(email: string): Promise<string>;
    getAccountSecret(email: string): Promise<string>;
}

export class D1AccountRepository implements AccountRepository {
    private d1Database: D1Database;

    constructor(d1Database: D1Database) {
        this.d1Database = d1Database;
    }

    private readonly INSERT_ACCOUNT_SQL: string = `
        INSERT INTO Users (email, secret, createdAt, lastUpdatedAt, banned) 
        VALUES (?, ?, ?, ?, ?)
    `;

    public async createAccount(email: string): Promise<string> {
        const newSecret = generateSecret();
        const response = await this.d1Database.write({
            sql: this.INSERT_ACCOUNT_SQL,
            params: [
                email,
                newSecret,
                Date.now().toString(),
                Date.now().toString(),
                Number(false).toString()
            ]
        })

        if (!response.success) {
            return Promise.reject(new Error("Failed to create account"));
        }

        return Promise.resolve(newSecret);
    }

    public async getAccountSecret(email: string): Promise<string> {
        const response = await this.d1Database.read<Map<string, string>>({
            sql: `SELECT secret FROM Users WHERE email = ?`,
            params: [email]
        })

        if (response.result.results.length <= 0) {
            return Promise.reject(new Error("Account not found"));
        }

        return Promise.resolve(response.result.results.at(0)!.get("secret")!);
    }
}