import { createApi } from "@reduxjs/toolkit/query/react";
import { baseQuery } from "./baseQuery";
import type { GetCompanyProfileResponse } from "../interfaces/profile";

export const apiProfile = createApi({
    reducerPath: 'apiProfile',
    baseQuery,
    tagTypes: ["Profile"],
    endpoints: build => ({
        getCompanyProfile: build.query<GetCompanyProfileResponse, void>({
            query: () => ({
                url: "profile/get-company-profile",
                method: "GET"
            }),
            providesTags: ["Profile"]
        })
    })
})

export const { useGetCompanyProfileQuery } = apiProfile;