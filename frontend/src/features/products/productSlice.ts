import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import productService, { type ProductDTO, type Page } from '../../services/productService';

interface ProductState {
    items: ProductDTO[];
    loading: boolean;
    error: string | null;
    page: number;
    size: number;
    totalPages: number;
    searchName: string;
    deletingId: number | null;
    deleteError: string | null;
    updating: boolean;
    updateError: string | null;
}

const initialState: ProductState = {
    items: [],
    loading: false,
    error: null,
    page: 0,
    size: 10,
    totalPages: 0,
    searchName: '',
    deletingId: null,
    deleteError: null,
    updating: false,
    updateError: null,
};

const formatErrorMessage = (raw: string) => {
    const msg = raw.toLowerCase();
    if (msg.includes("constraint") || msg.includes("foreign key")) {
        return "Impossible de supprimer ce produit car il est lié à des commandes.";
    }
    return "Opération impossible. Vérifie les informations.";
};

export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (
        { name, page, size }: { name: string; page: number; size: number },
        thunkAPI
    ) => {
        try {
            return await productService.getAllProducts(name, page, size);
        } catch (error: any) {
            return thunkAPI.rejectWithValue("Failed to fetch products");
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id: number, thunkAPI) => {
        try {
            await productService.deleteProduct(id);
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

export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, data }: { id: number; data: ProductDTO }, thunkAPI) => {
        try {
            return await productService.updateProduct(id, data);
        } catch (error: any) {
            const msg = error?.response?.data?.message || error?.response?.data || "Update failed";
            return thunkAPI.rejectWithValue(formatErrorMessage(msg));
        }
    }
);

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setPage: (state, action: PayloadAction<number>) => {
            state.page = action.payload;
        },
        setSearchName: (state, action: PayloadAction<string>) => {
            state.searchName = action.payload;
            state.page = 0;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Page<ProductDTO>>) => {
                state.loading = false;
                state.items = action.payload.content;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(deleteProduct.pending, (state, action) => {
                state.deletingId = action.meta.arg;
                state.deleteError = null;
            })
            .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
                state.items = state.items.filter(item => item.id !== action.payload);
                state.deletingId = null;
                state.deleteError = null;
            })
            .addCase(deleteProduct.rejected, (state, action) => {
                state.deletingId = null;
                state.deleteError = action.payload as string;
            })
            .addCase(updateProduct.pending, (state) => {
                state.updating = true;
                state.updateError = null;
            })
            .addCase(updateProduct.fulfilled, (state, action) => {
                state.updating = false;
                state.updateError = null;
                const index = state.items.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.items[index] = action.payload;
                }
            })
            .addCase(updateProduct.rejected, (state, action) => {
                state.updating = false;
                state.updateError = action.payload as string;
            });
    },
});

export const { setPage, setSearchName } = productSlice.actions;
export default productSlice.reducer;
