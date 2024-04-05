import { configureStore} from "@reduxjs/toolkit";
import { ApiSlice } from "./slices/ApiSlice";
import basicDataSlice from "./slices/basicDataSlice";
import AuthenticationSlice from "./slices/AuthenticationSlice";
import CartSlice from "./slices/CartSlice";
import OrderSlice from "./slices/OrderSlice";

const store = configureStore({
    reducer:{
        [ApiSlice.reducerPath]: ApiSlice.reducer,
        basicData: basicDataSlice,
        authSlice: AuthenticationSlice,
        cartSlice: CartSlice,
        orderSlice: OrderSlice
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(ApiSlice.middleware),
});

export default store;