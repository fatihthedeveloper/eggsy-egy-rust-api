export interface TransactionEntity {
    id: string;
    email: string;
    transactionDate: string;
    amount: number;
    currency: string;
    transactionType: string;
    merchantName: string;
    description: string;
    createdAt: number;
    updatedAt: number;
    category: string;
}