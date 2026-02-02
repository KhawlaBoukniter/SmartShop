import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import productReducer from '../features/products/productSlice';
import clientReducer from '../features/clients/clientSlice';
import orderReducer from '../features/orders/orderSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        products: productReducer,
        clients: clientReducer,
        orders: orderReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
