import { create } from 'zustand';

const useLocationStore = create((set) => ({
    address: localStorage.getItem('user-location') || 'Srinagar, Kashmir - 190001',
    coordinates: JSON.parse(localStorage.getItem('user-coordinates')) || { lat: 34.0837, lng: 74.7973 }, // Default Srinagar
    
    setLocation: (address, lat, lng) => {
        const coords = { lat, lng };
        localStorage.setItem('user-location', address);
        localStorage.setItem('user-coordinates', JSON.stringify(coords));
        set({ address, coordinates: coords });
    }
}));

export default useLocationStore;
