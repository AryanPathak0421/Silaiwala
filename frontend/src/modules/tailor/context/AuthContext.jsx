import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const TAILOR_STATUS = {
    NOT_REGISTERED: 'NOT_REGISTERED',
    PENDING_APPROVAL: 'PENDING_APPROVAL',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED',
    SUSPENDED: 'SUSPENDED',
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('tailor_token'));
    const [status, setStatus] = useState(TAILOR_STATUS.NOT_REGISTERED);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Dummy check for existing session
        const checkAuth = async () => {
            if (token) {
                // Mock API call to get profile
                setTimeout(() => {
                    const mockUser = JSON.parse(localStorage.getItem('tailor_user')) || {
                        name: 'Royal Stitches',
                        email: 'tailor@example.com',
                        status: TAILOR_STATUS.APPROVED, // Change this to test different flows
                    };
                    setUser(mockUser);
                    setStatus(mockUser.status);
                    setLoading(false);
                }, 500);
            } else {
                setLoading(false);
            }
        };
        checkAuth();
    }, [token]);

    const login = (userData, userToken) => {
        localStorage.setItem('tailor_token', userToken);
        localStorage.setItem('tailor_user', JSON.stringify(userData));
        setToken(userToken);
        setUser(userData);
        setStatus(userData.status);
    };

    const logout = () => {
        localStorage.removeItem('tailor_token');
        localStorage.removeItem('tailor_user');
        setToken(null);
        setUser(null);
        setStatus(TAILOR_STATUS.NOT_REGISTERED);
    };

    const updateStatus = (newStatus) => {
        setStatus(newStatus);
        if (user) {
            const updatedUser = { ...user, status: newStatus };
            setUser(updatedUser);
            localStorage.setItem('tailor_user', JSON.stringify(updatedUser));
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, status, loading, login, logout, updateStatus }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useTailorAuth = () => useContext(AuthContext);
