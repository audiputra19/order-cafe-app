export interface GetOrderResponse {
    order_id: string;
    meja: string;
    total: number;
    status: string;
    proses: string;
    created_at: string;
    snap_token: string;
    metode: string;
    diskon: number;
    voucher: string;
}

export interface GetOrderRequest {
    order_id: string;
}

export interface GetOrderItemsResponse {
    order_id: string;
    nama: string;
    harga: number;
    qty: number;
    catatan: string;
    tipe: string;
}

export interface GetOrderItemsRequest {
    order_id: string;
}

export interface FinishOrderResponse {
    message: string
}

export interface FinishOrderRequest {
    order_id: string
}

export interface GetTotalOrderByIdResponse {
    produk_id: string;
    qty: number;
    message?: string;
}

export interface GetTimeProcessResponse {
    order_id: string;
    paid: string;
    acc_kasir: string;
    acc_dapur: string;
    ready: string;
    done: string;
    cancel: string;
}

export interface GetTimeProcessRequest {
    order_id: string;
}