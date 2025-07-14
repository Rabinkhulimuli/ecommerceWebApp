'use client';

import { useState, useCallback } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface ImageUploaderProps {
  onUpload: (files:File[]) => void;
}

export default function ImageUploader({ onUpload }: ImageUploaderProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const handleFileChange = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    try{
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      const newPreviews = newFiles.map(file => URL.createObjectURL(file));
      
      setFiles(prev => [...prev, ...newFiles]);
      setPreviewImages(prev => [...prev, ...newPreviews]);
      onUpload([...files, ...newFiles]);
    }
    } catch (error) {
      console.error('Error uploading images:', error);
    } finally {
      setIsUploading(false);
    }
  }, [onUpload, previewImages]);
/* 
  const removeImage = (index: number) => {
    const newImages = previewImages.filter((_, i) => i !== index);
    setPreviewImages(newImages);
    onUpload(newImages);
  }; */
    const removeImage = (index: number) => {
    // Revoke the blob URL to prevent memory leaks
    URL.revokeObjectURL(previewImages[index]);
    
    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);
    
    setPreviewImages(newPreviews);
    setFiles(newFiles);
    onUpload(newFiles);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition ${isUploading ? 'opacity-70' : ''}`}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <FiUpload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500">
              <span className="font-semibold">Click to upload</span> or drag and drop
            </p>
            <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB each)</p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
          />
        </label>
      </div>

      {/* Image Previews */}
      {previewImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {previewImages.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-32 object-cover rounded-md"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
              >
                <FiX className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isUploading && (
        <div className="text-sm text-gray-500">Uploading images...</div>
      )}
    </div>
  );
}