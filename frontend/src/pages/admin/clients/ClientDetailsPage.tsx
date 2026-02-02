import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchClientDetails, clearSelectedClient, updateClient } from '../../../features/clients/clientSlice';
import type { RootState, AppDispatch } from '../../../app/store';
import { useForm } from 'react-hook-form';
import type { CreateClientRequest } from '../../../services/clientService';

const ClientDetailsPage = () => {
    const { id } = useParams<{ id: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { selectedClient, loading, error, updating, updateError } = useSelector((state: RootState) => state.clients);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    const { register, handleSubmit, setValue, formState: { errors } } = useForm<CreateClientRequest>();

    useEffect(() => {
        if (id) {
            dispatch(fetchClientDetails(parseInt(id)));
        }
        return () => {
            dispatch(clearSelectedClient());
        };
    }, [dispatch, id]);

    useEffect(() => {
        if (selectedClient) {
            setValue('username', selectedClient.username);
            setValue('name', selectedClient.name);
            setValue('email', selectedClient.email);
        }
    }, [selectedClient, setValue]);

    const onUpdateSubmit = (data: CreateClientRequest) => {
        if (selectedClient) {
            dispatch(updateClient({ id: selectedClient.id, data })).then((action) => {
                if (updateClient.fulfilled.match(action)) {
                    setIsEditModalOpen(false);
                }
            });
        }
    };

    if (loading) return <div>Loading details...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
    if (!selectedClient) return <div>Client not found</div>;

    return (
        <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
                <button onClick={() => navigate('/admin/clients')}>Back to List</button>
                <button onClick={() => setIsEditModalOpen(true)}>Edit Client</button>
            </div>

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

            {isEditModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                        <h3>Edit Client</h3>
                        <form onSubmit={handleSubmit(onUpdateSubmit)}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Username</label>
                                <input {...register('username', { required: true })} disabled style={{ width: '100%', padding: '5px', backgroundColor: '#e9ecef', cursor: 'not-allowed' }} />
                                {errors.username && <span style={{ color: 'red' }}>Required</span>}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Name</label>
                                <input {...register('name', { required: true })} style={{ width: '100%', padding: '5px' }} />
                                {errors.name && <span style={{ color: 'red' }}>Required</span>}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Email</label>
                                <input type="email" {...register('email', { required: true })} style={{ width: '100%', padding: '5px' }} />
                                {errors.email && <span style={{ color: 'red' }}>Required</span>}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setIsEditModalOpen(false)}>Cancel</button>
                                <button type="submit" disabled={updating}>{updating ? 'Updating...' : 'Update'}</button>
                            </div>
                            {updateError && <p style={{ color: 'red', marginTop: '10px' }}>{updateError}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDetailsPage;
