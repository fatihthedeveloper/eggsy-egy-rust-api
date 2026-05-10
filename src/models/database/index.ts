export interface D1DatabaseRequest {
    sql: string;
    params: string[];
}

interface D1DatabaseBaseResponse {
    success: boolean;
    errors?: string[];
    messages?: string[];
}

interface D1DatabaseResult<T> {
    results: Array<T>;
    success: boolean;
}

export interface D1DatabaseWriteResponse extends D1DatabaseBaseResponse {
}

export interface D1DatabaseReadResponse<T> extends D1DatabaseBaseResponse {
    result: D1DatabaseResult<T>[];
}