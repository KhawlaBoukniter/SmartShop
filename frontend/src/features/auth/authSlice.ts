import { createSlice, createAsyncThunk, type PayloadAction } from '@reduxjs/toolkit';
import authService, { type LoginCredentials, type Role, type User } from '../../services/authService';

interface AuthState {
    user: User | null;
    role: Role | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}

const saved = localStorage.getItem("auth");
const user = saved ? JSON.parse(saved) : null;

const initialState: AuthState = {
    user: user,
    role: user?.role ?? null,
    isAuthenticated: user !== null,
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
                localStorage.setItem("auth", JSON.stringify(action.payload));
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
                state.isAuthenticated = false;
                state.user = null;
                state.role = null;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                localStorage.removeItem("auth");
                state.user = null;
                state.role = null;
                state.isAuthenticated = false;
            });
    },
});

export const { resetError } = authSlice.actions;
export default authSlice.reducer;
