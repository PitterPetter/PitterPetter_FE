import React, { useCallback, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCloudUploadAlt, faTimes, faImage } from '@fortawesome/free-solid-svg-icons';

interface ImageUploadProps {
  onFileSelect: (file: File | null) => void;
  className?: string;
  maxSize?: number; // MB
  acceptedTypes?: string[];
  existingImageUrl?: string | null;
  onExistingImageRemove?: () => void;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  onFileSelect,
  className = '',
  maxSize = 5, // 5MB 기본값
  acceptedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif'],
  existingImageUrl,
  onExistingImageRemove
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): string | null => {
    // 파일 타입 검사
    if (!acceptedTypes.includes(file.type)) {
      return 'JPG, PNG, GIF 파일만 업로드 가능합니다.';
    }

    // 파일 크기 검사
    if (file.size > maxSize * 1024 * 1024) {
      return `파일 크기는 ${maxSize}MB 이하여야 합니다.`;
    }

    return null;
  };

  const handleFile = useCallback((file: File) => {
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    
    // 미리보기 생성
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    onFileSelect(file);
  }, [acceptedTypes, maxSize, onFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFile(files[0]);
    }
  }, [handleFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleRemove = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    setPreview(null);
    setError(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    // 기존 이미지가 있는 경우 기존 이미지 제거 콜백 호출
    if (existingImageUrl && onExistingImageRemove) {
      onExistingImageRemove();
    }
  }, [onFileSelect, existingImageUrl, onExistingImageRemove]);

  return (
    <div className={`w-full ${className}`}>
      <div
        className={`
          relative border rounded-lg p-6 text-center cursor-pointer transition-all duration-200
          ${isDragOver 
            ? 'border-[#662B2B] bg-[#FFEDED]' 
            : 'border-gray-300 hover:border-third hover:bg-gray-50'
          }
          ${error ? 'border-red-300 bg-red-50' : ''}
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInputChange}
          className="hidden"
        />

        {(preview || existingImageUrl) ? (
          <div className="relative">
            <img
              src={preview || existingImageUrl || ''}
              alt="미리보기"
              className="max-w-full max-h-48 mx-auto rounded-lg object-cover"
            />
            <button
              type="button"
              onClick={handleRemove}
              className="absolute -top-2 -right-2 w-6 h-6 bg-pink-500 text-white rounded-full flex items-center justify-center hover:bg-pink-600 transition-colors"
            >
              <FontAwesomeIcon icon={faTimes} className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <FontAwesomeIcon 
                icon={faCloudUploadAlt} 
                className="text-4xl text-gray-400"
              />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-700">
                {isDragOver ? '파일을 놓아주세요' : '클릭하거나 파일을 드래그하여 업로드'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                JPG, PNG, GIF (최대 {maxSize}MB)
              </p>
            </div>
          </div>
        )}

        {error && (
          <div className="mt-3 text-sm text-red-600 bg-red-100 p-2 rounded">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};
