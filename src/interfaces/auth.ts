export interface AuthRequest {
    meja: string;
}

export interface AuthResponse {
    token?: string;
    message?: string;
    meja?: string;
}