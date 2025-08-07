'use client';

import { useState } from 'react';

interface ImageWithFallbackProps {
  src: string;
  alt: string;
  className?: string;
  fallbackText?: string;
  width?: number;
  height?: number;
}

const ImageWithFallback: React.FC<ImageWithFallbackProps> = ({
  src,
  alt,
  className = '',
  fallbackText,
  width = 300,
  height = 200
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  if (hasError) {
    return (
      <div 
        className={`${className} bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center`}
        style={{ width: `${width}px`, height: `${height}px` }}
      >
        <div className="text-center p-4">
          <div className="text-gray-400 text-2xl mb-2">🖼️</div>
          <div className="text-gray-500 text-sm font-medium">
            {fallbackText || alt || '图片加载失败'}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {isLoading && (
        <div 
          className={`${className} bg-gray-200 animate-pulse flex items-center justify-center absolute inset-0`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          <div className="text-gray-400">
            <svg className="w-8 h-8 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={className}
        onError={handleError}
        onLoad={handleLoad}
        style={isLoading ? { opacity: 0 } : { opacity: 1 }}
      />
    </div>
  );
};

export default ImageWithFallback;
