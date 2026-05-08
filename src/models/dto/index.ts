import type {
    CreateAccountRequest,
    CreateAccountResponse,
    RotateAccountRequest, RotateAccountResponse
} from "./account.js";

export interface RequestPayload {
    requestId: string;
    action: string;
    email?: string;
    authentication?: string;
    data: RequestPayloadData;
}

interface RequestPayloadData {
    createAccountData?: CreateAccountRequest;
    rotateAccountData?: RotateAccountRequest;
}

export interface ResponsePayload {
    createAccountData?: CreateAccountResponse;
    rotateAccountData?: RotateAccountResponse;
}