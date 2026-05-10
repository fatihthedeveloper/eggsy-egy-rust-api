export interface CreateTransactionRequest {
    email: string;
    amount: number;
    currency: string;
    transactionType: string;
    merchantName: string;
    description: string;
}

export interface CreateTransactionResponse {
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
}

export interface ListTransactionRequest {
    page: number;
    pageSize: number;
    email: string;
}