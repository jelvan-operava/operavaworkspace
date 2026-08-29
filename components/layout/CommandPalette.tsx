import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Search,
  LayoutDashboard,
  Briefcase,
  Receipt,
  FileText,
  Folder,
  MessageSquare,
  HelpCircle,
  Calendar,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Settings,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { ViewId } from './NavRail';

export interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectView?: (view: ViewId) => void;
  onNavigate?: (view: ViewId) => void;
  openAiAssistant?: () => void;
}

interface CommandOption {
  id: string;
  title: string;
  category: 'Navigation' | 'Actions' | 'Recent';
  icon: React.ComponentType<{ className?: string }>;
  action: () => void;
  shortcut?: string;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onSelectView,
  onNavigate,
  openAiAssistant,
}) => {
  const navigate = (v: ViewId) => {
    if (onNavigate) onNavigate(v);
    if (onSelectView) onSelectView(v);
    onClose();
  };
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const options: CommandOption[] = [
    {
      id: 'nav-dashboard',
      title: 'Go to Dashboard Overview',
      category: 'Navigation',
      icon: LayoutDashboard,
      action: () => navigate('dashboard'),
    },
    {
      id: 'nav-projects',
      title: 'View Projects & Milestone Progress',
      category: 'Navigation',
      icon: Briefcase,
      action: () => navigate('projects'),
    },
    {
      id: 'nav-invoices',
      title: 'View Invoices & Pay Outstanding Balance',
      category: 'Navigation',
      icon: Receipt,
      action: () => navigate('invoices'),
    },
    {
      id: 'nav-contracts',
      title: 'Review Contracts & Statements of Work',
      category: 'Navigation',
      icon: FileText,
      action: () => navigate('contracts'),
    },
    {
      id: 'nav-files',
      title: 'Open File Manager & Asset Storage',
      category: 'Navigation',
      icon: Folder,
      action: () => navigate('files'),
    },
    {
      id: 'nav-messages',
      title: 'Workspace Chat & Team Communication',
      category: 'Navigation',
      icon: MessageSquare,
      action: () => navigate('messages'),
    },
    {
      id: 'nav-support',
      title: 'Open Support Tickets & SLA Desk',
      category: 'Navigation',
      icon: HelpCircle,
      action: () => navigate('support'),
    },
    {
      id: 'nav-calendar',
      title: 'Calendar & Meeting Scheduler',
      category: 'Navigation',
      icon: Calendar,
      action: () => navigate('calendar'),
    },
    {
      id: 'nav-client-portal',
      title: 'Open Client Self-Service Dashboard & Portal',
      category: 'Navigation',
      icon: Briefcase,
      action: () => navigate('client-portal'),
    },
    {
      id: 'nav-analytics',
      title: 'Financial & Project Analytics Reports',
      category: 'Navigation',
      icon: BarChart3,
      action: () => navigate('analytics'),
    },
    {
      id: 'nav-crm',
      title: 'Open CRM & Pipeline Opportunities',
      category: 'Navigation',
      icon: Briefcase,
      action: () => navigate('crm'),
    },
    {
      id: 'nav-email-blasting',
      title: 'Compose Email Blasting & Campaigns',
      category: 'Navigation',
      icon: FileText,
      action: () => navigate('email-blasting'),
    },
    {
      id: 'nav-monthly-notifications',
      title: 'Monthly Alerts & Automated Dispatch Rules',
      category: 'Navigation',
      icon: HelpCircle,
      action: () => navigate('monthly-notifications'),
    },
    {
      id: 'nav-audit-logs',
      title: 'View Internal Audit Logs & Compliance',
      category: 'Navigation',
      icon: ShieldCheck,
      action: () => navigate('audit-logs'),
    },
    {
      id: 'nav-security',
      title: 'SecOps Audit Logs & API Tokens',
      category: 'Navigation',
      icon: ShieldCheck,
      action: () => navigate('security'),
    },
    {
      id: 'nav-kb',
      title: 'Search Knowledge Base & Documentation',
      category: 'Navigation',
      icon: BookOpen,
      action: () => navigate('knowledge'),
    },
    {
      id: 'nav-settings',
      title: 'Company Settings & Billing Address',
      category: 'Navigation',
      icon: Settings,
      action: () => navigate('settings'),
    },
    {
      id: 'action-ai',
      title: 'Ask Gemini AI Assistant about invoices or tasks',
      category: 'Actions',
      icon: Sparkles,
      action: () => {
        onClose();
        openAiAssistant?.();
      },
      shortcut: 'AI',
    },
  ];

  const filteredOptions = options.filter((opt) =>
    opt.title.toLowerCase().includes(query.toLowerCase())
  );

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSelectedIndex(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      } else if (isOpen) {
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredOptions.length));
        } else if (e.key === 'ArrowUp') {
          e.preventDefault();
          setSelectedIndex((prev) => (prev - 1 + filteredOptions.length) % Math.max(1, filteredOptions.length));
        } else if (e.key === 'Enter') {
          e.preventDefault();
          if (filteredOptions[selectedIndex]) {
            filteredOptions[selectedIndex].action();
          }
        } else if (e.key === 'Escape') {
          onClose();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredOptions, selectedIndex, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 350 }}
            className="relative w-full max-w-2xl bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)] rounded-3xl shadow-2xl border border-[var(--m3-outline-variant)] overflow-hidden z-10"
          >
            {/* Input Search Header */}
            <div className="flex items-center gap-3 p-4 border-b border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container-lowest)]">
              <Search className="w-5 h-5 text-[var(--m3-primary)]" />
              <input
                type="text"
                value={query}
                onChange={handleQueryChange}
                placeholder="Type a command, search projects, invoices, or jump to view..."
                className="w-full bg-transparent text-sm focus:outline-hidden text-[var(--m3-on-surface)] placeholder-[var(--m3-on-surface-variant)] font-medium"
                autoFocus
              />
              <kbd className="px-2 py-1 rounded-md bg-[var(--m3-surface-container-high)] text-[11px] font-mono text-[var(--m3-on-surface-variant)]">
                ESC
              </kbd>
            </div>

            {/* Results List */}
            <div className="max-h-96 overflow-y-auto p-2 space-y-1 custom-scrollbar">
              {filteredOptions.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--m3-on-surface-variant)]">
                  No matching command found for &quot;{query}&quot;.
                </div>
              ) : (
                filteredOptions.map((opt, idx) => {
                  const Icon = opt.icon;
                  const isSelected = idx === selectedIndex;

                  return (
                    <button
                      key={opt.id}
                      onClick={opt.action}
                      onMouseEnter={() => setSelectedIndex(idx)}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-medium transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                          : 'hover:bg-[var(--m3-surface-container-highest)] text-[var(--m3-on-surface)]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected
                              ? 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)]'
                              : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <span className="font-semibold">{opt.title}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {opt.shortcut && (
                          <span className="px-2 py-0.5 rounded-full bg-[var(--m3-surface-container)] text-[10px] font-mono">
                            {opt.shortcut}
                          </span>
                        )}
                        <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                      </div>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer hints */}
            <div className="px-4 py-2.5 bg-[var(--m3-surface-container-low)] border-t border-[var(--m3-outline-variant)] flex items-center justify-between text-[11px] text-[var(--m3-on-surface-variant)]">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
              </div>
              <div className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[var(--m3-primary)]" />
                <span>Powered by Gemini 3</span>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
