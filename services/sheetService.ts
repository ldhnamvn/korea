
import { Product } from '../types';

const SHEET_ID = '1uqOCrUxoeSXAHODRjwCSY0PRc1cjB_r6nk-R5PyE4pQ';

export const fetchProductsFromSheet = async (): Promise<Product[]> => {
  // Thêm timestamp để Google Sheets không trả về dữ liệu cũ đã lưu trong cache của server
  const timestamp = new Date().getTime();
  const CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=0&t=${timestamp}`;

  try {
    const response = await fetch(CSV_URL, {
      method: 'GET',
      headers: {
        'content-type': 'text/csv;charset=UTF-8'
      },
      cache: 'no-cache'
    });
    
    if (!response.ok) throw new Error('Kết nối Google Sheets thất bại');
    
    const csvText = await response.text();
    // Tách dòng và loại bỏ các dòng trống
    const rows = csvText.split(/\r?\n/).filter(row => row.trim().length > 0);
    
    if (rows.length <= 1) return []; // Chỉ có header hoặc trống

    const dataRows = rows.slice(1); // Bỏ dòng tiêu đề
    
    return dataRows.map((row, index) => {
      // Xử lý CSV chuẩn: tách bằng dấu phẩy nhưng giữ nội dung trong ngoặc kép
      const matches = row.match(/(".*?"|[^",]+)(?=\s*,|\s*$)/g);
      const cleanCols = matches ? matches.map(c => c.replace(/^"|"$/g, '').trim()) : [];

      return {
        id: `sheet-${index}-${timestamp}`,
        name: cleanCols[0] || 'Sản phẩm Shopee',
        price: parseInt(cleanCols[1]?.replace(/\D/g, '')) || 0,
        category: cleanCols[2] || 'Khác',
        imageUrl: cleanCols[3] || 'https://via.placeholder.com/400?text=No+Image',
        description: cleanCols[4] || 'Sản phẩm chất lượng cao, giá tốt nhất thị trường.',
        sellerZalo: cleanCols[5] || '',
        sellerFB: cleanCols[6] || '',
        sellerName: cleanCols[7] || 'Cửa hàng chính hãng',
        sellerId: 'system-sync',
        createdAt: timestamp,
        rating: 4.5 + (Math.random() * 0.5),
        soldCount: Math.floor(Math.random() * 1200) + 100,
        location: cleanCols[8] || 'Hà Nội'
      };
    }).filter(p => p.price > 0);
  } catch (error) {
    console.error("Lỗi đồng bộ Google Sheets:", error);
    return [];
  }
};
