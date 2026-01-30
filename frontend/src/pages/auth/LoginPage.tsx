import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { loginUser, resetError } from '../../features/auth/authSlice';
import type { RootState, AppDispatch } from '../../app/store';
import type { LoginCredentials } from '../../services/authService';
import { useEffect } from 'react';

const LoginPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { isAuthenticated, role, loading, error } = useSelector((state: RootState) => state.auth);

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginCredentials>();

    useEffect(() => {
        dispatch(resetError());
    }, [dispatch]);

    const onSubmit = (data: LoginCredentials) => {
        dispatch(loginUser(data));
    };

    if (isAuthenticated) {
        if (role === 'ADMIN') return <Navigate to="/admin" replace />;
        if (role === 'CLIENT') return <Navigate to="/client" replace />;
        return null;
    }

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Login</h2>
            {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

            <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        {...register('username', {
                            required: 'Username is required',
                        })}
                    />
                    {errors.username && <span style={{ color: 'red', fontSize: '12px' }}>{errors.username.message}</span>}
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        style={{ width: '100%', padding: '8px', marginTop: '5px' }}
                        {...register('password', { required: 'Password is required' })}
                    />
                    {errors.password && <span style={{ color: 'red', fontSize: '12px' }}>{errors.password.message}</span>}
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
                    {loading ? 'Logging in...' : 'Login'}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;
