
import { Product } from '../types';

const SHEET_ID = '1uqOCrUxoeSXAHODRjwCSY0PRc1cjB_r6nk-R5PyE4pQ';
const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&t=${new Date().getTime()}`;

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  try {
    const response = await fetch(CSV_URL, {
      cache: 'no-store' // Đảm bảo luôn lấy dữ liệu mới nhất
    });
    
    if (!response.ok) throw new Error('Không thể kết nối tới Google Sheets');
    
    const csvText = await response.text();
    const rows = csvText.split(/\r?\n/).filter(row => row.trim() !== '');
    
    // Bỏ qua dòng header
    const dataRows = rows.slice(1);
    
    return dataRows.map((row, index) => {
      // Regex thông minh để split CSV (xử lý dấu phẩy trong ngoặc kép)
      const cols = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g) || [];
      const cleanCols = cols.map(c => c.replace(/^"|"$/g, '').trim());

      return {
        id: `sheet-${index}-${Date.now()}`,
        name: cleanCols[0] || 'Sản phẩm chưa đặt tên',
        price: parseInt(cleanCols[1]?.replace(/\D/g, '')) || 0,
        category: cleanCols[2] || 'Khác',
        imageUrl: cleanCols[3] || 'https://via.placeholder.com/400?text=No+Image',
        description: cleanCols[4] || 'Mô tả đang được cập nhật từ Google Sheets...',
        sellerZalo: cleanCols[5] || '',
        sellerFB: cleanCols[6] || '',
        sellerName: cleanCols[7] || 'Đối tác Chợ Việt',
        sellerId: 'system-sheet',
        createdAt: Date.now(),
        rating: 4.8,
        soldCount: Math.floor(Math.random() * 1000) + 50,
        location: cleanCols[8] || 'Toàn quốc'
      };
    }).filter(p => p.name !== 'Sản phẩm chưa đặt tên' && p.price > 0);
  } catch (error) {
    console.error("Lỗi Google Sheet Service:", error);
    return [];
  }
};
