import { createContext, useState, useEffect } from 'react';

// 1. Initialize the global session communication frequency
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 2. Read from localStorage on startup so users stay logged in when they refresh!
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(null);

    // 3. Keep localStorage perfectly synced whenever the token state changes
    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token);
        } else {
            localStorage.removeItem('token');
            setUser(null);
        }
    }, [token]);

    // 4. Exposed function actions that components can call from anywhere
    const login = (userPayload, tokenPayload) => {
        setToken(tokenPayload);
        setUser(userPayload);
    };

    const logout = () => {
        setToken(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
