import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import orderService, { type OrderDTO } from '../../services/orderService';

interface OrderState {
    items: OrderDTO[];
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    items: [],
    loading: false,
    error: null,
};

export const fetchOrders = createAsyncThunk(
    'orders/fetchOrders',
    async (_, thunkAPI) => {
        try {
            return await orderService.getAllOrders();
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Impossible de récupérer les commandes.";
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

const orderSlice = createSlice({
    name: 'orders',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchOrders.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOrders.fulfilled, (state, action: PayloadAction<OrderDTO[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchOrders.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default orderSlice.reducer;
