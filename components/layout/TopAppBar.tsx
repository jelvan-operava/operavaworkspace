import React, { useState } from 'react';
import {
  Search,
  Bell,
  Sparkles,
  Palette,
  Command,
  ChevronDown,
  Check,
  LogOut,
  Building2,
  Shield,
  HelpCircle,
} from 'lucide-react';
import { CompanyProfile } from '@/lib/mock-data';
import { ViewId } from './NavRail';

export interface TopAppBarProps {
  company?: CompanyProfile;
  companyName?: string;
  clientName?: string;
  avatarUrl?: string;
  activeView?: ViewId;
  currentView?: ViewId;
  openCommandPalette?: () => void;
  onOpenSearch?: () => void;
  openAiAssistant?: () => void;
  onOpenAiAssistant?: () => void;
  openThemeCustomizer?: () => void;
  onOpenThemeModal?: () => void;
  openNotifications?: () => void;
  onOpenNotifications?: () => void;
  unreadNotificationsCount?: number;
  currentThemeName?: string;
}

export const TopAppBar: React.FC<TopAppBarProps> = ({
  company,
  companyName,
  clientName,
  avatarUrl,
  openCommandPalette,
  onOpenSearch,
  openAiAssistant,
  onOpenAiAssistant,
  openThemeCustomizer,
  onOpenThemeModal,
  openNotifications,
  onOpenNotifications,
  unreadNotificationsCount = 2,
}) => {
  const [isWorkspaceMenuOpen, setIsWorkspaceMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const compName = companyName || company?.name || 'Apex Digital Systems';
  const cliName = clientName || company?.clientName || 'Julian Vance';
  const avatar = avatarUrl || company?.clientAvatar || 'https://picsum.photos/seed/julian/120/120';

  const handleSearch = onOpenSearch || openCommandPalette || (() => {});
  const handleAi = onOpenAiAssistant || openAiAssistant || (() => {});
  const handleTheme = onOpenThemeModal || openThemeCustomizer || (() => {});
  const handleNotif = onOpenNotifications || openNotifications || (() => {});

  return (
    <header className="h-16 sticky top-0 z-20 bg-[var(--m3-surface)]/90 backdrop-blur-md border-b border-[var(--m3-outline-variant)] text-[var(--m3-on-surface)] flex items-center justify-between px-4 sm:px-6 gap-4">
      {/* Left: Workspace Selector */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <button
            onClick={() => setIsWorkspaceMenuOpen(!isWorkspaceMenuOpen)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-full hover:bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] text-xs font-medium cursor-pointer transition-colors"
          >
            <div className="w-5 h-5 rounded-full bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] flex items-center justify-center font-bold text-[10px]">
              A
            </div>
            <span className="font-semibold text-[var(--m3-on-surface)]">{compName}</span>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--m3-on-surface-variant)]" />
          </button>

          {isWorkspaceMenuOpen && (
            <div className="absolute left-0 mt-2 w-64 rounded-2xl bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] shadow-xl p-2 z-50 text-xs">
              <div className="p-2 font-semibold text-[var(--m3-on-surface-variant)] uppercase text-[10px]">
                Active Workspaces
              </div>
              <div className="p-2.5 rounded-xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-bold flex items-center justify-between">
                <span>{compName}</span>
                <Check className="w-4 h-4" />
              </div>
              <div className="p-2.5 rounded-xl hover:bg-[var(--m3-surface-container-highest)] text-[var(--m3-on-surface)] font-medium flex items-center justify-between cursor-pointer mt-1">
                <span>Apex Staging & Sandbox</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Center: Search Launcher */}
      <div className="hidden sm:flex flex-1 max-w-md mx-4">
        <button
          onClick={handleSearch}
          className="w-full flex items-center justify-between px-4 py-2 rounded-full bg-[var(--m3-surface-container-low)] hover:bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] text-xs text-[var(--m3-on-surface-variant)] cursor-pointer transition-colors"
        >
          <div className="flex items-center gap-2">
            <Search className="w-4 h-4 text-[var(--m3-primary)]" />
            <span>Search invoices, projects, contracts, files...</span>
          </div>
          <kbd className="px-2 py-0.5 rounded-md bg-[var(--m3-surface-container)] font-mono text-[10px] border border-[var(--m3-outline-variant)]">
            ⌘K
          </kbd>
        </button>
      </div>

      {/* Right: Quick Action Controls */}
      <div className="flex items-center gap-2">
        {/* Gemini AI Action */}
        <button
          onClick={handleAi}
          className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-[var(--m3-primary)] to-[var(--m3-tertiary)] text-[var(--m3-on-primary)] font-semibold text-xs shadow-xs hover:shadow-md transition-all cursor-pointer"
        >
          <Sparkles className="w-4 h-4 animate-pulse" />
          <span className="hidden md:inline">Gemini AI</span>
        </button>

        {/* Theme System Customizer */}
        <button
          onClick={handleTheme}
          className="p-2 rounded-full hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)] transition-colors cursor-pointer relative"
          title="Customize Material 3 Color Theme"
        >
          <Palette className="w-5 h-5" />
        </button>

        {/* Notifications */}
        <button
          onClick={handleNotif}
          className="p-2 rounded-full hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)] transition-colors cursor-pointer relative"
          title="Notification Center"
        >
          <Bell className="w-5 h-5" />
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[var(--m3-primary)] animate-ping" />
          )}
          {unreadNotificationsCount > 0 && (
            <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-[var(--m3-primary)]" />
          )}
        </button>

        {/* User Profile Avatar */}
        <div className="relative ml-2">
          <button
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className="flex items-center gap-2 cursor-pointer"
          >
            <img
              src={avatar}
              alt={cliName}
              className="w-8 h-8 rounded-full object-cover border border-[var(--m3-primary)] shadow-2xs"
              referrerPolicy="no-referrer"
            />
          </button>

          {isProfileMenuOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl bg-[var(--m3-surface-container-high)] border border-[var(--m3-outline-variant)] shadow-xl p-2 z-50 text-xs">
              <div className="p-3 border-b border-[var(--m3-outline-variant)]">
                <p className="font-bold text-[var(--m3-on-surface)]">{cliName}</p>
                <p className="text-[11px] text-[var(--m3-on-surface-variant)]">
                  {company?.clientEmail || 'julian.vance@apexdigital.com'}
                </p>
              </div>

              <div className="p-1 space-y-1">
                <button
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full text-left p-2 rounded-xl hover:bg-[var(--m3-surface-container-highest)] flex items-center gap-2 text-[var(--m3-on-surface)] cursor-pointer"
                >
                  <Shield className="w-4 h-4 text-[var(--m3-primary)]" />
                  <span>Security & SOC2 Settings</span>
                </button>
                <button
                  onClick={() => setIsProfileMenuOpen(false)}
                  className="w-full text-left p-2 rounded-xl hover:bg-[var(--m3-surface-container-highest)] flex items-center gap-2 text-[var(--m3-on-surface)] cursor-pointer"
                >
                  <HelpCircle className="w-4 h-4 text-[var(--m3-primary)]" />
                  <span>Support SLA Desk</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
