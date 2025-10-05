import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './baseQuery'
import type { FinishOrderRequest, FinishOrderResponse, GetOrderItemsRequest, GetOrderItemsResponse, GetOrderRequest, GetOrderResponse, GetTotalOrderByIdResponse } from "../interfaces/order";

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
        getOrderItems: builder.query<GetOrderItemsResponse[], GetOrderItemsRequest>({
            query: (body) => ({
                url: 'order/get-order-items',
                method: 'POST',
                body
            }),
            providesTags: ["Order"]
        }),
        getOrderById: builder.query<GetOrderResponse, GetOrderRequest>({
            query: (body) => ({
                url: 'order/get-orderbyid',
                method: 'POST',
                body
            }),
            providesTags: ["Order"]
        }),
        getTotalOrderById: builder.query<GetTotalOrderByIdResponse[], void>({
            query: () => ({
                url: 'order/get-total-orderbyid',
                method: 'GET'
            })
        })
    })
})

export const { useGetOrderQuery, useFinishOrderMutation, useGetOrderItemsQuery, useGetOrderByIdQuery,
     useGetTotalOrderByIdQuery
} = apiOrder;