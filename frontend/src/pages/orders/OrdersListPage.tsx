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

    if (loading && items.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chargement des commandes...</div>;
    if (error && items.length === 0) return <div style={{ padding: '20px', color: '#e53935' }}>Erreur: {error}</div>;

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return { bg: '#e8f5e9', color: '#2e7d32', label: 'Confirmée' };
            case 'CANCELED':
                return { bg: '#ffebee', color: '#c62828', label: 'Annulée' };
            case 'REJECTED':
                return { bg: '#ffebee', color: '#c62828', label: 'Rejetée' };
            case 'PENDING':
                return { bg: '#fff3cd', color: '#856404', label: 'En attente' };
            default:
                return { bg: '#f5f5f5', color: '#666', label: status };
        }
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>Commandes</h2>
                <button
                    onClick={() => setIsCreateModalOpen(true)}
                    style={{
                        backgroundColor: '#28a745',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px rgba(40, 167, 69, 0.2)'
                    }}
                >
                    + Créer une commande
                </button>
            </div>

            {error && <div style={{ color: '#e53935', marginBottom: '15px' }}>Erreur globale: {error}</div>}

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Réf.</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Date</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Client (ID)</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Total</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Statut</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Aucune commande trouvée.</td>
                            </tr>
                        ) : (
                            items.map((order) => {
                                const statusStyle = getStatusStyle(order.status);
                                return (
                                    <tr key={order.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                        <td style={{ padding: '15px', fontWeight: '500', color: '#333' }}>#{order.id}</td>
                                        <td style={{ padding: '15px', color: '#666' }}>
                                            {new Date(order.date).toLocaleDateString()}
                                            <div style={{ fontSize: '0.8rem', color: '#999' }}>{new Date(order.date).toLocaleTimeString()}</div>
                                        </td>
                                        <td style={{ padding: '15px', color: '#555' }}>Client #{order.clientId}</td>
                                        <td style={{ padding: '15px', fontWeight: 'bold', color: '#2e7d32' }}>{order.total} DH</td>
                                        <td style={{ padding: '15px' }}>
                                            <span style={{
                                                padding: '5px 10px',
                                                borderRadius: '20px',
                                                backgroundColor: statusStyle.bg,
                                                color: statusStyle.color,
                                                fontSize: '0.85rem',
                                                fontWeight: '600'
                                            }}>
                                                {statusStyle.label}
                                            </span>
                                        </td>
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                style={{
                                                    background: 'none',
                                                    border: '1px solid #ddd',
                                                    padding: '5px 12px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer',
                                                    color: '#555',
                                                    fontSize: '0.9rem',
                                                    fontWeight: '500'
                                                }}
                                            >
                                                Voir détails
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })
                        )}
                    </tbody>
                </table>
            </div>

            <CreateOrderModal
                isOpen={isCreateModalOpen}
                onClose={() => setIsCreateModalOpen(false)}
            />
        </div>
    );
};

export default OrdersListPage;
