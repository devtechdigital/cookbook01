import { z } from 'zod';

export interface Ingredient {
  quantity: string;
  unit: string;
  item: string;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  backstory: string;
  prepTime: number;
  cookTime: number;
  ingredients: Ingredient[];
  steps: string[];
  notes: string;
  primaryImage: string;
  additionalImages: string[];
  createdAt: string;
}

export interface CookbookSettings {
  id: string;
  name: string;
  theme: 'warm' | 'cool' | 'neutral';
  subtitle: string;
  coverImage: string;
}

export interface Cookbook {
  settings: CookbookSettings;
  recipes: Recipe[];
}

export const ingredientSchema = z.object({
  quantity: z.string().min(1, "Quantity is required"),
  unit: z.string(),
  item: z.string().min(1, "Ingredient name is required")
});

export const recipeSchema = z.object({
  id: z.string(),
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  backstory: z.string(),
  prepTime: z.number().min(0),
  cookTime: z.number().min(0),
  ingredients: z.array(ingredientSchema),
  steps: z.array(z.string().min(1, "Step cannot be empty")),
  notes: z.string(),
  primaryImage: z.string(),
  additionalImages: z.array(z.string()),
  createdAt: z.string()
});