import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useAuth } from '../../context/AuthContext';
import { productsAPI, ordersAPI } from '../../services/api';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        productsAPI.getAll(1),
        ordersAPI.getAll(),
      ]);

      setStats({
        totalProducts: productsRes.data.meta?.total || 0,
        totalOrders: ordersRes.data.data?.length || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Dashboard
          </h1>
          <p className="text-xl text-gray-600">
            Selamat datang, <span className="font-semibold text-blue-600">{user?.name}</span>!
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 mb-2">Total Produk</p>
                <p className="text-5xl font-bold">
                  {loading ? '...' : stats.totalProducts}
                </p>
              </div>
              <div className="text-6xl opacity-50">📦</div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-500 to-green-700 rounded-xl shadow-lg p-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 mb-2">Total Pesanan</p>
                <p className="text-5xl font-bold">
                  {loading ? '...' : stats.totalOrders}
                </p>
              </div>
              <div className="text-6xl opacity-50">🛒</div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Aksi Cepat
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              to="/dashboard/products"
              className="bg-blue-50 hover:bg-blue-100 border-2 border-blue-200 rounded-xl p-6 transition duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">📦</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Kelola Produk
                  </h3>
                  <p className="text-gray-600">
                    Tambah, edit, atau hapus produk
                  </p>
                </div>
              </div>
            </Link>

            <Link
              to="/dashboard/orders"
              className="bg-green-50 hover:bg-green-100 border-2 border-green-200 rounded-xl p-6 transition duration-300"
            >
              <div className="flex items-center gap-4">
                <div className="text-4xl">🛒</div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-1">
                    Kelola Pesanan
                  </h3>
                  <p className="text-gray-600">
                    Lihat dan kelola pesanan
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Dashboard;
