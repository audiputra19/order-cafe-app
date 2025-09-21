import { fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const baseQuery = fetchBaseQuery({
    baseUrl: 'http://localhost:3002/'
});

export const baseQueryAuth = fetchBaseQuery({
    baseUrl: "http://localhost:3002/auth",
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as any).auth.token;
        if (token) headers.set("authorization", `Bearer ${token}`);
        return headers;
    }
})