import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import orderService, { type OrderDTO } from '../../services/orderService';

interface OrderState {
    items: OrderDTO[];
    selectedOrder: OrderDTO | null;
    loading: boolean;
    error: string | null;
}

const initialState: OrderState = {
    items: [],
    selectedOrder: null,
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

export const fetchOrder = createAsyncThunk(
    'orders/fetchOrder',
    async (id: number, thunkAPI) => {
        try {
            return await orderService.getOrder(id);
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Impossible de récupérer la commande.";
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
            })
            .addCase(fetchOrder.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.selectedOrder = null;
            })
            .addCase(fetchOrder.fulfilled, (state, action: PayloadAction<OrderDTO>) => {
                state.loading = false;
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrder.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default orderSlice.reducer;
