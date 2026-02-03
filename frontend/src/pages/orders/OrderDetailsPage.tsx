import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrder, updateOrderStatus } from '../../features/orders/orderSlice';
import type { RootState, AppDispatch } from '../../app/store';

const OrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedOrder, loading, error, updating, updateError } = useSelector((state: RootState) => state.orders);

    const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');

    useEffect(() => {
        if (id) {
            dispatch(fetchOrder(Number(id)));
        }
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedOrder) {
            setSelectedStatus(selectedOrder.status);
        }
    }, [selectedOrder]);

    const handleUpdateStatus = () => {
        if (selectedOrder && selectedStatus) {
            dispatch(updateOrderStatus({ id: selectedOrder.id, status: selectedStatus })).then((action) => {
                if (updateOrderStatus.fulfilled.match(action)) {
                    setIsStatusModalOpen(false);
                }
            });
        }
    };

    if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chargement de la commande...</div>;
    if (error) return (
        <div style={{ padding: '20px', textAlign: 'center' }}>
            <div style={{ color: '#e53935', marginBottom: '20px' }}>Erreur: {error}</div>
            <button onClick={() => navigate('/admin/orders')} style={{ color: '#007bff', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>Retour à la liste</button>
        </div>
    );
    if (!selectedOrder) return <div style={{ padding: '20px', textAlign: 'center' }}>Commande introuvable</div>;

    const availableStatuses = ['CONFIRMED', 'CANCELED', 'REJECTED'];

    const getStatusStyle = (status: string) => {
        switch (status) {
            case 'CONFIRMED':
                return { bg: '#e8f5e9', color: '#2e7d32', label: '✓ Confirmée' };
            case 'CANCELED':
                return { bg: '#ffebee', color: '#c62828', label: '✕ Annulée' };
            case 'REJECTED':
                return { bg: '#ffebee', color: '#c62828', label: '🚫 Rejetée' };
            case 'PENDING':
                return { bg: '#fff3cd', color: '#856404', label: '⏳ En attente' };
            default:
                return { bg: '#f5f5f5', color: '#666', label: status };
        }
    };

    const statusStyle = getStatusStyle(selectedOrder.status);

    return (
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button
                    onClick={() => navigate('/admin/orders')}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: '#666',
                        cursor: 'pointer',
                        fontSize: '0.9rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px'
                    }}
                >
                    ← Retour à la liste
                </button>
                <div style={{ display: 'flex', gap: '15px' }}>
                    <button
                        onClick={() => setIsStatusModalOpen(true)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#007bff',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}
                    >
                        Changer le Statut
                    </button>
                </div>
            </div>

            <div style={{ display: 'flex', gap: '20px', alignItems: 'center', marginBottom: '30px' }}>
                <h1 style={{ margin: 0, fontSize: '2rem', color: '#333' }}>Commande #{selectedOrder.id}</h1>
                <span style={{
                    padding: '6px 14px',
                    borderRadius: '20px',
                    backgroundColor: statusStyle.bg,
                    color: statusStyle.color,
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px'
                }}>
                    {statusStyle.label}
                </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Informations</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Date de commande</div>
                            <div style={{ fontWeight: '500', color: '#333' }}>
                                {new Date(selectedOrder.date).toLocaleDateString()}
                            </div>
                            <div style={{ fontSize: '0.85rem', color: '#666' }}>
                                {new Date(selectedOrder.date).toLocaleTimeString()}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Client</div>
                            <div style={{ fontWeight: '500', color: '#333' }}>ID #{selectedOrder.clientId}</div>
                            {/* Ideally fetch client name here if available in store or expand DTO */}
                        </div>
                    </div>
                </div>

                <div style={{ backgroundColor: 'white', padding: '25px', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                    <h3 style={{ marginTop: 0, color: '#555', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '20px' }}>Résumé Financier</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                            <span>Sous-total</span>
                            <span>{selectedOrder.subTotal} DH</span>
                        </div>
                        {selectedOrder.remise > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#2e7d32' }}>
                                <span>Remise {selectedOrder.promoCode ? `(${selectedOrder.promoCode})` : ''}</span>
                                <span>-{selectedOrder.remise} DH</span>
                            </div>
                        )}
                        <div style={{ display: 'flex', justifyContent: 'space-between', color: '#666' }}>
                            <span>TVA</span>
                            <span>{selectedOrder.tva} DH</span>
                        </div>
                        <div style={{ borderTop: '1px solid #eee', paddingTop: '10px', marginTop: '5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>Total TTC</span>
                            <span style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#764ba2' }}>{selectedOrder.total} DH</span>
                        </div>
                        {selectedOrder.montantRestant > 0 && (
                            <div style={{ display: 'flex', justifyContent: 'space-between', color: '#c62828', fontSize: '0.9rem', marginTop: '5px' }}>
                                <span>Reste à payer</span>
                                <span>{selectedOrder.montantRestant} DH</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden', marginBottom: '30px' }}>
                <h3 style={{ padding: '20px 25px', margin: 0, backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', color: '#555' }}>Articles ({selectedOrder.items.length})</h3>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
                            <th style={{ padding: '15px 25px', textAlign: 'left', color: '#888', fontWeight: '500' }}>Produit</th>
                            <th style={{ padding: '15px 25px', textAlign: 'right', color: '#888', fontWeight: '500' }}>Prix Unitaire</th>
                            <th style={{ padding: '15px 25px', textAlign: 'center', color: '#888', fontWeight: '500' }}>Quantité</th>
                            <th style={{ padding: '15px 25px', textAlign: 'right', color: '#888', fontWeight: '500' }}>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        {selectedOrder.items.map((item, index) => (
                            <tr key={index} style={{ borderBottom: index < selectedOrder.items.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                                <td style={{ padding: '15px 25px', fontWeight: '500', color: '#333' }}>Produit #{item.productId}</td>
                                <td style={{ padding: '15px 25px', textAlign: 'right', color: '#666' }}>{item.unitPrice} DH</td>
                                <td style={{ padding: '15px 25px', textAlign: 'center', color: '#333' }}>x{item.quantity}</td>
                                <td style={{ padding: '15px 25px', textAlign: 'right', fontWeight: '600', color: '#333' }}>{item.total} DH</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                    <h3 style={{ padding: '20px 25px', margin: 0, backgroundColor: '#f8f9fa', borderBottom: '1px solid #eee', color: '#555' }}>Historique des Paiements</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#fff', borderBottom: '1px solid #eee' }}>
                                <th style={{ padding: '15px 25px', textAlign: 'left', color: '#888', fontWeight: '500' }}>Date</th>
                                <th style={{ padding: '15px 25px', textAlign: 'left', color: '#888', fontWeight: '500' }}>Type</th>
                                <th style={{ padding: '15px 25px', textAlign: 'left', color: '#888', fontWeight: '500' }}>Référence</th>
                                <th style={{ padding: '15px 25px', textAlign: 'right', color: '#888', fontWeight: '500' }}>Montant</th>
                                <th style={{ padding: '15px 25px', textAlign: 'right', color: '#888', fontWeight: '500' }}>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.payments.map((payment, index) => (
                                <tr key={index} style={{ borderBottom: index < selectedOrder.payments.length - 1 ? '1px solid #f9f9f9' : 'none' }}>
                                    <td style={{ padding: '15px 25px', color: '#666' }}>{new Date(payment.datePayment).toLocaleString()}</td>
                                    <td style={{ padding: '15px 25px', color: '#333', fontWeight: '500' }}>{payment.paymentType}</td>
                                    <td style={{ padding: '15px 25px', color: '#666', fontFamily: 'monospace' }}>{payment.reference || '-'}</td>
                                    <td style={{ padding: '15px 25px', textAlign: 'right', fontWeight: '600', color: '#333' }}>{payment.amount} DH</td>
                                    <td style={{ padding: '15px 25px', textAlign: 'right' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '4px',
                                            backgroundColor: '#e3f2fd',
                                            color: '#1565c0',
                                            fontSize: '0.8rem',
                                            fontWeight: '600'
                                        }}>
                                            {payment.paymentStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isStatusModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(2px)'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '350px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Mettre à jour le statut</h3>

                        <div style={{ marginBottom: '25px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontSize: '0.9rem' }}>Nouveau statut</label>
                            <select
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    borderRadius: '6px',
                                    border: '1px solid #ddd',
                                    fontSize: '1rem',
                                    backgroundColor: 'white'
                                }}
                            >
                                <option value="">Choisir...</option>
                                {availableStatuses.map(status => (
                                    <option key={status} value={status}>{status}</option>
                                ))}
                            </select>
                        </div>

                        {updateError && <div style={{ color: '#e53935', marginBottom: '15px', fontSize: '0.9rem' }}>{updateError}</div>}

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                            <button
                                onClick={() => setIsStatusModalOpen(false)}
                                style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#333' }}
                            >
                                Annuler
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                disabled={updating || !selectedStatus}
                                style={{
                                    padding: '10px 20px',
                                    backgroundColor: '#007bff',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: '600',
                                    opacity: (updating || !selectedStatus) ? 0.7 : 1
                                }}
                            >
                                {updating ? '...' : 'Valider'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetailsPage;
