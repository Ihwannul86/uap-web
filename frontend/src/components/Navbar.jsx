import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className="bg-gradient-to-r from-blue-600 to-blue-800 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-3xl font-bold text-white">
              Gale<span className="text-yellow-300">X</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-white hover:text-yellow-300 transition duration-300 font-medium"
            >
              Beranda
            </Link>
            <Link
              to="/products"
              className="text-white hover:text-yellow-300 transition duration-300 font-medium"
            >
              Produk
            </Link>

            {isAuthenticated ? (
              <>
                <Link
                  to="/dashboard"
                  className="text-white hover:text-yellow-300 transition duration-300 font-medium"
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-4">
                  <span className="text-white">Halo, {user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="bg-red-500 text-white px-6 py-2 rounded-full hover:bg-red-600 transition duration-300 font-medium"
                  >
                    Keluar
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-white hover:text-yellow-300 transition duration-300 font-medium"
                >
                  Masuk
                </Link>
                <Link
                  to="/register"
                  className="bg-yellow-400 text-blue-900 px-6 py-2 rounded-full hover:bg-yellow-300 transition duration-300 font-bold shadow-md"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4">
            <Link to="/" className="block text-white hover:text-yellow-300 py-2">
              Beranda
            </Link>
            <Link to="/products" className="block text-white hover:text-yellow-300 py-2">
              Produk
            </Link>
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block text-white hover:text-yellow-300 py-2">
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-white hover:text-yellow-300 py-2"
                >
                  Keluar
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="block text-white hover:text-yellow-300 py-2">
                  Masuk
                </Link>
                <Link to="/register" className="block text-white hover:text-yellow-300 py-2">
                  Daftar
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
