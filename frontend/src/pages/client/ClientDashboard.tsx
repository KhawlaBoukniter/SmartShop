import { useDispatch } from 'react-redux';
import { logoutUser } from '../../features/auth/authSlice';
import type { AppDispatch } from '../../app/store';

const ClientDashboard = () => {
    const dispatch = useDispatch<AppDispatch>();

    const handleLogout = () => {
        dispatch(logoutUser());
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Client Dashboard</h1>
            <p>Welcome, Client!</p>
            <button onClick={handleLogout} style={{ padding: '5px 10px', marginTop: '10px' }}>Logout</button>
        </div>
    );
};

export default ClientDashboard;
