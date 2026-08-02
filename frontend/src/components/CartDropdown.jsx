// src/components/CartDropdown.jsx
import { useContext } from 'react';
import { CartContext } from '../context/CartContext.jsx';

export default function CartDropdown({ onClose }) {
    // UPGRADED: Added removeFromCart driver linkage
    const { cartItems, cartSubtotal, removeFromCart } = useContext(CartContext); 

    return (
        <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            width: '340px', // Widened slightly to account for button alignment spacing
            backgroundColor: '#fff',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 1000,
            color: '#333',
            fontFamily: 'sans-serif',
            marginTop: '0.5rem'
        }}>
            <h3 style={{ padding: '1rem', margin: 0, borderBottom: '1px solid #eee', fontSize: '1rem' }}>🛍️ Shopping Bag Summary</h3>

            <div style={{ maxHeight: '240px', overflowY: 'auto', padding: '0.5rem' }}>
                {cartItems.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#777', padding: '2rem 0', margin: 0, fontSize: '0.9rem' }}>
                        Your shopping cart is completely empty.
                    </p>
                ) : (
                    cartItems.map((line) => (
                        <div key={line.product_id} style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            padding: '0.65rem 0.5rem',
                            borderBottom: '1px solid #f9f9f9',
                            fontSize: '0.85rem',
                            gap: '0.5rem'
                        }}>
                            {/* Left Partition: Product Quantities Metadata */}
                            <div style={{ maxWidth: '65%' }}>
                                <strong style={{ display: 'block', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                                    {line.title}
                                </strong>
                                <span style={{ color: '#666' }}>Qty: {line.quantity} × ${parseFloat(line.price).toFixed(2)}</span>
                            </div>
                            
                            {/* Right Partition: Item Pricing and Deletion Trigger */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <span style={{ fontWeight: 'bold' }}>
                                    ${(parseFloat(line.price) * line.quantity).toFixed(2)}
                                </span>
                                
                                {/* ❌ ATOMIC REMOVAL ACTION BUTTON */}
                                <button 
                                    onClick={() => removeFromCart(line.product_id)} // ⚡ TRIGGER DELETION
                                    title="Remove item row completely"
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        color: '#e53935',
                                        cursor: 'pointer',
                                        fontSize: '0.85rem',
                                        padding: '0.25rem',
                                        fontWeight: 'bold',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}
                                >
                                    ❌
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {cartItems.length > 0 && (
                <div style={{ padding: '1rem', borderTop: '1px solid #eee', backgroundColor: '#fdfdfd', borderRadius: '0 0 8px 8px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '1rem', fontSize: '0.95rem' }}>
                        <span>Subtotal:</span>
                        <span style={{ color: '#2e7d32' }}>${cartSubtotal}</span>
                    </div>
                    <button 
                        onClick={() => {
                            alert("🚀 Proceeding to checkout transaction layout...");
                            onClose();
                        }}
                        style={{ width: '100%', padding: '0.65rem', backgroundColor: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer', textAlign: 'center', fontSize: '0.9rem' }}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            )}
        </div>
    );
}
