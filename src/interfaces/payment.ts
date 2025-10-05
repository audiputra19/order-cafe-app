export interface Items {
    nama: string;
    harga: number;
    quantity: number;
}

export interface CreatePaymentRequest {
    meja: string;
    items: Items[];
    total: number;
    metode: string;
}

export interface CreatePaymentResponse {
    orderId: string;
    snapToken: string;
}