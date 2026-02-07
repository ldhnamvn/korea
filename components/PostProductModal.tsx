
import React, { useState } from 'react';
import { Category, Product, User } from '../types';
import { generateProductDescription } from '../services/geminiService';

interface PostProductModalProps {
  user: User;
  onClose: () => void;
  onAdd: (p: Product) => void;
}

const PostProductModal: React.FC<PostProductModalProps> = ({ user, onClose, onAdd }) => {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    category: Category.TAT_CA,
    description: '',
    zalo: '',
    fb: ''
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateAI = async () => {
    if (!formData.name) {
      alert("Vui lòng nhập tên sản phẩm để AI hỗ trợ!");
      return;
    }
    setIsGenerating(true);
    const desc = await generateProductDescription(formData.name, formData.category);
    setFormData(prev => ({ ...prev, description: desc }));
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imagePreview) {
      alert("Vui lòng tải lên hình ảnh sản phẩm!");
      return;
    }

    const newProduct: Product = {
      id: Math.random().toString(36).substr(2, 9),
      name: formData.name,
      price: parseInt(formData.price),
      description: formData.description,
      category: formData.category === Category.TAT_CA ? Category.KHAC : formData.category,
      imageUrl: imagePreview,
      sellerId: user.id,
      sellerName: user.name,
      sellerZalo: formData.zalo,
      sellerFB: formData.fb,
      createdAt: Date.now()
    };

    onAdd(newProduct);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden relative shadow-2xl animate-in zoom-in duration-200">
        <div className="p-6 sm:p-8">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-900">Đăng sản phẩm mới</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <i className="fa-solid fa-xmark text-xl"></i>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Image Upload */}
            <div className="flex flex-col items-center">
              <label className="w-full aspect-video md:aspect-[21/9] bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors relative overflow-hidden group">
                {imagePreview ? (
                  <>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white font-medium transition-opacity">
                      Thay đổi ảnh
                    </div>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-cloud-arrow-up text-4xl text-gray-300 mb-2"></i>
                    <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">Tải lên ảnh sản phẩm</span>
                    <span className="text-xs text-gray-400 mt-1">Định dạng JPG, PNG lên đến 5MB</span>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              </label>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Tên sản phẩm</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={e => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Ví dụ: Tai nghe Gaming Pro..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Giá bán (VNĐ)</label>
                <input
                  required
                  type="number"
                  value={formData.price}
                  onChange={e => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  placeholder="Vd: 250000"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-gray-700 ml-1">Danh mục</label>
              <select
                value={formData.category}
                onChange={e => setFormData(prev => ({ ...prev, category: e.target.value as Category }))}
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              >
                {Object.values(Category).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between mb-1">
                <label className="text-sm font-semibold text-gray-700 ml-1">Mô tả sản phẩm</label>
                <button
                  type="button"
                  onClick={handleGenerateAI}
                  disabled={isGenerating}
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-2 py-1 rounded"
                >
                  <i className={`fa-solid ${isGenerating ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
                  {isGenerating ? 'Đang tạo...' : 'AI Viết hộ'}
                </button>
              </div>
              <textarea
                required
                rows={4}
                value={formData.description}
                onChange={e => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Mô tả chi tiết về sản phẩm..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Số Zalo liên hệ</label>
                  <input
                    type="text"
                    value={formData.zalo}
                    onChange={e => setFormData(prev => ({ ...prev, zalo: e.target.value }))}
                    placeholder="Vd: 0912345678"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
               </div>
               <div className="space-y-1">
                  <label className="text-sm font-semibold text-gray-700 ml-1">Link Facebook (nếu có)</label>
                  <input
                    type="text"
                    value={formData.fb}
                    onChange={e => setFormData(prev => ({ ...prev, fb: e.target.value }))}
                    placeholder="facebook.com/yourid"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
               </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-lg active:scale-[0.98] mt-4"
            >
              Đăng sản phẩm ngay
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PostProductModal;
