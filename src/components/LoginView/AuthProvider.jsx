// eslint-disable-next-line no-unused-vars
import React, { createContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState({ token: null, isAuthenticated: false });

    const login = (token) => {
        setAuth({ token, isAuthenticated: true });
        Cookies.set('token', token, { expires: 1, secure: true })
    };

    const logout = () => {
        setAuth({ token: null, isAuthenticated: false });
        Cookies.remove('token')
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            setAuth({ token, isAuthenticated: true });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};