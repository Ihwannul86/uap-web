import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await productsAPI.getAll(1);
      // Ambil 3 produk pertama untuk ditampilkan di home
      setProducts(response.data.data.slice(0, 3));
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Selamat Datang di <span className="text-blue-600">GaleX</span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8">
            Mitra tepercaya Anda untuk air minum bersih dan aman yang diantarkan
            langsung ke pintu rumah Anda
          </p>
          <p className="text-lg text-gray-700 mb-8 leading-relaxed">
            <strong>GaleX (Galon Express)</strong> adalah layanan pengiriman air minum premium yang
            berkomitmen untuk menyediakan air minum berkualitas tertinggi untuk
            kehidupan kost Anda ✌
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/products"
              className="bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition duration-300 shadow-lg"
            >
              Lihat Produk
            </Link>
            <Link
              to="/register"
              className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-full text-lg font-bold hover:bg-yellow-300 transition duration-300 shadow-lg"
            >
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-gray-800">
          Mengapa Memilih GaleX?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="text-6xl mb-6">🚚</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Pengiriman Cepat</h3>
            <p className="text-gray-600">Pengiriman pada hari yang sama tersedia</p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="text-6xl mb-6">💧</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Air Berkualitas</h3>
            <p className="text-gray-600">Air yang telah disaring tiga kali</p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="text-6xl mb-6">🌱</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Ramah Lingkungan</h3>
            <p className="text-gray-600">Material ramah lingkungan</p>
          </div>

          {/* Feature 4 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="text-6xl mb-6">📦</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Paket Fleksibel</h3>
            <p className="text-gray-600">Paket bulanan fleksibel</p>
          </div>

          {/* Feature 5 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="text-6xl mb-6">🏢</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Solusi Bisnis</h3>
            <p className="text-gray-600">Solusi untuk kantor & organisasi</p>
          </div>

          {/* Feature 6 */}
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl transition duration-300 text-center">
            <div className="text-6xl mb-6">💬</div>
            <h3 className="text-2xl font-bold mb-4 text-gray-800">Layanan 24/7</h3>
            <p className="text-gray-600">Layanan pelanggan setiap hari</p>
          </div>
        </div>
      </section>

      {/* Products Preview Section */}
      <section className="container mx-auto px-4 py-16 bg-white">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Produk Premium Kami
          </h2>
          <p className="text-gray-600 text-lg">
            Temukan berbagai pilihan galon air berkualitas tinggi
          </p>
        </div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 mx-auto"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              {products.map((product) => (
                <ProductCard key={product.uuid} product={product} />
              ))}
            </div>
            <div className="text-center">
              <Link
                to="/products"
                className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full text-lg font-bold hover:bg-blue-700 transition duration-300 shadow-lg"
              >
                Lihat Semua Produk →
              </Link>
            </div>
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Siap untuk Air Minum Berkualitas?
          </h2>
          <p className="text-xl text-white mb-8 max-w-2xl mx-auto">
            Bergabunglah dengan ribuan pelanggan yang sudah mempercayai GaleX untuk kebutuhan air minum mereka
          </p>
          <Link
            to="/register"
            className="inline-block bg-yellow-400 text-blue-900 px-10 py-4 rounded-full text-xl font-bold hover:bg-yellow-300 transition duration-300 shadow-lg"
          >
            Mulai Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
