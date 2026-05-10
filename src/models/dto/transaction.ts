export interface CreateTransactionRequest {
    email: string;
    amount: number;
    currency: string;
    transactionType: string;
    merchantName: string;
    description: string;
    category: string;
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
    category: string;
}

export interface UpdateTransactionRequest {
    id: string;
    email: string;
    amount: number;
    currency: string;
    transactionType: string;
    merchantName: string;
    description: string;
    category: string;
}

export interface GetTransactionRequest {
    id: string;
}

export interface ListTransactionRequest {
    email: string;
    page: number;
    pageSize: number;
    startDate?: string;
    endDate?: string;
    category?: string;
}
