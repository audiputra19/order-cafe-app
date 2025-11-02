import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { getVoucherResponse } from "../interfaces/voucher";

export const apiVoucher = createApi({
    reducerPath: 'apiVoucher',
    baseQuery,
    tagTypes: ["Voucher"],
    endpoints: build => ({
        getVoucher: build.query<getVoucherResponse[], void>({
            query: () => ({
                url: 'voucher/get-voucher',
                method: 'GET'
            }),
            providesTags: ["Voucher"]
        })
    })
})

export const { useGetVoucherQuery } = apiVoucher;