import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setLoading(true);

    // Validasi password
    if (formData.password !== formData.password_confirmation) {
      setErrors({ password_confirmation: ['Password tidak cocok'] });
      setLoading(false);
      return;
    }

    const result = await register(formData.name, formData.email, formData.password);

    if (result.success) {
      navigate('/dashboard');
    } else {
      setErrors(result.errors || { general: [result.message] });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar />

      <section className="container mx-auto px-4 py-20">
        <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Daftar ke GaleX
          </h1>

          {errors.general && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
              {errors.general[0]}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Nama Lengkap
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Nama Anda"
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name[0]}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="email@example.com"
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Minimal 8 karakter"
                required
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>
              )}
            </div>

            <div className="mb-6">
              <label className="block text-gray-700 font-semibold mb-2">
                Konfirmasi Password
              </label>
              <input
                type="password"
                name="password_confirmation"
                value={formData.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ulangi password"
                required
              />
              {errors.password_confirmation && (
                <p className="text-red-500 text-sm mt-1">{errors.password_confirmation[0]}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold hover:bg-blue-700 transition duration-300 disabled:bg-gray-400"
            >
              {loading ? 'Memproses...' : 'Daftar'}
            </button>
          </form>

          <p className="text-center text-gray-600 mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-blue-600 font-semibold hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Register;
