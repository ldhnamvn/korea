
import { Category, Product } from './types';

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Tai nghe Bluetooth Pro 2024',
    price: 450000,
    description: 'Âm thanh sống động, chống ồn chủ động, thời lượng pin lên đến 24h liên tục.',
    category: Category.DIEN_TU,
    imageUrl: 'https://picsum.photos/seed/earbuds/400/400',
    sellerId: 'admin',
    sellerName: 'Shop Công Nghệ',
    sellerZalo: '0901234567',
    createdAt: Date.now()
  },
  {
    id: '2',
    name: 'Áo thun Cotton Premium',
    price: 185000,
    description: 'Chất liệu vải cotton 100% co giãn 4 chiều, thấm hút mồ hôi cực tốt.',
    category: Category.THOI_TRANG,
    imageUrl: 'https://picsum.photos/seed/tshirt/400/400',
    sellerId: 'admin',
    sellerName: 'Fashion Việt',
    sellerFB: 'facebook.com/vietfashion',
    createdAt: Date.now()
  },
  {
    id: '3',
    name: 'Nồi chiên không dầu Lock&Lock',
    price: 1250000,
    description: 'Dung tích 5.5L, công nghệ Rapid Air giảm 80% lượng dầu mỡ thừa.',
    category: Category.GIA_DUNG,
    imageUrl: 'https://picsum.photos/seed/airfryer/400/400',
    sellerId: 'user1',
    sellerName: 'Gia Dụng Thông Minh',
    sellerZalo: '0988776655',
    createdAt: Date.now()
  },
  {
    id: '4',
    name: 'Hạt điều rang muối Bình Phước',
    price: 120000,
    description: 'Hạt điều loại 1, rang muối thủ công, giữ trọn hương vị bùi béo tự nhiên.',
    category: Category.AM_THUC,
    imageUrl: 'https://picsum.photos/seed/cashew/400/400',
    sellerId: 'user2',
    sellerName: 'Đặc Sản Quê',
    sellerZalo: '0123456789',
    createdAt: Date.now()
  }
];

export const PAYMENT_METHODS = [
  { id: 'cod', name: 'Thanh toán khi nhận hàng (COD)', icon: 'fa-truck-fast' },
  { id: 'momo', name: 'Ví MoMo', icon: 'fa-wallet', color: 'bg-pink-600' },
  { id: 'zalopay', name: 'ZaloPay', icon: 'fa-wallet', color: 'bg-blue-600' },
  { id: 'viettelmoney', name: 'Viettel Money', icon: 'fa-wallet', color: 'bg-red-600' }
];
