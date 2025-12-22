import React from 'react';
import { Link } from 'react-router-dom';

const ProductCard = ({ product }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg hover:shadow-2xl transition duration-300 overflow-hidden">
      <img
        src={product.image_url || 'https://placehold.co/400x300?text=Product'}
        alt={product.product_name}
        className="w-full h-56 object-cover"
      />
      <div className="p-6">
        <p className="text-sm text-blue-600 font-semibold mb-2">{product.brand}</p>
        <h3 className="text-xl font-bold mb-2 line-clamp-2 text-gray-800">
          {product.product_name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Kategori: {product.category}
        </p>
        <p className="text-sm mb-4">
          Stok: <span className={product.stock > 0 ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
            {product.stock} unit
          </span>
        </p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">
            Rp {Number(product.price).toLocaleString('id-ID')}
          </span>
          <Link
            to={`/products/${product.uuid}`}
            className="bg-blue-600 text-white px-5 py-2 rounded-full hover:bg-blue-700 transition duration-300 font-medium"
          >
            Detail
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
