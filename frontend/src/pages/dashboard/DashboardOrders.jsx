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

  // ⭐ UPDATE: Handle status update dengan konfirmasi khusus untuk cancel
  const handleUpdateStatus = async (uuid, newStatus) => {
    const confirmMessage =
      newStatus === 'cancelled'
        ? '⚠️ Yakin membatalkan pesanan ini? Stok produk akan dikembalikan!'
        : `Update status pesanan ke "${getStatusLabel(newStatus)}"?`;

    if (!window.confirm(confirmMessage)) return;

    try {
      await ordersAPI.update(uuid, { status: newStatus });
      alert(`✅ Status berhasil diupdate ke "${getStatusLabel(newStatus)}"!`);
      fetchOrders();
      setShowDetailModal(false);
    } catch (error) {
      console.error('Error:', error);
      alert(error.response?.data?.message || '❌ Gagal update status');
    }
  };

  const handleDelete = async (uuid, orderNumber) => {
    if (!window.confirm(`⚠️ Hapus pesanan "${orderNumber}"?\n\n⚡ Stok produk akan dikembalikan!`)) return;

    try {
      await ordersAPI.delete(uuid);
      alert('✅ Pesanan berhasil dihapus dan stok dikembalikan!');
      fetchOrders();
    } catch (error) {
      console.error('Error:', error);
      alert('❌ Gagal menghapus pesanan');
    }
  };

  // ⭐ NEW: Get status badge with colors
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: 'bg-yellow-100 text-yellow-800 border border-yellow-300',
      processing: 'bg-blue-100 text-blue-800 border border-blue-300',
      completed: 'bg-green-100 text-green-800 border border-green-300',
      cancelled: 'bg-red-100 text-red-800 border border-red-300',
    };

    return statusConfig[status] || 'bg-gray-100 text-gray-800 border border-gray-300';
  };

  
  const getStatusLabel = (status) => {
    const labels = {
      pending: '⏳ Pending',
      processing: '🔄 Processing',
      completed: '✅ Completed',
      cancelled: '❌ Cancelled',
    };
    return labels[status] || status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📦 Kelola Pesanan
          </h1>
          <Link to="/dashboard" className="text-blue-600 hover:underline">
            ← Kembali ke Dashboard
          </Link>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <p className="text-gray-500 text-lg">📭 Belum ada pesanan</p>
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
                    <tr key={order.uuid} className="border-b hover:bg-gray-50 transition">
                      <td className="px-6 py-4 font-mono text-sm font-semibold text-gray-700">
                        {order.order_number}
                      </td>
                      <td className="px-6 py-4 font-semibold text-gray-800">
                        {order.customer_name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{order.phone}</td>
                      <td className="px-6 py-4 font-bold text-blue-600">
                        Rp {Number(order.total_amount).toLocaleString('id-ID')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(order.status)}`}>
                          {getStatusLabel(order.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() => handleShowDetail(order)}
                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition font-semibold text-sm"
                          >
                            📄 Detail
                          </button>
                          <button
                            onClick={() => handleDelete(order.uuid, order.order_number)}
                            className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition font-semibold text-sm"
                          >
                            🗑️ Hapus
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


      {showDetailModal && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-6 border-b pb-4">
                <h2 className="text-3xl font-bold text-gray-800">
                  📦 Detail Pesanan
                </h2>
                <span className={`px-4 py-2 rounded-full text-sm font-bold ${getStatusBadge(selectedOrder.status)}`}>
                  {getStatusLabel(selectedOrder.status)}
                </span>
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">No. Pesanan</p>
                  <p className="font-mono font-bold text-lg">{selectedOrder.order_number}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">Nama Pelanggan</p>
                  <p className="font-bold text-lg">{selectedOrder.customer_name}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">📞 Telepon</p>
                  <p className="font-semibold text-lg">{selectedOrder.phone}</p>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-600 text-sm mb-1">📅 Tanggal</p>
                  <p className="font-semibold text-lg">
                    {new Date(selectedOrder.created_at).toLocaleDateString('id-ID', {
                      day: '2-digit',
                      month: 'long',
                      year: 'numeric'
                    })}
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6">
                <p className="text-gray-600 text-sm mb-1">📍 Alamat Pengiriman</p>
                <p className="font-semibold text-gray-800">{selectedOrder.address}</p>
              </div>

              {/* Items List */}
              <div className="mb-6">
                <p className="text-gray-700 font-bold text-lg mb-3">🛒 Item Pesanan:</p>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item, idx) => (
                    <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-lg border border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-bold text-gray-800 text-lg">{item.product_name}</p>
                          <p className="text-sm text-gray-600 mt-1">
                            {item.quantity} unit × Rp {Number(item.price).toLocaleString('id-ID')}
                          </p>
                        </div>
                        <p className="font-bold text-blue-600 text-lg">
                          Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-500 p-5 rounded-lg mb-6">
                <div className="flex justify-between items-center text-white">
                  <p className="text-xl font-bold">💰 Total Pembayaran</p>
                  <p className="text-3xl font-bold">
                    Rp {Number(selectedOrder.total_amount).toLocaleString('id-ID')}
                  </p>
                </div>
              </div>

              {/* ⭐ UPDATE STATUS BUTTONS - DYNAMIC */}
              <div className="mb-6 bg-gray-50 p-6 rounded-lg">
                <p className="text-gray-800 font-bold text-lg mb-4">🔄 Update Status Pesanan:</p>
                <div className="grid grid-cols-2 gap-3">
                  {selectedOrder.status !== 'pending' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.uuid, 'pending')}
                      className="px-5 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-bold text-sm shadow-md hover:shadow-lg"
                    >
                      ⏳ Set Pending
                    </button>
                  )}
                  {selectedOrder.status !== 'processing' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.uuid, 'processing')}
                      className="px-5 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition font-bold text-sm shadow-md hover:shadow-lg"
                    >
                      🔄 Set Processing
                    </button>
                  )}
                  {selectedOrder.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.uuid, 'completed')}
                      className="px-5 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-bold text-sm shadow-md hover:shadow-lg"
                    >
                      ✅ Set Completed
                    </button>
                  )}
                  {selectedOrder.status !== 'cancelled' && (
                    <button
                      onClick={() => handleUpdateStatus(selectedOrder.uuid, 'cancelled')}
                      className="px-5 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-bold text-sm shadow-md hover:shadow-lg"
                    >
                      ❌ Cancel Order
                    </button>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-4 bg-yellow-50 p-3 rounded border border-yellow-200">
                  💡 <strong>Catatan:</strong> Jika pesanan dibatalkan (cancelled), stok produk akan otomatis dikembalikan ke inventory.
                </p>
              </div>

              {/* Close Button */}
              <button
                onClick={() => setShowDetailModal(false)}
                className="w-full bg-gray-300 text-gray-800 py-4 rounded-lg font-bold text-lg hover:bg-gray-400 transition shadow-md hover:shadow-lg"
              >
                ✖️ Tutup
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
