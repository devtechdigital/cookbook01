import React from 'react';
import { X, Clock, Edit } from 'lucide-react';
import type { Recipe } from '../types/cookbook';
import { Button } from './ui/Button';

interface RecipeModalProps {
  recipe: Recipe;
  onClose: () => void;
  onEdit: () => void;
}

export function RecipeModal({ recipe, onClose, onEdit }: RecipeModalProps) {
  const totalTime = recipe.prepTime + recipe.cookTime;
  
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{recipe.title}</h2>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={onEdit}
              icon={Edit}
            >
              Edit
            </Button>
            <Button
              variant="outline"
              onClick={onClose}
              icon={X}
            >
              Close
            </Button>
          </div>
        </div>
        
        <div className="p-6 space-y-6">
          {recipe.primaryImage && (
            <img
              src={recipe.primaryImage}
              alt={recipe.title}
              className="w-full h-64 object-cover rounded-lg"
            />
          )}
          
          <div className="flex flex-wrap items-center gap-6 text-gray-600">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              <div className="space-y-1">
                <div>Prep Time: {recipe.prepTime} minutes</div>
                <div>Cook Time: {recipe.cookTime} minutes</div>
                <div className="font-medium">Total Time: {totalTime} minutes</div>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Description</h3>
            <p className="text-gray-600">{recipe.description}</p>
          </div>
          
          {recipe.backstory && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Family Story</h3>
              <p className="text-gray-600">{recipe.backstory}</p>
            </div>
          )}
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
            <ul className="list-disc list-inside space-y-1 text-gray-600">
              {recipe.ingredients.map((ingredient, index) => (
                <li key={index}>
                  {ingredient.quantity} {ingredient.unit} {ingredient.item}
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <ol className="list-decimal list-inside space-y-3 text-gray-600">
              {recipe.steps.map((step, index) => (
                <li key={index} className="pl-2">{step}</li>
              ))}
            </ol>
          </div>

          {recipe.notes && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Notes</h3>
              <p className="text-gray-600">{recipe.notes}</p>
            </div>
          )}

          {recipe.additionalImages.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold mb-2">Additional Images</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recipe.additionalImages.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${recipe.title} - Additional ${index + 1}`}
                    className="w-full h-48 object-cover rounded-lg"
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}