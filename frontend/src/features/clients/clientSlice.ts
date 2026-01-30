import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import clientService, { type ClientDTO, type CreateClientRequest } from '../../services/clientService';

interface ClientState {
    items: ClientDTO[];
    selectedClient: ClientDTO | null;
    loading: boolean;
    error: string | null;
    createError: string | null;
    creating: boolean;
    deletingId: number | null;
    deleteError: string | null;
}

const initialState: ClientState = {
    items: [],
    selectedClient: null,
    loading: false,
    error: null,
    createError: null,
    creating: false,
    deletingId: null,
    deleteError: null,
};

const formatErrorMessage = (raw: string) => {
    const msg = raw.toLowerCase();

    if (msg.includes("users_username_key") || msg.includes("username") && msg.includes("existe déjà")) {
        return "Ce nom d’utilisateur est déjà utilisé. Choisis-en un autre.";
    }

    if (msg.includes("duplicate") || msg.includes("clé dupliquée") || msg.includes("unique")) {
        return "Une valeur existe déjà. Vérifie les informations et réessaie.";
    }

    if (msg.includes("constraint") || msg.includes("foreign key")) {
        return "Impossible de supprimer ce client car il est lié à des commandes.";
    }

    return "Opération impossible. Vérifie les informations ou réessaie.";
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
            const status = error?.response?.status;
            const msg = error?.response?.data?.message || error?.response?.data || "Suppression impossible.";

            if (status === 401) return thunkAPI.rejectWithValue("Session expirée. Reconnecte-toi.");
            if (status === 403) return thunkAPI.rejectWithValue("Accès refusé.");

            return thunkAPI.rejectWithValue(formatErrorMessage(msg));
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
            return thunkAPI.rejectWithValue(formatErrorMessage(msg));
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
                state.creating = true;
                state.createError = null;
            })
            .addCase(createClient.fulfilled, (state, action) => {
                state.creating = false;
                state.createError = null;
                state.items.push(action.payload)
            })
            .addCase(createClient.rejected, (state, action) => {
                state.creating = false;
                state.createError = (action.payload as string) ?? "Failed to create client";
            })
            .addCase(deleteClient.pending, (state, action) => {
                state.deletingId = action.meta.arg;
                state.deleteError = null;
            })
            .addCase(deleteClient.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.deletingId = null;
                state.deleteError = null;
            })
            .addCase(deleteClient.rejected, (state, action) => {
                state.deletingId = null;
                state.deleteError = action.payload as string;
            });
    },
});

export const { clearSelectedClient } = clientSlice.actions;
export default clientSlice.reducer;
