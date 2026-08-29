import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  MessageSquare,
  Send,
  Paperclip,
  Hash,
  Bot,
  User,
  Sparkles,
  CheckCheck,
} from 'lucide-react';
import { M3Card } from '../ui/M3Card';
import { M3Button } from '../ui/M3Button';
import { M3Badge } from '../ui/M3Badge';
import { Channel, Message } from '@/lib/mock-data';

export interface MessagesViewProps {
  channels: Channel[];
  messages: Message[];
  onSendMessage: (channelId: string, text: string) => void;
  openAiAssistant: () => void;
}

export const MessagesView: React.FC<MessagesViewProps> = ({
  channels,
  messages,
  onSendMessage,
  openAiAssistant,
}) => {
  const [activeChannelId, setActiveChannelId] = useState<string>(channels[0]?.id || 'chan-general');
  const [inputMessage, setInputMessage] = useState('');

  const activeChannel = channels.find((c) => c.id === activeChannelId) || channels[0];
  const channelMessages = messages.filter((m) => m.channelId === activeChannelId);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    onSendMessage(activeChannelId, inputMessage);
    setInputMessage('');
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--m3-on-surface)] flex items-center gap-2">
            <MessageSquare className="w-6 h-6 text-[var(--m3-primary)]" />
            Workspace Chat & Direct Messaging
          </h1>
          <p className="text-xs text-[var(--m3-on-surface-variant)]">
            Encrypted workspace channels with your dedicated Account Lead and Solutions Architects.
          </p>
        </div>

        <M3Button
          variant="filled"
          icon={<Sparkles className="w-4 h-4" />}
          onClick={openAiAssistant}
        >
          Ask Gemini AI Assistant
        </M3Button>
      </div>

      {/* Main Chat Container */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 h-[600px]">
        {/* Left Channels List */}
        <M3Card variant="filled" className="p-3 space-y-2 flex flex-col md:col-span-1 overflow-y-auto">
          <p className="text-[11px] font-bold text-[var(--m3-on-surface-variant)] uppercase tracking-wider px-2 pt-1">
            Channels ({channels.length})
          </p>

          {channels.map((chan) => {
            const isActive = chan.id === activeChannelId;

            return (
              <button
                key={chan.id}
                onClick={() => setActiveChannelId(chan.id)}
                className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-bold shadow-xs'
                    : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <Hash className="w-4 h-4 shrink-0 text-[var(--m3-primary)]" />
                  <span className="truncate">{chan.name}</span>
                </div>

                {chan.unreadCount > 0 && (
                  <span className="px-2 py-0.5 rounded-full bg-[var(--m3-error)] text-[var(--m3-on-error)] text-[10px] font-bold">
                    {chan.unreadCount}
                  </span>
                )}
              </button>
            );
          })}
        </M3Card>

        {/* Right Chat Thread */}
        <M3Card variant="filled" className="md:col-span-3 flex flex-col h-full overflow-hidden p-0">
          {/* Thread Header */}
          <div className="p-4 border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container-high)] flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-[var(--m3-on-surface)] flex items-center gap-2">
                <Hash className="w-4 h-4 text-[var(--m3-primary)]" />
                {activeChannel?.name}
              </h3>
              <p className="text-[11px] text-[var(--m3-on-surface-variant)] truncate">
                {activeChannel?.topic}
              </p>
            </div>

            <M3Badge variant="success" size="sm">
              Online SLA
            </M3Badge>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {channelMessages.map((msg) => (
              <div key={msg.id} className="flex gap-3 items-start">
                <img
                  src={msg.sender.avatar}
                  alt={msg.sender.name}
                  className="w-8 h-8 rounded-full object-cover shrink-0 mt-1"
                  referrerPolicy="no-referrer"
                />

                <div className="space-y-1 max-w-xl">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-[var(--m3-on-surface)]">
                      {msg.sender.name}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)]">
                      {msg.sender.role}
                    </span>
                    <span className="text-[10px] text-[var(--m3-on-surface-variant)]">
                      {msg.timestamp}
                    </span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-[var(--m3-surface-container-lowest)] text-xs text-[var(--m3-on-surface)] border border-[var(--m3-outline-variant)]">
                    {msg.content}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input Box */}
          <div className="p-4 bg-[var(--m3-surface-container-high)] border-t border-[var(--m3-outline-variant)]">
            <form onSubmit={handleSend} className="flex items-center gap-2">
              <button
                type="button"
                className="p-2.5 rounded-full hover:bg-[var(--m3-surface-container-highest)] text-[var(--m3-on-surface-variant)] cursor-pointer"
                onClick={() => alert('Attachment simulation: File attached.')}
              >
                <Paperclip className="w-4 h-4" />
              </button>

              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder={`Message #${activeChannel?.name}...`}
                className="flex-1 bg-[var(--m3-surface-container-lowest)] text-xs rounded-full px-4 py-3 focus:outline-hidden text-[var(--m3-on-surface)] placeholder-[var(--m3-on-surface-variant)] border border-transparent focus:border-[var(--m3-outline)]"
              />

              <M3Button variant="filled" size="sm" type="submit" icon={<Send className="w-4 h-4" />}>
                Send
              </M3Button>
            </form>
          </div>
        </M3Card>
      </div>
    </div>
  );
};
