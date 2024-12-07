import React from 'react';
import { X, Plus } from 'lucide-react';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface ImageGalleryProps {
  primaryImage: string;
  additionalImages: string[];
  onPrimaryImageChange: (url: string) => void;
  onAdditionalImagesChange: (urls: string[]) => void;
}

export function ImageGallery({
  primaryImage,
  additionalImages,
  onPrimaryImageChange,
  onAdditionalImagesChange,
}: ImageGalleryProps) {
  const addImage = () => {
    onAdditionalImagesChange([...additionalImages, '']);
  };

  const removeImage = (index: number) => {
    onAdditionalImagesChange(additionalImages.filter((_, i) => i !== index));
  };

  const updateImage = (index: number, url: string) => {
    onAdditionalImagesChange(
      additionalImages.map((img, i) => (i === index ? url : img))
    );
  };

  return (
    <div className="space-y-4">
      <div>
        <Input
          label="Primary Image URL"
          type="url"
          value={primaryImage}
          onChange={(e) => onPrimaryImageChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
        />
        {primaryImage && (
          <img
            src={primaryImage}
            alt="Primary"
            className="mt-2 rounded-lg h-48 w-full object-cover"
          />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium text-gray-700">Additional Images</h4>
          <Button
            type="button"
            variant="secondary"
            onClick={addImage}
            icon={Plus}
          >
            Add Image
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {additionalImages.map((url, index) => (
            <div key={index} className="relative">
              <Input
                type="url"
                value={url}
                onChange={(e) => updateImage(index, e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
              {url && (
                <>
                  <img
                    src={url}
                    alt={`Additional ${index + 1}`}
                    className="mt-2 rounded-lg h-32 w-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(index)}
                    className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md hover:bg-red-50"
                  >
                    <X className="w-4 h-4 text-red-600" />
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}