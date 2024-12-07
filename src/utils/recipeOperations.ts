import { Recipe } from '../types/cookbook';
import { getCurrentCookbook, saveCookbook } from './storage';

export const resetRecipes = (): void => {
  const cookbook = getCurrentCookbook();
  cookbook.recipes = [];
  saveCookbook(cookbook);
};

export const createRecipe = (recipeData: Omit<Recipe, 'id' | 'createdAt'>): Recipe => {
  const cookbook = getCurrentCookbook();
  
  const newRecipe: Recipe = {
    ...recipeData,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
  };

  cookbook.recipes.push(newRecipe);
  saveCookbook(cookbook);
  
  return newRecipe;
};

export const updateRecipeById = (
  id: string,
  updates: Partial<Omit<Recipe, 'id' | 'createdAt'>>
): Recipe => {
  const cookbook = getCurrentCookbook();
  const recipeIndex = cookbook.recipes.findIndex(recipe => recipe.id === id);
  
  if (recipeIndex === -1) {
    throw new Error(`Recipe with id ${id} not found`);
  }

  const updatedRecipe = {
    ...cookbook.recipes[recipeIndex],
    ...updates,
  };

  cookbook.recipes[recipeIndex] = updatedRecipe;
  saveCookbook(cookbook);
  
  return updatedRecipe;
};

export const deleteRecipeById = (id: string): void => {
  const cookbook = getCurrentCookbook();
  cookbook.recipes = cookbook.recipes.filter(recipe => recipe.id !== id);
  saveCookbook(cookbook);
};

export const getRecipeById = (id: string): Recipe | undefined => {
  const cookbook = getCurrentCookbook();
  return cookbook.recipes.find(recipe => recipe.id === id);
};