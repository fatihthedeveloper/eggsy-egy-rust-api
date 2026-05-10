export interface CreateAccountRequest {
    email: string;
}

export interface CreateAccountResponse {
    success: boolean;
    error?: string;
    message?: string;
    secret?: string;
}
