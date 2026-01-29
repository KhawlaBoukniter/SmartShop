import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, setPage, setSearchName } from '../../features/products/productSlice';
import type { RootState, AppDispatch } from '../../app/store';

const ProductsListPage = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { items, loading, error, page, totalPages, searchName, size } = useSelector((state: RootState) => state.products);
    const { role } = useSelector((state: RootState) => state.auth);

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

    if (loading && items.length === 0) return <div>Loading...</div>;
    if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;

    return (
        <div style={{ padding: '20px' }}>
            <h2>Products</h2>

            <div style={{ marginBottom: '20px' }}>
                <input
                    type="text"
                    placeholder="Search by name..."
                    value={searchName}
                    onChange={handleSearch}
                    style={{ padding: '8px', width: '300px' }}
                />
            </div>

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
                                    <button style={{ marginRight: '5px' }} disabled>Edit</button>
                                    <button disabled>Delete</button>
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
        </div>
    );
};

export default ProductsListPage;
