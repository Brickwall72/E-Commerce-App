// src/components/ProductCard.jsx
import { useContext, useState } from 'react'; // UPGRADED
import { CartContext } from '../context/CartContext.jsx';

export default function ProductCard({ item }) {
    const { addToCart, loading } = useContext(CartContext);
    const isAvailable = item.inventory_quantity > 0;

    // Track modal overlay panel visibility parameters
    const [isModalOpen, setIsModalOpen] = useState(false);

    // Stop propagation helper: Stops button clicks from accidentally triggering the parent card click toggle
    const handleButtonClick = (e) => {
        e.stopPropagation(); 
        addToCart(item.id, 1);
    };

    return (
        <>
            {/* A. BASE PRODUCT CARD LIST TILE (DECLUTTERED INTERFACE) */}
            <div 
                onClick={() => setIsModalOpen(true)} // ⚡ OPEN MODAL DETAIL TRACK
                style={{ 
                    border: '1px solid #ddd', 
                    borderRadius: '8px', 
                    padding: '1.25rem', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    background: '#fff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    fontFamily: 'sans-serif',
                    cursor: 'pointer', // Indicates the full box is clickable!
                    transition: 'transform 0.15s ease, box-shadow 0.15s ease',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)';
                }}
            >
                <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem', color: '#222' }}>{item.title}</h3>
                    {/* ✂️ Description text string is completely stripped from here to optimize scan density */}
                </div>
                
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2e7d32' }}>
                            ${parseFloat(item.price).toFixed(2)}
                        </span>
                        <span style={{ fontSize: '0.8rem', color: isAvailable ? '#555' : '#c62828', fontWeight: '500' }}>
                            {isAvailable ? `Stock: ${item.inventory_quantity}` : 'SOLD OUT'}
                        </span>
                    </div>
                    
                    <button 
                        disabled={!isAvailable || loading}
                        onClick={handleButtonClick} // Uses standard stopping override
                        style={{ 
                            width: '100%', 
                            padding: '0.6rem', 
                            background: isAvailable ? '#222' : '#ccc', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '4px', 
                            fontWeight: 'bold', 
                            cursor: isAvailable && !loading ? 'pointer' : 'not-allowed' 
                        }}
                    >
                        {!isAvailable ? 'Out of Stock' : loading ? 'Adding...' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* B. DETAILED EXPANDED MODAL OVERLAY PANEL BLOCK */}
            {isModalOpen && (
                <div 
                    onClick={() => setIsModalOpen(false)} // Clicking the dark background overlay closes the modal
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark transparent backdrop overlay
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2000, // Floats above your navigation bar header grid layers
                        fontFamily: 'sans-serif'
                    }}
                >
                    {/* The Modal Container Card Box */}
                    <div 
                        onClick={(e) => e.stopPropagation()} // Stops clicks inside the modal card box from shutting it down
                        style={{
                            backgroundColor: '#fff',
                            padding: '2.5rem',
                            borderRadius: '12px',
                            maxWidth: '450px',
                            width: '90%',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)',
                            position: 'relative',
                            boxSizing: 'border-box'
                        }}
                    >
                        {/* Close Upper Right "X" Toggle Button */}
                        <button 
                            onClick={() => setIsModalOpen(false)}
                            style={{
                                position: 'absolute',
                                top: '1.25rem',
                                right: '1.25rem',
                                background: 'none',
                                border: 'none',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                color: '#aaa'
                            }}
                        >
                            ✕
                        </button>

                        <h2 style={{ margin: '0 0 1rem 0', color: '#222', paddingRight: '1.5rem' }}>{item.title}</h2>
                        
                        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#2e7d32' }}>
                                ${parseFloat(item.price).toFixed(2)}
                            </span>
                            <span style={{ fontSize: '0.85rem', color: isAvailable ? '#666' : '#c62828', background: '#f5f5f5', padding: '0.2rem 0.6rem', borderRadius: '4px' }}>
                                {isAvailable ? `Available Inventory: ${item.inventory_quantity}` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* FULL SPECIFICATION SPECIFICATION DESCRIPTION BLOCK */}
                        <h4 style={{ margin: '0 0 0.5rem 0', color: '#555', textTransform: 'uppercase', fontSize: '0.75rem', letterSpacing: '0.05em' }}>Product Overview</h4>
                        <p style={{ color: '#444', lineHeight: '1.5', fontSize: '0.95rem', margin: '0 0 2rem 0', whiteSpace: 'pre-line' }}>
                            {item.description || 'No deep structural specifications summary documented for this catalog listing line item rows.'}
                        </p>

                        <button 
                            disabled={!isAvailable || loading}
                            onClick={(e) => {
                                handleButtonClick(e);
                                setIsModalOpen(false); // Clean wrapper closure on successful card click appends
                            }}
                            style={{ 
                                width: '100%', 
                                padding: '0.85rem', 
                                background: isAvailable ? '#28a745' : '#ccc', // Green accent theme for transactional commits
                                color: '#fff', 
                                border: 'none', 
                                borderRadius: '6px', 
                                fontWeight: 'bold', 
                                fontSize: '1rem',
                                cursor: isAvailable && !loading ? 'pointer' : 'not-allowed' 
                            }}
                        >
                            {!isAvailable ? 'Out of Stock' : loading ? 'Adding to Bag...' : 'Add to Shopping Cart'}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
