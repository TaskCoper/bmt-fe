/** A single chat message in the assistant conversation. */
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  at: string;
}
