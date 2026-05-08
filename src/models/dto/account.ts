export interface CreateAccountRequest {
    email: string;
}

export interface CreateAccountResponse {
    success: boolean;
    error?: string;
    message?: string;
    secret?: string;
}

export interface RotateAccountRequest {
    email: string;
    password: string;
}

export interface RotateAccountResponse {
    success: boolean;
    error?: string;
    message?: string;
}
