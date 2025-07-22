'use client';

import { useState, useCallback } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface FullPageImageUploaderProps {
  onUpload: (files: File[]) => void;
}

export default function FullPageImageUploader({ onUpload }: FullPageImageUploaderProps) {
  const [previewImages, setPreviewImages] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [dragOver, setDragOver] = useState(false);

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    const previews = validFiles.map(file => URL.createObjectURL(file));
    const allFiles = [...files, ...validFiles];

    setFiles(allFiles);
    setPreviewImages(prev => [...prev, ...previews]);
    onUpload(allFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, [files]);

  const removeImage = (index: number) => {
    URL.revokeObjectURL(previewImages[index]);

    const newPreviews = previewImages.filter((_, i) => i !== index);
    const newFiles = files.filter((_, i) => i !== index);

    setPreviewImages(newPreviews);
    setFiles(newFiles);
    onUpload(newFiles);
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      className={`min-h-screen flex flex-col items-center justify-center px-4 py-8 transition bg-white ${
        dragOver ? 'bg-blue-50 border-blue-500' : 'bg-white'
      }`}
    >
      <div className="w-full max-w-2xl p-6 border-2 border-dashed rounded-lg border-gray-300 bg-gray-50">
        <div className="text-center">
          <FiUpload className="w-10 h-10 text-gray-400 mx-auto mb-2" />
          <p className="text-gray-600">Drag and drop images here or click to upload</p>
          <p className="text-sm text-gray-400 mt-1">Supported: PNG, JPG, JPEG (max 5MB each)</p>

          <label
            htmlFor="file-upload"
            className="inline-block mt-4 px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 transition"
          >
            Browse Files
          </label>
          <input
            id="file-upload"
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileInput}
            className="hidden"
          />
        </div>
      </div>

      {previewImages.length > 0 && (
        <div className="w-full max-w-4xl mt-8 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {previewImages.map((src, index) => (
            <div key={index} className="relative group">
              <img
                src={src}
                alt={`Preview ${index}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                onClick={() => removeImage(index)}
                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition"
              >
                <FiX className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
