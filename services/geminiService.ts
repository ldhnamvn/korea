
import { GoogleGenAI } from "@google/genai";

// Fix: Always use process.env.API_KEY directly without fallbacks or ternary operators
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateProductDescription = async (productName: string, category: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Hãy viết một đoạn mô tả sản phẩm ngắn gọn, hấp dẫn và chuyên nghiệp bằng tiếng Việt cho sản phẩm "${productName}" thuộc danh mục "${category}". Tập trung vào lợi ích cho người dùng.`,
    });
    // Fix: Use the .text property directly instead of calling it as a method
    return response.text || "Mô tả sản phẩm đang được cập nhật...";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Lỗi khi tạo mô tả. Vui lòng tự nhập mô tả cho sản phẩm.";
  }
};
