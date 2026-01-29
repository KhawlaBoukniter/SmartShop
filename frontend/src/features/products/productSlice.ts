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
}

const initialState: ProductState = {
    items: [],
    loading: false,
    error: null,
    page: 0,
    size: 10,
    totalPages: 0,
    searchName: '',
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
            });
    },
});

export const { setPage, setSearchName } = productSlice.actions;
export default productSlice.reducer;
