'use client';

import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Image, FileX, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { validateFile } from '@/lib/utils/file-utils';

interface DropzoneProps {
  onDrop: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxFiles?: number;
  tool: 'editor' | 'remover' | 'converter';
  className?: string;
  disabled?: boolean;
}

export function Dropzone({
  onDrop,
  accept,
  maxFiles = 1,
  tool,
  className,
  disabled = false,
}: DropzoneProps) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const validFiles = acceptedFiles.filter(file => {
      const validation = validateFile(file, tool);
      return validation.valid;
    });
    
    if (validFiles.length > 0) {
      onDrop(validFiles.slice(0, maxFiles));
    }
  }, [onDrop, tool, maxFiles]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragReject,
    fileRejections,
  } = useDropzone({
    onDrop: handleDrop,
    accept,
    maxFiles,
    disabled,
    multiple: maxFiles > 1,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDropAccepted: () => setDragActive(false),
    onDropRejected: () => setDragActive(false),
  });

  const rejectionReasons = fileRejections.map(rejection => 
    rejection.errors.map(error => error.message).join(', ')
  ).join('; ');

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative border-2 border-dashed rounded-2xl p-8 text-center transition-all duration-200 cursor-pointer focus-ring",
        "hover:border-primary/50 hover:bg-primary/5",
        "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
        (isDragActive || dragActive) && "border-primary bg-primary/10 scale-[1.02] shadow-lg",
        isDragReject && "border-destructive bg-destructive/10",
        !isDragActive && !isDragReject && "border-border hover:border-primary/50 hover:bg-muted/20",
        disabled && "opacity-50 cursor-not-allowed",
        className
      )}
      tabIndex={0}
      role="button"
      aria-label={`Upload files for ${tool}`}
    >
      <input {...getInputProps()} />
      
      <AnimatePresence>
        {(isDragActive || dragActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-r from-primary/20 to-purple-500/20 rounded-2xl"
          />
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        <motion.div
          key={isDragActive ? 'active' : 'idle'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col items-center space-y-4"
        >
          <motion.div
            animate={{ 
              y: isDragActive ? -5 : 0,
              scale: (isDragActive || dragActive) ? 1.1 : 1,
              rotate: (isDragActive || dragActive) ? 5 : 0
            }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className={cn(
              "p-4 rounded-full transition-colors duration-200",
              (isDragActive || dragActive) ? "bg-primary/10 shadow-lg" : "bg-muted",
              isDragReject && "bg-destructive/10"
            )}
          >
            {isDragReject ? (
              <FileX className="w-8 h-8 text-destructive" />
            ) : isDragActive ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              >
                <Upload className="w-8 h-8 text-primary" />
              </motion.div>
            ) : (
              <Image className="w-8 h-8 text-muted-foreground" />
            )}
          </motion.div>

          <div className="space-y-2">
            <motion.p 
              className="text-lg font-medium"
              animate={{ 
                scale: (isDragActive || dragActive) ? 1.05 : 1 
              }}
            >
              {isDragActive 
                ? isDragReject 
                  ? 'File not supported' 
                  : 'Drop files here'
                : 'Drag & drop files here'
              }
            </motion.p>
            <p className="text-sm text-muted-foreground">
              {isDragActive 
                ? isDragReject 
                  ? rejectionReasons
                  : 'Release to upload'
                : 'or click to browse'
              }
            </p>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Animated border effect */}
      <AnimatePresence>
        {(isDragActive || dragActive) && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute inset-0 border-2 border-primary rounded-2xl animate-pulse"
          />
        )}
      </AnimatePresence>
    </div>
  );
}