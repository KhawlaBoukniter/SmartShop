import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import clientService, { type ClientDTO, type CreateClientRequest } from '../../services/clientService';

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

export const createClient = createAsyncThunk(
    'clients/createClient',
    async (data: CreateClientRequest, thunkAPI) => {
        try {
            return await clientService.createClient(data);
        } catch (error: any) {
            const msg =
                error?.response?.data?.message ||
                error?.response?.data ||
                "Failed to create client";
            return thunkAPI.rejectWithValue(String(msg));
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
            .addCase(createClient.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createClient.fulfilled, (state, action: PayloadAction<ClientDTO>) => {
                state.loading = false;
                state.items.push(action.payload);
            })
            .addCase(createClient.rejected, (state, action) => {
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
