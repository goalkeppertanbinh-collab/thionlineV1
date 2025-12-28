
import { GoogleGenAI } from "@google/genai";
import { ExamResult, Exam } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export async function getAIFeedback(exam: Exam, result: ExamResult): Promise<string> {
  if (!process.env.API_KEY) return "Vui lòng cấu hình API Key để nhận nhận xét từ AI.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `
        Dựa trên kết quả thi sau đây:
        Tên bài thi: ${exam.title}
        Điểm đạt được: ${result.score}/${result.totalPoints}
        Tỷ lệ: ${(result.score / result.totalPoints * 100).toFixed(1)}%
        
        Hãy đưa ra lời khuyên ngắn gọn, khích lệ và những chủ đề học sinh cần ôn tập thêm dựa trên kết quả này bằng tiếng Việt.
      `
    });
    return response.text || "Không thể nhận phản hồi từ AI lúc này.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Đã xảy ra lỗi khi kết nối với AI.";
  }
}
