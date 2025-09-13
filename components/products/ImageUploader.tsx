'use client';

import { useState, useCallback, useEffect } from 'react';
import { FiUpload, FiX } from 'react-icons/fi';

interface ImageObj {
  url: string;
  publicId: string;
}

interface FullPageImageUploaderProps {
  onUpload: (files: File[]) => void;
  existingImages?: ImageObj[];
  onRemoveExisting?: (removedImages: ImageObj[]) => void;
}

export default function FullPageImageUploader({
  onUpload,
  existingImages = [],
  onRemoveExisting,
}: FullPageImageUploaderProps) {
  const [previewImages, setPreviewImages] = useState<(string | ImageObj)[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [removedExisting, setRemovedExisting] = useState<ImageObj[]>([]);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    // Populate existing images from backend
    setPreviewImages(existingImages);
  }, [existingImages]);

  const handleFiles = (selectedFiles: File[]) => {
    const validFiles = selectedFiles.filter(file => file.type.startsWith('image/'));

    const previews = validFiles.map(file => URL.createObjectURL(file));
    const allFiles = [...files, ...validFiles];

    setFiles(allFiles);
    setPreviewImages(prev => [...prev, ...previews]);
    onUpload(allFiles);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) handleFiles(Array.from(e.target.files));
  };

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault();
      setDragOver(false);
      handleFiles(Array.from(e.dataTransfer.files));
    },
    [files]
  );

  const removeImage = (index: number) => {
    const img = previewImages[index];

    if (typeof img === 'string' && img.startsWith('blob:')) {
      // New file upload
      URL.revokeObjectURL(img);
      const newFiles = files.filter((_, i) => i !== index);
      const newPreviews = previewImages.filter((_, i) => i !== index);
      setFiles(newFiles);
      setPreviewImages(newPreviews);
      onUpload(newFiles);
    } else if (typeof img === 'object') {
      // Existing image
      setPreviewImages(prev => prev.filter((_, i) => i !== index));
      setRemovedExisting(prev => [...prev, img]);
      onRemoveExisting?.([...removedExisting, img]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={e => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      className={`flex flex-col items-center justify-center bg-white px-1 py-2 transition sm:min-h-screen sm:px-4 ${
        dragOver ? 'border-blue-500 bg-blue-50' : 'bg-white'
      }`}
    >
      <div className="w-full max-w-2xl rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 px-2 py-4 sm:p-6">
        <div className="text-center">
          <FiUpload className="mx-auto mb-2 h-10 w-10 text-gray-400" />
          <p className="text-gray-600">Drag and drop images here or click to upload</p>
          <p className="mt-1 text-sm text-gray-400">Supported: PNG, JPG, JPEG (max 5MB each)</p>

          <label
            htmlFor="file-upload"
            className="mt-4 inline-block cursor-pointer rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700"
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
        <div className="mt-8 grid w-full max-w-4xl grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
          {previewImages.map((img, index) => {
            const src = typeof img === 'string' ? img : img.url;
            return (
              <div key={index} className="group relative">
                <img src={src} alt={`Preview ${index}`} className="h-40 w-full rounded-lg object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute right-1 top-1 rounded-full bg-red-500 p-1 text-white opacity-0 transition group-hover:opacity-100"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
