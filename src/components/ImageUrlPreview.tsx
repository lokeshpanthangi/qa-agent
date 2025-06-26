import React, { useState, useEffect } from 'react';
import { X, Download, Eye, Image as ImageIcon, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUrlPreviewProps {
  url: string;
  onRemove: () => void;
  className?: string;
}

const ImageUrlPreview: React.FC<ImageUrlPreviewProps> = ({ url, onRemove, className = "" }) => {
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [imageSize, setImageSize] = useState<{ width: number; height: number } | null>(null);

  useEffect(() => {
    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
    setImageSize(null);

    // Load image to get dimensions and verify it loads
    const img = new Image();
    img.onload = () => {
      setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      setIsLoading(false);
      setHasError(false);
    };
    img.onerror = () => {
      setIsLoading(false);
      setHasError(true);
    };
    img.src = url;
  }, [url]);

  const formatFileSize = (imageSize: { width: number; height: number } | null): string => {
    if (!imageSize) return 'Unknown';
    return `${imageSize.width} × ${imageSize.height}`;
  };

  const getFileName = (url: string): string => {
    try {
      const urlObj = new URL(url);
      const pathname = urlObj.pathname;
      const fileName = pathname.substring(pathname.lastIndexOf('/') + 1);
      return fileName || 'image-url';
    } catch {
      return 'image-url';
    }
  };

  const downloadImage = async () => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = getFileName(url);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      window.URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
      // Fallback: open in new tab
      window.open(url, '_blank');
    }
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  return (
    <>
      {/* Image Tile */}
      <div
        className={`group relative overflow-hidden rounded-lg border border-border bg-muted transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${className}`}
      >
        {/* Main Image */}
        <div className="relative aspect-square">
          {!hasError ? (
            <img
              src={url}
              alt={getFileName(url)}
              className={`w-full h-full object-cover transition-all duration-300 ${
                isLoading ? 'opacity-0' : 'opacity-100'
              } group-hover:scale-110`}
              onLoad={() => setIsLoading(false)}
              onError={() => {
                setIsLoading(false);
                setHasError(true);
              }}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
              <ImageIcon className="w-8 h-8 mb-2" />
              <span className="text-xs text-center px-2">Failed to load image</span>
            </div>
          )}
          
          {/* Loading State */}
          {isLoading && !hasError && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="w-6 h-6 text-muted-foreground animate-pulse" />
            </div>
          )}

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center`}>
            <div className={`flex space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100`}>
              {!hasError && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setShowFullscreen(true)}
                    className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
                  >
                    <Eye className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={downloadImage}
                    className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
                  >
                    <Download className="w-3 h-3" />
                  </Button>
                </>
              )}
              <Button
                variant="secondary"
                size="sm"
                onClick={openInNewTab}
                className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
              >
                <ExternalLink className="w-3 h-3" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemove}
                className="bg-red-500/90 hover:bg-red-500 text-white backdrop-blur-sm"
              >
                <X className="w-3 h-3" />
              </Button>
            </div>
          </div>

          {/* URL Indicator */}
          <div className="absolute top-2 left-2 bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-medium backdrop-blur-sm">
            URL
          </div>
        </div>

        {/* File Info */}
        <div className="p-3 border-t border-border/50">
          <p className="text-xs font-medium text-foreground truncate" title={getFileName(url)}>
            {getFileName(url)}
          </p>
          <p className="text-xs text-muted-foreground">
            {hasError ? 'Load Error' : formatFileSize(imageSize)}
          </p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && !hasError && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={url}
              alt={getFileName(url)}
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => setShowFullscreen(false)}
              className="absolute top-4 right-4 bg-black/50 border-white/20 text-white hover:bg-black/70"
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="absolute bottom-4 left-4 bg-black/50 text-white px-3 py-2 rounded-lg backdrop-blur-sm">
              <p className="text-sm font-medium">{getFileName(url)}</p>
              <p className="text-xs opacity-80">
                {imageSize ? formatFileSize(imageSize) : 'Image URL'}
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImageUrlPreview; 