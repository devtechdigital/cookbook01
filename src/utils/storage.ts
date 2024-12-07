import { Recipe, CookbookSettings, Cookbook } from '../types/cookbook';

const STORAGE_KEYS = {
  CURRENT_COOKBOOK_ID: 'familyCookbook_currentId',
  COOKBOOKS: 'familyCookbook_cookbooks',
} as const;

export const defaultSettings: CookbookSettings = {
  id: 'default',
  name: 'Our Family Cookbook',
  theme: 'warm',
  subtitle: 'Preserving our family\'s culinary heritage, one recipe at a time',
  coverImage: 'https://images.unsplash.com/photo-1495521821757-a1efb6729352?q=80&w=2062&auto=format&fit=crop',
};

export const createNewCookbook = (settings: Partial<CookbookSettings> = {}): Cookbook => ({
  settings: {
    ...defaultSettings,
    id: crypto.randomUUID(),
    ...settings,
  },
  recipes: [],
});

export const getCurrentCookbookId = (): string => {
  const id = localStorage.getItem(STORAGE_KEYS.CURRENT_COOKBOOK_ID);
  return id || defaultSettings.id;
};

export const setCurrentCookbookId = (id: string): void => {
  localStorage.setItem(STORAGE_KEYS.CURRENT_COOKBOOK_ID, id);
};

export const getCookbooks = (): Cookbook[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.COOKBOOKS);
    if (!stored) {
      const defaultCookbook = createNewCookbook();
      saveCookbooks([defaultCookbook]);
      return [defaultCookbook];
    }
    return JSON.parse(stored);
  } catch (error) {
    console.error('Error reading cookbooks:', error);
    return [createNewCookbook()];
  }
};

export const saveCookbooks = (cookbooks: Cookbook[]): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.COOKBOOKS, JSON.stringify(cookbooks));
  } catch (error) {
    console.error('Error saving cookbooks:', error);
  }
};

export const getCurrentCookbook = (): Cookbook => {
  const cookbooks = getCookbooks();
  const currentId = getCurrentCookbookId();
  return cookbooks.find(cb => cb.settings.id === currentId) || cookbooks[0];
};

export const saveCookbook = (cookbook: Cookbook): void => {
  const cookbooks = getCookbooks();
  const index = cookbooks.findIndex(cb => cb.settings.id === cookbook.settings.id);
  
  if (index >= 0) {
    cookbooks[index] = cookbook;
  } else {
    cookbooks.push(cookbook);
  }
  
  saveCookbooks(cookbooks);
};

export const deleteCookbook = (id: string): void => {
  const cookbooks = getCookbooks().filter(cb => cb.settings.id !== id);
  if (cookbooks.length === 0) {
    cookbooks.push(createNewCookbook());
  }
  saveCookbooks(cookbooks);
  
  if (getCurrentCookbookId() === id) {
    setCurrentCookbookId(cookbooks[0].settings.id);
  }
};

export const duplicateCookbook = (id: string, newName: string): Cookbook => {
  const cookbooks = getCookbooks();
  const cookbook = cookbooks.find(cb => cb.settings.id === id);
  
  if (!cookbook) {
    throw new Error('Cookbook not found');
  }
  
  const newCookbook: Cookbook = {
    settings: {
      ...cookbook.settings,
      id: crypto.randomUUID(),
      name: newName,
    },
    recipes: [...cookbook.recipes],
  };
  
  cookbooks.push(newCookbook);
  saveCookbooks(cookbooks);
  return newCookbook;
};