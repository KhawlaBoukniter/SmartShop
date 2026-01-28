import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import authService, { type LoginCredentials, type User } from '../../services/authService';

interface AuthState {
    user: User | null;
    role: 'ADMIN' | 'CLIENT' | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    role: null,
    isAuthenticated: false,
    loading: false,
    error: null,
};

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials: LoginCredentials, thunkAPI) => {
        try {
            return await authService.login(credentials);
        } catch (error: any) {
            return thunkAPI.rejectWithValue("Failed to login");
        }
    }
);

export const logoutUser = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        await authService.logout();
    } catch (error: any) {
        return thunkAPI.rejectWithValue("Failed to logout");
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        resetError: (state) => {
            state.error = null;
        },
        setUser: (state, action: PayloadAction<User>) => {
            state.user = action.payload;
            state.role = action.payload.role;
            state.isAuthenticated = true;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action: PayloadAction<User>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.user = action.payload;
                state.role = action.payload.role;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.user = null;
                state.role = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.role = null;
                state.isAuthenticated = false;
            });
    },
});

export const { resetError, setUser } = authSlice.actions;
export default authSlice.reducer;
