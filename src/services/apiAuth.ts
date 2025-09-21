import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQueryAuth } from './baseQuery'
import type { AuthRequest, AuthResponse } from "../interfaces/auth";

export const apiAuth = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryAuth,
    endpoints: build => ({
        scan: build.mutation<AuthResponse, AuthRequest>({
            query: (body) => ({
                url: '/scan',
                method: 'POST',
                body
            })
        }),
        check: build.query<AuthResponse, void>({
            query: () => ({
                url: '/protected',
                method: 'GET'
            })
        })
    })
})

export const { useScanMutation, useCheckQuery } = apiAuth;