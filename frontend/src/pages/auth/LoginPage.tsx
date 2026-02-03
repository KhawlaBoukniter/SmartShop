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
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            fontFamily: "'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '40px',
                borderRadius: '12px',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                width: '100%',
                maxWidth: '400px',
                textAlign: 'center'
            }}>
                <h1 style={{ marginBottom: '30px', color: '#333', fontSize: '2rem', fontWeight: 'bold' }}>SmartShop</h1>

                {error && (
                    <div style={{
                        backgroundColor: '#ffebee',
                        color: '#c62828',
                        padding: '10px',
                        borderRadius: '4px',
                        marginBottom: '20px',
                        fontSize: '0.9rem'
                    }}>
                        {error}
                    </div>
                )}

                <style>
                    {`
                        .input-field:focus {
                            border-color: #764ba2 !important;
                            box-shadow: 0 0 0 2px rgba(118, 75, 162, 0.2);
                        }
                        .submit-btn:hover {
                            background-color: #5a367e !important;
                        }
                    `}
                </style>
                <form onSubmit={handleSubmit(onSubmit)} style={{ textAlign: 'left' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label htmlFor="username" style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>Username</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Entrez votre nom d'utilisateur"
                            className="input-field"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                boxSizing: 'border-box'
                            }}
                            {...register('username', { required: 'Username is required' })}
                        />
                        {errors.username && <span style={{ color: '#e53935', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.username.message}</span>}
                    </div>

                    <div style={{ marginBottom: '25px' }}>
                        <label htmlFor="password" style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Entrez votre mot de passe"
                            className="input-field"
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                outline: 'none',
                                transition: 'border-color 0.2s, box-shadow 0.2s',
                                boxSizing: 'border-box'
                            }}
                            {...register('password', { required: 'Password is required' })}
                        />
                        {errors.password && <span style={{ color: '#e53935', fontSize: '0.85rem', marginTop: '5px', display: 'block' }}>{errors.password.message}</span>}
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="submit-btn"
                        style={{
                            width: '100%',
                            padding: '14px',
                            backgroundColor: '#764ba2',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            transition: 'background-color 0.2s'
                        }}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;
