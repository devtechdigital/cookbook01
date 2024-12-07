import React from 'react';
import { Button } from './ui/Button';
import { ArrowLeft, Save } from 'lucide-react';

interface FormActionsProps {
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function FormActions({ onCancel, isSubmitting = false }: FormActionsProps) {
  return (
    <div className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t p-4 mt-8 -mx-6 -mb-6 rounded-b-lg flex justify-between items-center">
      <Button
        type="button"
        variant="outline"
        size="md"
        onClick={onCancel}
        icon={ArrowLeft}
      >
        Cancel
      </Button>
      <Button
        type="submit"
        variant="primary"
        size="md"
        icon={Save}
        disabled={isSubmitting}
      >
        Save Recipe
      </Button>
    </div>
  );
}