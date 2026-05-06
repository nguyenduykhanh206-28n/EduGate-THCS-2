import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not defined");
}

export const ai = new GoogleGenAI({ apiKey });

export const chatWithGemini = async (message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) => {
  const model = "gemini-3-flash-preview";
  
  const systemInstruction = `Bạn là trợ lý ảo AI chính thức của website Trường THCS EduGate. 
  Nhiệm vụ của bạn là hỗ trợ học sinh, giáo viên và phụ huynh. 
  Bạn trả lời lịch sự, thân thiện, mang tính giáo dục. 
  Bạn có thể hỗ trợ giải đáp về các chức năng website:
  - Xem tin tức và thông báo mới nhất.
  - Tải tài liệu học tập PDF/Word.
  - Xem thời khóa biểu theo lớp.
  - Xem thư viện video bài giảng.
  - Liên hệ với nhà trường qua form liên hệ.
  
  Nếu người dùng hỏi về kiến thức học tập (Toán, Lý, Văn...), hãy trả lời ngắn gọn và khuyến khích họ tham khảo thêm trong phần 'Tài liệu học tập'.
  Ngôn ngữ phản hồi: Tiếng Việt.`;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: [
        ...history.map(h => ({ role: h.role, parts: h.parts })),
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    return response.text;
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Xin lỗi, tôi đang gặp một chút trục trặc kỹ thuật. Vui lòng thử lại sau!";
  }
};
