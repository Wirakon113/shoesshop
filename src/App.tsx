import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { StoreProvider, useStore } from './context/StoreContext';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { CheckoutModal } from './components/CheckoutModal';
import { ToastContainer } from './components/Toast';
import { ScrollToTop } from './components/ScrollToTop';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetail } from './pages/ProductDetail';
import { CartPage } from './pages/CartPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { OrderHistory } from './pages/OrderHistory';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

function AppShell() {
  const { isCheckoutModalOpen, setIsCheckoutModalOpen } = useStore();

  return (
    <Router>
      <ScrollToTop />
      <div className="flex flex-col min-h-screen bg-white text-black selection:bg-black selection:text-white">
        <Navbar />

        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/orders" element={<OrderHistory />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/add-product" element={<AdminDashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            {/* Fallback route */}
            <Route path="*" element={<Home />} />
          </Routes>
        </main>

        <Footer />

        {/* Global UI Overlays */}
        <CartDrawer />
        <QuickViewModal />
        <CheckoutModal
          isOpen={isCheckoutModalOpen}
          onClose={() => setIsCheckoutModalOpen(false)}
        />
        <ToastContainer />
      </div>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </AuthProvider>
  );
}



