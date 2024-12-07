import React, { useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useRecipes } from '../hooks/useRecipes';
import { useRecipeForm } from '../hooks/useRecipeForm';
import { Input } from '../components/ui/Input';
import { TextArea } from '../components/ui/TextArea';
import { Button } from '../components/ui/Button';
import { FormSection } from '../components/FormSection';
import { FormActions } from '../components/FormActions';
import { IngredientInput } from '../components/IngredientInput';
import { ImageGallery } from '../components/ImageGallery';
import { Clock, ListOrdered, Plus, UtensilsCrossed, Image, Copy, Trash2 } from 'lucide-react';

export default function EditRecipe() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { getRecipeById, updateRecipe, deleteRecipe, addRecipe } = useRecipes();
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
    resetForm,
  } = useRecipeForm();

  const loadRecipe = useCallback(() => {
    if (!id) {
      navigate('/recipes');
      return;
    }

    const recipe = getRecipeById(id);
    console.log('Loading recipe for editing:', recipe);
    
    if (!recipe) {
      console.log('Recipe not found, redirecting to recipes list');
      navigate('/recipes');
      return;
    }

    resetForm(recipe);
  }, [id, getRecipeById, navigate, resetForm]);

  useEffect(() => {
    loadRecipe();
  }, [loadRecipe]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;

    setIsSubmitting(true);
    try {
      console.log('Updating recipe:', formData);
      updateRecipe(id, formData);
      navigate('/recipes');
    } catch (error) {
      console.error('Error updating recipe:', error);
      setIsSubmitting(false);
    }
  };

  const handleSaveAsNew = () => {
    const newRecipe = addRecipe(formData);
    navigate('/recipes');
  };

  const handleDelete = () => {
    if (!id || !window.confirm('Are you sure you want to delete this recipe?')) return;
    deleteRecipe(id);
    navigate('/recipes');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6 pb-20">
      <div className="flex justify-end gap-2 mb-4">
        <Button
          type="button"
          variant="secondary"
          onClick={handleSaveAsNew}
          icon={Copy}
        >
          Save as New
        </Button>
        <Button
          type="button"
          variant="danger"
          onClick={handleDelete}
          icon={Trash2}
        >
          Delete Recipe
        </Button>
      </div>

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
                icon={Trash2}
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