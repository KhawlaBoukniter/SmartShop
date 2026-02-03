import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchOrders } from '../../features/orders/orderSlice';
import type { RootState, AppDispatch } from '../../app/store';
import CreateOrderModal from './CreateOrderModal';

const OrdersListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items, loading, error } = useSelector((state: RootState) => state.orders);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    if (loading && items.length === 0) return <div>Loading...</div>;
    if (error && items.length === 0) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h2>Commandes</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '10px 20px', borderRadius: '5px', cursor: 'pointer' }}
                >
                    + Créer une commande
                </button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>Global Error: {error}</div>}

            {items.length === 0 ? (
                <p>Aucune commande trouvée.</p>
            ) : (
                <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#f2f2f2' }}>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Client ID</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Total (DH)</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Status</th>
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((order) => (
                            <tr key={order.id}>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.id}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.clientId}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(order.date).toLocaleDateString()} {new Date(order.date).toLocaleTimeString()}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.total}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>{order.status}</td>
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    <button onClick={() => navigate(`/admin/orders/${order.id}`)} style={{ cursor: 'pointer' }}>Voir</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default OrdersListPage;
