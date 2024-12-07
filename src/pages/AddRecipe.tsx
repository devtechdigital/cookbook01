import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeForm } from '../hooks/useRecipeForm';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Button } from '../components/ui/Button';
import { FormSection } from '../components/FormSection';
import { FormActions } from '../components/FormActions';
import { IngredientInput } from '../components/IngredientInput';
import { ImageGallery } from '../components/ImageGallery';
import { Clock, ListOrdered, Plus, UtensilsCrossed, Image } from 'lucide-react';

export default function AddRecipe() {
  const navigate = useNavigate();
  const { addRecipe } = useRecipes();
  const {
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
  } = useRecipeForm();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      console.log('Submitting new recipe:', formData);
      const recipe = addRecipe(formData);
      console.log('Recipe added successfully:', recipe);
      navigate('/recipes');
    } catch (error) {
      console.error('Error adding recipe:', error);
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-20">
      <FormSection title="Recipe Details" icon={UtensilsCrossed}>
        <div className="space-y-4">
          <Input
            label="Recipe Title"
            value={formData.title}
            onChange={e => updateField('title', e.target.value)}
            required
            className="w-full"
          />
          <TextArea
            label="Description"
            value={formData.description}
            onChange={e => updateField('description', e.target.value)}
            required
            className="w-full"
          />
          <TextArea
            label="Family Story"
            value={formData.backstory}
            onChange={e => updateField('backstory', e.target.value)}
            placeholder="Share the story behind this recipe..."
            className="w-full"
          />
        </div>
      </FormSection>

      <FormSection title="Timing" icon={Clock}>
        <div className="grid grid-cols-2 gap-4">
          <Input
            type="number"
            label="Prep Time"
            suffix="minutes"
            value={formData.prepTime}
            onChange={e => updateField('prepTime', parseInt(e.target.value) || 0)}
            min="0"
            required
            className="w-full"
          />
          <Input
            type="number"
            label="Cook Time"
            suffix="minutes"
            value={formData.cookTime}
            onChange={e => updateField('cookTime', parseInt(e.target.value) || 0)}
            min="0"
            required
            className="w-full"
          />
        </div>
      </FormSection>

      <FormSection
        title="Ingredients"
        icon={UtensilsCrossed}
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={addIngredient}
            icon={Plus}
            size="sm"
          >
            Add Ingredient
          </Button>
        }
      >
        <div className="space-y-4">
          {formData.ingredients.map((ingredient, index) => (
            <IngredientInput
              key={index}
              ingredient={ingredient}
              onChange={ingredient => updateIngredient(index, ingredient)}
              onRemove={() => removeIngredient(index)}
              required={index === 0}
            />
          ))}
        </div>
      </FormSection>

      <FormSection
        title="Instructions"
        icon={ListOrdered}
        actions={
          <Button
            type="button"
            variant="secondary"
            onClick={addStep}
            icon={Plus}
            size="sm"
          >
            Add Step
          </Button>
        }
      >
        <div className="space-y-4">
          {formData.steps.map((step, index) => (
            <div key={index} className="flex gap-4 items-start w-full">
              <div className="flex-1">
                <TextArea
                  value={step}
                  onChange={e => updateStep(index, e.target.value)}
                  placeholder={`Step ${index + 1}`}
                  required={index === 0}
                  rows={3}
                  className="w-full"
                />
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => removeStep(index)}
                icon={Plus}
                className="shrink-0 mt-0"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </FormSection>

      <FormSection title="Notes" icon={ListOrdered}>
        <TextArea
          value={formData.notes}
          onChange={e => updateField('notes', e.target.value)}
          placeholder="Add any additional notes, tips, or variations..."
          rows={4}
          className="w-full"
        />
      </FormSection>

      <FormSection title="Images" icon={Image}>
        <ImageGallery
          primaryImage={formData.primaryImage}
          additionalImages={formData.additionalImages}
          onPrimaryImageChange={url => updateField('primaryImage', url)}
          onAdditionalImagesChange={urls => updateField('additionalImages', urls)}
        />
      </FormSection>

      <FormActions onCancel={() => navigate('/recipes')} isSubmitting={isSubmitting} />
    </form>
  );
}