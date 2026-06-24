'use client';

import { useCallback, useRef, useState } from 'react';
import { useMutation } from '@tanstack/react-query';

import { chatbotApi } from '../api/chatbot.api';
import { INITIAL_MESSAGES } from '../api/chatbot.mock';
import type { ChatMessage } from '../types/chatbot.types';

/**
 * Conversation state for the assistant. Holds messages locally (a real impl
 * would persist threads) and streams an assistant reply via a mutation.
 */
export function useChat() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const counter = useRef(0);

  const nextId = () => `m-${++counter.current}-${messages.length}`;

  const mutation = useMutation({
    mutationFn: (text: string) => chatbotApi.sendMessage(text),
    onSuccess: (reply) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: reply,
          at: new Date().toISOString(),
        },
      ]);
    },
  });

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || mutation.isPending) return;
      setMessages((prev) => [
        ...prev,
        {
          id: `u-${counter.current}-${prev.length}`,
          role: 'user',
          content: trimmed,
          at: new Date().toISOString(),
        },
      ]);
      mutation.mutate(trimmed);
    },
    [mutation],
  );

  return { messages, send, isReplying: mutation.isPending };
}
