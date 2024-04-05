import { ApiSlice } from "./ApiSlice";
import { BOOKED_HOUSES_USER, BOOKING_HOUSE, CURRENT_BOOKING, DELETE_BOOKING_USER, ORDERS_URL, PAYPAL_URL } from "../constants";

export const bookingSlice = ApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    createBooking: builder.mutation({
        query:(bookingData) => ({
            method:'POST',
            url: BOOKING_HOUSE,
            body: bookingData
        }),
    }),
    getCurrentBookingDetails: builder.query({
      query:(bookingId) => `${CURRENT_BOOKING}/${bookingId}`
    }),
   
    payOrder: builder.mutation({
      query:(id) => ({
        method:'PUT',
        url: `${ORDERS_URL}/${id}`,
    }),
    }),
    
    getPaypalClientId: builder.query({
      query: () => ({
        url: PAYPAL_URL,
      }),
    }),
    getAllBookingBySingleUser: builder.query({
      query: (id) => ({
        url: `${BOOKED_HOUSES_USER}/${id}`
      }),
    }),
    deleteSingleBookingUser: builder.mutation({
        query:(id) => ({
            method:'DELETE',
            url:`${DELETE_BOOKING_USER}/${id}`
        })
    })
  }),
  providesTags: ['Booking'],
});

export const { useCreateBookingMutation, useGetCurrentBookingDetailsQuery, usePayOrderMutation, useGetPaypalClientIdQuery, useGetAllBookingBySingleUserQuery, useDeleteSingleBookingUserMutation } = bookingSlice;