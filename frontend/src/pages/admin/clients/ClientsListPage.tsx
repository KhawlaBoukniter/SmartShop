import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients, createClient, deleteClient } from '../../../features/clients/clientSlice';
import type { RootState, AppDispatch } from '../../../app/store';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import type { CreateClientRequest } from '../../../services/clientService';

const ClientsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items, loading, error, creating, createError, deletingId, deleteError } = useSelector((state: RootState) => state.clients);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { register, handleSubmit, reset, formState: { errors } } = useForm<CreateClientRequest>();

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    const onSubmit = (data: CreateClientRequest) => {
        dispatch(createClient(data)).then((action) => {
            if (createClient.fulfilled.match(action)) {
                setIsModalOpen(false);
                reset();
            }
        });
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Supprimer ce client ? Cette action est irréversible.")) {
            dispatch(deleteClient(id));
        }
    };

    if (loading && items.length === 0) return <div>Loading...</div>;
    if (error && items.length === 0) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>Clients Management</h2>
                <button onClick={() => setIsModalOpen(true)} style={{ padding: '8px 16px' }}>New Client</button>
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>Global Error: {error}</div>}
            {deleteError && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid red' }}>{deleteError}</div>}


            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', marginTop: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Username</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Email</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Tier</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {items.map((client) => (
                        <tr key={client.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{client.id}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{client.username}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{client.name}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{client.email}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <span style={{
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    backgroundColor: client.tier === 'GOLD' ? '#ffd700' :
                                        client.tier === 'SILVER' ? '#c0c0c0' :
                                            client.tier === 'PLATINUM' ? '#e5e4e2' : '#cd7f32',
                                    color: 'black'
                                }}>
                                    {client.tier}
                                </span>
                            </td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                <button
                                    onClick={() => navigate(`/admin/clients/${client.id}`)}
                                    style={{ marginRight: '5px', cursor: 'pointer' }}
                                >
                                    View
                                </button>
                                <button
                                    onClick={() => handleDelete(client.id)}
                                    disabled={deletingId === client.id}
                                    style={{ cursor: deletingId === client.id ? 'not-allowed' : 'pointer', color: 'red' }}
                                >
                                    {deletingId === client.id ? 'Deleting...' : 'Delete'}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                        <h3>Add New Client</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Username</label>
                                <input {...register('username', { required: true })} style={{ width: '100%', padding: '5px' }} />
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
                            <div style={{ marginBottom: '10px' }}>
                                <label>Password</label>
                                <input type="password" {...register('password', { required: true })} style={{ width: '100%', padding: '5px' }} />
                                {errors.password && <span style={{ color: 'red' }}>Required</span>}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" disabled={creating}>{creating ? 'Creating...' : 'Create'}</button>
                            </div>
                            {createError && <p style={{ color: 'red', marginTop: '10px' }}>{createError}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsListPage;
