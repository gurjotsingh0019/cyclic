import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    userInfo: localStorage.getItem('userInfo')
      ? JSON.parse(localStorage.getItem('userInfo'))
      : null,
  };
const AuthenticationSlice = createSlice({
    name:'AuthenticationSlice',
    initialState,
    reducers:{
        logout:(state, action) => {
            state.userInfo = null;
            localStorage.removeItem('userInfo');
        },
        setUserInfo:(state, action) => {
            state.userInfo = action.payload.user;
            localStorage.setItem('userInfo', JSON.stringify(action.payload.user));
        }
    },
});

export const { logout, setUserInfo} = AuthenticationSlice.actions;

export default AuthenticationSlice.reducer;