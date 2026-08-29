import React, { useState } from 'react';
import { NAV_ITEMS, ViewId } from './NavRail';
import { Menu, X, Sparkles, ChevronRight } from 'lucide-react';

interface MobileNavProps {
  activeView: ViewId;
  onNavigate: (viewId: ViewId) => void;
  openAiAssistant?: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  activeView,
  onNavigate,
  openAiAssistant,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Quick primary tabs for bottom strip
  const quickTabs: ViewId[] = ['dashboard', 'crm', 'invoices', 'email-blasting', 'monthly-notifications'];

  return (
    <>
      {/* Top Mobile Bar - All Tabs Scrollable Strip */}
      <div className="md:hidden bg-[var(--m3-surface-container-low)] border-b border-[var(--m3-outline-variant)] px-3 py-2 flex items-center gap-2 overflow-x-auto custom-scrollbar sticky top-16 z-20 shadow-2xs">
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--m3-primary)] text-[var(--m3-on-primary)] font-bold text-xs shrink-0 cursor-pointer shadow-xs"
        >
          <Menu className="w-4 h-4" />
          <span>All Tabs ({NAV_ITEMS.length})</span>
        </button>

        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeView === item.id || (activeView === 'knowledge' && item.id === 'kb');
          return (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id === 'kb' ? 'knowledge' : item.id);
              }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap shrink-0 transition-all cursor-pointer ${
                isActive
                  ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)] font-bold shadow-2xs'
                  : 'bg-[var(--m3-surface-container)] text-[var(--m3-on-surface-variant)] hover:bg-[var(--m3-surface-container-high)]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>

      {/* Full-Screen All Tabs Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-start md:hidden">
          <div className="w-4/5 max-w-xs bg-[var(--m3-surface)] text-[var(--m3-on-surface)] h-full flex flex-col p-4 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-[var(--m3-outline-variant)]">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[var(--m3-primary)] to-[var(--m3-tertiary)] text-[var(--m3-on-primary)] flex items-center justify-center font-bold text-sm">
                  G
                </div>
                <span className="font-bold text-sm">Client Portal Tabs</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-[var(--m3-surface-container-high)]"
              >
                <X className="w-5 h-5 text-[var(--m3-on-surface-variant)]" />
              </button>
            </div>

            <nav className="flex-1 py-4 space-y-1">
              <p className="px-2 pb-2 text-[10px] font-bold uppercase tracking-wider text-[var(--m3-on-surface-variant)]">
                All Navigation Tabs
              </p>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = activeView === item.id || (activeView === 'knowledge' && item.id === 'kb');
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      onNavigate(item.id === 'kb' ? 'knowledge' : item.id);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center justify-between p-3 rounded-2xl text-xs font-semibold cursor-pointer transition-colors ${
                      isActive
                        ? 'bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]'
                        : 'hover:bg-[var(--m3-surface-container-high)] text-[var(--m3-on-surface)]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-[var(--m3-primary)]" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge ? (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[var(--m3-primary)] text-[var(--m3-on-primary)] font-bold">
                        {item.badge}
                      </span>
                    ) : (
                      <ChevronRight className="w-4 h-4 text-[var(--m3-on-surface-variant)] opacity-50" />
                    )}
                  </button>
                );
              })}
            </nav>

            {openAiAssistant && (
              <button
                onClick={() => {
                  setIsOpen(false);
                  openAiAssistant();
                }}
                className="w-full flex items-center justify-center gap-2 p-3 rounded-2xl bg-gradient-to-r from-[var(--m3-primary)] to-[var(--m3-tertiary)] text-[var(--m3-on-primary)] font-bold text-xs shadow-md mt-auto"
              >
                <Sparkles className="w-4 h-4" />
                <span>Launch Gemini AI</span>
              </button>
            )}
          </div>
          <div className="flex-1" onClick={() => setIsOpen(false)} />
        </div>
      )}
    </>
  );
};
