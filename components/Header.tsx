
import React from 'react';
import { User } from '../types';

interface HeaderProps {
  user: User | null;
  onLogin: () => void;
  onLogout: () => void;
  onPostProduct: () => void;
  searchTerm: string;
  setSearchTerm: (val: string) => void;
}

const Header: React.FC<HeaderProps> = ({ user, onLogin, onLogout, onPostProduct, searchTerm, setSearchTerm }) => {
  return (
    <header className="sticky top-0 z-50 bg-[#ee4d2d] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        {/* Top Mini Nav */}
        <div className="flex justify-between items-center py-1 text-xs border-b border-white/10 mb-2">
          <div className="flex gap-4">
            <span className="hover:text-white/80 cursor-pointer">Kênh Người Bán</span>
            <span className="hover:text-white/80 cursor-pointer">Tải ứng dụng</span>
            <span className="hover:text-white/80 cursor-pointer">Kết nối <i className="fa-brands fa-facebook mx-1"></i><i className="fa-brands fa-instagram"></i></span>
          </div>
          <div className="flex gap-4 items-center">
            <span className="hover:text-white/80 cursor-pointer"><i className="fa-regular fa-bell mr-1"></i> Thông báo</span>
            <span className="hover:text-white/80 cursor-pointer"><i className="fa-regular fa-circle-question mr-1"></i> Hỗ trợ</span>
            {user ? (
              <div className="flex items-center gap-2 group relative cursor-pointer">
                <img src={user.avatar} className="w-5 h-5 rounded-full" alt="" />
                <span>{user.name}</span>
                <div className="absolute right-0 top-full mt-2 w-40 bg-white text-gray-800 rounded-sm shadow-xl hidden group-hover:block overflow-hidden">
                   <button onClick={onLogout} className="w-full text-left p-3 hover:bg-gray-100 text-sm">Đăng xuất</button>
                </div>
              </div>
            ) : (
              <span onClick={onLogin} className="font-bold cursor-pointer">Đăng Ký | Đăng Nhập</span>
            )}
          </div>
        </div>

        {/* Main Header */}
        <div className="h-16 flex items-center gap-8 pb-2">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer min-w-max" onClick={() => window.location.hash = '#'}>
            <i className="fa-solid fa-bag-shopping text-4xl"></i>
            <span className="text-2xl font-bold tracking-tighter">Shopee Việt</span>
          </div>

          {/* Search Box */}
          <div className="flex-1 relative">
            <div className="bg-white rounded-sm p-1 flex shadow-sm">
              <input
                type="text"
                placeholder="Đăng ký và nhận voucher bạn mới ngay!"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 text-gray-800 outline-none text-sm"
              />
              <button className="bg-[#ee4d2d] px-6 py-2 rounded-sm hover:opacity-90 transition-opacity">
                <i className="fa-solid fa-magnifying-glass text-white"></i>
              </button>
            </div>
            {/* Search Suggestions */}
            <div className="flex gap-3 mt-1 text-xs opacity-90 overflow-hidden whitespace-nowrap">
              <span>Voucher 50k</span>
              <span>Điện thoại giá rẻ</span>
              <span>Áo thun nam</span>
              <span>Đồ gia dụng</span>
            </div>
          </div>

          {/* Cart & Actions */}
          <div className="flex items-center gap-6">
            <div className="relative cursor-pointer group">
              <i className="fa-solid fa-cart-shopping text-2xl"></i>
              <span className="absolute -top-2 -right-3 bg-white text-[#ee4d2d] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-[#ee4d2d]">3</span>
            </div>
            <button
              onClick={onPostProduct}
              className="bg-white/20 hover:bg-white/30 border border-white/50 px-4 py-2 rounded-sm text-sm font-medium transition-colors"
            >
              Đăng bán
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
