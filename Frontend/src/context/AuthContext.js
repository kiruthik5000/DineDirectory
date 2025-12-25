import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Ideally verify token with backend here or decode it
            // For now, we assume it's valid if present or decode it
            // decode token to get user info if needed, or fetch profile
            // const decoded = jwt_decode(token); 
            // setUser(decoded);

            let savedUser = null;

            try {
                const storedUser = localStorage.getItem("user");
                savedUser = storedUser ? JSON.parse(storedUser) : null;
            } catch (err) {
                console.error("Invalid JSON in localStorage:", err);
                localStorage.removeItem("user");
            }
            setUser(savedUser);
        }
        setLoading(false);
    }, [token]);

    const login = (userData, newToken) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
