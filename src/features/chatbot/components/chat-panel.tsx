'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Bot, SendHorizonal, User } from 'lucide-react';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Card } from '@/shared/components/ui/card';
import { useChat } from '../hooks/use-chat';
import { SUGGESTIONS } from '../api/chatbot.mock';

export function ChatPanel() {
  const t = useTranslations('chatbot');
  const { messages, send, isReplying } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, isReplying]);

  function handleSend() {
    send(input);
    setInput('');
  }

  const showSuggestions = messages.length <= 1 && !isReplying;

  return (
    <Card className="flex h-[calc(100svh-13rem)] flex-col overflow-hidden p-0">
      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-4 overflow-y-auto p-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              'flex items-start gap-3',
              m.role === 'user' && 'flex-row-reverse',
            )}
          >
            <div
              className={cn(
                'flex size-8 shrink-0 items-center justify-center rounded-full',
                m.role === 'assistant'
                  ? 'bg-primary/10 text-primary'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              {m.role === 'assistant' ? (
                <Bot className="size-4" />
              ) : (
                <User className="size-4" />
              )}
            </div>
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap',
                m.role === 'assistant'
                  ? 'bg-muted'
                  : 'bg-primary text-primary-foreground',
              )}
            >
              {m.content}
            </div>
          </div>
        ))}

        {isReplying ? (
          <div className="flex items-start gap-3">
            <div className="bg-primary/10 text-primary flex size-8 shrink-0 items-center justify-center rounded-full">
              <Bot className="size-4" />
            </div>
            <div className="bg-muted flex items-center gap-1 rounded-lg px-3 py-3">
              <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full [animation-delay:-0.3s]" />
              <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full [animation-delay:-0.15s]" />
              <span className="bg-muted-foreground/50 size-2 animate-bounce rounded-full" />
            </div>
          </div>
        ) : null}
      </div>

      {/* Suggestions */}
      {showSuggestions ? (
        <div className="flex flex-wrap gap-2 px-4 pb-2">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => send(s)}
              className="border-border hover:bg-accent rounded-full border px-3 py-1.5 text-xs transition-colors"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend();
        }}
        className="flex items-center gap-2 border-t p-3"
      >
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t('placeholder')}
          disabled={isReplying}
          autoComplete="off"
        />
        <Button
          type="submit"
          size="icon"
          disabled={isReplying || !input.trim()}
        >
          <SendHorizonal className="size-4" />
          <span className="sr-only">{t('send')}</span>
        </Button>
      </form>
    </Card>
  );
}
