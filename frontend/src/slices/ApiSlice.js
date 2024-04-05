import {createApi, fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import { BASE_URL } from "../constants";

const baseQuery = fetchBaseQuery({baseUrl: BASE_URL});

export const ApiSlice = createApi({
    baseQuery,
    tagTypes: ['House', 'Order', 'User', 'Booking'],
    endpoints: (builder) => ({}),
});