// src/App.jsx
import { useContext } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { AuthContext } from './context/AuthContext.jsx';
import ProductsView from './views/ProductsView.jsx';
import LoginView from './views/LoginView.jsx';
import RegisterView from './views/RegisterView.jsx';

const NotFoundView = () => (
  <div style={{ padding: '2rem', color: 'red' }}>
    <h2>⚠️ 404 - Resource Routing Exception</h2>
    <p>The targeted URL track does not match an active system view.</p>
  </div>
);

export default function App() {
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  return (
    <div>
      {/* PERSISTENT NAVIGATION BAR */}
      <header style={{ 
        background: '#222', 
        padding: '1rem', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        fontFamily: 'sans-serif' 
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>🛒 DevStore</Link>
          <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Browse Catalog</Link>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          {isAuthenticated && user ? (
            <>
              <span style={{ color: '#81c784', fontSize: '0.9rem', fontWeight: '500' }}>👤 {user.first_name}</span>
              <button onClick={logout} style={{ background: '#e53935', color: '#fff', border: 'none', padding: '0.4rem 0.8rem', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.85rem' }}>Sign Out</button>
            </>
          ) : (
            // CONDENSED UNIFIED SYSTEM ACCESS GATEWAY
            <Link to="/register" style={{ color: '#ccc', textDecoration: 'none', fontWeight: '500' }}>
              Register / Login
            </Link>
          )}
        </div>
      </header>

      {/* VIEWPORT CONTROLLER SWITCHBOARD */}
      <main>
        <Routes>
          <Route path="/" element={<ProductsView />} />
          <Route path="/login" element={<LoginView />} />
          <Route path="/register" element={<RegisterView />} />
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>
    </div>
  );
}
