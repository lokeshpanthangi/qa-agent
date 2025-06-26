import React, { useState } from 'react';
import { Pin, Plus, X, Link, Image } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface ImageUrlInputProps {
  onUrlAdd: (url: string) => void;
  onClose: () => void;
}

const ImageUrlInput: React.FC<ImageUrlInputProps> = ({ onUrlAdd, onClose }) => {
  const [url, setUrl] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState('');

  const validateImageUrl = (url: string): boolean => {
    // Check if URL has valid image extension or is from common image hosting services
    const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp)(\?.*)?$/i;
    const imageHosts = /\.(imgur|flickr|cloudinary|unsplash|pexels|pixabay|giphy)\./i;
    
    try {
      const urlObj = new URL(url);
      return imageExtensions.test(urlObj.pathname) || imageHosts.test(urlObj.hostname);
    } catch {
      return false;
    }
  };

  const handleAddUrl = async () => {
    if (!url.trim()) {
      setError('Please enter a URL');
      return;
    }

    if (!validateImageUrl(url)) {
      setError('Please enter a valid image URL (jpg, png, gif, webp, svg)');
      return;
    }

    setIsValidating(true);
    setError('');

    try {
      // Test if the URL is accessible and is an image
      const img = new Image();
      
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = url;
      });

      onUrlAdd(url);
      setUrl('');
      onClose();
    } catch (error) {
      setError('Unable to load image from this URL. Please check the URL and try again.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddUrl();
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div className="absolute top-full left-0 mt-2 bg-background border border-border rounded-lg shadow-lg p-4 w-80 z-20 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <Link className="w-3 h-3 text-white" />
          </div>
          <span className="text-sm font-medium text-foreground">Add Image URL</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 p-0"
        >
          <X className="w-3 h-3" />
        </Button>
      </div>

      {/* URL Input */}
      <div className="space-y-3">
        <div>
          <Input
            type="url"
            placeholder="https://example.com/image.jpg"
            value={url}
            onChange={(e) => {
              setUrl(e.target.value);
              setError('');
            }}
            onKeyPress={handleKeyPress}
            className="text-sm"
            disabled={isValidating}
            autoFocus
          />
          {error && (
            <p className="text-xs text-destructive mt-1">{error}</p>
          )}
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={onClose}
            className="text-xs"
          >
            Cancel
          </Button>
          <Button
            onClick={handleAddUrl}
            size="sm"
            disabled={!url.trim() || isValidating}
            className="text-xs"
          >
            {isValidating ? (
              <>
                <Image className="w-3 h-3 mr-1 animate-pulse" />
                Validating...
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 mr-1" />
                Add Image
              </>
            )}
          </Button>
        </div>

        {/* Help Text */}
        <p className="text-xs text-muted-foreground">
          Supports: JPG, PNG, GIF, WebP, SVG formats
        </p>
      </div>
    </div>
  );
};

export default ImageUrlInput; 