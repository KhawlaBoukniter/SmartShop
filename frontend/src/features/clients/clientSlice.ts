import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import clientService, { type ClientDTO } from '../../services/clientService';

interface ClientState {
    items: ClientDTO[];
    selectedClient: ClientDTO | null;
    loading: boolean;
    error: string | null;
}

const initialState: ClientState = {
    items: [],
    selectedClient: null,
    loading: false,
    error: null,
};

export const fetchClients = createAsyncThunk(
    'clients/fetchClients',
    async (_, thunkAPI) => {
        try {
            return await clientService.getAllClients();
        } catch (error: any) {
            return thunkAPI.rejectWithValue("Failed to fetch clients");
        }
    }
);

export const fetchClientDetails = createAsyncThunk(
    'clients/fetchClientDetails',
    async (id: number, thunkAPI) => {
        try {
            return await clientService.getClientById(id);
        } catch (error: any) {
            return thunkAPI.rejectWithValue("Failed to fetch client details");
        }
    }
);

export const deleteClient = createAsyncThunk(
    'clients/deleteClient',
    async (id: number, thunkAPI) => {
        try {
            await clientService.deleteClient(id);
            return id;
        } catch (error: any) {
            return thunkAPI.rejectWithValue("Failed to delete client");
        }
    }
);

const clientSlice = createSlice({
    name: 'clients',
    initialState,
    reducers: {
        clearSelectedClient: (state) => {
            state.selectedClient = null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchClients.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClients.fulfilled, (state, action: PayloadAction<ClientDTO[]>) => {
                state.loading = false;
                state.items = action.payload;
            })
            .addCase(fetchClients.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchClientDetails.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchClientDetails.fulfilled, (state, action: PayloadAction<ClientDTO>) => {
                state.loading = false;
                state.selectedClient = action.payload;
            })
            .addCase(fetchClientDetails.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteClient.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
            });
    },
});

export const { clearSelectedClient } = clientSlice.actions;
export default clientSlice.reducer;
