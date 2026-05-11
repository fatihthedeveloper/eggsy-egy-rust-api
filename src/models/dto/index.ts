import type {
    CreateAccountRequest,
    CreateAccountResponse
} from "./account.js";
import type {
    CreateTransactionRequest,
    CreateTransactionResponse,
    GetTransactionRequest, ListTransactionRequest,
    UpdateTransactionRequest
} from "./transaction.js";

export interface RequestPayload {
    requestId: string;
    action: string;
    authentication?: string;
    claims?: {
        email: string;
    };
    data: {
        createAccountData?: CreateAccountRequest;
        createTransactionData?: CreateTransactionRequest;
        updateTransactionData?: UpdateTransactionRequest;
        getTransactionData?: GetTransactionRequest;
        listTransactionData?: ListTransactionRequest;
        deleteTransactionData?: GetTransactionRequest;
    };
}

export interface ResponsePayload {
    success?: boolean;
    errorMessage?: string;
    data?: {
        createAccountData?: CreateAccountResponse;
        createTransactionData?: CreateTransactionResponse;
        updateTransactionData?: CreateTransactionResponse;
        getTransactionData?: CreateTransactionResponse;
        listTransactionData?: CreateTransactionResponse[];
        deleteTransactionData?: string;
    }
}