import { createSlice } from "@reduxjs/toolkit";

const initialState = localStorage.getItem('cart') ? {cartItems: JSON.parse(localStorage.getItem('cart'))} : {cartItems: []};

const cartSlice = createSlice({
    name:'cart',
    initialState,
    reducers:{
        addToCart:(state, action) => {
            const newItem = action.payload;
            const isItemPresent = state.cartItems.find(item => item?._id === newItem?._id);
            if(!isItemPresent){
                state.cartItems.push({...newItem});
            }
            localStorage.setItem('cart', JSON.stringify(state.cartItems))
        },
        removeFromCart:(state, action) => {
            const itemToBeRemoved = action.payload;
            state.cartItems = state.cartItems.filter(item => item._id !== itemToBeRemoved);
            localStorage.setItem('cart', JSON.stringify(state.cartItems));
        },
        clearHousesFromCart:(state, action) => {
            console.log('Clear Cart Items');
        },
        getHousesToBeBooked:(state, action) => {
            localStorage.setItem('HousesToBeBooked', JSON.stringify(action.payload));
        }
    }
});

export const {addToCart, removeFromCart, getHousesToBeBooked} = cartSlice.actions;
export default cartSlice.reducer;