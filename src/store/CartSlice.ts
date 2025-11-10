import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GetProductResponse } from "../interfaces/product";

export interface CartItem extends GetProductResponse {
  quantity: number;
  drinkType?: string;
  note?: string;
}

interface CartState {
    items: CartItem[];
    paymentMethod?: number;
    voucher?: number;
    voucherId?: string;
    voucherManual?: boolean;
}

const initialState: CartState = {
    items: [],
    paymentMethod: undefined,
    voucher: 0,
    voucherId: "",
    voucherManual: false,
}

const CartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, action: PayloadAction<GetProductResponse>) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if(item) {
                item.quantity += 1;
            } else {
                state.items.push({ ...action.payload, quantity: 1 });
            }
        },
        addToCartWithQty: (state, action: PayloadAction<{product: GetProductResponse, quantity: number}>) => {
            const { product, quantity } = action.payload;

            const item = state.items.find(i => i.id === product.id);
            if(item) {
                item.quantity += quantity;
            } else {
                state.items.push({ ...product, quantity });
            }
        },
        addToCartWithTypeNote: (state, action: PayloadAction<{
            productId: string, 
            drinkType?: string,
            note?: string
        }>) => {
            const { productId, drinkType, note } = action.payload;

            const item = state.items.find(i => i.id === productId);
            if(item) {
                item.drinkType = drinkType;
                item.note = note;
            }
        },
        setPaymentMethod: (state, action: PayloadAction<number>) => {
            state.paymentMethod = action.payload;
        },
        setVoucher(state, action: PayloadAction<number>) {
            state.voucher = action.payload;
            state.voucherManual = true;
        },
        setVoucherId(state, action: PayloadAction<string>) {
            state.voucherId = action.payload;
        },
        increaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload);
            if (item) item.quantity += 1;
        },
        decreaseQty: (state, action: PayloadAction<string>) => {
            const item = state.items.find(i => i.id === action.payload);
            if(item) {
                if(item.quantity > 1) {
                    item.quantity -= 1;
                } else {
                    state.items = state.items.filter(i => i.id !== action.payload);
                }
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(i => i.id !== action.payload);
        },
        removeAllCart: (state) => {
            state.items = [];
            state.paymentMethod = undefined;
            state.voucher = 0;
            state.voucherManual = false;
        },
        removeVoucher: (state) => {
            state.voucher = 0;
            state.voucherManual = false;
        }
    }
});

export const { addToCart, addToCartWithQty, addToCartWithTypeNote, setPaymentMethod, setVoucher, 
    setVoucherId, increaseQty, decreaseQty, removeFromCart, removeAllCart, removeVoucher } = CartSlice.actions;
export default CartSlice.reducer;