import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useRef, useCallback } from 'react';
import { chatApi } from '../services/api';
// ─── Typing indicator ─────────────────────────────────────────────────────────
function TypingIndicator() {
    return (_jsx("div", { className: "flex items-start gap-2 mb-4", children: _jsx("div", { className: "bg-white border border-slate-200 rounded-2xl rounded-tl-sm px-4 py-3 max-w-xs shadow-sm", children: _jsxs("div", { className: "flex gap-1 items-center h-5", "aria-label": "AI is thinking", children: [_jsx("span", { className: "w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:0ms]" }), _jsx("span", { className: "w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:150ms]" }), _jsx("span", { className: "w-2 h-2 bg-teal-400 rounded-full animate-bounce [animation-delay:300ms]" })] }) }) }));
}
// ─── Message bubble ───────────────────────────────────────────────────────────
function MessageBubble({ message }) {
    const isUser = message.sender === 'user';
    const isHighRisk = message.riskLevel === 'high';
    if (isUser) {
        return (_jsx("div", { className: "flex justify-end mb-4", children: _jsx("div", { className: "bg-teal-600 text-white rounded-2xl rounded-tr-sm px-4 py-3 max-w-sm lg:max-w-md shadow-sm", children: _jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.content }) }) }));
    }
    return (_jsx("div", { className: "flex items-start gap-2 mb-4", children: _jsxs("div", { className: `rounded-2xl rounded-tl-sm px-4 py-3 max-w-sm lg:max-w-md shadow-sm border ${isHighRisk
                ? 'bg-amber-50 border-amber-200 text-amber-900'
                : 'bg-white border-slate-200 text-slate-800'}`, children: [isHighRisk && (_jsx("p", { className: "text-xs font-semibold text-amber-700 mb-1.5 uppercase tracking-wide", children: "\u26A0 Important" })), _jsx("p", { className: "text-sm leading-relaxed whitespace-pre-wrap", children: message.content })] }) }));
}
// ─── Empty state (no conversations at all) ────────────────────────────────────
function EmptyConversation({ onNew }) {
    return (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-teal-50 border border-teal-200 rounded-2xl flex items-center justify-center text-3xl", children: "\uD83D\uDCAC" }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-2", children: "How can I support you today?" }), _jsx("p", { className: "text-slate-500 text-sm max-w-xs leading-relaxed", children: "You can talk about stress, school, relationships, motivation, or simply how you're feeling." })] }), _jsx("button", { id: "btn-start-conversation", onClick: onNew, className: "inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition cursor-pointer", children: "Start a conversation" })] }));
}
// ─── No conversation selected ─────────────────────────────────────────────────
function NoConversationSelected({ onNew }) {
    return (_jsxs("div", { className: "flex-1 flex flex-col items-center justify-center gap-5 p-8 text-center", children: [_jsx("div", { className: "w-16 h-16 bg-slate-100 border border-slate-200 rounded-2xl flex items-center justify-center text-3xl", children: "\uD83C\uDF3F" }), _jsxs("div", { children: [_jsx("h2", { className: "text-lg font-semibold text-slate-900 mb-2", children: "Select a conversation" }), _jsx("p", { className: "text-slate-500 text-sm", children: "Choose one from the sidebar, or start a new one." })] }), _jsx("button", { id: "btn-new-conversation-placeholder", onClick: onNew, className: "inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition cursor-pointer", children: "+ New conversation" })] }));
}
export default function ChatPage() {
    const [state, setState] = useState({
        conversations: [],
        activeConversation: null,
        messages: [],
        loadingConversations: true,
        loadingMessages: false,
        sending: false,
        error: null,
    });
    const [input, setInput] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const messagesEndRef = useRef(null);
    const textareaRef = useRef(null);
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, []);
    useEffect(() => {
        scrollToBottom();
    }, [state.messages, state.sending, scrollToBottom]);
    useEffect(() => {
        loadConversations();
    }, []);
    async function loadConversations() {
        setState((s) => ({ ...s, loadingConversations: true, error: null }));
        try {
            const data = await chatApi.getConversations();
            setState((s) => ({ ...s, conversations: data.conversations, loadingConversations: false }));
        }
        catch (err) {
            const e = err;
            setState((s) => ({
                ...s,
                loadingConversations: false,
                error: e.message ?? 'Failed to load conversations.',
            }));
        }
    }
    async function openConversation(conv) {
        setSidebarOpen(false);
        setState((s) => ({ ...s, loadingMessages: true, activeConversation: conv, messages: [], error: null }));
        try {
            const data = await chatApi.getConversation(conv.id);
            setState((s) => ({
                ...s,
                activeConversation: data.conversation,
                messages: data.messages,
                loadingMessages: false,
            }));
        }
        catch (err) {
            const e = err;
            setState((s) => ({ ...s, loadingMessages: false, error: e.message ?? 'Failed to load conversation.' }));
        }
    }
    async function createNewConversation() {
        setSidebarOpen(false);
        setState((s) => ({ ...s, error: null }));
        try {
            const data = await chatApi.createConversation();
            setState((s) => ({
                ...s,
                conversations: [data.conversation, ...s.conversations],
                activeConversation: data.conversation,
                messages: [],
            }));
            textareaRef.current?.focus();
        }
        catch (err) {
            const e = err;
            setState((s) => ({ ...s, error: e.message ?? 'Failed to create conversation.' }));
        }
    }
    async function handleSend() {
        const content = input.trim();
        if (!content || !state.activeConversation || state.sending)
            return;
        const convId = state.activeConversation.id;
        setInput('');
        setState((s) => ({ ...s, sending: true, error: null }));
        try {
            const data = await chatApi.sendMessage(convId, content);
            setState((s) => ({
                ...s,
                messages: [...s.messages, data.userMessage, data.assistantMessage],
                sending: false,
            }));
            // Refresh sidebar list for updated titles/timestamps
            chatApi.getConversations()
                .then((res) => setState((s) => ({ ...s, conversations: res.conversations })))
                .catch(() => { });
        }
        catch (err) {
            const e = err;
            setState((s) => ({
                ...s,
                sending: false,
                error: e.message ?? "I'm having trouble responding right now. Please try again.",
            }));
        }
    }
    function handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }
    const { conversations, activeConversation, messages, loadingConversations, loadingMessages, sending, error } = state;
    const hasConversations = conversations.length > 0;
    return (_jsxs("div", { className: "flex h-full overflow-hidden", children: [_jsxs("aside", { className: `
          fixed inset-y-0 left-0 z-40 w-72 bg-white border-r border-slate-200 flex flex-col
          transform transition-transform duration-200
          md:relative md:translate-x-0 md:z-auto md:w-64 md:shrink-0
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        `, "aria-label": "Conversation list", children: [_jsxs("div", { className: "flex items-center justify-between gap-2 px-4 py-4 border-b border-slate-100", children: [_jsx("h2", { className: "text-sm font-semibold text-slate-700 uppercase tracking-wide", children: "Conversations" }), _jsx("button", { id: "btn-new-conversation", onClick: createNewConversation, className: "text-xs font-medium text-teal-700 hover:text-teal-900 hover:bg-teal-50 px-2.5 py-1.5 rounded-lg transition cursor-pointer border border-teal-200", children: "+ New" })] }), _jsx("div", { className: "flex-1 overflow-y-auto", children: loadingConversations ? (_jsx("p", { className: "text-slate-400 text-sm text-center py-8", children: "Loading\u2026" })) : !hasConversations ? (_jsxs("div", { className: "p-4 text-center", children: [_jsx("p", { className: "text-slate-500 text-sm mb-3", children: "No conversations yet." }), _jsx("button", { id: "btn-new-conversation-sidebar-empty", onClick: createNewConversation, className: "text-sm text-teal-700 hover:text-teal-900 font-medium underline cursor-pointer", children: "Start your first conversation" })] })) : (_jsx("ul", { role: "list", className: "py-2", children: conversations.map((conv) => (_jsx("li", { children: _jsxs("button", { id: `btn-conversation-${conv.id}`, onClick: () => openConversation(conv), className: `w-full text-left px-4 py-3 transition cursor-pointer border-l-2 ${activeConversation?.id === conv.id
                                        ? 'bg-teal-50 border-l-teal-600 text-slate-900'
                                        : 'border-l-transparent hover:bg-slate-50 text-slate-700'}`, children: [_jsx("p", { className: "text-sm font-medium truncate", children: conv.title }), _jsx("p", { className: "text-xs text-slate-400 mt-0.5", children: new Date(conv.updatedAt).toLocaleDateString() })] }) }, conv.id))) })) })] }), sidebarOpen && (_jsx("div", { className: "fixed inset-0 z-30 bg-black/25 md:hidden", onClick: () => setSidebarOpen(false), "aria-hidden": "true" })), _jsxs("div", { className: "flex-1 flex flex-col overflow-hidden", children: [_jsxs("div", { className: "md:hidden flex items-center gap-3 px-4 py-3 border-b border-slate-200 bg-white shrink-0", children: [_jsx("button", { id: "btn-mobile-sidebar-toggle", onClick: () => setSidebarOpen((v) => !v), className: "p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition cursor-pointer", "aria-label": "Toggle conversation list", children: "\u2630" }), _jsx("span", { className: "text-sm font-medium text-slate-700 truncate", children: activeConversation?.title ?? 'AI Emotional Support' })] }), _jsxs("div", { className: "hidden md:flex items-center justify-between px-6 py-3 border-b border-slate-100 bg-white shrink-0", children: [_jsx("h1", { className: "text-sm font-semibold text-slate-700", children: activeConversation?.title ?? 'AI Emotional Support' }), activeConversation && (_jsx("button", { id: "btn-new-conversation-top", onClick: createNewConversation, className: "text-xs text-slate-500 hover:text-slate-700 hover:bg-slate-100 px-2.5 py-1.5 rounded-lg transition cursor-pointer", children: "+ New conversation" }))] }), !activeConversation ? (hasConversations ? (_jsx(NoConversationSelected, { onNew: createNewConversation })) : (_jsx(EmptyConversation, { onNew: createNewConversation }))) : (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex-1 overflow-y-auto px-4 md:px-6 py-5", role: "log", "aria-live": "polite", children: [loadingMessages ? (_jsx("p", { className: "text-center text-slate-400 text-sm py-12", children: "Loading messages\u2026" })) : messages.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full", children: _jsx("p", { className: "text-slate-400 text-sm text-center", children: "Start the conversation \u2014 I'm here to listen. \uD83C\uDF3F" }) })) : (_jsx(_Fragment, { children: messages.map((msg) => (_jsx(MessageBubble, { message: msg }, msg.id))) })), sending && _jsx(TypingIndicator, {}), _jsx("div", { ref: messagesEndRef })] }), error && (_jsxs("div", { className: "mx-4 mb-3 flex items-center justify-between gap-2 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg", role: "alert", children: [_jsx("span", { children: error }), _jsx("button", { className: "text-red-500 hover:text-red-700 text-lg leading-none cursor-pointer shrink-0", onClick: () => setState((s) => ({ ...s, error: null })), "aria-label": "Dismiss error", children: "\u2715" })] })), _jsxs("div", { className: "px-4 md:px-6 pb-4 shrink-0 border-t border-slate-100 bg-white pt-3", children: [_jsxs("div", { className: "flex gap-2 items-end", children: [_jsx("textarea", { id: "chat-input", ref: textareaRef, value: input, onChange: (e) => setInput(e.target.value), onKeyDown: handleKeyDown, placeholder: "Type a message\u2026 (Enter to send, Shift+Enter for newline)", rows: 1, disabled: sending, "aria-label": "Message input", className: "flex-1 resize-none bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed max-h-40 overflow-y-auto" }), _jsx("button", { id: "btn-send-message", onClick: handleSend, disabled: sending || !input.trim(), "aria-label": "Send message", className: "shrink-0 bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white font-medium text-sm px-5 py-3 rounded-xl transition cursor-pointer disabled:cursor-not-allowed", children: sending ? '…' : 'Send' })] }), _jsx("p", { className: "text-xs text-slate-400 mt-2 px-1", children: "MindCare AI provides emotional support, not medical advice. If you're in crisis, please contact emergency services." })] })] }))] })] }));
}
//# sourceMappingURL=Chat.js.map