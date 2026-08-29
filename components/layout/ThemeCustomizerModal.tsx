import React from 'react';
import { Palette, Sun, Moon, Check } from 'lucide-react';
import { M3Dialog } from '../ui/M3Dialog';
import { M3Button } from '../ui/M3Button';
import { ColorTheme, THEME_SCHEMES } from '@/lib/m3-theme';

export interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentTheme: ColorTheme;
  onChangeTheme: (theme: ColorTheme) => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  currentTheme,
  onChangeTheme,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const themes: ColorTheme[] = [
    'google-blue',
    'purple-violet',
    'emerald-teal',
    'coral-sunset',
    'amber-gold',
  ];

  return (
    <M3Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Material 3 Dynamic Color System"
      icon={<Palette className="w-5 h-5" />}
      actions={
        <M3Button variant="filled" onClick={onClose}>
          Apply & Close
        </M3Button>
      }
    >
      <div className="space-y-6">
        <p className="text-xs text-[var(--m3-on-surface-variant)]">
          Select a Material You dynamic seed palette. Accent colors, surface container shades, and contrast ratios recalculate in real-time at 60FPS.
        </p>

        {/* Dark / Light Toggle */}
        <div className="p-4 rounded-2xl bg-[var(--m3-surface-container-lowest)] border border-[var(--m3-outline-variant)] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[var(--m3-primary-container)] text-[var(--m3-on-primary-container)]">
              {isDarkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </div>
            <div>
              <p className="font-semibold text-xs text-[var(--m3-on-surface)]">
                {isDarkMode ? 'Dark Mode Surface' : 'Light Mode Surface'}
              </p>
              <p className="text-[11px] text-[var(--m3-on-surface-variant)]">
                High contrast WCAG AA+ accessible color tokens
              </p>
            </div>
          </div>

          <button
            onClick={onToggleDarkMode}
            className={`w-14 h-8 rounded-full transition-colors duration-200 p-1 flex items-center cursor-pointer ${
              isDarkMode ? 'bg-[var(--m3-primary)] justify-end' : 'bg-[var(--m3-surface-container-highest)] justify-start'
            }`}
          >
            <span className="w-6 h-6 rounded-full bg-white shadow-md flex items-center justify-center text-xs">
              {isDarkMode ? '🌙' : '☀️'}
            </span>
          </button>
        </div>

        {/* Palettes Grid */}
        <div>
          <h4 className="text-xs font-semibold text-[var(--m3-on-surface)] mb-3">
            Dynamic Color Seed Presets
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {themes.map((themeKey) => {
              const theme = THEME_SCHEMES[themeKey];
              const isSelected = currentTheme === themeKey;

              return (
                <button
                  key={themeKey}
                  onClick={() => onChangeTheme(themeKey)}
                  className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                    isSelected
                      ? 'border-[var(--m3-primary)] bg-[var(--m3-primary-container)]/30 ring-2 ring-[var(--m3-primary)]/20'
                      : 'border-[var(--m3-outline-variant)] hover:bg-[var(--m3-surface-container-lowest)]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span
                      className="w-7 h-7 rounded-full shadow-inner flex items-center justify-center shrink-0"
                      style={{ backgroundColor: theme.primaryHex }}
                    />
                    <span className="text-xs font-semibold text-[var(--m3-on-surface)]">
                      {theme.name}
                    </span>
                  </div>

                  {isSelected && <Check className="w-4 h-4 text-[var(--m3-primary)]" />}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </M3Dialog>
  );
};
