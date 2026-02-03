import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClients } from '../../features/clients/clientSlice';
import { fetchProducts } from '../../features/products/productSlice';
import { createOrder } from '../../features/orders/orderSlice';
import type { AppDispatch, RootState } from '../../app/store';

interface CreateOrderModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ItemRow {
    productId: number;
    quantity: number;
}

const CreateOrderModal = ({ isOpen, onClose }: CreateOrderModalProps) => {
    const dispatch = useDispatch<AppDispatch>();

    const clients = useSelector((state: RootState) => state.clients.items);
    const products = useSelector((state: RootState) => state.products.items);
    const { creating, createError } = useSelector((state: RootState) => state.orders);

    const [clientId, setClientId] = useState<number | ''>('');
    const [promoCode, setPromoCode] = useState('');
    const [items, setItems] = useState<ItemRow[]>([{ productId: 0, quantity: 1 }]);
    const [formError, setFormError] = useState<string | null>(null);

    useEffect(() => {
        if (isOpen) {
            if (clients.length === 0) dispatch(fetchClients());
            dispatch(fetchProducts({ name: '', page: 0, size: 100 }));
        }
    }, [isOpen, dispatch, clients.length]);

    useEffect(() => {
        if (!isOpen) {
            setClientId('');
            setPromoCode('');
            setItems([{ productId: 0, quantity: 1 }]);
            setFormError(null);
        }
    }, [isOpen]);

    const handleAddItem = () => {
        setItems([...items, { productId: 0, quantity: 1 }]);
    };

    const handleRemoveItem = (index: number) => {
        const newItems = items.filter((_, i) => i !== index);
        setItems(newItems);
    };

    const handleItemChange = (index: number, field: keyof ItemRow, value: number) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        setItems(newItems);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormError(null);

        if (!clientId) {
            setFormError("Veuillez sélectionner un client.");
            return;
        }

        if (items.length === 0) {
            setFormError("La commande doit contenir au moins un article.");
            return;
        }

        for (const item of items) {
            if (!item.productId) {
                setFormError("Veuillez sélectionner un produit pour chaque ligne.");
                return;
            }
            if (item.quantity < 1) {
                setFormError("La quantité doit être au moins 1.");
                return;
            }
        }

        const payload = {
            clientId: Number(clientId),
            items: items.map(i => ({ productId: Number(i.productId), quantity: Number(i.quantity) })),
            promoCode: promoCode.trim() || null
        };

        const result = await dispatch(createOrder(payload));
        if (createOrder.fulfilled.match(result)) {
            onClose();
        }
    };

    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
            zIndex: 1000, backdropFilter: 'blur(2px)'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '30px',
                borderRadius: '12px',
                width: '650px',
                maxHeight: '90vh',
                overflowY: 'auto',
                boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
            }}>
                <h2 style={{ marginTop: 0, marginBottom: '20px', color: '#333' }}>Nouvelle Commande</h2>

                {formError && <div style={{ color: '#c62828', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{formError}</div>}
                {createError && <div style={{ color: '#c62828', marginBottom: '15px', padding: '10px', backgroundColor: '#ffebee', borderRadius: '4px' }}>{createError}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>Client</label>
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(Number(e.target.value))}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                backgroundColor: 'white'
                            }}
                        >
                            <option value="">Sélectionner un client...</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name} (ID: {client.id})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#555', fontWeight: '500' }}>Code Promo (Optionnel)</label>
                        <input
                            type="text"
                            placeholder="Ex: SOLDES2024"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                borderRadius: '8px',
                                border: '1px solid #ddd',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>

                    <div style={{ marginTop: '30px', marginBottom: '20px' }}>
                        <h3 style={{ fontSize: '1.2rem', color: '#333', borderBottom: '1px solid #eee', paddingBottom: '10px' }}>Articles</h3>

                        <div style={{ maxHeight: '250px', overflowY: 'auto', paddingRight: '5px' }}>
                            {items.map((item, index) => (
                                <div key={index} style={{ display: 'flex', gap: '15px', marginBottom: '15px', alignItems: 'center' }}>
                                    <div style={{ flex: 3 }}>
                                        <select
                                            value={item.productId}
                                            onChange={(e) => handleItemChange(index, 'productId', Number(e.target.value))}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #ddd',
                                                fontSize: '0.95rem'
                                            }}
                                        >
                                            <option value={0}>Sélectionner un produit...</option>
                                            {products.map(product => (
                                                <option key={product.id} value={product.id}>
                                                    {product.name} - {product.price} DH
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <input
                                            type="number"
                                            min="1"
                                            value={item.quantity}
                                            onChange={(e) => handleItemChange(index, 'quantity', Number(e.target.value))}
                                            style={{
                                                width: '100%',
                                                padding: '10px',
                                                borderRadius: '6px',
                                                border: '1px solid #ddd',
                                                textAlign: 'center',
                                                fontSize: '0.95rem',
                                                boxSizing: 'border-box'
                                            }}
                                        />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveItem(index)}
                                        style={{
                                            backgroundColor: '#ffebee',
                                            color: '#c62828',
                                            border: 'none',
                                            width: '36px',
                                            height: '36px',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            fontWeight: 'bold'
                                        }}
                                        title="Retirer la ligne"
                                    >
                                        ✕
                                    </button>
                                </div>
                            ))}
                        </div>

                        <button
                            type="button"
                            onClick={handleAddItem}
                            style={{
                                marginTop: '10px',
                                color: '#007bff',
                                background: 'none',
                                border: '1px dashed #007bff',
                                borderRadius: '6px',
                                padding: '10px',
                                width: '100%',
                                cursor: 'pointer',
                                fontWeight: '500'
                            }}
                        >
                            + Ajouter un autre article
                        </button>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '15px', marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '20px' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '12px 24px',
                                background: '#f5f5f5',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                color: '#333',
                                fontWeight: '500'
                            }}
                        >
                            Annuler
                        </button>
                        <button
                            type="submit"
                            disabled={creating}
                            style={{
                                padding: '12px 24px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: '600',
                                boxShadow: '0 4px 6px rgba(40, 167, 69, 0.2)',
                                opacity: creating ? 0.7 : 1
                            }}
                        >
                            {creating ? 'Création en cours...' : 'Valider la Commande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;
