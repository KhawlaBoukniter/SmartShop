import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { logoutUser } from '../../features/auth/authSlice';
import type { AppDispatch, RootState } from '../../app/store';

const Navbar = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { user, role } = useSelector((state: RootState) => state.auth);

    const handleLogout = () => {
        dispatch(logoutUser());
        navigate('/login');
    };

    return (
        <nav style={{
            backgroundColor: '#1a1a1a',
            color: 'white',
            padding: '1rem 2rem',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                <Link to={role === 'ADMIN' ? '/admin' : '/client'} style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'white', textDecoration: 'none' }}>
                    SmartShop
                </Link>

                <div style={{ display: 'flex', gap: '1.5rem' }}>
                    {role === 'ADMIN' && (
                        <>
                            <Link to="/admin" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Dashboard</Link>
                            <Link to="/products" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Produits</Link>
                            <Link to="/admin/clients" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Clients</Link>
                            <Link to="/admin/orders" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Commandes</Link>
                        </>
                    )}
                    {role === 'CLIENT' && (
                        <>
                            <Link to="/client" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Mon Dashboard</Link>
                            <Link to="/products" style={{ color: '#e0e0e0', textDecoration: 'none' }}>Nos Produits</Link>
                        </>
                    )}
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                {user && (
                    <span style={{ fontSize: '0.9rem', color: '#888' }}>
                        {user.name} ({role})
                    </span>
                )}
                <button
                    onClick={handleLogout}
                    style={{
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        padding: '0.5rem 1rem',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '0.9rem'
                    }}
                >
                    Se déconnecter
                </button>
            </div>
        </nav>
    );
};

export default Navbar;
