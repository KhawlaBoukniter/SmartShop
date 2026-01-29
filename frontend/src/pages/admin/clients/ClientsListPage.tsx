import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from '../../../features/clients/clientSlice';
import type { RootState, AppDispatch } from '../../../app/store';
import { useNavigate } from 'react-router-dom';

const ClientsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { items, loading, error } = useSelector((state: RootState) => state.clients);

    useEffect(() => {
        dispatch(fetchClients());
    }, [dispatch]);

    if (loading && items.length === 0) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Clients Management</h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
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
                                <button disabled>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ClientsListPage;
