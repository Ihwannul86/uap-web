import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-12 mt-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4">
              Gale<span className="text-yellow-300">X</span>
            </h3>
            <p className="text-gray-400">
              Mitra tepercaya Anda untuk air minum bersih dan aman yang diantarkan langsung ke pintu rumah Anda.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Tautan Cepat</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-yellow-300 transition">
                  Beranda
                </Link>
              </li>
              <li>
                <Link to="/products" className="text-gray-400 hover:text-yellow-300 transition">
                  Produk
                </Link>
              </li>
              <li>
                <Link to="/login" className="text-gray-400 hover:text-yellow-300 transition">
                  Masuk
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Kontak</h4>
            <ul className="space-y-2 text-gray-400">
              <li>📧 info@galex.com</li>
              <li>📞 +62 812-3456-7890</li>
              <li>📍 Jakarta, Indonesia</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; 2025 GaleX - Galon Express. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
