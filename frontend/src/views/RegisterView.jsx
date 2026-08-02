// src/views/RegisterView.jsx
import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';
import { apiClient } from '../config/apiClient.js';

export default function RegisterView() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage('');
        setLoading(true);

        try {
            await apiClient.post('/auth/register', {
                email,
                password,
                first_name: firstName,
                last_name: lastName
            });

            const loginResponse = await apiClient.post('/auth/login', { email, password });
            const { user, token } = loginResponse.data;
            login(user, token);
            navigate('/');
        } catch (error) {
            console.error("❌ Registration failure:", error);
            setErrorMessage(error.response?.data?.error || "Error initializing profile account.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '3rem auto', padding: '2rem', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'sans-serif' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '1.5rem' }}>📦 Create Account</h2>
            
            {errorMessage && (
                <div style={{ padding: '0.75rem', marginBottom: '1rem', background: '#ffebee', color: '#c62828', borderRadius: '4px', fontSize: '0.9rem' }}>
                    {errorMessage}
                </div>
            )}

            {/* ACCOUNT FORM CORE */}
            <form onSubmit={handleRegisterSubmit}>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>First Name</label>
                        <input type="text" value={firstName} onChange={(e) => setFirstName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                    <div style={{ flex: 1 }}>
                        <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Last Name</label>
                        <input type="text" value={lastName} onChange={(e) => setLastName(e.target.value)} required style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                    </div>
                </div>

                <div style={{ marginBottom: '1rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Email Address</label>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem', fontWeight: 'bold' }}>Secure Password</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ width: '100%', padding: '0.5rem', boxSizing: 'border-box', borderRadius: '4px', border: '1px solid #ccc' }} />
                </div>

                <button type="submit" disabled={loading} style={{ width: '100%', padding: '0.75rem', background: '#28a745', color: '#fff', border: 'none', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                    {loading ? 'Processing Registry...' : 'Register Profile'}
                </button>
            </form>

            {/* SEGMENTATION LINE */}
            <div style={{ borderTop: '1px solid #eee', marginTop: '2rem', paddingTop: '1.5rem', textAlign: 'center' }}>
                <span style={{ fontSize: '0.9rem', color: '#666', display: 'block', marginBottom: '0.75rem' }}>
                    Already have an account?
                </span>
                <Link to="/login" style={{ 
                    display: 'block',
                    width: '100%', 
                    padding: '0.65rem', 
                    boxSizing: 'border-box',
                    background: '#fff', 
                    color: '#007bff', 
                    border: '1px solid #007bff', 
                    borderRadius: '4px', 
                    fontWeight: 'bold', 
                    textDecoration: 'none',
                    textAlign: 'center',
                    fontSize: '0.9rem'
                }}>
                    Sign In
                </Link>
            </div>
        </div>
    );
}
