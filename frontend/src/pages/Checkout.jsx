import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ordersAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Checkout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [formData, setFormData] = useState({
    customer_name: user?.name || '',
    phone: '',
    address: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const checkoutProduct = localStorage.getItem('checkout_product');
    if (!checkoutProduct) {
      navigate('/products');
      return;
    }
    setProduct(JSON.parse(checkoutProduct));
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const orderData = {
        customer_name: formData.customer_name,
        phone: formData.phone,
        address: formData.address,
        items: [
          {
            product_uuid: product.uuid,
            quantity: product.quantity,
          },
        ],
      };

      const response = await ordersAPI.create(orderData);

      // Hapus checkout product dari localStorage
      localStorage.removeItem('checkout_product');

      // Redirect ke dashboard orders
      alert('Pesanan berhasil dibuat!');
      navigate('/dashboard/orders');
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  if (!product) {
    return null;
  }

  const totalPrice = product.price * product.quantity;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          Checkout Pesanan
        </h1>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Order Summary */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Ringkasan Pesanan
              </h2>

              <div className="flex gap-4 mb-6">
                <img
                  src={product.image_url || 'https://placehold.co/100x100?text=Product'}
                  alt={product.product_name}
                  className="w-20 h-20 object-cover rounded-lg"
                />
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">{product.product_name}</h3>
                  <p className="text-sm text-gray-600">{product.brand}</p>
                  <p className="text-blue-600 font-semibold">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Jumlah:</span>
                  <span className="font-semibold">{product.quantity} unit</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Harga Satuan:</span>
                  <span className="font-semibold">
                    Rp {Number(product.price).toLocaleString('id-ID')}
                  </span>
                </div>
                <div className="flex justify-between text-xl font-bold text-blue-600 mt-4 pt-4 border-t">
                  <span>Total:</span>
                  <span>Rp {totalPrice.toLocaleString('id-ID')}</span>
                </div>
              </div>
            </div>

            {/* Customer Form */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Informasi Pengiriman
              </h2>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    name="customer_name"
                    value={formData.customer_name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Nomor Telepon
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Alamat Lengkap
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Alamat lengkap untuk pengiriman"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
                >
                  {loading ? 'Memproses...' : 'Buat Pesanan'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Checkout;
