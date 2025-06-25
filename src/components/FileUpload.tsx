
import React, { useRef, useState } from 'react';
import { Upload, Image, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploadProps {
  onFileSelect: (files: File[]) => void;
  onClose: () => void;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFileSelect, onClose }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFileSelect = (files: FileList | null) => {
    if (files) {
      const fileArray = Array.from(files);
      onFileSelect(fileArray);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="absolute bottom-full left-0 mb-2 z-50 animate-scale-in">
      <div className="bg-white rounded-lg shadow-xl border border-gray-200 p-4 w-72">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-medium text-gray-900">Upload Files</h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="p-1 h-auto text-gray-500 hover:text-gray-700"
          >
            <X size={16} />
          </Button>
        </div>
        
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-all duration-200 cursor-pointer ${
            dragOver 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <Upload className="mx-auto mb-2 text-gray-400" size={24} />
          <p className="text-sm text-gray-600 mb-1">
            Drop files here or click to upload
          </p>
          <p className="text-xs text-gray-500">
            Images, PDFs, and text files supported
          </p>
        </div>

        <div className="flex space-x-2 mt-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = 'image/*';
                fileInputRef.current.click();
              }
            }}
            className="flex-1 text-xs hover:scale-105 transition-transform"
          >
            <Image size={14} className="mr-1" />
            Images
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.accept = '.pdf,.txt,.doc,.docx';
                fileInputRef.current.click();
              }
            }}
            className="flex-1 text-xs hover:scale-105 transition-transform"
          >
            <FileText size={14} className="mr-1" />
            Documents
          </Button>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFileSelect(e.target.files)}
          accept="image/*,.pdf,.txt,.doc,.docx"
        />
      </div>
    </div>
  );
};

export default FileUpload;
