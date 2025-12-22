import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { productsAPI } from '../../services/api';

const DashboardProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    product_name: '',
    brand: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image_url: '',
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await productsAPI.getAll(1);
      setProducts(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleOpenModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        product_name: product.product_name,
        brand: product.brand,
        category: product.category,
        price: product.price,
        stock: product.stock,
        description: product.description,
        image_url: product.image_url || '',
      });
    } else {
      setEditingProduct(null);
      setFormData({
        product_name: '',
        brand: '',
        category: '',
        price: '',
        stock: '',
        description: '',
        image_url: '',
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingProduct(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingProduct) {
        await productsAPI.update(editingProduct.uuid, formData);
        alert('Produk berhasil diupdate!');
      } else {
        await productsAPI.create(formData);
        alert('Produk berhasil ditambahkan!');
      }

      handleCloseModal();
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || 'Terjadi kesalahan');
    }
  };

  const handleDelete = async (uuid, name) => {
    if (!window.confirm(`Hapus produk "${name}"?`)) return;

    try {
      await productsAPI.delete(uuid);
      alert('Produk berhasil dihapus!');
      fetchProducts();
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menghapus produk');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">
              Kelola Produk
            </h1>
            <Link to="/dashboard" className="text-blue-600 hover:underline">
              ← Kembali ke Dashboard
            </Link>
          </div>
          <button
            onClick={() => handleOpenModal()}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            + Tambah Produk
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-blue-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left">Produk</th>
                    <th className="px-6 py-4 text-left">Brand</th>
                    <th className="px-6 py-4 text-left">Kategori</th>
                    <th className="px-6 py-4 text-left">Harga</th>
                    <th className="px-6 py-4 text-left">Stok</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.uuid} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.image_url || 'https://placehold.co/60x60?text=Product'}
                            alt={product.product_name}
                            className="w-12 h-12 object-cover rounded"
                          />
                          <span className="font-semibold">{product.product_name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">{product.brand}</td>
                      <td className="px-6 py-4">{product.category}</td>
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        Rp {Number(product.price).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={product.stock > 0 ? 'text-green-600' : 'text-red-600'}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleOpenModal(product)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.uuid, product.product_name)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                {editingProduct ? 'Edit Produk' : 'Tambah Produk'}
              </h2>

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Nama Produk *
                    </label>
                    <input
                      type="text"
                      name="product_name"
                      value={formData.product_name}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Brand *
                    </label>
                    <input
                      type="text"
                      name="brand"
                      value={formData.brand}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Kategori *
                    </label>
                    <input
                      type="text"
                      name="category"
                      value={formData.category}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Harga *
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      Stok *
                    </label>
                    <input
                      type="number"
                      name="stock"
                      value={formData.stock}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 font-semibold mb-2">
                      URL Gambar
                    </label>
                    <input
                      type="url"
                      name="image_url"
                      value={formData.image_url}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Deskripsi
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-4 mt-6">
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    {editingProduct ? 'Update' : 'Simpan'}
                  </button>
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                  >
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DashboardProducts;
