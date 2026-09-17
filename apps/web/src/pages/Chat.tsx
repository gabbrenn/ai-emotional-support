import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { chatApi, type Conversation, type Message } from '../services/api';
import logoImg from '../assets/logo.png';

// ─── Compact Typing Indicator ──────────────────────────────────────────────────
function TypingIndicator() {
  return (
    <div className="flex items-start gap-2 mb-2.5 animate-fadeIn">
      <img src={logoImg} alt="MindCare AI" className="w-6 h-6 rounded-full object-contain shrink-0 mt-0.5" />
      <div className="bg-white border border-slate-200/80 rounded-2xl rounded-tl-xs px-3.5 py-2 shadow-2xs">
        <div className="flex gap-1 items-center h-3.5" aria-label="MindCare AI is typing">
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

// ─── Compact Message Bubble ────────────────────────────────────────────────────
function MessageBubble({ message }: { message: Message }) {
  const isUser = message.sender === 'user';
  const isHighRisk = message.riskLevel === 'high';

  if (isUser) {
    return (
      <div className="flex justify-end mb-2.5 animate-fadeIn">
        <div className="bg-[#132c45] text-white rounded-2xl rounded-tr-xs px-3.5 py-2 sm:px-4 sm:py-2.5 max-w-[85%] sm:max-w-md shadow-2xs">
          <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start gap-2 mb-2.5 animate-fadeIn">
      <img src={logoImg} alt="MindCare AI" className="w-6 h-6 rounded-full object-contain shrink-0 mt-0.5" />
      <div
        className={`rounded-2xl rounded-tl-xs px-3.5 py-2 sm:px-4 sm:py-2.5 max-w-[85%] sm:max-w-lg shadow-2xs border ${
          isHighRisk
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-white border-slate-200/90 text-slate-800'
        }`}
      >
        {isHighRisk && (
          <p className="text-[11px] font-semibold text-amber-700 mb-1 uppercase tracking-wide flex items-center gap-1">
            <span>⚠️</span> Important Note
          </p>
        )}
        <p className="text-xs sm:text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const { user } = useAuth();
  const userName = user?.name?.split(' ')[0] || 'Alex';

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [input, setInput] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, sending, scrollToBottom]);

  // Load initial conversations
  useEffect(() => {
    async function initChat() {
      try {
        const data = await chatApi.getConversations();
        const convs = data.conversations || [];
        setConversations(convs);

        if (convs.length > 0) {
          const first = convs[0];
          setActiveConversation(first);
          setLoadingMessages(true);
          const msgData = await chatApi.getConversation(first.id);
          setMessages(msgData.messages || []);
        } else {
          const newConv = await chatApi.createConversation();
          setConversations([newConv.conversation]);
          setActiveConversation(newConv.conversation);
          setMessages([]);
        }
      } catch (err: unknown) {
        const e = err as { message?: string };
        setError(e.message ?? 'Failed to load conversations.');
      } finally {
        setLoadingMessages(false);
      }
    }

    initChat();
  }, []);

  // Send message
  async function handleSend(textToSend?: string) {
    const content = (textToSend ?? input).trim();
    if (!content || sending) return;

    let convId = activeConversation?.id;

    if (!convId) {
      try {
        const newConv = await chatApi.createConversation();
        setConversations((prev) => [newConv.conversation, ...prev]);
        setActiveConversation(newConv.conversation);
        convId = newConv.conversation.id;
      } catch {
        setError('Failed to initiate conversation.');
        return;
      }
    }

    setInput('');
    setSending(true);
    setError(null);

    try {
      const data = await chatApi.sendMessage(convId, content);
      setMessages((prev) => [...prev, data.userMessage, data.assistantMessage]);

      chatApi.getConversations().then((res) => {
        if (res.conversations) setConversations(res.conversations);
      }).catch(() => {});
    } catch (err: unknown) {
      const e = err as { message?: string };
      setError(e.message ?? "I'm having trouble responding right now. Please try again.");
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  }

  async function handleCreateNewChat() {
    try {
      const newConv = await chatApi.createConversation();
      setConversations((prev) => [newConv.conversation, ...prev]);
      setActiveConversation(newConv.conversation);
      setMessages([]);
      inputRef.current?.focus();
    } catch {
      // Non-fatal
    }
  }

  // Quick suggestion prompts matching Chat page.jpg
  const starterPrompts = [
    "I'm feeling stressed",
    "Can you help me with anxiety?",
    "I just need someone to talk to",
  ];

  return (
    <div className="h-full w-full flex flex-col justify-between overflow-hidden relative select-text">
      {/* ── Top Chat Header (Fixed, compact) ── */}
      <div className="flex items-center justify-between pb-2 shrink-0 border-b border-slate-100/80">
        <div className="flex items-center gap-2.5">
          <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">Chat</h1>
          {conversations.length > 1 && (
            <select
              value={activeConversation?.id ?? ''}
              onChange={async (e) => {
                const selected = conversations.find((c) => c.id === Number(e.target.value));
                if (selected) {
                  setActiveConversation(selected);
                  setLoadingMessages(true);
                  try {
                    const msgData = await chatApi.getConversation(selected.id);
                    setMessages(msgData.messages || []);
                  } finally {
                    setLoadingMessages(false);
                  }
                }
              }}
              className="text-xs text-slate-600 bg-white border border-slate-200 rounded-lg px-2 py-1 focus:outline-none"
            >
              {conversations.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.title || `Chat #${c.id}`}
                </option>
              ))}
            </select>
          )}
        </div>

        {messages.length > 0 && (
          <button
            type="button"
            onClick={handleCreateNewChat}
            className="text-xs font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100/70 px-2.5 py-1 rounded-lg transition cursor-pointer"
          >
            + New Chat
          </button>
        )}
      </div>

      {/* ── Scrollable Messages Container (Only messages scroll) ── */}
      <div
        className="flex-1 overflow-y-auto min-h-0 py-2 sm:py-3 px-1 space-y-2 overscroll-contain"
        role="log"
        aria-live="polite"
      >
        {loadingMessages ? (
          <div className="flex items-center justify-center h-full text-slate-400 text-xs sm:text-sm">
            Loading conversation...
          </div>
        ) : messages.length === 0 ? (
          /* ── Empty / Welcome State matching Chat page.jpg ── */
          <div className="h-full flex flex-col items-center justify-center text-center px-3 max-w-lg mx-auto my-auto py-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-[#eff6ff] border border-blue-100/80 flex items-center justify-center shadow-xs mb-3.5 p-2">
              <img src={logoImg} alt="MindCare AI" className="w-full h-full object-contain" />
            </div>

            <h2 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 flex items-center justify-center gap-1.5">
              <span>Hi {userName}</span>
              <span className="select-none">👋</span>
            </h2>

            <p className="text-slate-600 text-xs sm:text-sm leading-relaxed mb-6 max-w-md">
              <span className="text-slate-800 underline underline-offset-4 decoration-slate-400 font-medium">
                I'm here to listen
              </span>{' '}
              and support you. You can share whatever is on your mind, ask for guidance, or just talk through your thoughts.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2 w-full">
              {starterPrompts.map((prompt, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSend(prompt)}
                  className="px-3.5 py-2 sm:px-4 sm:py-2.5 rounded-full bg-white border border-slate-200/90 hover:border-slate-400 hover:bg-slate-50/80 text-slate-700 text-xs font-medium transition-all shadow-2xs hover:shadow-xs cursor-pointer active:scale-95"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto w-full">
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {sending && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div
          className="my-1.5 flex items-center justify-between gap-2 bg-red-50 border border-red-200 text-red-700 text-xs px-3 py-2 rounded-xl shrink-0"
          role="alert"
        >
          <span>{error}</span>
          <button
            className="text-red-500 hover:text-red-700 text-base leading-none cursor-pointer shrink-0"
            onClick={() => setError(null)}
            aria-label="Dismiss error"
          >
            ✕
          </button>
        </div>
      )}

      {/* ── Fixed Bottom Input Bar (Fixed to bottom, never scrolled away on mobile or desktop) ── */}
      <div className="shrink-0 pt-2 pb-1.5 w-full max-w-3xl mx-auto bg-[#f8fafc] z-10">
        <div className="relative bg-white border border-slate-200/90 rounded-full pl-4 pr-1.5 py-1 sm:py-1.5 shadow-sm flex items-center gap-2.5 transition-all focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
          <input
            id="chat-input"
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            disabled={sending}
            className="flex-1 bg-transparent text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none disabled:opacity-50 py-1"
          />

          {/* Paperclip Attachment Icon */}
          <button
            type="button"
            className="text-slate-400 hover:text-slate-600 p-1.5 rounded-full transition cursor-pointer"
            title="Attach file"
            onClick={() => alert('Attachment feature is simulated.')}
          >
            <svg className="w-4 h-4 sm:w-5 sm:h-5 -rotate-45" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.8"
                d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
              />
            </svg>
          </button>

          {/* Circular Send Button with Paper Plane */}
          <button
            id="btn-send-message"
            type="button"
            onClick={() => handleSend()}
            disabled={sending || !input.trim()}
            aria-label="Send message"
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#175cd3] hover:bg-[#154fc1] active:bg-[#1242a5] disabled:bg-slate-200 text-white flex items-center justify-center shadow-xs transition-all cursor-pointer disabled:cursor-not-allowed shrink-0"
          >
            {sending ? (
              <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
            ) : (
              <svg className="w-3.5 h-3.5 translate-x-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
