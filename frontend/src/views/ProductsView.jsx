// src/views/ProductsView.jsx
import { useState, useEffect } from 'react';
import { apiClient } from '../config/apiClient.js';
import ProductCard from '../components/ProductCard.jsx'; // ADDED

export default function ProductsView() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        const fetchInventoryCatalog = async () => {
            try {
                const response = await apiClient.get('/products');
                setProducts(response.data.products || []);
            } catch (error) {
                console.error("❌ Product grid fetch crash:", error);
                setErrorMessage("Unable to stream store merchandise rows.");
            } finally {
                setLoading(false);
            }
        };

        fetchInventoryCatalog();
    }, []);

    if (loading) return <div style={{ padding: '3rem', fontFamily: 'sans-serif' }}>🔄 Streaming store catalog matrix...</div>;
    if (errorMessage) return <div style={{ padding: '3rem', color: '#c62828', fontFamily: 'sans-serif' }}>⚠️ {errorMessage}</div>;

    return (
        <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
            <h2 style={{ marginBottom: '1.5rem' }}>📦 Available Store Merchandise ({products.length})</h2>
            
            {products.length === 0 ? (
                <p>No inventory listings floating on the database shelves right now.</p>
            ) : (
                <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                    gap: '1.5rem' 
                }}>
                    {/* CLEAN MATRIX LOOP */}
                    {products.map((item) => (
                        <ProductCard key={item.id} item={item} />
                    ))}
                </div>
            )}
        </div>
    );
}
