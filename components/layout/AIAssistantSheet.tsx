import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, X, Send, Bot, User, Copy, Check, RefreshCw } from 'lucide-react';
import { M3Button } from '../ui/M3Button';

export interface AIAssistantSheetProps {
  isOpen: boolean;
  onClose: () => void;
  contextText?: string;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
}

export const AIAssistantSheet: React.FC<AIAssistantSheetProps> = ({
  isOpen,
  onClose,
  contextText,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'assistant',
      text: 'Hello Julian! I am your Google Workspace Client Portal AI Assistant powered by Gemini 3.6 Flash. How can I assist you with your active projects, billing summaries, or technical contracts today?',
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const suggestedPrompts = [
    'Summarize our active project statuses and upcoming milestones',
    'What is the balance of Invoice #INV-2026-089?',
    'Draft a support update for Cloud Run domain SSL verification',
    'Explain our SLA response time guarantees',
  ];

  const handleSendPrompt = async (promptToSend?: string) => {
    const prompt = promptToSend || inputPrompt;
    if (!prompt.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${crypto.randomUUID()}`,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!promptToSend) setInputPrompt('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: contextText || 'Workspace Client Portal active overview',
        }),
      });

      const data = await res.json();
      const aiText = data.text || data.error || 'No answer available.';

      const aiMsg: ChatMessage = {
        id: `assistant-${crypto.randomUUID()}`,
        sender: 'assistant',
        text: aiText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          sender: 'assistant',
          text: 'Unable to reach Gemini AI service. Please check your network connection.',
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/40 backdrop-blur-xs"
          />

          {/* Drawer Slide Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-full max-w-lg bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)] shadow-2xl border-l border-[var(--m3-outline-variant)] flex flex-col z-10"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 flex items-center justify-between border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container-lowest)]">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-gradient-to-br from-[var(--m3-primary)] to-[var(--m3-tertiary)] text-[var(--m3-on-primary)] shadow-sm">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-[var(--m3-on-surface)] flex items-center gap-2">
                    Gemini AI Assistant
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-medium">
                      gemini-3.6-flash
                    </span>
                  </h3>
                  <p className="text-xs text-[var(--m3-on-surface-variant)]">
                    Context-aware Google Workspace Client Intelligence
                  </p>
                </div>
              </div>

              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-[var(--m3-surface-container-highest)] text-[var(--m3-on-surface-variant)] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.sender === 'assistant' && (
                    <div className="w-8 h-8 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center shrink-0 mt-1">
                      <Bot className="w-4 h-4 text-[var(--m3-primary)]" />
                    </div>
                  )}

                  <div
                    className={`max-w-[85%] rounded-3xl p-4 text-xs leading-relaxed shadow-xs relative group ${
                      msg.sender === 'user'
                        ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)] rounded-br-xs'
                        : 'bg-[var(--m3-surface-container-lowest)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] rounded-bl-xs'
                    }`}
                  >
                    <div className="whitespace-pre-wrap">{msg.text}</div>

                    <div
                      className={`flex items-center justify-between gap-2 mt-2 pt-1 border-t text-[10px] ${
                        msg.sender === 'user'
                          ? 'border-[var(--m3-on-primary)]/20 text-[var(--m3-on-primary)]/80'
                          : 'border-[var(--m3-outline-variant)] text-[var(--m3-on-surface-variant)]'
                      }`}
                    >
                      <span>{msg.timestamp}</span>

                      {msg.sender === 'assistant' && (
                        <button
                          onClick={() => copyToClipboard(msg.id, msg.text)}
                          className="hover:opacity-100 opacity-60 transition-opacity cursor-pointer flex items-center gap-1"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-3 h-3 text-[var(--m3-success)]" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                          <span>Copy</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {msg.sender === 'user' && (
                    <div className="w-8 h-8 rounded-full bg-[var(--m3-secondary-container)] text-[var(--m3-on-secondary-container)] flex items-center justify-center shrink-0 mt-1">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </div>
              ))}

              {isLoading && (
                <div className="flex items-center gap-3 text-xs text-[var(--m3-primary)] p-3 rounded-2xl bg-[var(--m3-primary-container)]/50">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Gemini is generating response...</span>
                </div>
              )}
            </div>

            {/* Quick Suggested Chips */}
            <div className="p-3 border-t border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container-low)]">
              <p className="text-[11px] font-semibold text-[var(--m3-on-surface-variant)] mb-2">
                Suggested Prompts
              </p>
              <div className="flex flex-wrap gap-1.5">
                {suggestedPrompts.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSendPrompt(chip)}
                    className="text-[11px] px-3 py-1 rounded-full bg-[var(--m3-surface-container-high)] hover:bg-[var(--m3-surface-container-highest)] text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)] transition-colors cursor-pointer text-left truncate max-w-full"
                  >
                    {chip}
                  </button>
                ))}
              </div>
            </div>

            {/* Footer Input */}
            <div className="p-4 bg-[var(--m3-surface-container-lowest)] border-t border-[var(--m3-outline-variant)]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendPrompt();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  value={inputPrompt}
                  onChange={(e) => setInputPrompt(e.target.value)}
                  placeholder="Ask Gemini AI anything..."
                  className="flex-1 bg-[var(--m3-surface-container)] text-xs rounded-full px-4 py-3 focus:outline-hidden text-[var(--m3-on-surface)] placeholder-[var(--m3-on-surface-variant)] border border-transparent focus:border-[var(--m3-outline)] transition-all"
                  disabled={isLoading}
                />
                <M3Button
                  variant="filled"
                  size="sm"
                  type="submit"
                  disabled={!inputPrompt.trim() || isLoading}
                  icon={<Send className="w-4 h-4" />}
                >
                  Send
                </M3Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
