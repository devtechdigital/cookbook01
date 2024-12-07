import React from 'react';
import { Clock, Edit } from 'lucide-react';
import type { Recipe } from '../types/cookbook';

interface RecipeCardProps {
  recipe: Recipe;
  onView: () => void;
  onEdit: () => void;
}

export function RecipeCard({ recipe, onView, onEdit }: RecipeCardProps) {
  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit();
  };
  
  return (
    <div
      onClick={onView}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group relative"
    >
      {recipe.primaryImage && (
        <img
          src={recipe.primaryImage}
          alt={recipe.title}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2 line-clamp-1">{recipe.title}</h3>
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{recipe.description}</p>
        <div className="flex items-center text-gray-500 text-sm space-x-4">
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Prep: {recipe.prepTime}m</span>
          </div>
          <div className="flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            <span>Cook: {recipe.cookTime}m</span>
          </div>
        </div>
      </div>
      
      <button
        onClick={handleEditClick}
        className="absolute top-2 right-2 p-2 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-amber-50"
        aria-label="Edit recipe"
      >
        <Edit className="w-4 h-4 text-amber-600" />
      </button>
    </div>
  );
}