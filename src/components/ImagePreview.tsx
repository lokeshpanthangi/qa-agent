import React, { useState, useEffect } from 'react';
import { X, Download, Eye, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImagePreviewProps {
  file: File;
  onRemove: () => void;
  className?: string;
}

const ImagePreview: React.FC<ImagePreviewProps> = ({ file, onRemove, className = "" }) => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const downloadImage = () => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      {/* Image Tile */}
      <div
        className={`group relative overflow-hidden rounded-lg border border-border bg-muted transition-all duration-300 hover:border-primary/50 hover:shadow-lg ${className}`}
      >
        {/* Main Image */}
        <div className="relative aspect-square">
          <img
            src={imageUrl}
            alt={file.name}
            className={`w-full h-full object-cover transition-all duration-300 ${
              isLoading ? 'opacity-0' : 'opacity-100'
            } group-hover:scale-110`}
            onLoad={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
          />
          
          {/* Loading State */}
          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <ImageIcon className="w-6 h-6 text-muted-foreground animate-pulse" />
            </div>
          )}

          {/* Hover Overlay */}
          <div className={`absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-300 flex items-center justify-center`}>
            <div className={`flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100`}>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setShowFullscreen(true)}
                className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={downloadImage}
                className="bg-white/90 hover:bg-white text-black backdrop-blur-sm"
              >
                <Download className="w-4 h-4" />
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={onRemove}
                className="bg-red-500/90 hover:bg-red-500 text-white backdrop-blur-sm"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* File Info */}
        <div className="p-3 border-t border-border/50">
          <p className="text-xs font-medium text-foreground truncate">{file.name}</p>
          <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
        </div>
      </div>

      {/* Fullscreen Modal */}
      {showFullscreen && (
        <div
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setShowFullscreen(false)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img
              src={imageUrl}
              alt={file.name}
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
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs opacity-80">{formatFileSize(file.size)}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ImagePreview; 