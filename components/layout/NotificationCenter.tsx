import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, Check, Trash2, Receipt, Briefcase, ShieldCheck, CheckCheck } from 'lucide-react';

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  type: 'invoice' | 'project' | 'security';
}

export interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllAsRead: () => void;
  onClearAll: () => void;
  onSelectNotification: (id: string) => void;
}

export const NotificationCenter: React.FC<NotificationCenterProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllAsRead,
  onClearAll,
  onSelectNotification,
}) => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const filtered = notifications.filter((n) => (filter === 'unread' ? !n.read : true));

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-end pt-16 pr-4 sm:pr-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-transparent"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            className="relative w-full max-w-sm bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)] rounded-3xl p-4 shadow-2xl border border-[var(--m3-outline-variant)] z-10 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between pb-3 border-b border-[var(--m3-outline-variant)]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[var(--m3-primary)]" />
                <h3 className="font-semibold text-xs text-[var(--m3-on-surface)]">
                  Notifications ({notifications.filter((n) => !n.read).length} unread)
                </h3>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={onMarkAllAsRead}
                  className="p-1.5 rounded-lg hover:bg-[var(--m3-surface-container-highest)] text-[11px] text-[var(--m3-primary)] font-medium cursor-pointer flex items-center gap-1"
                  title="Mark all as read"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Mark read</span>
                </button>
                <button
                  onClick={onClearAll}
                  className="p-1.5 rounded-lg hover:bg-[var(--m3-error-container)] text-[11px] text-[var(--m3-error)] cursor-pointer"
                  title="Clear all"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Filter Tabs */}
            <div className="flex gap-2 my-3">
              <button
                onClick={() => setFilter('all')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                    : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)]'
                }`}
              >
                All
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`text-xs px-3 py-1 rounded-full font-medium transition-colors cursor-pointer ${
                  filter === 'unread'
                    ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                    : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)]'
                }`}
              >
                Unread
              </button>
            </div>

            {/* List */}
            <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar">
              {filtered.length === 0 ? (
                <div className="p-6 text-center text-xs text-[var(--m3-on-surface-variant)]">
                  No notifications to display.
                </div>
              ) : (
                filtered.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => onSelectNotification(item.id)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                      !item.read
                        ? 'bg-[var(--m3-surface-container-lowest)] border-[var(--m3-primary)]/40 shadow-xs'
                        : 'bg-[var(--m3-surface-container-low)] border-transparent opacity-70'
                    }`}
                  >
                    <div className="p-2 rounded-xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] shrink-0 mt-0.5">
                      {item.type === 'invoice' ? (
                        <Receipt className="w-3.5 h-3.5 text-[var(--m3-primary)]" />
                      ) : item.type === 'project' ? (
                        <Briefcase className="w-3.5 h-3.5 text-[var(--m3-primary)]" />
                      ) : (
                        <ShieldCheck className="w-3.5 h-3.5 text-[var(--m3-primary)]" />
                      )}
                    </div>

                    <div className="flex-1 overflow-hidden">
                      <p className="font-semibold text-xs text-[var(--m3-on-surface)] truncate">
                        {item.title}
                      </p>
                      <p className="text-[11px] text-[var(--m3-on-surface-variant)] line-clamp-2">
                        {item.description}
                      </p>
                      <span className="text-[10px] text-[var(--m3-on-surface-variant)]/80 mt-1 block">
                        {item.timestamp}
                      </span>
                    </div>

                    {!item.read && (
                      <span className="w-2 h-2 rounded-full bg-[var(--m3-primary)] shrink-0 mt-2" />
                    )}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
