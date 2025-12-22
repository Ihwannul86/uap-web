import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { productsAPI } from '../services/api';

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState({});

  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  const fetchProducts = async (page) => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll(page);
      setProducts(response.data.data);
      setMeta(response.data.meta);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Produk Kami
          </h1>
          <p className="text-xl text-gray-600">
            Pilihan galon air berkualitas untuk kebutuhan Anda
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-8">
              {products.map((product) => (
                <ProductCard key={product.uuid} product={product} />
              ))}
            </div>

            {/* Pagination */}
            {meta.last_page > 1 && (
              <div className="flex justify-center gap-2">
                <button
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                >
                  Previous
                </button>
                <span className="px-4 py-2">
                  Page {currentPage} of {meta.last_page}
                </span>
                <button
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === meta.last_page}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-blue-700 transition"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Products;
