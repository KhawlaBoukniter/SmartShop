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

    if (loading && items.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chargement des clients...</div>;
    if (error && items.length === 0) return <div style={{ padding: '20px', color: '#e53935' }}>Erreur: {error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>Gestion des Clients</h2>
                <button
                    onClick={() => setIsModalOpen(true)}
                    style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '10px 20px',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: '600',
                        boxShadow: '0 4px 6px rgba(0, 123, 255, 0.2)'
                    }}
                >
                    + Nouveau Client
                </button>
            </div>

            {error && <div style={{ color: '#e53935', marginBottom: '15px' }}>{error}</div>}
            {deleteError && <div style={{ color: '#e53935', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{deleteError}</div>}

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Client</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Email</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Niveau (Tier)</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Aucun client trouvé.</td>
                            </tr>
                        ) : (
                            items.map((client) => (
                                <tr key={client.id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                                    <td style={{ padding: '15px' }}>
                                        <div style={{ fontWeight: '500', color: '#333' }}>{client.name}</div>
                                        <div style={{ fontSize: '0.85rem', color: '#888' }}>@{client.username}</div>
                                    </td>
                                    <td style={{ padding: '15px', color: '#555' }}>{client.email}</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 10px',
                                            borderRadius: '20px',
                                            fontSize: '0.8rem',
                                            fontWeight: '600',
                                            backgroundColor: client.tier === 'GOLD' ? '#fff3cd' :
                                                client.tier === 'SILVER' ? '#e2e3e5' :
                                                    client.tier === 'PLATINUM' ? '#e0f7fa' : '#ffebee',
                                            color: client.tier === 'GOLD' ? '#856404' :
                                                client.tier === 'SILVER' ? '#383d41' :
                                                    client.tier === 'PLATINUM' ? '#006064' : '#721c24',
                                            border: `1px solid ${client.tier === 'GOLD' ? '#ffeeba' :
                                                    client.tier === 'SILVER' ? '#d6d8db' :
                                                        client.tier === 'PLATINUM' ? '#b2ebf2' : '#f5c6cb'
                                                }`
                                        }}>
                                            {client.tier}
                                        </span>
                                    </td>
                                    <td style={{ padding: '15px', textAlign: 'right' }}>
                                        <button
                                            onClick={() => navigate(`/admin/clients/${client.id}`)}
                                            style={{ marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#007bff', fontWeight: '500' }}
                                        >
                                            Voir
                                        </button>
                                        <button
                                            onClick={() => handleDelete(client.id)}
                                            disabled={deletingId === client.id}
                                            style={{ cursor: deletingId === client.id ? 'not-allowed' : 'pointer', background: 'none', border: 'none', color: deletingId === client.id ? '#999' : '#e53935', fontWeight: '500' }}
                                        >
                                            {deletingId === client.id ? '...' : 'Supprimer'}
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(2px)'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Nouveau Client</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Nom d'utilisateur</label>
                                <input {...register('username', { required: true })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                {errors.username && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Nom complet</label>
                                <input {...register('name', { required: true })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                {errors.name && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Email</label>
                                <input type="email" {...register('email', { required: true })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                {errors.email && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Mot de passe</label>
                                <input type="password" {...register('password', { required: true })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                {errors.password && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#333' }}>Annuler</button>
                                <button type="submit" disabled={creating} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{creating ? 'Création...' : 'Créer'}</button>
                            </div>
                            {createError && <p style={{ color: '#e53935', marginTop: '10px' }}>{createError}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientsListPage;
