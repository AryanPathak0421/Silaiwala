/**
 * Central Theme Configuration
 * This file serves as the Single Source of Truth for brand colors and assets.
 * Use these variables for inline styles, external scripts (e.g., Razorpay), or JS logic.
 */

export const theme = {
    colors: {
        primary: "#FF5C8A",
        primaryLight: "#FF85A2",
        primaryDark: "#cc496e",
        primarySoft: "#fff5f7",
        
        secondary: "#0f172a",
        accent: "#f59e0b",
        success: "#10b981",
        warning: "#facc15",
        error: "#ef4444",

        gray: {
            50: "#f8fafc",
            100: "#f1f5f9",
            200: "#e2e8f0",
            300: "#cbd5e1",
            400: "#94a3b8",
            500: "#64748b",
            600: "#475569",
            700: "#334155",
            800: "#1e293b",
            900: "#0f172a"
        }
    },
    
    gradients: {
        primary: "linear-gradient(135deg, #FF5C8A 0%, #cc496e 100%)",
        dark: "linear-gradient(135deg, #1e293b 0%, #0f172a 100%)",
        glass: "rgba(255, 255, 255, 0.7)"
    },

    shadows: {
        primary: "0 10px 25px -5px rgba(255, 92, 138, 0.25)",
        card: "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)"
    }
};

export default theme;
