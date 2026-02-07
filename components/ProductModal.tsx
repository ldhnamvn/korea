
import React from 'react';
import { Product } from '../types';
// Fix: PAYMENT_METHODS is exported from constants.ts, not types.ts
import { PAYMENT_METHODS } from '../constants';

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose }) => {
  if (!product) return null;

  const handleOrder = (method: string) => {
    alert(`Bạn đã chọn thanh toán qua ${method}. Đơn hàng đang được khởi tạo!`);
    onClose();
  };

  const handleContactZalo = () => {
    if (product.sellerZalo) {
      window.open(`https://zalo.me/${product.sellerZalo}`, '_blank');
    } else {
      alert("Người bán chưa cung cấp số điện thoại Zalo.");
    }
  };

  const handleContactFB = () => {
    if (product.sellerFB) {
      const fbUrl = product.sellerFB.startsWith('http') ? product.sellerFB : `https://${product.sellerFB}`;
      window.open(fbUrl, '_blank');
    } else {
      alert("Người bán chưa cung cấp link Facebook.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl overflow-hidden relative shadow-2xl animate-in slide-in-from-bottom-8 duration-300 flex flex-col md:flex-row">
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center text-gray-800 shadow-md transition-colors"
        >
          <i className="fa-solid fa-xmark text-lg"></i>
        </button>

        {/* Image Section */}
        <div className="md:w-1/2 bg-gray-50">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-contain md:max-h-[600px]"
          />
        </div>

        {/* Content Section */}
        <div className="md:w-1/2 p-6 sm:p-8 overflow-y-auto">
          <div className="mb-6">
            <span className="inline-block bg-blue-100 text-blue-700 text-xs font-bold px-3 py-1 rounded-full mb-3 uppercase tracking-wider">
              {product.category}
            </span>
            <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
              {product.name}
            </h2>
            <p className="text-3xl font-extrabold text-red-600 mb-4">
              {product.price.toLocaleString('vi-VN')} đ
            </p>
            <div className="prose prose-sm text-gray-600 bg-gray-50 p-4 rounded-xl mb-6">
              <p className="leading-relaxed">{product.description}</p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button 
                onClick={handleContactZalo}
                className="flex items-center justify-center gap-2 bg-blue-500 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-600 transition-all shadow-lg active:scale-95"
              >
                <i className="fa-solid fa-comment-dots"></i>
                Zalo người bán
              </button>
              <button 
                onClick={handleContactFB}
                className="flex items-center justify-center gap-2 bg-blue-800 text-white py-3 px-4 rounded-xl font-semibold hover:bg-blue-900 transition-all shadow-lg active:scale-95"
              >
                <i className="fa-brands fa-facebook"></i>
                Messenger
              </button>
            </div>

            <div className="border-t border-gray-100 pt-6">
              <h4 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                <i className="fa-solid fa-credit-card text-blue-600"></i>
                Chọn hình thức mua hàng
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {PAYMENT_METHODS.map(method => (
                  <button
                    key={method.id}
                    onClick={() => handleOrder(method.name)}
                    className="group flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:border-blue-500 hover:bg-blue-50 transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white ${method.color || 'bg-gray-400'}`}>
                        <i className={`fa-solid ${method.icon}`}></i>
                      </div>
                      <span className="font-medium text-gray-700 group-hover:text-blue-700">{method.name}</span>
                    </div>
                    <i className="fa-solid fa-chevron-right text-gray-300 group-hover:text-blue-500"></i>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 p-4 bg-green-50 rounded-xl">
             <i className="fa-solid fa-shield-check text-green-600 text-xl"></i>
             <div>
                <p className="text-sm font-bold text-green-800">Giao dịch an toàn</p>
                <p className="text-xs text-green-700">Thông tin của bạn luôn được bảo mật tuyệt đối 100%.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
