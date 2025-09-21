import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './baseQuery'
import type { FinishOrderRequest, FinishOrderResponse, GetOrderItemsRequest, GetOrderItemsResponse, GetOrderRequest, GetOrderResponse } from "../interfaces/order";

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
        getOrderItems: builder.mutation<GetOrderItemsResponse[], GetOrderItemsRequest>({
            query: (body) => ({
                url: 'order/get-order-items',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        }),
        getOrderById: builder.mutation<GetOrderResponse, GetOrderRequest>({
            query: (body) => ({
                url: 'order/get-orderbyid',
                method: 'POST',
                body
            }),
            invalidatesTags: ["Order"]
        })
    })
})

export const { useGetOrderQuery, useFinishOrderMutation, useGetOrderItemsMutation, useGetOrderByIdMutation } = apiOrder;