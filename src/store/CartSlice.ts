import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { GetProductResponse } from "../interfaces/product";

export interface CartItem extends GetProductResponse {
  quantity: number;
  type?: string;
  note?: string;
}

interface CartState {
    items: CartItem[]
}

const initialState: CartState = {
    items: []
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
            type?: string,
            note?: string
        }>) => {
            const { productId, type, note } = action.payload;

            const item = state.items.find(i => i.id === productId);
            if(item) {
                item.type = type;
                item.note = note;
            }
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
        }
    }
});

export const { addToCart, addToCartWithQty, addToCartWithTypeNote, increaseQty, decreaseQty, removeFromCart, removeAllCart } = CartSlice.actions;
export default CartSlice.reducer;