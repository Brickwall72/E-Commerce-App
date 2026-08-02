// src/App.jsx
import { useContext, useState, useEffect, useRef } from 'react'; // UPGRADED
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import { CartContext } from './context/CartContext.jsx';
import ProductsView from './views/ProductsView.jsx';
import CheckoutView from './views/CheckoutView.jsx';
import LoginView from './views/LoginView.jsx';
import RegisterView from './views/RegisterView.jsx';
import CartDropdown from './components/CartDropdown.jsx';

const NotFoundView = () => (
  <div style={{ padding: '2rem', color: 'red' }}>
    <h2>⚠️ 404 - Resource Routing Exception</h2>
    <p>The targeted URL track does not match an active system view.</p>
  </div>
);

export default function App() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);
  const { totalItemCount } = useContext(CartContext);
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  // 1. ANCHOR HOOK: Allocates an active reference coordinate anchor card
  const cartContainerRef = useRef(null);

  // 2. WINDOW LISTENER MATRIX: Detects clicks across your entire viewport surface area
  useEffect(() => {
    const handleOutsideClick = (event) => {
      // If the reference slot is populated AND the clicked item is physically OUTSIDE its borders:
      if (cartContainerRef.current && !cartContainerRef.current.contains(event.target)) {
        setIsCartOpen(false); // Snap the dropdown shut cleanly!
      }
    };

    // Mount global window listener thread when the component boots up
    document.addEventListener('mousedown', handleOutsideClick);
    
    // Clean-up lifecycle loop: Safely destroys the listener when navigating away to prevent memory leaks
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, []);

  return (
    <div>
      {/* PERSISTENT HEADER NAVIGATION BAR */}
      <header style={{ 
        background: '#222', 
        padding: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        fontFamily: 'sans-serif',
        position: 'relative'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>🛒 DevStore</Link>
          <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Browse Catalog</Link>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            <>
              {/* 3. WRAPPER CONTAINER: Binds both the button and dropdown inside the reference shield fence */}
              <div ref={cartContainerRef} style={{ position: 'relative' }}>
                <button 
                  onClick={() => setIsCartOpen(!isCartOpen)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#ccc',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    fontWeight: '500',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    padding: '0.5rem'
                  }}
                >
                  Cart 
                  <span style={{
                    background: totalItemCount > 0 ? '#007bff' : '#555',
                    color: '#fff',
                    borderRadius: '20px',
                    padding: '0.15rem 0.5rem',
                    fontSize: '0.75rem',
                    fontWeight: 'bold'
                  }}>
                    {totalItemCount}
                  </span>
                </button>

                {isCartOpen && <CartDropdown onClose={() => setIsCartOpen(false)} />}
              </div>

              <span style={{ color: '#81c784', fontSize: '0.9rem', fontWeight: '500' }}>👤 {user.first_name}</span>
              <button onClick={logout} style={{ background: '#e53935', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Sign Out</button>
            </>
          ) : (
            <Link to="/register" style={{ color: '#ccc', textDecoration: 'none', fontWeight: '500' }}>Register / Login</Link>
          )}
        </div>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<ProductsView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="/checkout" element={<CheckoutView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>
    </div>
  );
}
