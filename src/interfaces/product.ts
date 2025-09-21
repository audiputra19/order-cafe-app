export interface ProductProps {
    id: number;
    title: string;
    category: number;
    img: string;
    price: number;
}

export interface GetProductResponse {
    id: string;
    nama: string;
    harga: number;
    kategori: number;
    deskripsi: string;
    image_title: string;
    image_path: string;
    created_at: string;
}