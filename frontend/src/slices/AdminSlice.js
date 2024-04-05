import { DELETE_BOOKING, GET_ALL_BOOKING, GET_ALL_USERS_ADMIN, PAYMENT_STATUS, SINGLE_USER } from "../constants";
import { ApiSlice } from "./ApiSlice";

export const adminSlice = ApiSlice.injectEndpoints({
    endpoints: (builder) => ({
        getAllUsers: builder.query({
            query: () => GET_ALL_USERS_ADMIN
        }),
        deleteSingleUser: builder.mutation({
            query: (userId) => ({
                method:'DELETE',
                url: `${SINGLE_USER}/${userId}`
            })
        }),
        updateUserRole: builder.mutation({
            query: (userData) => ({
                method:'PUT',
                url: `${SINGLE_USER}/${userData.id}`,
                body: {...userData}
            })
        }),
        getAllBooking: builder.query({
            query: () => GET_ALL_BOOKING
        }),
        deleteBooking: builder.mutation({
            query: (bookingId) => ({
                method:'DELETE',
                url:`${DELETE_BOOKING}/${bookingId}`
            })
        }),
        updatePaymentStatus: builder.mutation({
            query:(bookingId) => ({
                method:'PUT',
                url:`${PAYMENT_STATUS}/${bookingId}`,
                body: {
                    "status":"completed"
                }
            }),
        }),
        getSingleUserDetail: builder.query({
            query: (id) => `${SINGLE_USER}/${id}`
        })
    })
})

export const {useGetAllUsersQuery, useDeleteSingleUserMutation, useUpdateUserRoleMutation, useGetAllBookingQuery, useDeleteBookingMutation, useUpdatePaymentStatusMutation, useGetSingleUserDetailQuery} = adminSlice;