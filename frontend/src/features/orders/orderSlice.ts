import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import orderService, { type OrderDTO, type CreateOrderDTO } from '../../services/orderService';

interface OrderState {
    items: OrderDTO[];
    selectedOrder: OrderDTO | null;
    loading: boolean;
    error: string | null;
    updating: boolean;
    updateError: string | null;
    creating: boolean;
    createError: string | null;
}

const initialState: OrderState = {
    items: [],
    selectedOrder: null,
    loading: false,
    error: null,
    updating: false,
    updateError: null,
    creating: false,
    createError: null,
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

export const updateOrderStatus = createAsyncThunk(
    'orders/updateStatus',
    async ({ id, status }: { id: number; status: string }, thunkAPI) => {
        try {
            switch (status) {
                case 'CONFIRMED':
                    await orderService.confirmOrder(id);
                    break;
                case 'CANCELED':
                    await orderService.cancelOrder(id);
                    break;
                case 'REJECTED':
                    await orderService.rejectOrder(id);
                    break;
                default:
                    throw new Error("Statut non supporté via cette action.");
            }
            return status;
        } catch (error: any) {
            const msg = error?.response?.data?.message || error.message || "Impossible de mettre à jour le statut.";
            return thunkAPI.rejectWithValue(msg);
        }
    }
);

export const createOrder = createAsyncThunk(
    'orders/createOrder',
    async (data: CreateOrderDTO, thunkAPI) => {
        try {
            return await orderService.createOrder(data);
        } catch (error: any) {
            const msg = error?.response?.data?.message || "Impossible de créer la commande.";
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
            })
            .addCase(updateOrderStatus.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateOrderStatus.fulfilled, (state, action) => {
                state.updating = false;
                if (state.selectedOrder) {
                    state.selectedOrder.status = action.payload;
                }
            })
            .addCase(updateOrderStatus.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload as string;
            })
            .addCase(createOrder.pending, (state) => {
                state.creating = true;
                state.createError = null;
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.creating = false;
                state.items.push(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.creating = false;
                state.createError = action.payload as string;
            });
    },
});

export default orderSlice.reducer;
