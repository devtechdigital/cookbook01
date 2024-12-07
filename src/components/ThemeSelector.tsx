import React from 'react';
import { Palette } from 'lucide-react';
import type { CookbookSettings } from '../types/cookbook';

interface ThemeSelectorProps {
  currentTheme: CookbookSettings['theme'];
  onThemeChange: (theme: CookbookSettings['theme']) => void;
}

export function ThemeSelector({ currentTheme, onThemeChange }: ThemeSelectorProps) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2 flex items-center gap-2">
        <Palette className="w-4 h-4" />
        Theme
      </label>
      <div className="grid grid-cols-3 gap-4">
        {(['warm', 'cool', 'neutral'] as const).map((theme) => (
          <button
            key={theme}
            onClick={() => onThemeChange(theme)}
            className={`p-4 rounded-lg border transition-all ${
              currentTheme === theme
                ? 'border-amber-500 shadow-md'
                : 'border-gray-200 hover:border-amber-300'
            }`}
          >
            <div
              className={`h-8 rounded ${
                theme === 'warm'
                  ? 'bg-amber-100'
                  : theme === 'cool'
                  ? 'bg-blue-100'
                  : 'bg-gray-100'
              }`}
            />
            <span className="block text-sm mt-2 capitalize">{theme}</span>
          </button>
        ))}
      </div>
    </div>
  );
}