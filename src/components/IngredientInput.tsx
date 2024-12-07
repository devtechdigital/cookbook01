import React from 'react';
import { Trash2 } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';
import type { Ingredient } from '../types/cookbook';

interface IngredientInputProps {
  ingredient: Ingredient;
  onChange: (ingredient: Ingredient) => void;
  onRemove: () => void;
  required?: boolean;
}

export function IngredientInput({ 
  ingredient, 
  onChange, 
  onRemove, 
  required = false 
}: IngredientInputProps) {
  const handleChange = (field: keyof Ingredient) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...ingredient,
      [field]: e.target.value
    });
  };

  return (
    <div className="flex gap-4 items-start w-full">
      <div className="grid grid-cols-12 gap-4 flex-1">
        <div className="col-span-3">
          <Input
            placeholder="Quantity"
            value={ingredient.quantity}
            onChange={handleChange('quantity')}
            required={required}
            className="w-full"
          />
        </div>
        <div className="col-span-3">
          <Input
            placeholder="Unit"
            value={ingredient.unit}
            onChange={handleChange('unit')}
            className="w-full"
          />
        </div>
        <div className="col-span-6">
          <Input
            placeholder="Ingredient name"
            value={ingredient.item}
            onChange={handleChange('item')}
            required={required}
            className="w-full"
          />
        </div>
      </div>
      <Button
        type="button"
        variant="outline"
        onClick={onRemove}
        icon={Trash2}
        className="shrink-0 mt-0"
      >
        Remove
      </Button>
    </div>
  );
}