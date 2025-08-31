'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { ImageProcessor, ProcessingOptions, ProcessingResult } from '@/lib/utils/image-processing';
import { toast } from 'sonner';

export interface UseImageProcessorReturn {
  isProcessing: boolean;
  processImage: (file: File, options: ProcessingOptions, onProgressUpdate?: (progress: number) => void) => Promise<ProcessingResult | null>;
  error: string | null;
}

export function useImageProcessor(): UseImageProcessorReturn {
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const processorRef = useRef<ImageProcessor | null>(null);

  const getProcessor = useCallback(() => {
    if (!processorRef.current) {
      processorRef.current = new ImageProcessor();
    }
    return processorRef.current;
  }, []);

  const processImage = useCallback(async (
    file: File, 
    options: ProcessingOptions,
    onProgressUpdate?: (progress: number) => void
  ): Promise<ProcessingResult | null> => {
    setIsProcessing(true);
    setError(null);

    try {
      const processor = getProcessor();
      
      onProgressUpdate?.(30);
      const result = await processor.processImage(file, options);
      
      onProgressUpdate?.(100);
      toast.success('Image processed successfully!');
      
      return result;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Processing failed';
      setError(errorMessage);
      toast.error(errorMessage);
      return null;
    } finally {
      setIsProcessing(false);
    }
  }, [getProcessor]);


  return {
    isProcessing,
    processImage,
    error,
  };
}