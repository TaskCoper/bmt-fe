'use client'

import { useCallback, useRef, useState, useSyncExternalStore } from 'react'
import { useMutation } from '@tanstack/react-query'

import { useAuth } from '@/shared/auth'
import { chatbotApi } from '../api/chatbot.api'
import { INITIAL_MESSAGES } from '../api/chatbot.mock'
import { CHAT_DAILY_LIMIT } from '../constants/chatbot.constants'
import { getServerCount, getTodayCount, incrementTodayCount, subscribeUsage } from '../services/chat-quota'
import type { ChatMessage } from '../types/chatbot.types'

/**
 * Conversation state for the assistant. Holds messages locally (no history
 * persistence per spec) and streams an assistant reply via a mutation.
 * Enforces a per-day message quota (UX guard): 30/day for customers, 10/day
 * for guests.
 */
export function useChat() {
  const { isAuthenticated } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES)
  const used = useSyncExternalStore(subscribeUsage, getTodayCount, getServerCount)
  const counter = useRef(0)

  const dailyLimit = isAuthenticated ? CHAT_DAILY_LIMIT.customer : CHAT_DAILY_LIMIT.guest
  const remaining = Math.max(0, dailyLimit - used)
  const limitReached = remaining <= 0

  const nextId = () => `m-${++counter.current}-${messages.length}`

  const mutation = useMutation({
    mutationFn: (text: string) => chatbotApi.sendMessage(text),
    onSuccess: (reply) => {
      setMessages((prev) => [
        ...prev,
        {
          id: nextId(),
          role: 'assistant',
          content: reply,
          at: new Date().toISOString()
        }
      ])
    }
  })

  const send = useCallback(
    (text: string) => {
      const trimmed = text.trim()
      if (!trimmed || mutation.isPending) return
      if (getTodayCount() >= dailyLimit) return
      incrementTodayCount()
      setMessages((prev) => [
        ...prev,
        {
          id: `u-${counter.current}-${prev.length}`,
          role: 'user',
          content: trimmed,
          at: new Date().toISOString()
        }
      ])
      mutation.mutate(trimmed)
    },
    [mutation, dailyLimit]
  )

  return {
    messages,
    send,
    isReplying: mutation.isPending,
    remaining,
    dailyLimit,
    limitReached
  }
}
