import { mockDelay } from '@/shared/lib';
import type { ChatMessage } from '../types/chatbot.types';

/** Opening message shown when the chat panel mounts. */
export const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: 'm-0',
    role: 'assistant',
    content:
      'Xin chào! Tôi là trợ lý AI của BMT. Tôi có thể giúp bạn ước tính chi phí, tra cứu đơn giá vật tư và lập dự toán. Bạn cần hỗ trợ gì?',
    at: '2026-06-24T01:00:00Z',
  },
];

/** Quick-start prompts offered before the user types anything. */
export const SUGGESTIONS = [
  'Ước tính chi phí sơn 100m² tường',
  'Đơn giá xi măng và thép hôm nay',
  'Lập dự toán sơ bộ cho căn hộ 60m²',
];

/** Canned, keyword-based replies — stands in for a real LLM endpoint. */
function generateReply(text: string): string {
  const q = text.toLowerCase();
  if (q.includes('sơn')) {
    return 'Với 100m² tường, định mức sơn nước khoảng 0,25 lít/m² cho 2 lớp. Ước tính: ~25 lít sơn (≈ 2 thùng 18L) + nhân công sơn bả ~400.000đ/công. Tổng tạm tính khoảng 6–8 triệu đồng tuỳ loại sơn. Bạn muốn tôi lập dự toán chi tiết không?';
  }
  if (q.includes('xi măng') || q.includes('thép') || q.includes('đơn giá')) {
    return 'Đơn giá tham khảo hiện tại: Xi măng PCB40 ~92.000đ/bao, Thép D10 ~18.500đ/kg. Bạn có thể xem đầy đủ trong mục Thư viện đơn giá. Cần tôi tính khối lượng cho hạng mục cụ thể nào không?';
  }
  if (q.includes('dự toán') || q.includes('căn hộ') || q.includes('m²')) {
    return 'Để lập dự toán sơ bộ cho căn hộ, tôi cần biết: diện tích, hạng mục (sơn/ốp lát/điện nước/nội thất) và mức hoàn thiện mong muốn. Với căn hộ 60m² hoàn thiện cơ bản, suất đầu tư tham khảo ~4–6 triệu/m², tức khoảng 240–360 triệu đồng.';
  }
  return 'Tôi đã ghi nhận yêu cầu của bạn. (Đây là phản hồi mẫu — khi kết nối backend AI thật, câu trả lời sẽ dựa trên dữ liệu dự án và đơn giá thực tế.)';
}

export const mockChatbotApi = {
  async sendMessage(text: string): Promise<string> {
    await mockDelay(900);
    return generateReply(text);
  },
};
