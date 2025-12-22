import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Checkout from './pages/Checkout';
import Dashboard from './pages/dashboard/Dashboard';
import DashboardProducts from './pages/dashboard/DashboardProducts';
import DashboardOrders from './pages/dashboard/DashboardOrders';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:uuid" element={<ProductDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <Checkout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/products"
            element={
              <ProtectedRoute>
                <DashboardProducts />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/orders"
            element={
              <ProtectedRoute>
                <DashboardOrders />
              </ProtectedRoute>
            }
          />

          {/* 404 Page */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
                <div className="text-center">
                  <h1 className="text-6xl font-bold text-gray-800 mb-4">404</h1>
                  <p className="text-xl text-gray-600 mb-8">Halaman tidak ditemukan</p>
                  <a href="/" className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition">
                    Kembali ke Beranda
                  </a>
                </div>
              </div>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
