import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ScheduleItem, SchedulePreferences } from "../types";

// Initialize Gemini Client
// WARNING: In a real production app, never expose API keys on the client side.
// This is for demonstration/prototyping purposes using the provided runtime environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_FLASH = 'gemini-2.5-flash';

export const summarizeContent = async (text: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Hãy tóm tắt nội dung bài giảng sau đây một cách ngắn gọn, súc tích, tập trung vào các ý chính và định nghĩa quan trọng. Định dạng đầu ra bằng Markdown.\n\nNội dung:\n${text}`,
      config: {
        systemInstruction: "Bạn là một trợ lý học tập thông minh cho sinh viên đại học.",
      }
    });
    
    return response.text || "Không thể tạo tóm tắt.";
  } catch (error) {
    console.error("Error summarizing content:", error);
    throw error;
  }
};

export const generateSchedule = async (prefs: SchedulePreferences): Promise<ScheduleItem[]> => {
  const prompt = `
    Hãy tạo một lịch trình học tập hàng ngày cho sinh viên dựa trên thông tin sau:
    - Thức dậy: ${prefs.wakeUpTime}
    - Đi ngủ: ${prefs.sleepTime}
    - Các môn cần học: ${prefs.subjects}
    - Mức độ tập trung: ${prefs.focusLevel}

    Yêu cầu:
    - Bao gồm thời gian nghỉ ngơi hợp lý.
    - Phân bổ thời gian Pomodoro nếu mức độ là 'intense'.
    - Đảm bảo cân bằng giữa học và sinh hoạt cá nhân.
  `;

  const schema: Schema = {
    type: Type.ARRAY,
    items: {
      type: Type.OBJECT,
      properties: {
        time: { type: Type.STRING, description: "Khoảng thời gian (VD: 07:00 - 08:00)" },
        activity: { type: Type.STRING, description: "Tên hoạt động chính" },
        notes: { type: Type.STRING, description: "Ghi chú chi tiết hoặc lời khuyên" },
        category: { 
          type: Type.STRING, 
          enum: ['study', 'break', 'personal', 'class'],
          description: "Loại hoạt động"
        }
      },
      required: ["time", "activity", "notes", "category"],
    },
  };

  try {
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: schema,
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];
    
    return JSON.parse(jsonText) as ScheduleItem[];
  } catch (error) {
    console.error("Error generating schedule:", error);
    throw error;
  }
};

export const createChatSession = () => {
  return ai.chats.create({
    model: MODEL_FLASH,
    config: {
      systemInstruction: "Bạn là SmartStudy Bot, một trợ lý ảo chuyên hỗ trợ sinh viên FPT Polytechnic. Bạn giỏi về lập trình (Java, Python, Web), kỹ năng mềm và quản lý thời gian. Hãy trả lời thân thiện, ngắn gọn và hữu ích.",
    }
  });
};
