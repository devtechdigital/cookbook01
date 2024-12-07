import { useState, useCallback } from 'react';
import type { Recipe } from '../types/cookbook';

const emptyIngredient = { quantity: '', unit: '', item: '' };

export const emptyRecipe: Omit<Recipe, 'id' | 'createdAt'> = {
  title: '',
  description: '',
  backstory: '',
  prepTime: 0,
  cookTime: 0,
  ingredients: [emptyIngredient],
  steps: [''],
  notes: '',
  primaryImage: '',
  additionalImages: [],
};

export function useRecipeForm(initialRecipe?: Recipe) {
  const [formData, setFormData] = useState<Omit<Recipe, 'id' | 'createdAt'>>(() => {
    if (!initialRecipe) return emptyRecipe;
    
    const { id, createdAt, ...recipeData } = initialRecipe;
    return recipeData;
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = useCallback(<K extends keyof typeof formData>(
    field: K,
    value: typeof formData[K]
  ) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const addIngredient = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      ingredients: [...prev.ingredients, emptyIngredient]
    }));
  }, []);

  const removeIngredient = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter((_, i) => i !== index)
    }));
  }, []);

  const updateIngredient = useCallback((index: number, ingredient: typeof emptyIngredient) => {
    setFormData(prev => ({
      ...prev,
      ingredients: prev.ingredients.map((ing, i) => i === index ? ingredient : ing)
    }));
  }, []);

  const addStep = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  }, []);

  const removeStep = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.filter((_, i) => i !== index)
    }));
  }, []);

  const updateStep = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      steps: prev.steps.map((step, i) => i === index ? value : step)
    }));
  }, []);

  const resetForm = useCallback((recipe?: Recipe) => {
    if (!recipe) {
      setFormData(emptyRecipe);
      return;
    }
    
    const { id, createdAt, ...recipeData } = recipe;
    setFormData(recipeData);
  }, []);

  return {
    formData,
    isSubmitting,
    setIsSubmitting,
    updateField,
    addIngredient,
    removeIngredient,
    updateIngredient,
    addStep,
    removeStep,
    updateStep,
    resetForm,
  };
}