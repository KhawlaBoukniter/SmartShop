import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientDetails, clearSelectedClient } from '../../../features/clients/clientSlice';
import type { RootState, AppDispatch } from '../../../app/store';

const ClientDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { selectedClient, loading, error } = useSelector((state: RootState) => state.clients);

    useEffect(() => {
        if (id) {
            dispatch(fetchClientDetails(parseInt(id)));
        }
        return () => {
            dispatch(clearSelectedClient());
        };
    }, [dispatch, id]);

    if (loading) return <div>Loading details...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!selectedClient) return <div>Client not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <button onClick={() => navigate('/admin/clients')} style={{ marginBottom: '20px' }}>Back to List</button>

            <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
                <h2>Client Profile: {selectedClient.username}</h2>

                <div style={{ marginBottom: '20px' }}>
                    <h3>Personal Info</h3>
                    <p><strong>Name:</strong> {selectedClient.name}</p>
                    <p><strong>Email:</strong> {selectedClient.email}</p>
                    <p><strong>User ID:</strong> {selectedClient.id}</p>
                </div>

                <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f9f9f9', borderRadius: '5px' }}>
                    <h3>Loyalty & Stats</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        <div>
                            <strong>Tier Level:</strong>
                            <div style={{
                                marginTop: '5px',
                                fontWeight: 'bold',
                                color: selectedClient.tier === 'GOLD' ? '#d4af37' : '#333'
                            }}>
                                {selectedClient.tier}
                            </div>
                        </div>
                        <div>
                            <strong>Total Orders:</strong>
                            <div>{selectedClient.totalOrders}</div>
                        </div>
                        <div>
                            <strong>Total Spent:</strong>
                            <div>{selectedClient.totalSpent} €</div>
                        </div>
                    </div>
                </div>

                <div style={{ fontSize: '0.9em', color: '#666' }}>
                    <p>Member since: {selectedClient.firstOrderDate ? new Date(selectedClient.firstOrderDate).toLocaleDateString() : 'N/A'}</p>
                    <p>Last order: {selectedClient.lastOrderDate ? new Date(selectedClient.lastOrderDate).toLocaleDateString() : 'N/A'}</p>
                </div>
            </div>
        </div>
    );
};

export default ClientDetailsPage;
