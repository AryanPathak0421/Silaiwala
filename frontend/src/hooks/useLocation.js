import { useState, useEffect } from 'react';

const useLocation = () => {
    const [location, setLocation] = useState({
        lat: null,
        lng: null,
        error: null,
        isLoading: true
    });

    useEffect(() => {
        if (!navigator.geolocation) {
            setLocation(prev => ({ ...prev, error: 'Geolocation not supported', isLoading: false }));
            return;
        }

        const handleSuccess = (position) => {
            setLocation({
                lat: position.coords.latitude,
                lng: position.coords.longitude,
                error: null,
                isLoading: false
            });
        };

        const handleError = (error) => {
            let errorMsg = 'Failed to get location';
            if (error.code === 1) errorMsg = 'Location permission denied';
            
            setLocation(prev => ({ 
                ...prev, 
                error: errorMsg, 
                isLoading: false 
            }));
        };

        navigator.geolocation.getCurrentPosition(handleSuccess, handleError, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
        });
    }, []);

    return location;
};

export default useLocation;
