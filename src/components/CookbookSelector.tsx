import React from 'react';
import { Book, Plus, Copy, Trash2 } from 'lucide-react';
import { Button } from './ui/Button';
import { usePermissions } from '../hooks/usePermissions';
import type { Cookbook } from '../types/cookbook';

interface CookbookSelectorProps {
  cookbooks: Cookbook[];
  currentId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export function CookbookSelector({
  cookbooks,
  currentId,
  onSelect,
  onNew,
  onDuplicate,
  onDelete,
}: CookbookSelectorProps) {
  const { canManageCookbooks, canAccessCookbook } = usePermissions();
  const canManage = canManageCookbooks();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Book className="w-5 h-5" />
          Your Cookbooks
        </h3>
        {canManage && (
          <Button
            type="button"
            variant="secondary"
            onClick={onNew}
            icon={Plus}
            size="sm"
          >
            New Cookbook
          </Button>
        )}
      </div>
      
      <div className="space-y-2">
        {cookbooks.map((cookbook) => {
          const hasAccess = canAccessCookbook(cookbook.settings.id);
          if (!hasAccess) return null;

          return (
            <div
              key={cookbook.settings.id}
              className={`p-4 rounded-lg border transition-all ${
                cookbook.settings.id === currentId
                  ? 'border-amber-500 bg-amber-50'
                  : 'border-gray-200 hover:border-amber-300'
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => onSelect(cookbook.settings.id)}
                  className="flex-1 text-left"
                >
                  <h4 className="font-medium">{cookbook.settings.name}</h4>
                  <p className="text-sm text-gray-500">
                    {cookbook.recipes.length} recipes
                  </p>
                </button>
                
                {canManage && (
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      icon={Copy}
                      onClick={() => onDuplicate(cookbook.settings.id)}
                    >
                      Duplicate
                    </Button>
                    {cookbooks.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        icon={Trash2}
                        onClick={() => onDelete(cookbook.settings.id)}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}