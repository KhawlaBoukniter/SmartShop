import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage, setSearchName, deleteProduct, updateProduct, createProduct } from '../../features/products/productSlice';
import type { RootState, AppDispatch } from '../../app/store';
import { useForm } from 'react-hook-form';
import type { ProductDTO } from '../../services/productService';

const ProductsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error, page, totalPages, searchName, size, deletingId, deleteError, updating, updateError, creating, createError } = useSelector((state: RootState) => state.products);
    const { role } = useSelector((state: RootState) => state.auth);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState<ProductDTO | null>(null);
    const { register, handleSubmit, setValue, reset, formState: { errors } } = useForm<ProductDTO>();

    useEffect(() => {
        dispatch(fetchProducts({ name: searchName, page, size }));
    }, [dispatch, searchName, page, size]);

    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(setSearchName(e.target.value));
    };

    const handlePrev = () => {
        if (page > 0) dispatch(setPage(page - 1));
    };

    const handleNext = () => {
        if (page < totalPages - 1) dispatch(setPage(page + 1));
    };

    const handleDelete = (id: number) => {
        if (window.confirm("Supprimer ce produit ? Cette action est irréversible.")) {
            dispatch(deleteProduct(id));
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            setValue('name', selectedProduct.name);
            setValue('price', selectedProduct.price);
            setValue('stock', selectedProduct.stock);
        } else {
            reset();
        }
    }, [selectedProduct, setValue, reset]);

    const handleEdit = (product: ProductDTO) => {
        setSelectedProduct(product);
        setIsModalOpen(true);
    };

    const handleCreate = () => {
        setSelectedProduct(null);
        setIsModalOpen(true);
        reset();
    };

    const onSubmit = (data: ProductDTO) => {
        if (selectedProduct) {
            dispatch(updateProduct({ id: selectedProduct.id, data })).then((action) => {
                if (updateProduct.fulfilled.match(action)) {
                    setIsModalOpen(false);
                    setSelectedProduct(null);
                    reset();
                }
            });
        } else {
            dispatch(createProduct(data)).then((action) => {
                if (createProduct.fulfilled.match(action)) {
                    setIsModalOpen(false);
                    reset();
                }
            });
        }
    };

    if (loading && items.length === 0) return <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>Chargement des produits...</div>;
    if (error && items.length === 0) return <div style={{ padding: '20px', color: '#e53935' }}>Erreur: {error}</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
                <h2 style={{ fontSize: '1.8rem', color: '#333', margin: 0 }}>Catalogue Produits</h2>
                {role === 'ADMIN' && (
                    <button
                        onClick={handleCreate}
                        style={{
                            backgroundColor: '#764ba2',
                            color: 'white',
                            border: 'none',
                            padding: '10px 20px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: '600',
                            boxShadow: '0 4px 6px rgba(118, 75, 162, 0.2)'
                        }}
                    >
                        + Nouveau Produit
                    </button>
                )}
            </div>

            <div style={{ marginBottom: '25px' }}>
                <input
                    type="text"
                    placeholder="Rechercher un produit..."
                    value={searchName}
                    onChange={handleSearch}
                    style={{
                        padding: '12px',
                        width: '100%',
                        maxWidth: '400px',
                        borderRadius: '8px',
                        border: '1px solid #ddd',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                        outline: 'none',
                        fontSize: '1rem'
                    }}
                />
            </div>

            {error && <div style={{ color: '#e53935', marginBottom: '15px' }}>{error}</div>}
            {deleteError && <div style={{ color: '#e53935', marginBottom: '15px', padding: '10px', backgroundColor: '#ffe6e6', borderRadius: '4px' }}>{deleteError}</div>}

            <div style={{ backgroundColor: 'white', borderRadius: '12px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead style={{ backgroundColor: '#f8f9fa' }}>
                        <tr>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Produit</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Prix</th>
                            <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600' }}>Stock</th>
                            {role === 'ADMIN' && (
                                <th style={{ padding: '15px', borderBottom: '1px solid #eee', color: '#555', fontWeight: '600', textAlign: 'right' }}>Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr>
                                <td colSpan={4} style={{ padding: '30px', textAlign: 'center', color: '#888' }}>Aucun produit trouvé.</td>
                            </tr>
                        ) : (
                            items.map((product) => (
                                <tr key={product.id} style={{ borderBottom: '1px solid #f0f0f0', transition: 'background-color 0.1s' }}>
                                    <td style={{ padding: '15px', color: '#333', fontWeight: '500' }}>{product.name}</td>
                                    <td style={{ padding: '15px', color: '#2e7d32', fontWeight: '600' }}>{product.price} DH</td>
                                    <td style={{ padding: '15px' }}>
                                        <span style={{
                                            padding: '4px 8px',
                                            borderRadius: '12px',
                                            backgroundColor: product.stock > 0 ? '#e8f5e9' : '#ffebee',
                                            color: product.stock > 0 ? '#2e7d32' : '#c62828',
                                            fontSize: '0.85rem',
                                            fontWeight: '500'
                                        }}>
                                            {product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}
                                        </span>
                                    </td>
                                    {role === 'ADMIN' && (
                                        <td style={{ padding: '15px', textAlign: 'right' }}>
                                            <button
                                                onClick={() => handleEdit(product)}
                                                style={{ marginRight: '10px', cursor: 'pointer', background: 'none', border: 'none', color: '#1976d2', fontWeight: '500' }}
                                            >
                                                Éditer
                                            </button>
                                            <button
                                                onClick={() => handleDelete(product.id)}
                                                disabled={deletingId === product.id}
                                                style={{ cursor: deletingId === product.id ? 'not-allowed' : 'pointer', background: 'none', border: 'none', color: deletingId === product.id ? '#999' : '#e53935', fontWeight: '500' }}
                                            >
                                                {deletingId === product.id ? '...' : 'Supprimer'}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'center', gap: '15px', alignItems: 'center' }}>
                <button
                    onClick={handlePrev}
                    disabled={page === 0 || loading}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        background: 'white',
                        cursor: (page === 0 || loading) ? 'not-allowed' : 'pointer',
                        color: (page === 0 || loading) ? '#aaa' : '#333'
                    }}
                >
                    Précédent
                </button>
                <span style={{ color: '#666' }}>Page {page + 1} sur {totalPages || 1}</span>
                <button
                    onClick={handleNext}
                    disabled={page >= totalPages - 1 || loading}
                    style={{
                        padding: '8px 16px',
                        border: '1px solid #ddd',
                        borderRadius: '6px',
                        background: 'white',
                        cursor: (page >= totalPages - 1 || loading) ? 'not-allowed' : 'pointer',
                        color: (page >= totalPages - 1 || loading) ? '#aaa' : '#333'
                    }}
                >
                    Suivant
                </button>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center',
                    zIndex: 1000, backdropFilter: 'blur(2px)'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '30px', borderRadius: '12px', width: '400px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
                        <h3 style={{ margin: '0 0 20px 0', color: '#333' }}>{selectedProduct ? 'Modifier le Produit' : 'Nouveau Produit'}</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Nom du produit</label>
                                <input
                                    {...register('name', { required: true })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                                {errors.name && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis</span>}
                            </div>
                            <div style={{ marginBottom: '15px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Prix (DH)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    {...register('price', { required: true, min: 0 })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                                {errors.price && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis (Min 0)</span>}
                            </div>
                            <div style={{ marginBottom: '25px' }}>
                                <label style={{ display: 'block', marginBottom: '5px', color: '#555', fontSize: '0.9rem' }}>Stock</label>
                                <input
                                    type="number"
                                    {...register('stock', { required: true, min: 0 })}
                                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', fontSize: '1rem', boxSizing: 'border-box' }}
                                />
                                {errors.stock && <span style={{ color: '#e53935', fontSize: '0.8rem' }}>Requis (Min 0)</span>}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                                <button
                                    type="button"
                                    onClick={() => setIsModalOpen(false)}
                                    style={{ padding: '10px 20px', background: '#f5f5f5', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#333' }}
                                >
                                    Annuler
                                </button>
                                <button
                                    type="submit"
                                    disabled={updating || creating}
                                    style={{
                                        padding: '10px 20px',
                                        backgroundColor: '#764ba2',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '6px',
                                        cursor: 'pointer',
                                        fontWeight: '600',
                                        opacity: (updating || creating) ? 0.7 : 1
                                    }}
                                >
                                    {updating || creating ? 'Enregistrement...' : 'Enregistrer'}
                                </button>
                            </div>
                            {updateError && <p style={{ color: '#e53935', marginTop: '10px', fontSize: '0.9rem' }}>Erreur: {updateError}</p>}
                            {createError && <p style={{ color: '#e53935', marginTop: '10px', fontSize: '0.9rem' }}>Erreur: {createError}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsListPage;
