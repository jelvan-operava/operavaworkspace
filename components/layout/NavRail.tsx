import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  LayoutDashboard,
  Building2,
  Users,
  Briefcase,
  Receipt,
  Send,
  BellRing,
  FileText,
  Folder,
  MessageSquare,
  HelpCircle,
  Calendar,
  BarChart3,
  ShieldCheck,
  BookOpen,
  Settings,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Command,
} from 'lucide-react';

export type ViewId =
  | 'dashboard'
  | 'crm'
  | 'invoices'
  | 'email-blasting'
  | 'monthly-notifications'
  | 'client-portal'
  | 'projects'
  | 'contracts'
  | 'files'
  | 'messages'
  | 'support'
  | 'calendar'
  | 'analytics'
  | 'security'
  | 'audit-logs'
  | 'knowledge'
  | 'kb'
  | 'settings';

export interface NavRailProps {
  currentView?: ViewId;
  activeView?: ViewId;
  onSelectView?: (view: ViewId) => void;
  onNavigate?: (view: ViewId) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  unreadCount?: number;
  unreadMessagesCount?: number;
  openAiAssistant?: () => void;
  openCommandPalette?: () => void;
}

interface NavItem {
  id: ViewId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  badgeVariant?: 'primary' | 'error' | 'warning';
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'client-portal', label: 'Client Dashboard', icon: Building2, badge: 'Portal', badgeVariant: 'primary' },
  { id: 'crm', label: 'CRM & Pipeline', icon: Users, badge: '4 Deals', badgeVariant: 'primary' },
  { id: 'invoices', label: 'Invoicing & Pay', icon: Receipt, badge: '1 Due', badgeVariant: 'warning' },
  { id: 'email-blasting', label: 'Email Blasting', icon: Send, badge: 'New', badgeVariant: 'primary' },
  { id: 'monthly-notifications', label: 'Monthly Alerts', icon: BellRing, badge: '4 Rules', badgeVariant: 'primary' },
  { id: 'projects', label: 'Projects & Tasks', icon: Briefcase, badge: '8', badgeVariant: 'primary' },
  { id: 'contracts', label: 'Contracts & MSA', icon: FileText },
  { id: 'files', label: 'Files & Assets', icon: Folder },
  { id: 'messages', label: 'Workspace Chat', icon: MessageSquare, badge: '2', badgeVariant: 'primary' },
  { id: 'support', label: 'Support & SLA', icon: HelpCircle, badge: '1', badgeVariant: 'primary' },
  { id: 'calendar', label: 'Calendar & Sync', icon: Calendar },
  { id: 'analytics', label: 'Financial Analytics', icon: BarChart3 },
  { id: 'security', label: 'SecOps & API Keys', icon: ShieldCheck },
  { id: 'audit-logs', label: 'Internal Audit Logs', icon: FileText, badge: 'SOC2', badgeVariant: 'primary' },
  { id: 'knowledge', label: 'Knowledge Base', icon: BookOpen },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export const NavRail: React.FC<NavRailProps> = ({
  currentView,
  activeView,
  onSelectView,
  onNavigate,
  isCollapsed: externalIsCollapsed,
  onToggleCollapse,
  openAiAssistant,
  openCommandPalette,
}) => {
  const [internalIsCollapsed, setInternalIsCollapsed] = useState(false);

  const collapsed = externalIsCollapsed !== undefined ? externalIsCollapsed : internalIsCollapsed;
  const toggleCollapse = onToggleCollapse || (() => setInternalIsCollapsed((prev) => !prev));

  const active = activeView || currentView || 'dashboard';
  const handleNavigate = (v: ViewId) => {
    const target = v === 'kb' ? 'knowledge' : v;
    if (onNavigate) onNavigate(target);
    if (onSelectView) onSelectView(target);
  };

  return (
    <motion.aside
      animate={{ width: collapsed ? 80 : 256 }}
      transition={{ type: 'spring', damping: 25, stiffness: 300 }}
      className="hidden md:flex flex-col h-screen sticky top-0 z-30 bg-[var(--m3-surface-container-low)] border-r border-[var(--m3-outline-variant)] text-[var(--m3-on-surface)] select-none shrink-0 overflow-hidden"
    >
      {/* Top Header Logo */}
      <div className="p-4 flex items-center justify-between h-16 border-b border-[var(--m3-outline-variant)]">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--m3-primary)] to-[var(--m3-tertiary)] text-[var(--m3-on-primary)] flex items-center justify-center font-bold text-lg shadow-sm shrink-0">
            G
          </div>
          {!collapsed && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col overflow-hidden whitespace-nowrap"
            >
              <span className="font-semibold text-sm tracking-tight text-[var(--m3-on-surface)]">
                Google Workspace
              </span>
              <span className="text-xs text-[var(--m3-on-surface-variant)]">
                Client Portal
              </span>
            </motion.div>
          )}
        </div>

        <button
          onClick={toggleCollapse}
          className="p-1.5 rounded-full hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)] transition-colors cursor-pointer shrink-0"
          title={collapsed ? 'Expand navigation' : 'Collapse navigation'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation Items List */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-1 custom-scrollbar">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = active === item.id || (active === 'knowledge' && item.id === 'kb');

          return (
            <button
              key={item.id}
              onClick={() => handleNavigate(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-2xl transition-all duration-200 cursor-pointer text-xs font-medium relative group ${
                isActive
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-bold shadow-xs'
                  : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)]'
              }`}
              title={collapsed ? item.label : undefined}
            >
              <div className="flex items-center gap-3 overflow-hidden">
                <Icon
                  className={`w-5 h-5 shrink-0 transition-transform duration-200 ${
                    isActive ? 'scale-110 text-[var(--m3-primary)]' : ''
                  }`}
                />
                {!collapsed && (
                  <span className="truncate whitespace-nowrap text-xs tracking-tight">
                    {item.label}
                  </span>
                )}
              </div>

              {!collapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full shadow-2xs shrink-0 ${
                    item.badgeVariant === 'warning'
                      ? 'bg-[var(--m3-warning-container)] text-[var(--m3-on-warning-container)]'
                      : item.badgeVariant === 'error'
                      ? 'bg-[var(--m3-error-container)] text-[var(--m3-on-error-container)]'
                      : 'bg-[var(--m3-primary)] text-[var(--m3-on-primary)]'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Floating Quick Action */}
      <div className="p-3 border-t border-[var(--m3-outline-variant)] bg-[var(--m3-surface-container-low)]">
        {openAiAssistant && (
          <button
            onClick={openAiAssistant}
            className={`w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-[var(--m3-primary)] to-[var(--m3-tertiary)] text-[var(--m3-on-primary)] font-semibold text-xs shadow-md hover:shadow-lg transition-all cursor-pointer ${
              collapsed ? 'px-0' : ''
            }`}
          >
            <Sparkles className="w-4 h-4 animate-pulse shrink-0" />
            {!collapsed && <span>Gemini Assistant</span>}
          </button>
        )}
      </div>
    </motion.aside>
  );
};
