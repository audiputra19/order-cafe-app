export interface Items {
    nama: string;
    harga: number;
    quantity: number;
}

export interface CreatePaymentRequest {
    meja: string;
    items: Items[];
    subTotal: number;
    voucher_id?: string | null;
    metode: string;
}

export interface CreatePaymentResponse {
    orderId: string;
    snapToken: string;
}