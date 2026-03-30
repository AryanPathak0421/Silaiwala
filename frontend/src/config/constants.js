// Dynamic detection for LAN/Mobile devices
const currentHost = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const getBackendBase = () => {
    if (currentHost === 'localhost' || currentHost === '127.0.0.1') return 'http://localhost:5000';
    return `http://${currentHost}:5000`; // Dynamically use the host IP for API calls
};

const getBase = () => {
    const apiEnv = import.meta.env.VITE_API_URL;
    if (apiEnv) {
        // Extract base from /api/v1
        try {
            const url = new URL(apiEnv);
            return `${url.protocol}//${url.host}`;
        } catch (e) {
            return apiEnv.split('/api/v1')[0];
        }
    }
    return getBackendBase();
};

export const SOCKET_URL = getBase();
export const API_URL = import.meta.env.VITE_API_URL || `${SOCKET_URL}/api/v1`;


export const APP_NAME = 'Silaiwala';

export const THEME = {
    primary: '#FF5C8A', // Emerald Green (Starbucks-like)
    secondary: '#d4e9e2', // Light Green
    accent: '#00754a', // Bright Green
};
