import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// Layouts
import AuthLayout from './layouts/AuthLayout';
import TailorLayout from './layouts/TailorLayout';
import AdminLayout from './layouts/AdminLayout';

// Auth Pages
import Login from './modules/auth/pages/Login';
import Signup from './modules/auth/pages/Signup';

// Tailor Module Pages
import TailorLogin from './modules/tailor/pages/Login';
import TailorRegistration from './modules/tailor/pages/Registration';
import { UnderReview, RejectedPage } from './modules/tailor/pages/StatusPages';
import TailorProtectedRoute from './modules/tailor/components/ProtectedRoute';
import { TAILOR_STATUS } from './modules/tailor/context/AuthContext';
import TailorOverview from './modules/tailor/pages/Overview';
import TailorOrders from './modules/tailor/pages/Orders';
import TailorProducts from './modules/tailor/pages/Products';
import DeliveryDetails from './modules/tailor/pages/DeliveryDetails';
import VerificationStatus from './modules/tailor/pages/VerificationStatus';
import SubscriptionSettings from './modules/tailor/pages/Subscription';
import ProfileSettings from './modules/tailor/pages/ProfileSettings';
import TailorWithdraw from './modules/tailor/pages/Withdraw';
import TailorNotifications from './modules/tailor/pages/Notifications';

// Customer Pages
import CustomerHome from './modules/customer/pages/Home';
import ServicesPage from './modules/customer/pages/Services';
import ServiceDetailPage from './modules/customer/pages/ServiceDetail';
import StorePage from './modules/customer/pages/Store'; // NEW
import StoreProductDetail from './modules/customer/pages/StoreProductDetail'; // NEW
import OrdersPage from './modules/customer/pages/Orders'; // NEW
import ProfilePage from './modules/customer/pages/Profile'; // NEW
import EditProfile from './modules/customer/pages/EditProfile'; // NEW
import CheckoutAddress from './modules/customer/pages/CheckoutAddress'; // NEW
import CheckoutSummary from './modules/customer/pages/CheckoutSummary'; // NEW
import OrderSuccess from './modules/customer/pages/OrderSuccess'; // NEW
import OrderTracking from './modules/customer/pages/OrderTracking'; // NEW
import CartPage from './modules/customer/pages/Cart'; // NEW
import WishlistPage from './modules/customer/pages/Wishlist'; // NEW
import TailorProfile from './modules/customer/pages/TailorProfile'; // NEW
import TailorListing from './modules/customer/pages/TailorListing'; // NEW
import TailorSelection from './modules/customer/pages/TailorSelection'; // NEW

// Tailor Pages
import TailorDashboard from './modules/tailor/pages/Dashboard';

// Delivery Pages
import DeliveryDashboard from './modules/delivery/pages/Dashboard';

// Admin Pages
import AdminDashboard from './modules/admin/pages/Dashboard';

import ReferEarn from './modules/customer/pages/ReferEarn'; // NEW
import FabricDetail from './modules/customer/pages/FabricDetail'; // NEW

const AppRoutes = () => {
    return (
        <Routes>
            {/* ... Auth Routes ... */}
            <Route element={<AuthLayout />}>
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
            </Route>

            {/* Customer Routes */}
            <Route path="/" element={<Navigate to="/tailor/login" replace />} />
            <Route path="/services" element={<ServicesPage />} />
            <Route path="/services/:id" element={<ServiceDetailPage />} />

            {/* New Store & Nav Routes */}
            <Route path="/store" element={<StorePage />} />
            <Route path="/store/product/:id" element={<StoreProductDetail />} />
            <Route path="/fabric/:id" element={<FabricDetail />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/refer" element={<ReferEarn />} />
            <Route path="/tailor/:id" element={<TailorProfile />} />
            <Route path="/tailors" element={<TailorListing />} />

            {/* Checkout Flow */}
            <Route path="/checkout/tailor" element={<TailorSelection />} />
            <Route path="/checkout/address" element={<CheckoutAddress />} />
            <Route path="/checkout/summary" element={<CheckoutSummary />} />
            <Route path="/checkout/success" element={<OrderSuccess />} />
            <Route path="/orders/:id/track" element={<OrderTracking />} />

            <Route path="/cart" element={<CartPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />

            {/* Tailor Public Routes */}
            <Route path="/tailor/login" element={<TailorLogin />} />
            <Route path="/tailor/register" element={<TailorRegistration />} />
            <Route path="/tailor/under-review" element={<UnderReview />} />
            <Route path="/tailor/rejected" element={<RejectedPage />} />

            {/* Tailor Protected Routes */}
            <Route element={<TailorProtectedRoute requiredStatus={[TAILOR_STATUS.APPROVED]} />}>
                <Route element={<TailorLayout />}>
                    <Route path="/tailor" element={<TailorOverview />} />
                    <Route path="/tailor/orders" element={<TailorOrders />} />
                    <Route path="/tailor/portfolio" element={<TailorProducts />} />
                    <Route path="/tailor/earnings" element={<TailorOverview />} />
                    <Route path="/tailor/products" element={<TailorProducts />} />
                    <Route path="/tailor/delivery" element={<DeliveryDetails />} />
                    <Route path="/tailor/verification" element={<VerificationStatus />} />
                    <Route path="/tailor/subscription" element={<SubscriptionSettings />} />
                    <Route path="/tailor/settings" element={<ProfileSettings />} />
                </Route>
                {/* Full screen tailor views separated from layout nav */}
                <Route path="/tailor/withdraw" element={<TailorWithdraw />} />
                <Route path="/tailor/notifications" element={<TailorNotifications />} />
            </Route>

            {/* Delivery Routes */}
            <Route path="/delivery" element={<DeliveryDashboard />} />

            {/* Admin Module */}
            <Route element={<AdminLayout />}>
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/orders" element={<AdminDashboard />} />
                <Route path="/admin/tailors" element={<AdminDashboard />} />
                <Route path="/admin/delivery" element={<AdminDashboard />} />
                <Route path="/admin/customers" element={<AdminDashboard />} />
                <Route path="/admin/services" element={<AdminDashboard />} />
                <Route path="/admin/reports" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
