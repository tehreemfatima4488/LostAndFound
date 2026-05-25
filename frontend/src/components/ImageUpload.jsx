import React, { useRef, useState } from 'react';

const ImageUpload = ({ onImageSelect, preview, loading }) => {
  const fileInputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFile(files[0]);
    }
  };

  const handleChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type.startsWith('image/')) {
      onImageSelect(file);
    } else {
      alert('Please select an image file');
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        className={`relative border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 bg-gray-50 hover:border-gray-400'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
          disabled={loading}
        />

        {preview ? (
          <div className="space-y-4">
            <img
              src={preview}
              alt="Preview"
              className="w-32 h-32 object-cover rounded-lg mx-auto"
            />
            <p className="text-sm text-gray-600">Click or drag to change image</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="text-4xl">🖼️</div>
            <div>
              <p className="text-gray-700 font-medium">Drag image here or click to browse</p>
              <p className="text-sm text-gray-500">Supported: JPG, PNG, GIF, WebP</p>
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black bg-opacity-10 rounded-lg flex items-center justify-center">
            <div className="animate-spin text-3xl">⌛</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
