import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOrder } from '../../features/orders/orderSlice';
import type { RootState, AppDispatch } from '../../app/store';

const OrderDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { selectedOrder, loading, error } = useSelector((state: RootState) => state.orders);

    useEffect(() => {
        if (id) {
            dispatch(fetchOrder(Number(id)));
        }
    }, [dispatch, id]);

    if (loading) return <div>Chargement de la commande...</div>;
    if (error) return (
        <div style={{ padding: '20px' }}>
            <div style={{ color: 'red', marginBottom: '20px' }}>Erreur: {error}</div>
            <button onClick={() => navigate('/admin/orders')}>Retour à la liste</button>
        </div>
    );
    if (!selectedOrder) return <div>Commande introuvable</div>;

    return (
        <div style={{ padding: '20px' }}>
            <button onClick={() => navigate('/admin/orders')} style={{ marginBottom: '20px' }}>Retour</button>

            <h2>Détail Commande #{selectedOrder.id}</h2>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                    <h3>Informations Générales</h3>
                    <p><strong>Date:</strong> {new Date(selectedOrder.date).toLocaleString()}</p>
                    <p><strong>Statut:</strong> {selectedOrder.status}</p>
                    <p><strong>Client ID:</strong> {selectedOrder.clientId}</p>
                </div>

                <div style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '5px' }}>
                    <h3>Paiement & Totaux</h3>
                    <p><strong>Sous-total:</strong> {selectedOrder.subTotal} DH</p>
                    {selectedOrder.promoCode && <p><strong>Code Promo:</strong> {selectedOrder.promoCode}</p>}
                    <p><strong>Remise:</strong> {selectedOrder.remise} DH</p>
                    <p><strong>TVA:</strong> {selectedOrder.tva} DH</p>
                    <p style={{ fontSize: '1.2em', fontWeight: 'bold' }}>Total TTC: {selectedOrder.total} DH</p>
                    <p><strong>Reste à payer:</strong> {selectedOrder.montantRestant} DH</p>
                </div>
            </div>

            <h3>Articles ({selectedOrder.items.length})</h3>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', marginBottom: '30px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Produit (ID)</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Quantité</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Prix Unitaire</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Total Ligne</th>
                    </tr>
                </thead>
                <tbody>
                    {selectedOrder.items.map((item, index) => (
                        <tr key={index}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.productId}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.quantity}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.unitPrice} DH</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{item.total} DH</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {selectedOrder.payments && selectedOrder.payments.length > 0 && (
                <>
                    <h3>Paiements ({selectedOrder.payments.length})</h3>
                    <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                        <thead>
                            <tr style={{ backgroundColor: '#f2f2f2' }}>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Type</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Référence</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Date</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Montant</th>
                                <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Statut</th>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedOrder.payments.map((payment, index) => (
                                <tr key={index}>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{payment.id}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{payment.paymentType}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{payment.reference || '-'}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{new Date(payment.datePayment).toLocaleString()}</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{payment.amount} DH</td>
                                    <td style={{ padding: '8px', border: '1px solid #ddd' }}>{payment.paymentStatus}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </>
            )}
        </div>
    );
};

export default OrderDetailsPage;
