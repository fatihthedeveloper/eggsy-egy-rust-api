import type { TransactionEntity } from "../../../models/entity/transaction.js";
import type {D1Database} from "../../database/index.js";

export interface TransactionRepository {
    create(transaction: TransactionEntity): Promise<string>;
    get(transaction: string): Promise<TransactionEntity | undefined>;
}

export class D1TransactionRepository implements TransactionRepository {
    private d1Database: D1Database;

    constructor(d1Database: D1Database) {
        this.d1Database = d1Database;
    }

    private readonly INSERT_TRANSACTION_SQL: string = `
        INSERT INTO transactions (id, email, transactionDate, amount, currency, transactionType, merchantName, description, createdAt, updatedAt)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    private readonly SELECT_TRANSACTIONS_SQL: string = `
        SELECT * FROM transactions
            WHERE transactionDate BETWEEN ? AND ?
        LIMIT ? OFFSET ?
    `;

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
            ]
        });

        console.log(response);

        if (!response.success) {
            return Promise.reject(new Error("Failed to create transaction"));
        }

        return Promise.resolve(transaction.id);
    }
}