'use client';

import { useState, useRef, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useLocalization } from '@/contexts/LocalizationContext';

interface ImageFile {
  id: string;
  file: File;
  preview: string;
  processed?: string;
  status: 'pending' | 'processing' | 'completed' | 'error';
  originalSize: number;
  processedSize?: number;
  compressionRatio?: number;
}

interface CleaningOptions {
  removeBackground: boolean;
  enhanceQuality: boolean;
  compressImage: boolean;
  resizeImage: boolean;
  targetWidth?: number;
  targetHeight?: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp';
}

export default function ImageCleanerPage() {
  const { t } = useLocalization();
  const [images, setImages] = useState<ImageFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [cleaningOptions, setCleaningOptions] = useState<CleaningOptions>({
    removeBackground: false,
    enhanceQuality: true,
    compressImage: true,
    resizeImage: false,
    quality: 80,
    format: 'jpeg'
  });

  // 文件拖拽处理
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newImages: ImageFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      preview: URL.createObjectURL(file),
      status: 'pending',
      originalSize: file.size
    }));
    
    setImages(prev => [...prev, ...newImages]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.bmp', '.webp']
    },
    multiple: true
  });

  // 图像处理函数
  const processImage = async (imageFile: ImageFile): Promise<string> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        // 设置画布尺寸
        let { width, height } = img;
        
        if (cleaningOptions.resizeImage && cleaningOptions.targetWidth && cleaningOptions.targetHeight) {
          width = cleaningOptions.targetWidth;
          height = cleaningOptions.targetHeight;
        }

        canvas.width = width;
        canvas.height = height;

        if (!ctx) {
          reject(new Error('Canvas context not available'));
          return;
        }

        // 绘制图像
        ctx.drawImage(img, 0, 0, width, height);

        // 图像增强处理
        if (cleaningOptions.enhanceQuality) {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          // 简单的对比度和亮度调整
          for (let i = 0; i < data.length; i += 4) {
            // 增强对比度
            data[i] = Math.min(255, Math.max(0, (data[i] - 128) * 1.2 + 128));     // Red
            data[i + 1] = Math.min(255, Math.max(0, (data[i + 1] - 128) * 1.2 + 128)); // Green
            data[i + 2] = Math.min(255, Math.max(0, (data[i + 2] - 128) * 1.2 + 128)); // Blue
          }

          ctx.putImageData(imageData, 0, 0);
        }

        // 导出处理后的图像
        const quality = cleaningOptions.quality / 100;
        const mimeType = `image/${cleaningOptions.format}`;
        
        canvas.toBlob((blob) => {
          if (blob) {
            const processedUrl = URL.createObjectURL(blob);
            resolve(processedUrl);
          } else {
            reject(new Error('Failed to process image'));
          }
        }, mimeType, quality);
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = imageFile.preview;
    });
  };

  // 批量处理图像
  const handleProcessImages = async () => {
    setIsProcessing(true);
    
    for (const image of images) {
      if (image.status === 'pending') {
        setImages(prev => prev.map(img => 
          img.id === image.id ? { ...img, status: 'processing' } : img
        ));

        try {
          const processedUrl = await processImage(image);
          
          // 计算压缩比
          const response = await fetch(processedUrl);
          const blob = await response.blob();
          const processedSize = blob.size;
          const compressionRatio = ((image.originalSize - processedSize) / image.originalSize) * 100;

          setImages(prev => prev.map(img => 
            img.id === image.id ? { 
              ...img, 
              status: 'completed',
              processed: processedUrl,
              processedSize,
              compressionRatio
            } : img
          ));
        } catch (error) {
          console.error('Error processing image:', error);
          setImages(prev => prev.map(img => 
            img.id === image.id ? { ...img, status: 'error' } : img
          ));
        }
      }
    }
    
    setIsProcessing(false);
  };

  // 下载处理后的图像
  const downloadImage = (image: ImageFile) => {
    if (image.processed) {
      const link = document.createElement('a');
      link.href = image.processed;
      link.download = `cleaned_${image.file.name.split('.')[0]}.${cleaningOptions.format}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // 批量下载
  const downloadAllImages = () => {
    images.filter(img => img.processed).forEach(img => {
      setTimeout(() => downloadImage(img), 100);
    });
  };

  // 清除所有图像
  const clearAllImages = () => {
    images.forEach(img => {
      URL.revokeObjectURL(img.preview);
      if (img.processed) {
        URL.revokeObjectURL(img.processed);
      }
    });
    setImages([]);
  };

  // 移除单个图像
  const removeImage = (id: string) => {
    const image = images.find(img => img.id === id);
    if (image) {
      URL.revokeObjectURL(image.preview);
      if (image.processed) {
        URL.revokeObjectURL(image.processed);
      }
    }
    setImages(prev => prev.filter(img => img.id !== id));
  };

  // 格式化文件大小
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            {t('imageCleaner.title') || '图像清洗系统'}
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-300">
            {t('imageCleaner.subtitle') || '上传、处理和优化您的图像文件'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧：上传区域和设置 */}
          <div className="lg:col-span-1 space-y-6">
            {/* 文件上传区域 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('imageCleaner.upload.title') || '上传图像'}
              </h2>
              
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                  isDragActive
                    ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                    : 'border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500'
                }`}
              >
                <input {...getInputProps()} />
                <div className="space-y-4">
                  <div className="mx-auto w-12 h-12 text-gray-400">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-gray-600 dark:text-gray-300">
                      {isDragActive
                        ? (t('imageCleaner.upload.dropHere') || '释放文件到这里')
                        : (t('imageCleaner.upload.dragDrop') || '拖拽图像文件到这里，或点击选择')}
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {t('imageCleaner.upload.supportedFormats') || '支持 JPG, PNG, GIF, BMP, WebP 格式'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* 处理选项 */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('imageCleaner.options.title') || '处理选项'}
              </h2>
              
              <div className="space-y-4">
                {/* 图像增强 */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.enhanceQuality}
                    onChange={(e) => setCleaningOptions(prev => ({
                      ...prev,
                      enhanceQuality: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('imageCleaner.options.enhanceQuality') || '增强图像质量'}
                  </span>
                </label>

                {/* 压缩图像 */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.compressImage}
                    onChange={(e) => setCleaningOptions(prev => ({
                      ...prev,
                      compressImage: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('imageCleaner.options.compressImage') || '压缩图像'}
                  </span>
                </label>

                {/* 调整尺寸 */}
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={cleaningOptions.resizeImage}
                    onChange={(e) => setCleaningOptions(prev => ({
                      ...prev,
                      resizeImage: e.target.checked
                    }))}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    {t('imageCleaner.options.resizeImage') || '调整图像尺寸'}
                  </span>
                </label>

                {/* 尺寸设置 */}
                {cleaningOptions.resizeImage && (
                  <div className="ml-6 grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('imageCleaner.options.width') || '宽度'}
                      </label>
                      <input
                        type="number"
                        value={cleaningOptions.targetWidth || ''}
                        onChange={(e) => setCleaningOptions(prev => ({
                          ...prev,
                          targetWidth: parseInt(e.target.value) || undefined
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="800"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">
                        {t('imageCleaner.options.height') || '高度'}
                      </label>
                      <input
                        type="number"
                        value={cleaningOptions.targetHeight || ''}
                        onChange={(e) => setCleaningOptions(prev => ({
                          ...prev,
                          targetHeight: parseInt(e.target.value) || undefined
                        }))}
                        className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="600"
                      />
                    </div>
                  </div>
                )}

                {/* 质量设置 */}
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('imageCleaner.options.quality') || '图像质量'}: {cleaningOptions.quality}%
                  </label>
                  <input
                    type="range"
                    min="10"
                    max="100"
                    value={cleaningOptions.quality}
                    onChange={(e) => setCleaningOptions(prev => ({
                      ...prev,
                      quality: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                {/* 输出格式 */}
                <div>
                  <label className="block text-sm text-gray-700 dark:text-gray-300 mb-2">
                    {t('imageCleaner.options.format') || '输出格式'}
                  </label>
                  <select
                    value={cleaningOptions.format}
                    onChange={(e) => setCleaningOptions(prev => ({
                      ...prev,
                      format: e.target.value as 'jpeg' | 'png' | 'webp'
                    }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
              </div>

              {/* 处理按钮 */}
              <div className="mt-6 space-y-2">
                <button
                  onClick={handleProcessImages}
                  disabled={images.length === 0 || isProcessing}
                  className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isProcessing 
                    ? (t('imageCleaner.processing') || '处理中...')
                    : (t('imageCleaner.processImages') || '处理图像')
                  }
                </button>
                
                {images.some(img => img.processed) && (
                  <button
                    onClick={downloadAllImages}
                    className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    {t('imageCleaner.downloadAll') || '下载所有'}
                  </button>
                )}
                
                {images.length > 0 && (
                  <button
                    onClick={clearAllImages}
                    className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    {t('imageCleaner.clearAll') || '清除所有'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 右侧：图像预览和结果 */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                {t('imageCleaner.preview.title') || '图像预览'}
              </h2>
              
              {images.length === 0 ? (
                <div className="text-center py-12">
                  <div className="mx-auto w-16 h-16 text-gray-400 mb-4">
                    <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 dark:text-gray-400">
                    {t('imageCleaner.preview.empty') || '还没有上传图像'}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {images.map((image) => (
                    <div key={image.id} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                      {/* 图像预览 */}
                      <div className="grid grid-cols-2 gap-2 p-4">
                        {/* 原始图像 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('imageCleaner.preview.original') || '原始图像'}
                          </h4>
                          <img
                            src={image.preview}
                            alt="Original"
                            className="w-full h-32 object-cover rounded border"
                          />
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {formatFileSize(image.originalSize)}
                          </p>
                        </div>

                        {/* 处理后图像 */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            {t('imageCleaner.preview.processed') || '处理后'}
                          </h4>
                          {image.processed ? (
                            <>
                              <img
                                src={image.processed}
                                alt="Processed"
                                className="w-full h-32 object-cover rounded border"
                              />
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                <p>{formatFileSize(image.processedSize || 0)}</p>
                                {image.compressionRatio && (
                                  <p className="text-green-600">
                                    -{image.compressionRatio.toFixed(1)}%
                                  </p>
                                )}
                              </div>
                            </>
                          ) : (
                            <div className="w-full h-32 bg-gray-100 dark:bg-gray-700 rounded border flex items-center justify-center">
                              {image.status === 'processing' ? (
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                              ) : image.status === 'error' ? (
                                <span className="text-red-500 text-xs">
                                  {t('imageCleaner.preview.error') || '处理失败'}
                                </span>
                              ) : (
                                <span className="text-gray-400 text-xs">
                                  {t('imageCleaner.preview.pending') || '等待处理'}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* 操作按钮 */}
                      <div className="px-4 pb-4 flex justify-between items-center">
                        <span className="text-sm text-gray-600 dark:text-gray-300 truncate">
                          {image.file.name}
                        </span>
                        <div className="flex gap-2">
                          {image.processed && (
                            <button
                              onClick={() => downloadImage(image)}
                              className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors"
                            >
                              {t('imageCleaner.download') || '下载'}
                            </button>
                          )}
                          <button
                            onClick={() => removeImage(image.id)}
                            className="px-3 py-1 bg-red-600 text-white text-xs rounded hover:bg-red-700 transition-colors"
                          >
                            {t('imageCleaner.remove') || '移除'}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
