import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    keyword:'',
    price_lte:'',
    price_gte:'',
    category:[],
    constructionStatus:[],
    bhk:[],
    postedBy:[],
    page:1,
    toggleSearch:false,
    viewAt:'recent'
}
const basicDataSlice = createSlice({
    name:'basicDataSlice',
    initialState,
    reducers:{
        updateKeyword:(state, action) => {
            const city = action?.payload?.split(',')[0]?.trim();
            state.keyword = city;
        },
        updateMinPrice:(state, action) => {
            state.price_lte = action?.payload;
        },
        updateMaxPrice:(state, action) => {
            state.price_gte = action?.payload;
        },
        updateCategory:(state, action) => {
            state.category = action?.payload;
        },
        updatePage:(state, action) => {
            state.page = action?.payload;
        },
        updateToggleSearch:(state, action) => {
            state.toggleSearch = !state?.toggleSearch;
        },
        updateConstructionStatus:(state, action) => {
            state.constructionStatus = action?.payload;
        },
        updateBhk:(state, action) => {
            state.bhk = action?.payload;
        },
        updatePostedBy:(state, action) => {
            state.postedBy = action?.payload;
        },
        updateViewAt:(state, action) => {
            state.viewAt = action?.payload;
        }
    }
});

export const {updateCategory, updateKeyword, updateMaxPrice, updateMinPrice, updatePage, updateToggleSearch, updateBhk, updateConstructionStatus, updatePostedBy, updateViewAt} = basicDataSlice.actions;

export default basicDataSlice.reducer;