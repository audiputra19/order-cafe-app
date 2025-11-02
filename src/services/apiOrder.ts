import { createApi } from "@reduxjs/toolkit/query/react";
import type { FinishOrderRequest, FinishOrderResponse, GetOrderItemsResponse, GetOrderResponse, GetTimeProcessResponse, GetTotalOrderByIdResponse } from "../interfaces/order";
import { baseQuery } from './baseQuery';

export const apiOrder = createApi({
    reducerPath: 'apiOrder',
    baseQuery,
    tagTypes: ["Order"],
    endpoints: builder => ({
        getOrder: builder.query<GetOrderResponse[], string>({
            query: (meja) => ({
                url: `order/get-order/${meja}`,
                method: 'GET',
            }),
            providesTags: ["Order"]
        }),
        finishOrder: builder.mutation<FinishOrderResponse, FinishOrderRequest>({
            query: (body) => ({
                url: 'order/finish',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        getOrderItems: builder.query<GetOrderItemsResponse[], string>({
            query: (order_id) => ({
                url: 'order/get-order-items',
                method: 'POST',
                body: { order_id }
            }),
            providesTags: ["Order"]
        }),
        getOrderById: builder.query<GetOrderResponse, string>({
            query: (order_id) => ({
                url: 'order/get-orderbyid',
                method: 'POST',
                body: { order_id }
            }),
            providesTags: ["Order"]
        }),
        getTotalOrderById: builder.query<GetTotalOrderByIdResponse[], void>({
            query: () => ({
                url: 'order/get-total-orderbyid',
                method: 'GET'
            })
        }),
        getTimeProcessById: builder.query<GetTimeProcessResponse, string>({
            query: (order_id) => ({
                url: 'order/get-time-process',
                method: 'POST',
                body: { order_id }
            }),
            providesTags: ["Order"]
        }),
    })
})

export const { useGetOrderQuery, useFinishOrderMutation, useGetOrderItemsQuery, useGetOrderByIdQuery,
     useGetTotalOrderByIdQuery,useGetTimeProcessByIdQuery
} = apiOrder;