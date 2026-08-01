import { Routes, Route, Link } from 'react-router-dom';
import ProductsView from './views/ProductsView';
import LoginView from './views/LoginView';
import './App.css'

// Inline 404 Catch Layout
const NotFoundView = () => (
  <div style={{ padding: '2rem', color: 'red' }}>
    <h2>⚠️ 404 - Resource Routing Exception</h2>
    <p>The targeted URL track does not match an active system view.</p>
  </div>
);

export default function App() {
  return (
    <div>
      {/* PERSISTENT HEADER NAVIGATION (Stays visible across all pages) */}
      <header style={{ background: '#222', padding: '1rem', display: 'flex', gap: '1.5rem' }}>
        <Link to="/" style={{ color: '#fff', textDecoration: 'none', fontWeight: 'bold' }}>🛒 DevStore</Link>
        <Link to="/" style={{ color: '#ccc', textDecoration: 'none' }}>Browse Catalog</Link>
        <Link to="/login" style={{ color: '#ccc', textDecoration: 'none' }}>Login Gateway</Link>
      </header>

      {/* DYNAMIC HIGHWAY PANEL MATRIX */}
      <main>
        <Routes>
          {/* Target URL Paths mapped directly to your clean view files */}
          <Route path="/" element={<ProductsView />} />
          <Route path="/login" element={<LoginView />} />
          
          {/* Wildcard Intercept: Any unmapped path throws the 404 handler safety block */}
          <Route path="*" element={<NotFoundView />} />
        </Routes>
      </main>
    </div>
  );
}
