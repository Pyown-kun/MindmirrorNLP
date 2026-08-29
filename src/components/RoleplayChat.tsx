import { useEffect, useRef } from 'react';
import { Send, User } from 'lucide-react';
import type { RoleplayMessage } from '../types/training';

interface RoleplayChatProps {
  messages: RoleplayMessage[];
  characterName: string;
  input: string;
  onInputChange: (value: string) => void;
  onSend: () => void;
  placeholder: string;
  sendLabel: string;
  youLabel: string;
  disabled?: boolean;
}

export const RoleplayChat = ({
  messages,
  characterName,
  input,
  onInputChange,
  onSend,
  placeholder,
  sendLabel,
  youLabel,
  disabled = false,
}: RoleplayChatProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !disabled && input.trim()) {
      onSend();
    }
  };

  return (
    <div className="flex flex-col">
      <div className="scrollbar-thin flex max-h-[420px] min-h-[280px] flex-col gap-3 overflow-y-auto rounded-2xl bg-mist/70 p-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-end gap-2 ${msg.speaker === 'user' ? 'flex-row-reverse self-end' : 'self-start'}`}
          >
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                msg.speaker === 'user' ? 'bg-primary text-white' : 'bg-aqua/20 text-aqua'
              }`}
            >
              {msg.speaker === 'user' ? <User className="h-4 w-4" /> : characterName.charAt(0)}
            </div>
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${
                msg.speaker === 'user'
                  ? 'rounded-br-sm bg-primary text-white'
                  : 'rounded-bl-sm bg-white text-ink'
              }`}
            >
              <p className="mb-0.5 text-[10px] font-semibold uppercase tracking-wide opacity-60">
                {msg.speaker === 'user' ? youLabel : characterName}
              </p>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <div className="mt-3 flex items-center gap-2">
        <input
          value={input}
          onChange={(e) => onInputChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full flex-1 rounded-2xl border border-ink/10 bg-white px-5 py-3.5 text-sm outline-none transition focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-50"
        />
        <button
          onClick={onSend}
          disabled={disabled || !input.trim()}
          aria-label={sendLabel}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary text-white shadow-lg shadow-primary/25 transition active:scale-95 disabled:opacity-40"
        >
          <Send className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
