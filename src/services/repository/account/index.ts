import type {D1Database} from "../../database/index.js";
import {generateSecret} from "../../../utils/secret.js";
import type {AccountEntity} from "../../../models/entity/account.js";

export interface AccountRepository {
    create(account: AccountEntity): Promise<string>;
    get(account: string): Promise<AccountEntity | undefined>;
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

    private readonly SELECT_ACCOUNT_SQL: string = `
        SELECT * FROM Users WHERE email = ?
    `;

    public async get(email: string): Promise<AccountEntity | undefined> {
        const response = await this.d1Database.read<AccountEntity>({
            sql: this.SELECT_ACCOUNT_SQL,
            params: [email]
        })

        console.warn(JSON.stringify(response));

        if (!response.success) {
            return undefined;
        }

        const account = response.result.at(0)?.results.at(0);
        if (!account) {
            return undefined;
        }

        return account;
    }

    public async create(account: AccountEntity): Promise<string> {
        const response = await this.d1Database.write({
            sql: this.INSERT_ACCOUNT_SQL,
            params: [
                account.email,
                account.secret,
                account.createdAt.toString(),
                account.lastUpdatedAt.toString(),
                Number(account.banned).toString()
            ]
        })

        if (!response.success) {
            return Promise.reject(new Error("Failed to create account"));
        }

        return Promise.resolve(account.email);
    }
}