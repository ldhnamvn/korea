
import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (p: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div 
      onClick={() => onClick(product)}
      className="bg-white rounded-sm shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group border border-transparent hover:border-[#ee4d2d] flex flex-col h-full overflow-hidden"
    >
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover"
        />
        {/* Badges */}
        <div className="absolute top-0 left-0">
          <div className="bg-[#ee4d2d] text-white text-[10px] font-bold px-1 py-0.5 rounded-br-sm">
            Yêu thích
          </div>
        </div>
        <div className="absolute top-0 right-0">
          <div className="bg-[#ffd424] text-[#ee4d2d] text-[10px] font-bold p-1 flex flex-col items-center leading-tight">
            <span>15%</span>
            <span className="text-white">GIẢM</span>
          </div>
        </div>
      </div>
      
      <div className="p-2 flex flex-col flex-1">
        <h3 className="text-xs text-gray-800 mb-2 line-clamp-2 leading-relaxed h-8">
          {product.name}
        </h3>
        
        <div className="mt-auto">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[#ee4d2d] text-base font-medium">
              ₫{product.price.toLocaleString('vi-VN')}
            </span>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center text-[10px] text-gray-400">
               <div className="flex text-[#ffce3d] mr-1">
                 <i className="fa-solid fa-star"></i>
               </div>
               <span>Đã bán {product.soldCount || 0}</span>
            </div>
            <span className="text-[10px] text-gray-400">{product.location || 'Hà Nội'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
