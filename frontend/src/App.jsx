// src/App.jsx
import { useContext } from 'react'; // ADDED
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx'; // ADDED
import ProductsView from './views/ProductsView.jsx';
import LoginView from './views/LoginView.jsx';

const NotFoundView = () => (
  <div style={{ padding: '2rem', color: 'red' }}>
    <h2>⚠️ 404 - Resource Routing Exception</h2>
    <p>The targeted URL track does not match an active system view.</p>
  </div>
);

export default function App() {
  // Tune our layout directly into your global session radio tower channel!
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div>
      {/* PERSISTENT HEADER NAVIGATION PANEL */}
      <header style={{ 
        background: '#222', 
        padding: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        fontFamily: 'sans-serif' 
      }}>
        {/* Left Side: Navigation Lanes */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>🛒 DevStore</Link>
          <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Browse Catalog</Link>
        </div>

        {/* Right Side: Dynamic Session Context Swap */}
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            // STATE A: Show customer metadata profile when logged in successfully
            <>
              <span style={{ color: '#81c784', fontSize: '0.9rem', fontWeight: '500' }}>
                👤 {user.first_name}
              </span>
              <button 
                onClick={logout}
                style={{ 
                  background: '#e53935', 
                  color: '#fff', 
                  border: 'none', 
                  padding: '0.4rem 0.8rem', 
                  borderRadius: '4px', 
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  fontSize: '0.85rem'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            // STATE B: Fallback to basic link when session is unauthenticated / anonymous
            <Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>Login</Link>
          )}
        </div>
      </header>

      {/* CORE ROUTING matriz PANEL */}
      <main>
        <Routes>
          <Route path="/" element={<ProductsView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>
    </div>
  );
}
