import { LOGIN_USER, LOGOUT_USER, MODIFY_EMAIL_NAME, MODIFY_PASSWORD, REGISTER_USER } from "../constants";
import { ApiSlice } from "./ApiSlice";

export const userSlice = ApiSlice.injectEndpoints({
    endpoints:(builder) => ({
        registerUser: builder.mutation({
            query: (data) => ({
                url:REGISTER_USER,
                method:'POST',
                body:data
            }),
        }),
        loginUser: builder.mutation({
            query: (data) => ({
                url:LOGIN_USER,
                method:'POST',
                body:data
            })
        }),
        logoutUser: builder.mutation({
            query: () => ({
                url: LOGOUT_USER,
                method:'POST'
            })
        }),
        modifyNameEmail: builder.mutation({
            query: (data) => ({
                url: MODIFY_EMAIL_NAME,
                method:'PUT',
                body:data
            })
        }),
        modifyPassword: builder.mutation({
            query: (data) => ({
                url: MODIFY_PASSWORD,
                method:'PUT',
                body:data
            })
        })
    })
});

export const { useRegisterUserMutation, useLoginUserMutation, useLogoutUserMutation, useModifyNameEmailMutation, useModifyPasswordMutation } = userSlice;

export default userSlice.reducer;