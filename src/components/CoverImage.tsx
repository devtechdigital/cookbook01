import React from 'react';
import { ImageIcon } from 'lucide-react';
import { Input } from './ui/Input';

interface CoverImageProps {
  image: string;
  onChange: (url: string) => void;
}

export function CoverImage({ image, onChange }: CoverImageProps) {
  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          label="Cover Image URL"
          type="url"
          value={image}
          onChange={(e) => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {image ? (
          <div className="mt-4 relative group">
            <img
              src={image}
              alt="Cookbook Cover"
              className="w-full h-64 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
              <p className="text-white text-sm">Change Image</p>
            </div>
          </div>
        ) : (
          <div className="mt-4 h-64 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <p className="mt-2 text-sm text-gray-500">Add a cover image</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}