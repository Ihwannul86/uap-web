import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { productsAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const ProductDetail = () => {
  const { uuid } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    fetchProduct();
  }, [uuid]);

  const fetchProduct = async () => {
    try {
      const response = await productsAPI.getById(uuid);
      setProduct(response.data.data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleOrder = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    // Simpan ke localStorage untuk checkout
    localStorage.setItem('checkout_product', JSON.stringify({ ...product, quantity }));
    navigate('/checkout');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="flex justify-center items-center min-h-[600px]">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
        <Navbar />
        <div className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Produk tidak ditemukan</h1>
          <Link to="/products" className="text-blue-600 hover:underline">
            Kembali ke Produk
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <Link to="/products" className="text-blue-600 hover:underline mb-6 inline-block">
          ← Kembali ke Produk
        </Link>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-8">
            {/* Image */}
            <div>
              <img
                src={product.image_url || 'https://placehold.co/600x600?text=Product'}
                alt={product.product_name}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Details */}
            <div>
              <p className="text-sm text-blue-600 font-semibold mb-2">{product.brand}</p>
              <h1 className="text-4xl font-bold text-gray-800 mb-4">
                {product.product_name}
              </h1>
              <p className="text-gray-600 mb-4">
                Kategori: <span className="font-semibold">{product.category}</span>
              </p>
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Stok Tersedia:</p>
                <p className={`text-2xl font-bold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock} unit
                </p>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Harga:</p>
                <p className="text-4xl font-bold text-blue-600">
                  Rp {Number(product.price).toLocaleString('id-ID')}
                </p>
              </div>

              {/* Quantity */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-2">Jumlah:</p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="text-2xl font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
                    disabled={quantity >= product.stock}
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Order Button */}
              <button
                onClick={handleOrder}
                disabled={product.stock === 0}
                className="w-full bg-blue-600 text-white px-8 py-4 rounded-full text-lg font-bold hover:bg-blue-700 transition duration-300 disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {product.stock === 0 ? 'Stok Habis' : 'Pesan Sekarang'}
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductDetail;
