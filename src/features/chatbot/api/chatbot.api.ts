import { http } from '@/shared/lib/api';
import { env } from '@/shared/config/env';
import { mockChatbotApi } from './chatbot.mock';

const realChatbotApi = {
  sendMessage: (message: string) =>
    http.post<string>('/chatbot/messages', { message }),
};

export const chatbotApi = env.NEXT_PUBLIC_USE_MOCK_API
  ? mockChatbotApi
  : realChatbotApi;
