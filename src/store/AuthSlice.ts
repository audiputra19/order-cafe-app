import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { AuthResponse } from "../interfaces/auth";
import { jwtDecode } from "jwt-decode";

interface Meja {
    meja: string;
}

const initialState: AuthResponse = {
    token: undefined,
    meja: undefined,
}

const AuthSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setToken: (state, action: PayloadAction<string | undefined>) => {
            state.token = action.payload;
            if(action.payload){
                state.meja = jwtDecode<Meja>(action.payload).meja;
            } else {
                state.meja = undefined;
            }
        },
        clearToken: (state) => {
            state.token = undefined;
        }
    }
});

export const { setToken, clearToken } = AuthSlice.actions;
export default AuthSlice.reducer;