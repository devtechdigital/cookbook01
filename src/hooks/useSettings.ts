import { useCookbooks } from './useCookbooks';

export function useSettings() {
  const { currentCookbook, updateCookbook } = useCookbooks();

  const updateSettings = (newSettings: Partial<typeof currentCookbook.settings>) => {
    updateCookbook({
      ...currentCookbook,
      settings: { ...currentCookbook.settings, ...newSettings },
    });
  };

  return { settings: currentCookbook.settings, updateSettings };
}