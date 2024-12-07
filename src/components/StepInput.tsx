import React from 'react';
import { Trash2 } from 'lucide-react';
import { TextArea } from './ui/TextArea';
import { Button } from './ui/Button';

interface StepInputProps {
  value: string;
  onChange: (value: string) => void;
  onRemove: () => void;
  index: number;
  required?: boolean;
}

export function StepInput({
  value,
  onChange,
  onRemove,
  index,
  required = false
}: StepInputProps) {
  return (
    <div className="flex gap-4 items-start w-full">
      <div className="flex-1">
        <TextArea
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={`Step ${index + 1}`}
          required={required}
          rows={3}
          className="w-full"
        />
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