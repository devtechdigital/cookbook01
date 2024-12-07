import React from 'react';
import { useSettings } from '../hooks/useSettings';
import { useCookbooks } from '../hooks/useCookbooks';
import { usePermissions } from '../hooks/usePermissions';
import { Utensils, RefreshCw } from 'lucide-react';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { CoverImage } from '../components/CoverImage';
import { ThemeSelector } from '../components/ThemeSelector';
import { CookbookSelector } from '../components/CookbookSelector';
import { FamilyManager } from '../components/FamilyManager';
import { resetRecipes } from '../utils/recipeOperations';

export default function Home() {
  const {
    cookbooks,
    currentCookbook,
    switchCookbook,
    createCookbook,
    updateCookbook,
    removeCookbook,
    duplicateCurrentCookbook,
  } = useCookbooks();

  const { canManageCookbooks } = usePermissions();

  const handleUpdateSettings = (updates: Partial<typeof currentCookbook.settings>) => {
    if (!canManageCookbooks()) return;
    updateCookbook({
      ...currentCookbook,
      settings: { ...currentCookbook.settings, ...updates },
    });
  };

  const handleDuplicate = (id: string) => {
    if (!canManageCookbooks()) return;
    const cookbook = cookbooks.find(cb => cb.settings.id === id);
    if (!cookbook) return;
    
    const newName = window.prompt('Enter a name for the new cookbook:', `${cookbook.settings.name} (Copy)`);
    if (!newName) return;
    
    duplicateCurrentCookbook(newName);
  };

  const handleDelete = (id: string) => {
    if (!canManageCookbooks()) return;
    if (!window.confirm('Are you sure you want to delete this cookbook?')) return;
    removeCookbook(id);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Hero Section */}
      <div className="relative">
        <div className="h-96 overflow-hidden rounded-xl shadow-xl">
          {currentCookbook.settings.coverImage ? (
            <img
              src={currentCookbook.settings.coverImage}
              alt="Cookbook Cover"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-300" />
          )}
          <div className="absolute inset-0 bg-black/40" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-5xl font-bold mb-4 text-center">
              {currentCookbook.settings.name}
            </h1>
            <p className="text-xl opacity-90">{currentCookbook.settings.subtitle}</p>
          </div>
        </div>
      </div>

      {/* Family Management */}
      <FamilyManager />

      {/* Cookbook Selection */}
      <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
        <CookbookSelector
          cookbooks={cookbooks}
          currentId={currentCookbook.settings.id}
          onSelect={switchCookbook}
          onNew={createCookbook}
          onDuplicate={handleDuplicate}
          onDelete={handleDelete}
        />
      </div>

      {canManageCookbooks() && (
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-lg p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold flex items-center gap-2">
              <Utensils className="w-6 h-6" />
              Cookbook Settings
            </h2>
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                if (window.confirm('Are you sure you want to reset all recipes? This cannot be undone.')) {
                  resetRecipes();
                }
              }}
              icon={RefreshCw}
              size="sm"
            >
              Reset All Recipes
            </Button>
          </div>

          <div className="space-y-6">
            <Input
              label="Cookbook Name"
              value={currentCookbook.settings.name}
              onChange={(e) => handleUpdateSettings({ name: e.target.value })}
              placeholder="Enter cookbook name"
            />

            <Input
              label="Subtitle"
              value={currentCookbook.settings.subtitle}
              onChange={(e) => handleUpdateSettings({ subtitle: e.target.value })}
              placeholder="Enter a subtitle"
            />

            <CoverImage
              image={currentCookbook.settings.coverImage}
              onChange={(url) => handleUpdateSettings({ coverImage: url })}
            />

            <ThemeSelector
              currentTheme={currentCookbook.settings.theme}
              onThemeChange={(theme) => handleUpdateSettings({ theme })}
            />
          </div>
        </div>
      )}
    </div>
  );
}