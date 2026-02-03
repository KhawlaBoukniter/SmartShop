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

    if (loading) return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chargement du profil...</div>;
    if (error) return <div style={{ padding: '20px', color: '#e53935' }}>Erreur: {error}</div>;
    if (!selectedClient) return <div style={{ padding: '20px', textAlign: 'center' }}>Client introuvable</div>;

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <div style={{ marginBottom: '20px' }}>
                <button
                    onClick={() => navigate('/admin/clients')}
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
            </div>

            <div style={{
                backgroundColor: 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                overflow: 'hidden'
            }}>
                <div style={{
                    padding: '30px',
                    borderBottom: '1px solid #f0f0f0',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'start'
                }}>
                    <div>
                        <h1 style={{ margin: '0 0 5px 0', fontSize: '1.8rem', color: '#333' }}>{selectedClient.name}</h1>
                        <p style={{ margin: 0, color: '#888' }}>@{selectedClient.username}</p>
                    </div>
                    <button
                        onClick={() => setIsEditModalOpen(true)}
                        style={{
                            padding: '8px 16px',
                            backgroundColor: '#f5f5f5',
                            border: '1px solid #ddd',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#333',
                            fontWeight: '500'
                        }}
                    >
                        Modifier
                    </button>
                </div>

                <div style={{ padding: '30px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px' }}>

                    <div>
                        <h3 style={{ marginTop: 0, color: '#555', borderBottom: '2px solid #f0f0f0', paddingBottom: '10px', display: 'inline-block' }}>Informations Personnelles</h3>
                        <div style={{ marginTop: '15px' }}>
                            <div style={{ marginBottom: '15px' }}>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '3px' }}>Email</span>
                                <span style={{ fontSize: '1.1rem', color: '#333' }}>{selectedClient.email}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '3px' }}>ID Client</span>
                                <span style={{ fontSize: '1.1rem', color: '#333' }}>#{selectedClient.id}</span>
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <span style={{ display: 'block', fontSize: '0.85rem', color: '#888', marginBottom: '3px' }}>Membre depuis</span>
                                <span style={{ fontSize: '1.1rem', color: '#333' }}>{selectedClient.firstOrderDate ? new Date(selectedClient.firstOrderDate).toLocaleDateString() : 'Non disponible'}</span>
                            </div>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#f9fafb', padding: '20px', borderRadius: '8px' }}>
                        <h3 style={{ marginTop: 0, color: '#555', marginBottom: '20px' }}>Statistiques</h3>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Niveau Fidélité</div>
                            <div style={{
                                fontWeight: 'bold',
                                fontSize: '1.2rem',
                                color: selectedClient.tier === 'GOLD' ? '#d4af37' :
                                    selectedClient.tier === 'PLATINUM' ? '#00bcd4' :
                                        selectedClient.tier === 'SILVER' ? '#757575' : '#795548',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px'
                            }}>
                                {selectedClient.tier === 'GOLD' && '🥇'}
                                {selectedClient.tier === 'SILVER' && '🥈'}
                                {selectedClient.tier === 'PLATINUM' && '💎'}
                                {(!selectedClient.tier || selectedClient.tier === 'BRONZE') && '🥉'}
                                {selectedClient.tier}
                            </div>
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Total Dépensé</div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#2e7d32' }}>{selectedClient.totalSpent} DH</div>
                        </div>

                        <div>
                            <div style={{ fontSize: '0.85rem', color: '#888', marginBottom: '5px' }}>Commandes</div>
                            <div style={{ fontWeight: 'bold', fontSize: '1.5rem', color: '#333' }}>{selectedClient.totalOrders}</div>
                        </div>
                    </div>
                </div>
            </div>

            {isEditModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(2px)'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>Modifier le profil</h3>
                        <form onSubmit={handleSubmit(onUpdateSubmit)}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Nom d'utilisateur</label>
                                <input {...register('username', { required: true })} disabled style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', color: '#888' }} />
                                {errors.username && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Nom complet</label>
                                <input {...register('name', { required: true })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                {errors.name && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Email</label>
                                <input type="email" {...register('email', { required: true })} style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd' }} />
                                {errors.email && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button type="button" onClick={() => setIsEditModalOpen(false)} style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#333' }}>Annuler</button>
                                <button type="submit" disabled={updating} style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>{updating ? 'Enregistrement...' : 'Enregistrer'}</button>
                            </div>
                            {updateError && <p style={{ color: '#e53935', marginTop: '10px', fontSize: '0.9rem' }}>Erreur: {updateError}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientDetailsPage;
