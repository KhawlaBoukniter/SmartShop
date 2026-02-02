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

    if (loading && items.length === 0) return <div>Loading...</div>;
    if (error && items.length === 0) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Products</h2>

            <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={handleSearch}
                    style={{ padding: '8px', width: '300px' }}
                />
                {role === 'ADMIN' && (
                    <button onClick={handleCreate} style={{ padding: '8px 16px' }}>Add Product</button>
                )}
            </div>

            {error && <div style={{ color: 'red', marginBottom: '10px' }}>Global Error: {error}</div>}
            {deleteError && <div style={{ color: 'red', marginBottom: '10px', padding: '10px', backgroundColor: '#ffe6e6', border: '1px solid red' }}>{deleteError}</div>}

            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>ID</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Name</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Price</th>
                        <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Stock</th>
                        {role === 'ADMIN' && (
                            <th style={{ padding: '8px', border: '1px solid #ddd', textAlign: 'left' }}>Actions</th>
                        )}
                    </tr>
                </thead>
                <tbody>
                    {items.map((product) => (
                        <tr key={product.id}>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.id}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.name}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.price}</td>
                            <td style={{ padding: '8px', border: '1px solid #ddd' }}>{product.stock}</td>
                            {role === 'ADMIN' && (
                                <td style={{ padding: '8px', border: '1px solid #ddd' }}>
                                    <button
                                        onClick={() => handleEdit(product)}
                                        style={{ marginRight: '5px', cursor: 'pointer' }}
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(product.id)}
                                        disabled={deletingId === product.id}
                                        style={{ cursor: deletingId === product.id ? 'not-allowed' : 'pointer', color: 'red' }}
                                    >
                                        {deletingId === product.id ? 'Deleting...' : 'Delete'}
                                    </button>
                                </td>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>

            <div style={{ marginTop: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <button onClick={handlePrev} disabled={page === 0 || loading}>Previous</button>
                <span>Page {page + 1} of {totalPages}</span>
                <button onClick={handleNext} disabled={page >= totalPages - 1 || loading}>Next</button>
            </div>

            {isModalOpen && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center'
                }}>
                    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', width: '400px' }}>
                        <h3>{selectedProduct ? 'Edit Product' : 'Add Product'}</h3>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Name</label>
                                <input {...register('name', { required: true })} style={{ width: '100%', padding: '5px' }} />
                                {errors.name && <span style={{ color: 'red' }}>Required</span>}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Price</label>
                                <input type="number" step="0.01" {...register('price', { required: true, min: 0 })} style={{ width: '100%', padding: '5px' }} />
                                {errors.price && <span style={{ color: 'red' }}>Required (Min 0)</span>}
                            </div>
                            <div style={{ marginBottom: '10px' }}>
                                <label>Stock</label>
                                <input type="number" {...register('stock', { required: true, min: 0 })} style={{ width: '100%', padding: '5px' }} />
                                {errors.stock && <span style={{ color: 'red' }}>Required (Min 0)</span>}
                            </div>

                            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                                <button type="button" onClick={() => setIsModalOpen(false)}>Cancel</button>
                                <button type="submit" disabled={updating || creating}>
                                    {updating || creating ? 'Saving...' : 'Save'}
                                </button>
                            </div>
                            {updateError && <p style={{ color: 'red', marginTop: '10px' }}>Update Error: {updateError}</p>}
                            {createError && <p style={{ color: 'red', marginTop: '10px' }}>Create Error: {createError}</p>}
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ProductsListPage;
