import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from './baseQuery'
import type { GetProductResponse } from "../interfaces/product";

export const apiProduct = createApi({
    reducerPath: 'apiProduct',
    baseQuery,
    tagTypes: ["Product"],
    endpoints: build => ({
        getProduct: build.query<GetProductResponse[], void>({
            query:() => ({
                url: 'get-product',
                method: 'GET'
            }),
            providesTags: ["Product"]
        })
    })
})

export const { useGetProductQuery } = apiProduct;