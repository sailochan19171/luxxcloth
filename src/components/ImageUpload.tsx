import React, { useState } from 'react';
import { X, Camera } from 'lucide-react';

interface ImageUploadProps {
  label?: string;
  onImageChange: (file: File | null) => void;
  isDarkMode?: boolean;
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  label, 
  onImageChange, 
  isDarkMode = false, 
  className = '' 
}) => {
  const [preview, setPreview] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleFileChange = (file: File | null) => {
    if (file) {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        alert('Please upload an image file only!');
        return;
      }

      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        alert('Image must be smaller than 10MB!');
        return;
      }

      setIsProcessing(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
        onImageChange(file);
        setIsProcessing(false);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setIsProcessing(false);
      };
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
      onImageChange(null);
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileChange(files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileChange(file);
  };

  return (
    <div className={`w-full transition-all duration-300 flex flex-col items-center ${className}`}>
      {label && (
        <h3 className="text-lg font-semibold mb-4 text-center text-gray-900">
          {label}
        </h3>
      )}

      {preview ? (
        <div className="relative w-full flex justify-center items-center mt-4">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="h-32 w-32 md:h-48 md:w-48 object-cover rounded-lg shadow-md"
            />
            <button
              onClick={handleRemove}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors shadow-lg"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      ) : (
        <div
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className={`w-full max-w-sm p-6 md:p-8 border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
            isDragOver
              ? 'border-purple-500 bg-purple-50'
              : isDarkMode
              ? 'border-gray-600 bg-gray-800 hover:border-gray-500'
              : 'border-gray-300 bg-gray-50 hover:border-gray-400'
          }`}
        >
          <label className="cursor-pointer block text-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleInputChange}
              className="hidden"
              capture="environment"
            />
            
            {isProcessing ? (
              <div className="flex flex-col items-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mb-4"></div>
                <p className="text-sm text-gray-600">Processing...</p>
              </div>
            ) : (
              <>
                <div className={`mx-auto w-12 h-12 mb-4 rounded-full flex items-center justify-center ${
                  isDarkMode ? 'bg-gray-700' : 'bg-gray-200'
                }`}>
                  <Camera size={24} className={isDarkMode ? 'text-gray-300' : 'text-gray-600'} />
                </div>
                <p className={`font-medium mb-2 text-sm md:text-base ${isDarkMode ? 'text-gray-200' : 'text-gray-700'}`}>
                  Click or drag an image here to upload
                </p>
                <p className={`text-xs md:text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  Image only • Max size: 10MB
                </p>
                <div className="mt-3 md:mt-4">
                  <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-medium inline-block">
                    Choose Photo
                  </div>
                </div>
              </>
            )}
          </label>
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
