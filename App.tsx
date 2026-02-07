
import React, { useState, useEffect, useMemo } from 'react';
import { Category, Product, User } from './types';
import { INITIAL_PRODUCTS } from './constants';
import Header from './components/Header';
import CategoryBar from './components/CategoryBar';
import ProductCard from './components/ProductCard';
import ProductModal from './components/ProductModal';
import PostProductModal from './components/PostProductModal';
import { fetchProductsFromSheet } from './services/sheetService';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>(Category.TAT_CA);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewingProduct, setViewingProduct] = useState<Product | null>(null);
  const [isPosting, setIsPosting] = useState(false);

  // Sync data from Google Sheets and LocalStorage
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // 1. Lấy từ Sheet
      const sheetProducts = await fetchProductsFromSheet();
      
      // 2. Lấy từ LocalStorage (các tin người dùng tự đăng tại chỗ)
      const localData = localStorage.getItem('viet_market_products');
      const localProducts = localData ? JSON.parse(localData) : [];
      
      // 3. Kết hợp và ưu tiên Sheet
      if (sheetProducts.length > 0) {
        setProducts([...localProducts, ...sheetProducts]);
      } else {
        setProducts([...localProducts, ...INITIAL_PRODUCTS]);
      }
      
      setIsLoading(false);
    };

    loadData();

    const savedUser = localStorage.getItem('viet_market_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      const matchesCat = selectedCategory === Category.TAT_CA || p.category === selectedCategory;
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    }).sort((a, b) => b.createdAt - a.createdAt);
  }, [products, selectedCategory, searchTerm]);

  const handleLogin = () => {
    const mockUser: User = {
      id: 'user-' + Date.now(),
      name: 'Khách hàng Shopee',
      email: 'user@gmail.com',
      avatar: 'https://i.pravatar.cc/150?u=shopee',
      isSeller: true
    };
    setUser(mockUser);
    localStorage.setItem('viet_market_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('viet_market_user');
  };

  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    const localOnly = updated.filter(p => !p.id.startsWith('sheet-'));
    localStorage.setItem('viet_market_products', JSON.stringify(localOnly));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans">
      <Header 
        user={user} 
        onLogin={handleLogin} 
        onLogout={handleLogout}
        onPostProduct={() => setIsPosting(true)}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      
      <CategoryBar 
        selected={selectedCategory} 
        onSelect={setSelectedCategory} 
      />

      <main className="flex-1 max-w-7xl mx-auto px-4 py-6 w-full">
        {/* Simple Flash Sale Banner Area */}
        <div className="bg-white rounded-sm p-4 mb-6 flex items-center justify-between border-b-2 border-[#ee4d2d]">
           <div className="flex items-center gap-4">
              <h2 className="text-[#ee4d2d] text-xl font-bold italic tracking-tighter uppercase">Flash Sale</h2>
              <div className="flex gap-1">
                 <span className="bg-black text-white px-1.5 py-0.5 rounded-sm text-sm font-bold">02</span>
                 <span className="font-bold">:</span>
                 <span className="bg-black text-white px-1.5 py-0.5 rounded-sm text-sm font-bold">45</span>
                 <span className="font-bold">:</span>
                 <span className="bg-black text-white px-1.5 py-0.5 rounded-sm text-sm font-bold">12</span>
              </div>
           </div>
           <button className="text-gray-500 text-sm hover:text-[#ee4d2d]">Xem tất cả <i className="fa-solid fa-chevron-right ml-1"></i></button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20">
             <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#ee4d2d]"></div>
             <p className="mt-4 text-gray-500">Đang đồng bộ dữ liệu từ Google Sheets...</p>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={setViewingProduct} 
              />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center bg-white rounded-sm border border-gray-100">
            <i className="fa-solid fa-magnifying-glass text-4xl text-gray-200 mb-4"></i>
            <h3 className="text-lg font-medium text-gray-800">Không tìm thấy sản phẩm</h3>
            <p className="text-gray-400">Thử tìm kiếm với từ khóa khác nhé!</p>
          </div>
        )}

        <div className="mt-10 text-center">
           <button className="bg-white border border-gray-200 px-12 py-3 text-sm hover:bg-gray-50 transition-colors shadow-sm">
             Xem thêm
           </button>
        </div>
      </main>

      <footer className="bg-white mt-10 pt-10 border-t-4 border-[#ee4d2d]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 pb-10">
          <div>
            <h4 className="font-bold text-xs text-gray-800 mb-4 uppercase">Chăm sóc khách hàng</h4>
            <ul className="space-y-2 text-[11px] text-gray-500">
              <li>Trung Tâm Trợ Giúp</li>
              <li>Shopee Blog</li>
              <li>Shopee Mall</li>
              <li>Hướng Dẫn Mua Hàng</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-800 mb-4 uppercase">Về Shopee Việt</h4>
            <ul className="space-y-2 text-[11px] text-gray-500">
              <li>Giới Thiệu</li>
              <li>Tuyển Dụng</li>
              <li>Điều Khoản</li>
              <li>Chính Sách Bảo Mật</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-800 mb-4 uppercase">Thanh toán</h4>
            <div className="flex flex-wrap gap-2">
               <div className="bg-white p-1 shadow-sm border rounded-sm w-10 h-6 flex items-center justify-center text-[8px] font-bold">VISA</div>
               <div className="bg-white p-1 shadow-sm border rounded-sm w-10 h-6 flex items-center justify-center text-[8px] font-bold">MOMO</div>
               <div className="bg-white p-1 shadow-sm border rounded-sm w-10 h-6 flex items-center justify-center text-[8px] font-bold">COD</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-800 mb-4 uppercase">Theo dõi chúng tôi</h4>
            <ul className="space-y-2 text-[11px] text-gray-500">
              <li><i className="fa-brands fa-facebook mr-2 text-blue-600"></i> Facebook</li>
              <li><i className="fa-brands fa-instagram mr-2 text-pink-500"></i> Instagram</li>
              <li><i className="fa-brands fa-linkedin mr-2 text-blue-800"></i> LinkedIn</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-xs text-gray-800 mb-4 uppercase">Tải ứng dụng</h4>
            <div className="flex gap-2">
               <div className="bg-gray-100 w-16 h-16 rounded-sm"></div>
               <div className="flex flex-col gap-2">
                  <div className="bg-gray-100 w-20 h-7 rounded-sm"></div>
                  <div className="bg-gray-100 w-20 h-7 rounded-sm"></div>
               </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f5f5f5] py-10 text-center text-[12px] text-gray-500">
           <div className="max-w-7xl mx-auto px-4">
              <div className="flex justify-center gap-6 mb-8">
                 <span>CHÍNH SÁCH BẢO MẬT</span>
                 <span>QUY CHẾ HOẠT ĐỘNG</span>
                 <span>CHÍNH SÁCH VẬN CHUYỂN</span>
                 <span>CHÍNH SÁCH TRẢ HÀNG VÀ HOÀN TIỀN</span>
              </div>
              <p>© 2024 Shopee. Tất cả các quyền được bảo lưu.</p>
           </div>
        </div>
      </footer>

      {viewingProduct && (
        <ProductModal 
          product={viewingProduct} 
          onClose={() => setViewingProduct(null)} 
        />
      )}

      {isPosting && user && (
        <PostProductModal 
          user={user} 
          onClose={() => setIsPosting(false)} 
          onAdd={handleAddProduct}
        />
      )}
    </div>
  );
};

export default App;
