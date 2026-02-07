
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

  useEffect(() => {
    const initApp = async () => {
      setIsLoading(true);
      try {
        const sheetProducts = await fetchProductsFromSheet();
        const localData = localStorage.getItem('shopee_local_products');
        const localProducts = localData ? JSON.parse(localData) : [];
        
        if (sheetProducts.length > 0) {
          setProducts([...localProducts, ...sheetProducts]);
        } else {
          setProducts([...localProducts, ...INITIAL_PRODUCTS]);
        }
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
        setProducts(INITIAL_PRODUCTS);
      } finally {
        setIsLoading(false);
      }
    };

    initApp();

    const savedUser = localStorage.getItem('shopee_user');
    if (savedUser) setUser(JSON.parse(savedUser));
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
      id: 'shopee-user-' + Date.now(),
      name: 'Thành viên Shopee',
      email: 'member@shopee.vn',
      avatar: 'https://cf.shopee.vn/file/default_avatar',
      isSeller: true
    };
    setUser(mockUser);
    localStorage.setItem('shopee_user', JSON.stringify(mockUser));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('shopee_user');
  };

  const handleAddProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    setProducts(updated);
    const localOnly = updated.filter(p => !p.id.startsWith('sheet-'));
    localStorage.setItem('shopee_local_products', JSON.stringify(localOnly));
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col font-sans selection:bg-[#ee4d2d] selection:text-white">
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

      <main className="flex-1 max-w-7xl mx-auto px-4 py-4 md:py-6 w-full">
        {/* Banner Khuyến Mãi */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 mb-6">
           <div className="md:col-span-2 aspect-[21/9] bg-orange-100 rounded-sm overflow-hidden shadow-sm">
              <img src="https://cf.shopee.vn/file/vn-50009109-7a54a02c899c75124032d9d13f990924_xxhdpi" className="w-full h-full object-cover" alt="Sale Banner" />
           </div>
           <div className="hidden md:flex flex-col gap-2">
              <div className="flex-1 bg-blue-100 rounded-sm overflow-hidden shadow-sm">
                 <img src="https://cf.shopee.vn/file/vn-50009109-b46768340d02b54d603e9114d642657e_xhdpi" className="w-full h-full object-cover" alt="Side Banner" />
              </div>
              <div className="flex-1 bg-green-100 rounded-sm overflow-hidden shadow-sm">
                 <img src="https://cf.shopee.vn/file/vn-50009109-775670860555776d4986c757f5c78672_xhdpi" className="w-full h-full object-cover" alt="Side Banner" />
              </div>
           </div>
        </div>

        {/* Flash Sale Header */}
        <div className="bg-white rounded-sm p-4 mb-4 flex items-center justify-between shadow-sm border-b-2 border-[#ee4d2d]">
           <div className="flex items-center gap-4">
              <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/flashsale/fb1088de81e423f4ca6af799051ee2e0.png" className="h-6 md:h-8" alt="Flash Sale" />
              <div className="flex gap-1 items-center">
                 <span className="bg-black text-white px-1.5 py-0.5 rounded-sm text-xs md:text-sm font-bold">02</span>
                 <span className="font-bold">:</span>
                 <span className="bg-black text-white px-1.5 py-0.5 rounded-sm text-xs md:text-sm font-bold">45</span>
                 <span className="font-bold">:</span>
                 <span className="bg-black text-white px-1.5 py-0.5 rounded-sm text-xs md:text-sm font-bold">12</span>
              </div>
           </div>
           <button className="text-gray-500 text-xs md:text-sm hover:text-[#ee4d2d] transition-colors">Xem tất cả <i className="fa-solid fa-chevron-right ml-1"></i></button>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32">
             <div className="w-12 h-12 border-4 border-[#ee4d2d]/20 border-t-[#ee4d2d] rounded-full animate-spin"></div>
             <p className="mt-4 text-gray-500 animate-pulse text-sm">Đang tải sản phẩm từ Google Sheets...</p>
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
          <div className="py-32 text-center bg-white rounded-sm shadow-sm">
            <img src="https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/a60759ad1dabe909c46a817ecbf71878.png" className="w-24 mx-auto mb-4 opacity-50" alt="No data" />
            <h3 className="text-lg font-medium text-gray-600">Không tìm thấy sản phẩm nào</h3>
            <p className="text-gray-400 text-sm mt-1">Hãy thử tìm kiếm với từ khóa khác nhé!</p>
          </div>
        )}

        <div className="mt-12 text-center">
           <button className="bg-white border border-gray-200 px-16 py-3 text-sm text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95">
             Xem thêm
           </button>
        </div>
      </main>

      <footer className="bg-white mt-12 pt-12 border-t-4 border-[#ee4d2d]">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-5 gap-8 pb-12 border-b border-gray-100">
          <div>
            <h4 className="font-bold text-[10px] text-gray-700 mb-4 uppercase tracking-wider">Chăm sóc khách hàng</h4>
            <ul className="space-y-2 text-[11px] text-gray-500">
              <li className="hover:text-[#ee4d2d] cursor-pointer">Trung Tâm Trợ Giúp</li>
              <li className="hover:text-[#ee4d2d] cursor-pointer">Shopee Blog</li>
              <li className="hover:text-[#ee4d2d] cursor-pointer">Hướng Dẫn Mua Hàng</li>
              <li className="hover:text-[#ee4d2d] cursor-pointer">Thanh Toán</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[10px] text-gray-700 mb-4 uppercase tracking-wider">Về Shopee Việt</h4>
            <ul className="space-y-2 text-[11px] text-gray-500">
              <li className="hover:text-[#ee4d2d] cursor-pointer">Giới Thiệu</li>
              <li className="hover:text-[#ee4d2d] cursor-pointer">Tuyển Dụng</li>
              <li className="hover:text-[#ee4d2d] cursor-pointer">Điều Khoản</li>
              <li className="hover:text-[#ee4d2d] cursor-pointer">Chính Sách Bảo Mật</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[10px] text-gray-700 mb-4 uppercase tracking-wider">Thanh toán</h4>
            <div className="flex flex-wrap gap-2">
               <div className="bg-white p-1 shadow-sm border rounded-sm w-10 h-6 flex items-center justify-center text-[8px] font-black text-blue-800">VISA</div>
               <div className="bg-white p-1 shadow-sm border rounded-sm w-10 h-6 flex items-center justify-center text-[8px] font-black text-blue-600">JCB</div>
               <div className="bg-white p-1 shadow-sm border rounded-sm w-10 h-6 flex items-center justify-center text-[8px] font-black text-orange-600">COD</div>
            </div>
          </div>
          <div>
            <h4 className="font-bold text-[10px] text-gray-700 mb-4 uppercase tracking-wider">Theo dõi chúng tôi</h4>
            <ul className="space-y-2 text-[11px] text-gray-500">
              <li className="flex items-center gap-2 hover:text-[#ee4d2d] cursor-pointer"><i className="fa-brands fa-facebook text-base text-blue-600"></i> Facebook</li>
              <li className="flex items-center gap-2 hover:text-[#ee4d2d] cursor-pointer"><i className="fa-brands fa-instagram text-base text-pink-500"></i> Instagram</li>
              <li className="flex items-center gap-2 hover:text-[#ee4d2d] cursor-pointer"><i className="fa-brands fa-tiktok text-base text-black"></i> TikTok</li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold text-[10px] text-gray-700 mb-4 uppercase tracking-wider">Tải ứng dụng</h4>
            <div className="flex gap-2">
               <div className="bg-gray-50 p-1 border rounded shadow-inner"><i className="fa-solid fa-qrcode text-4xl text-gray-300"></i></div>
               <div className="flex flex-col gap-1 justify-center">
                  <div className="bg-white border rounded px-1 flex items-center gap-1 text-[8px] w-20 h-6 cursor-pointer"><i className="fa-brands fa-apple"></i> App Store</div>
                  <div className="bg-white border rounded px-1 flex items-center gap-1 text-[8px] w-20 h-6 cursor-pointer"><i className="fa-brands fa-google-play"></i> Play Store</div>
               </div>
            </div>
          </div>
        </div>
        <div className="bg-[#f5f5f5] py-12 text-center text-[12px] text-gray-400">
           <div className="max-w-7xl mx-auto px-4">
              <div className="flex flex-wrap justify-center gap-4 md:gap-10 mb-8 uppercase font-medium">
                 <span className="hover:text-gray-600 cursor-pointer">Chính sách bảo mật</span>
                 <span className="hover:text-gray-600 cursor-pointer">Quy chế hoạt động</span>
                 <span className="hover:text-gray-600 cursor-pointer">Chính sách vận chuyển</span>
                 <span className="hover:text-gray-600 cursor-pointer">Chính sách trả hàng</span>
              </div>
              <p className="mb-2">Địa chỉ: Tầng 4-5-6, Tòa nhà Capital Place, số 29 đường Liễu Giai, Hà Nội, Việt Nam.</p>
              <p>© 2024 - Bản quyền thuộc về Shopee Việt Clone</p>
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
