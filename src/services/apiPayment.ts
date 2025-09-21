import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { CreatePaymentRequest, CreatePaymentResponse } from "../interfaces/payment";

export const apiPayment = createApi({
    reducerPath: 'apiPayment',
    baseQuery,
    endpoints: build => ({
        createPayment: build.mutation<CreatePaymentResponse, CreatePaymentRequest>({
            query: (body) => ({
                url: 'payment/create',
                method: 'POST',
                body
            })
        })
    })
})

export const { useCreatePaymentMutation } = apiPayment;