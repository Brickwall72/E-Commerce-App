// src/views/LoginView.jsx

import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiClient } from '../config/apiClient.js';

export default function LoginView() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    // 1. Core State Trackers
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // 2. Standard Email/Password Form Submission Handler
    const handleCredentialSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            // Fires network packet over port 3000 to your backend container
            const response = await apiClient.post('/auth/login', { email, password });
            
            // Unpacks token data and updates global session memory
            const { user, token } = response.data;
            login(user, token);
            
            // Seamlessly routes user back to the main catalog shelf rows
            navigate('/');
        } catch (error) {
            console.error("❌ Frontend login capture failure:", error);
            const statusText = error.response?.data?.error || "Connection failure validating credentials.";
            setErrorMessage(statusText);
        } finally {
            setLoading(false);
        }
    };

    // 3. Third-Party OAuth Trigger Gateway
    const handleSocialRedirect = (provider) => {
        // Redirection points straight to your Express backend OAuth initiator route!
        // This ensures the secure environment keys remain completely hidden from the browser.
        window.location.href = `http://localhost:3000/api/v1/auth/${provider}`;
    };

    return (
        <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>🔑 Access Gateway</h2>
            
            {errorMessage && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '0.9rem' }}>
                    {errorMessage}
                </div>
            )}

            {/* A. STANDARD CREDENTIALS FORM */}
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

            {/* B. VISUAL DIVIDER */}
            <div style={{ display: 'flex', alignItems: 'center', margin: '2rem 0' }}>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
                <span style={{ padding: '0 1rem', color: '#777', fontSize: '0.85rem' }}>OR CONTINUE WITH</span>
                <div style={{ flex: 1, height: '1px', background: '#ddd' }}></div>
            </div>

            {/* C. THIRD-PARTY SOCIAL BUTTONS PANEL */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <button 
                    onClick={() => handleSocialRedirect('google')}
                    style={{ width: '100%', padding: '0.65rem', background: '#fff', color: '#333', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '500' }}
                >
                    🌐 Continue with Google
                </button>
                <button 
                    onClick={() => handleSocialRedirect('github')}
                    style={{ width: '100%', padding: '0.65rem', background: '#24292e', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: '500' }}
                >
                    💻 Continue with GitHub
                </button>
            </div>
        </div>
    );
}
