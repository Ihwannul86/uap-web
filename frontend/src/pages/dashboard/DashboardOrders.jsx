import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { ordersAPI } from '../../services/api';

const DashboardOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await ordersAPI.getAll();
      setOrders(response.data.data);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  const handleShowDetail = async (order) => {
    try {
      const response = await ordersAPI.getById(order.uuid);
      setSelectedOrder(response.data.data);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal memuat detail pesanan');
    }
  };

  const handleUpdateStatus = async (uuid, newStatus) => {
    try {
      await ordersAPI.update(uuid, { status: newStatus });
      alert('Status pesanan berhasil diupdate!');
      fetchOrders();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal update status');
    }
  };

  const handleDelete = async (uuid, orderNumber) => {
    if (!window.confirm(`Hapus pesanan "${orderNumber}"?`)) return;

    try {
      await ordersAPI.delete(uuid);
      alert('Pesanan berhasil dihapus!');
      fetchOrders();
    } catch (error) {
      console.error('Error:', error);
      alert('Gagal menghapus pesanan');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800',
      processing: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Kelola Pesanan
          </h1>
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            ← Kembali ke Dashboard
          </Link>
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
                    <th className="px-6 py-4 text-left">No. Pesanan</th>
                    <th className="px-6 py-4 text-left">Pelanggan</th>
                    <th className="px-6 py-4 text-left">Telepon</th>
                    <th className="px-6 py-4 text-left">Total</th>
                    <th className="px-6 py-4 text-left">Status</th>
                    <th className="px-6 py-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order.uuid} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4 font-mono text-sm">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 font-semibold">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4">{order.phone}</td>
                      <td className="px-6 py-4 font-semibold text-blue-600">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleShowDetail(order)}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
                          >
                            Detail
                          </button>
                          <button
                            onClick={() => handleDelete(order.uuid, order.order_number)}
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

      {/* Detail Modal */}
      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-6">
                Detail Pesanan
              </h2>

              <div className="space-y-4 mb-6">
                <div>
                  <p className="text-gray-600 text-sm">No. Pesanan</p>
                  <p className="font-mono font-bold">{selectedOrder.order_number}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Pelanggan</p>
                  <p className="font-semibold">{selectedOrder.customer_name}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Telepon</p>
                  <p className="font-semibold">{selectedOrder.phone}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Alamat</p>
                  <p className="font-semibold">{selectedOrder.address}</p>
                </div>

                <div>
                  <p className="text-gray-600 text-sm">Status</p>
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </div>

                <div>
                  <p className="text-gray-600 text-sm mb-2">Item Pesanan</p>
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-2">
                      <p className="font-semibold">{item.product_name}</p>
                      <p className="text-sm text-gray-600">
                        {item.quantity} x Rp {Number(item.price).toLocaleString('id-ID')} =
                        Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 text-sm">Total</p>
                  <p className="text-2xl font-bold text-blue-600">
                    Rp {Number(selectedOrder.total_amount).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 font-semibold mb-2">Update Status:</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.uuid, 'processing')}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Processing
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.uuid, 'completed')}
                    className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                  >
                    Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedOrder.uuid, 'cancelled')}
                    className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Cancelled
                  </button>
                </div>
              </div>

              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gray-300 text-gray-700 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default DashboardOrders;
