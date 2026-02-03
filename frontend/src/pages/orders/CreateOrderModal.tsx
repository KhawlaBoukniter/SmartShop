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
            zIndex: 1000
        }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
                <h2>Créer une Commande</h2>

                {formError && <div style={{ color: 'red', marginBottom: '10px' }}>{formError}</div>}
                {createError && <div style={{ color: 'red', marginBottom: '10px' }}>{createError}</div>}

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Client</label>
                        <select
                            value={clientId}
                            onChange={(e) => setClientId(Number(e.target.value))}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="">Sélectionner un client</option>
                            {clients.map(client => (
                                <option key={client.id} value={client.id}>
                                    {client.name} ({client.email})
                                </option>
                            ))}
                        </select>
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label style={{ display: 'block', marginBottom: '5px' }}>Code Promo (Optionnel)</label>
                        <input
                            type="text"
                            value={promoCode}
                            onChange={(e) => setPromoCode(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        />
                    </div>

                    <h3>Articles</h3>
                    {items.map((item, index) => (
                        <div key={index} style={{ display: 'flex', gap: '10px', marginBottom: '10px', alignItems: 'center' }}>
                            <div style={{ flex: 2 }}>
                                <select
                                    value={item.productId}
                                    onChange={(e) => handleItemChange(index, 'productId', Number(e.target.value))}
                                    style={{ width: '100%', padding: '8px' }}
                                >
                                    <option value={0}>Sélectionner un produit</option>
                                    {products.map(product => (
                                        <option key={product.id} value={product.id}>
                                            {product.name} ({product.price} DH)
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
                                    style={{ width: '100%', padding: '8px' }}
                                />
                            </div>
                            <button type="button" onClick={() => handleRemoveItem(index)} style={{ backgroundColor: '#ff4444', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px' }}>
                                X
                            </button>
                        </div>
                    ))}
                    <button type="button" onClick={handleAddItem} style={{ marginBottom: '20px', display: 'block' }}>
                        + Ajouter un produit
                    </button>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                        <button type="button" onClick={onClose}>Annuler</button>
                        <button type="submit" disabled={creating} style={{ backgroundColor: '#4CAF50', color: 'white', border: 'none', padding: '8px 16px', borderRadius: '4px' }}>
                            {creating ? 'Création...' : 'Créer Commande'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CreateOrderModal;
