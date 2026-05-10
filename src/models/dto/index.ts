import type {
    CreateAccountRequest,
    CreateAccountResponse
} from "./account.js";
import type {CreateTransactionRequest, CreateTransactionResponse} from "./transaction.js";

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
    };
}

export interface ResponsePayload {
    success?: boolean;
    errorMessage?: string;
    data?: {
        createAccountData?: CreateAccountResponse;
        createTransactionData?: CreateTransactionResponse;
    }
}