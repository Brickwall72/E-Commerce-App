// src/views/CheckoutView.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext.jsx';
import { apiClient } from '../config/apiClient.js';

export default function CheckoutView() {
    const { cartItems, cartSubtotal, refreshCart } = useContext(CartContext);
    const navigate = useNavigate();

    // Structural States
    const [shippingAddress, setShippingAddress] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [orderConfirmation, setOrderConfirmation] = useState(null);

    // Transaction Submit Handler
    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        if (cartItems.length === 0) return;
        
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await apiClient.post('/orders', {
                shipping_address: shippingAddress
            });

            setOrderConfirmation(response.data.order || response.data);
            await refreshCart();
        } catch (error) {
            console.error("❌ Checkout transaction failure:", error);
            setErrorMessage(error.response?.data?.error || "Transaction declined. System failed to process invoice rows.");
        } finally {
            setLoading(false);
        }
    };

    // UI STATE A: Successful Order Confirmation Receipt
    if (orderConfirmation) {
        return (
            <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '2.5rem', border: '1px solid #81c784', borderRadius: '12px', background: '#e8f5e9', fontFamily: 'sans-serif', textAlign: 'center' }}>
                <h2 style={{ color: '#2e7d32', marginTop: 0 }}>🎉 Order Placed Successfully!</h2>
                <p style={{ fontSize: '1.05rem', color: '#333' }}>Your transaction has been written to the database ledger rows.</p>
                
                <div style={{ background: '#fff', padding: '1.5rem', borderRadius: '8px', margin: '2rem 0', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', textAlign: 'left' }}>
                    <h4 style={{ margin: '0 0 1rem 0', textTransform: 'uppercase', color: '#666', fontSize: '0.8rem', letterSpacing: '0.05em' }}>Invoice Summary</h4>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}><strong>Order Reference ID:</strong> <code style={{ background: '#f4f4f4', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>{orderConfirmation.id || 'N/A'}</code></p>
                    <p style={{ margin: '0 0 0.5rem 0', fontSize: '0.95rem' }}><strong>Shipping Destination:</strong> {shippingAddress}</p>
                    <p style={{ margin: '1rem 0 0 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#2e7d32' }}>Total Paid: ${cartSubtotal}</p>
                </div>

                <Link to="/" style={{ display: 'inline-block', padding: '0.75rem 1.5rem', background: '#2e7d32', color: '#fff', textDecoration: 'none', borderRadius: '6px', fontWeight: 'bold' }}>
                    Return to Catalog Shelf Rows
                </Link>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '700px', margin: '3rem auto', padding: '0 1rem', fontFamily: 'sans-serif' }}>
            <h2 style={{ marginBottom: '2rem', textAlign: 'center', color: '#222' }}>📋 Complete Your Purchase</h2>
            
            {errorMessage && (
                <div style={{ padding: '0.75rem', marginBottom: '1.5rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '0.9rem' }}>
                    ⚠️ {errorMessage}
                </div>
            )}

            {cartItems.length === 0 ? (
                <div style={{ padding: '3rem 1rem', border: '1px dashed #ccc', borderRadius: '8px', textAlign: 'center' }}>
                    <p style={{ color: '#666', marginBottom: '1.5rem' }}>Your shopping bag canvas contains 0 item allocations.</p>
                    <Link to="/" style={{ padding: '0.6rem 1.2rem', background: '#007bff', color: '#fff', textDecoration: 'none', borderRadius: '4px', fontWeight: 'bold' }}>Go Browse Store Inventory</Link>
                </div>
            ) : (
                <div>
                    {/* 📦 THE EXPANSIVE CENTER-STACKED ITEM LIST */}
                    <div style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', marginBottom: '2rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ margin: '0 0 1.25rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', fontSize: '1.1rem', color: '#555' }}>Review Items</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                            {cartItems.map((line) => (
                                <div key={line.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #f9f9f9', paddingBottom: '0.75rem' }}>
                                    <div>
                                        <span style={{ fontWeight: '600', fontSize: '1rem', color: '#222', display: 'block' }}>{line.title}</span>
                                        <span style={{ color: '#666', fontSize: '0.85rem' }}>Quantity: {line.quantity} × ${parseFloat(line.price).toFixed(2)}</span>
                                    </div>
                                    <span style={{ fontWeight: 'bold', fontSize: '1rem', color: '#333' }}>
                                        ${(parseFloat(line.price) * line.quantity).toFixed(2)}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Totals Section directly attached underneath the center stack list */}
                        <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontWeight: 'bold', fontSize: '1.2rem', borderTop: '2px solid #eee', paddingTop: '1rem' }}>
                            <span style={{ color: '#444' }}>Total Order Subtotal:</span>
                            <span style={{ color: '#2e7d32' }}>${cartSubtotal}</span>
                        </div>
                    </div>

                    {/* 📋 THE CENTER-STACKED SHIPPING FORM */}
                    <form onSubmit={handlePlaceOrder} style={{ background: '#fff', border: '1px solid #eee', borderRadius: '8px', padding: '1.5rem', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                        <h3 style={{ margin: '0 0 1.25rem 0', borderBottom: '1px solid #eee', paddingBottom: '0.5rem', fontSize: '1.1rem', color: '#555' }}>Shipping Parameters</h3>
                        
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold', fontSize: '0.9rem', color: '#333' }}>
                                Physical Destination Address
                            </label>
                            <textarea 
                                rows="3"
                                value={shippingAddress}
                                onChange={(e) => setShippingAddress(e.target.value)}
                                placeholder="Enter street name, building number, apartment suite, city, state, zip code..."
                                required
                                style={{ width: '100%', padding: '0.75rem', boxSizing: 'border-box', borderRadius: '6px', border: '1px solid #ccc', fontFamily: 'sans-serif', fontSize: '0.95rem', resize: 'vertical' }}
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            style={{ width: '100%', padding: '1rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '1.1rem', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 2px 4px rgba(40,167,69,0.2)' }}
                        >
                            {loading ? 'Executing Atomic Transaction...' : `Authorize & Pay $${cartSubtotal}`}
                        </button>
                    </form>
                </div>
            )}
        </div>
    );
}
