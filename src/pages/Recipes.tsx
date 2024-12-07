import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { SearchInput } from '../components/ui/SearchInput';
import { RecipeCard } from '../components/RecipeCard';
import { RecipeModal } from '../components/RecipeModal';
import type { Recipe } from '../types/cookbook';

export default function Recipes() {
  const navigate = useNavigate();
  const { recipes } = useRecipes();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filteredRecipes = useMemo(() => {
    if (!searchQuery) return recipes;
    
    const query = searchQuery.toLowerCase();
    return recipes.filter(recipe => {
      const titleMatch = recipe.title?.toLowerCase().includes(query);
      const descriptionMatch = recipe.description?.toLowerCase().includes(query);
      const ingredientMatch = recipe.ingredients?.some(ing => 
        ing?.item?.toLowerCase().includes(query)
      );
      
      return titleMatch || descriptionMatch || ingredientMatch;
    });
  }, [recipes, searchQuery]);

  const handleEdit = (recipe: Recipe) => {
    console.log('Edit clicked for recipe:', recipe);
    navigate(`/edit-recipe/${recipe.id}`);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Family Recipes</h1>
        <div className="w-72">
          <SearchInput onSearch={setSearchQuery} />
        </div>
      </div>

      {filteredRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">
            {searchQuery
              ? "No recipes found matching your search."
              : "No recipes added yet. Start by adding your first family recipe!"}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onView={() => setSelectedRecipe(recipe)}
              onEdit={() => handleEdit(recipe)}
            />
          ))}
        </div>
      )}

      {selectedRecipe && (
        <RecipeModal
          recipe={selectedRecipe}
          onClose={() => setSelectedRecipe(null)}
          onEdit={() => handleEdit(selectedRecipe)}
        />
      )}
    </div>
  );
}