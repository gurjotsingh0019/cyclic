import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('order') ? {order: JSON.parse(localStorage.getItem('order'))} : {order: []};

const orderSlice = createSlice({
    name:'order',
    initialState,
    reducers:{
        saveShippingAddress:(state, action) => {
            state.shippingAddress = action?.payload;
            localStorage.setItem('order', JSON.stringify(state.shippingAddress));
        },
    }
});

export const {saveShippingAddress} = orderSlice.actions;
export default orderSlice.reducer;