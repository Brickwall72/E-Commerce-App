// src/views/LoginView.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiClient } from '../config/apiClient.js';
import SocialAuthButtons from '../components/SocialAuthButtons.jsx';

export default function LoginView() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // Form Field States
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleCredentialSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            const response = await apiClient.post('/auth/login', { email, password });
            const { user, token } = response.data;
            login(user, token);
            navigate('/');
        } catch (error) {
            console.error("❌ Login failure:", error);
            setErrorMessage(error.response?.data?.error || "Connection failure validating credentials.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔑 Access Gateway</h2>
            
            {errorMessage && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '0.9rem' }}>
                    {errorMessage}
                </div>
            )}

            {/* FULLY EMBEDDED MANUAL CREDENTIALS FORM */}
            <form onSubmit={handleCredentialSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Email Address</label>
                    <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.9rem', fontWeight: 'bold' }}>Secure Password</label>
                    <input 
                        type="password" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                        style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                </div>

                <button 
                    type="submit" 
                    disabled={loading}
                    style={{ width: '100%', padding: '0.75rem', background: '#007bff', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}
                >
                    {loading ? 'Validating Session...' : 'Sign In'}
                </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                <span style={{ padding: '0 1rem', color: '#777', fontSize: '0.85rem' }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
            </div>

            <SocialAuthButtons />

            <div style={{ borderTop: '1px solid #eee', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '0.75rem' }}>New to DevStore?</span>
                <Link to="/register" style={{ display: 'block', width: '100%', padding: '0.65rem', boxSizing: 'border-box', background: '#fff', color: '#28a745', border: '1px solid #28a745', borderRadius: '4px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center', fontSize: '0.9rem' }}>Create an Account</Link>
            </div>
        </div>
    );
}
