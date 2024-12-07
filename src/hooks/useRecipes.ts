import { useState, useEffect, useCallback } from 'react';
import { Recipe } from '../types/cookbook';
import { useCookbooks } from './useCookbooks';
import {
  createRecipe,
  updateRecipeById,
  deleteRecipeById,
  getRecipeById as getRecipe
} from '../utils/recipeOperations';

export function useRecipes() {
  const { currentCookbook } = useCookbooks();
  const [recipes, setRecipes] = useState<Recipe[]>(currentCookbook.recipes);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setRecipes(currentCookbook.recipes);
    setIsLoading(false);
  }, [currentCookbook]);

  const addRecipe = useCallback((recipe: Omit<Recipe, 'id' | 'createdAt'>) => {
    const newRecipe = createRecipe(recipe);
    setRecipes(prev => [...prev, newRecipe]);
    return newRecipe;
  }, []);

  const updateRecipe = useCallback((id: string, updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>) => {
    const updated = updateRecipeById(id, updates);
    setRecipes(prev => prev.map(recipe => recipe.id === id ? updated : recipe));
    return updated;
  }, []);

  const deleteRecipe = useCallback((id: string) => {
    deleteRecipeById(id);
    setRecipes(prev => prev.filter(recipe => recipe.id !== id));
  }, []);

  const getRecipeById = useCallback((id: string) => {
    return getRecipe(id);
  }, []);

  return {
    recipes,
    isLoading,
    addRecipe,
    updateRecipe,
    deleteRecipe,
    getRecipeById,
  };
}