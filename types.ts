
export enum Category {
  TAT_CA = 'Tất cả',
  DIEN_TU = 'Điện tử',
  THOI_TRANG = 'Thời trang',
  GIA_DUNG = 'Gia dụng',
  AM_THUC = 'Ẩm thực',
  KHAC = 'Khác'
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description: string;
  category: string;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  sellerZalo?: string;
  sellerFB?: string;
  createdAt: number;
  rating?: number;
  soldCount?: number;
  location?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isSeller: boolean;
}
