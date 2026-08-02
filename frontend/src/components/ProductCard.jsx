// src/components/ProductCard.jsx
export default function ProductCard({ item }) {
    const isAvailable = item.inventory_quantity > 0;

    return (
        <div style={{ 
            border: '1px solid #ddd', 
            borderRadius: '8px', 
            padding: '1.25rem', 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            background: '#fff',
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
            <div>
                <h3 style={{ margin: '0 0 0.5rem 0', fontSize: '1.1rem' }}>{item.title}</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 1rem 0', minHeight: '40px' }}>
                    {item.description || 'No item specifications text summary provided.'}
                </p>
            </div>
            
            <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#2e7d32' }}>
                        ${parseFloat(item.price).toFixed(2)}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: isAvailable ? '#555' : '#c62828' }}>
                        {isAvailable ? `Stock: ${item.inventory_quantity}` : 'SOLD OUT'}
                    </span>
                </div>
                
                <button 
                    disabled={!isAvailable}
                    style={{ 
                        width: '100%', 
                        padding: '0.6rem', 
                        background: isAvailable ? '#222' : '#ccc', 
                        color: '#fff', 
                        border: 'none', 
                        borderRadius: '4px', 
                        fontWeight: 'bold', 
                        cursor: isAvailable ? 'pointer' : 'not-allowed' 
                    }}
                >
                    {isAvailable ? 'Add to Cart' : 'Out of Stock'}
                </button>
            </div>
        </div>
    );
}
