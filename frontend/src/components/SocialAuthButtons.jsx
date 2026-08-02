// src/components/SocialAuthButtons.jsx
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext.jsx';

export default function SocialAuthButtons() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleSocialRedirect = (provider) => {
        const width = 500, height = 600;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        
        // Spawn standalone authentication popup frame gateway
        window.open(
            `http://localhost:3000/api/v1/auth/${provider}`,
            'OAuth Handshake Portal',
            `width=${width},height=${height},top=${top},left=${left}`
        );

        // Real-time message listener captures token payload issued by Express backend
        const messageListener = (event) => {
            if (event.origin !== 'http://localhost:3000') return;

            if (event.data.token) {
                const { user, token } = event.data;
                login(user, token); // Synchronize memory tower
                window.removeEventListener('message', messageListener);
                navigate('/');
            }
        };

        window.addEventListener('message', messageListener);
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', width: '100%' }}>
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
    );
}
