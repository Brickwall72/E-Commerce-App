import { createContext, useState, useEffect } from 'react';

// 1. Initialize the global session communication frequency
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    // 2. Read from localStorage on startup so users stay logged in when they refresh!
    // Ensure user parsing is safe from localStorage text blocks
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    // Update the useEffect tracking block to keep the user profile object synced 
    useEffect(() => {
        if (token && user) {
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(user));
        } else {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
        }
    }, [token, user]);


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
