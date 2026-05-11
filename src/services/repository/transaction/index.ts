import type { TransactionEntity } from "../../../models/entity/transaction.js";
import type {D1Database} from "../../database/index.js";

export interface TransactionRepository {
    create(transaction: TransactionEntity): Promise<string>;
    update(transaction: TransactionEntity): Promise<void>;
    get(transaction: string): Promise<TransactionEntity | undefined>;
    delete(transaction: string): Promise<void>;
    list(email: string, page: number, pageSize: number, startDate?: string, endDate?: string, category?: string): Promise<TransactionEntity[]>;
}

export class D1TransactionRepository implements TransactionRepository {
    private d1Database: D1Database;

    constructor(d1Database: D1Database) {
        this.d1Database = d1Database;
    }

    private readonly INSERT_TRANSACTION_SQL: string = `
        INSERT INTO transactions (id, email, transactionDate, amount, currency, transactionType, merchantName, description, createdAt, updatedAt, category)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    private readonly UPDATE_TRANSACTION_SQL: string = `
        UPDATE transactions 
        SET 
            transactionDate = ?,
            amount = ?,
            currency = ?,
            transactionType = ?,
            merchantName = ?,
            description = ?,
            updatedAt = ?,
            category = ?
        WHERE id = ? AND email = ?
    `;

    public async delete(transaction: string): Promise<void> {
        const response = await this.d1Database.write({
            sql: "DELETE FROM transactions WHERE id = ?",
            params: [transaction]
        });

        if (!response.success) {
            return Promise.reject(new Error("Failed to delete transaction"));
        }

        return Promise.resolve();
    }

    public async list(email: string, page: number, pageSize: number, startDate?: string, endDate?: string, category?: string): Promise<TransactionEntity[]> {
        const offset = (page - 1) * pageSize;

        const sql = `
            SELECT * FROM transactions WHERE email = ? 
                ${startDate ? `AND transactionDate >= ?` : ""} 
                ${endDate ? `AND transactionDate <= ?` : ""} 
                ${category ? `AND category = ?` : ""} 
           ORDER BY transactionDate DESC LIMIT ${pageSize} OFFSET ${offset}
        `;

        const params: string[] = [email];
        if (startDate) {
            params.push(startDate);
        }
        if (endDate) {
            params.push(endDate);
        }
        if (category) {
            params.push(category);
        }

        const response = await this.d1Database.read<TransactionEntity>({
            sql, params,
        });

        if (!response.success) {
            return Promise.reject(new Error("Failed to list transactions"));
        }

        if (!response.result.at(0)) {
            return Promise.reject(new Error("No transactions found"));
        }

        const transactions = response.result.at(0)?.results;

        if (!transactions) {
            return Promise.reject(new Error("No transactions found"));
        }

        return transactions;

    }

    public async update(transaction: TransactionEntity): Promise<void> {
        const response = await this.d1Database.write({
            sql: this.UPDATE_TRANSACTION_SQL,
            params: [
                transaction.transactionDate,
                transaction.amount.toString(),
                transaction.currency,
                transaction.transactionType,
                transaction.merchantName,
                transaction.description,
                transaction.updatedAt.toString(),
                transaction.category,
                transaction.id,
                transaction.email,
            ]
        });

        if (!response.success) {
            return Promise.reject(new Error("Failed to update transaction"));
        }

        return Promise.resolve();
    }

    public async get(transaction: string): Promise<TransactionEntity | undefined> {
        const response = await this.d1Database.read<TransactionEntity>({
            sql: `SELECT * FROM transactions WHERE id = ?`,
            params: [transaction]
        });

        return Promise.resolve(response.result.at(0)?.results.at(0));
    }

    public async create(transaction: TransactionEntity): Promise<string> {
        const response = await this.d1Database.write({
            sql: this.INSERT_TRANSACTION_SQL,
            params: [
                transaction.id,
                transaction.email,
                transaction.transactionDate,
                transaction.amount.toString(),
                transaction.currency,
                transaction.transactionType,
                transaction.merchantName,
                transaction.description,
                transaction.createdAt.toString(),
                transaction.updatedAt.toString(),
                transaction.category,
            ]
        });

        if (!response.success) {
            return Promise.reject(new Error("Failed to create transaction"));
        }

        return Promise.resolve(transaction.id);
    }
}