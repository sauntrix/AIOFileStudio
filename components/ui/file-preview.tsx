'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Download, FileText, Image as ImageIcon, AlertCircle, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { ProcessingFile } from '@/lib/stores/file-store';
import { formatFileSize } from '@/lib/utils/file-utils';

interface FilePreviewProps {
  file: ProcessingFile;
  onRemove: (id: string) => void;
  onDownload?: (id: string) => void;
  showResult?: boolean;
  compact?: boolean;
}

export function FilePreview({ 
  file, 
  onRemove, 
  onDownload, 
  showResult = false, 
  compact = false 
}: FilePreviewProps) {
  const isImage = file.file.type.startsWith('image/');
  
  const getStatusIcon = () => {
    switch (file.status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'processing':
        return (
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full"
          />
        );
      default:
        return <FileText className="w-4 h-4 text-muted-foreground" />;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "glass-card space-y-4 relative overflow-hidden",
        compact ? "p-3" : "p-4"
      )}
    >
      {/* Background gradient for processing state */}
      <AnimatePresence>
        {file.status === 'processing' && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: '100%' }}
            exit={{ opacity: 0 }}
            transition={{ 
              duration: 2, 
              repeat: Infinity, 
              ease: "linear" 
            }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
          />
        )}
      </AnimatePresence>

      <div className="flex items-start space-x-3">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0 relative">
          {isImage && file.preview ? (
            <motion.div
              whileHover={{ scale: 1.05 }}
              className="relative"
            >
              <img
                src={file.preview}
                alt={file.file.name}
                className={cn(
                  "object-cover rounded-lg",
                  compact ? "w-10 h-10" : "w-12 h-12"
                )}
              />
              {file.status === 'processing' && (
                <div className="absolute inset-0 bg-black/20 rounded-lg flex items-center justify-center">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                  />
                </div>
              )}
            </motion.div>
          ) : (
            <div className={cn(
              "bg-muted rounded-lg flex items-center justify-center",
              compact ? "w-10 h-10" : "w-12 h-12"
            )}>
              <FileText className="w-6 h-6 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <h4 className={cn(
              "font-medium truncate",
              compact ? "text-xs" : "text-sm"
            )}>
              {file.file.name}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onRemove(file.id)}
              className="h-6 w-6 p-0 hover:bg-destructive/10 hover:text-destructive focus-ring rounded-md"
            >
              <X className="w-3 h-3" />
            </Button>
          </div>
          
          <p className={cn(
            "text-muted-foreground",
            compact ? "text-xs" : "text-xs"
          )}>
            {formatFileSize(file.file.size)}
          </p>

          {/* Status */}
          <div className={cn(
            "flex items-center space-x-2",
            compact ? "mt-1" : "mt-2"
          )}>
            {getStatusIcon()}
            <span className={cn(
              "text-muted-foreground",
              compact ? "text-xs" : "text-xs"
            )}>
              {file.status === 'idle' && 'Ready to process'}
              {file.status === 'processing' && `Processing... ${file.progress}%`}
              {file.status === 'completed' && 'Completed'}
              {file.status === 'error' && 'Error occurred'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <AnimatePresence>
        {file.status === 'processing' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Progress value={file.progress} className="h-2" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Preview */}
      <AnimatePresence>
        {showResult && file.result && file.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t pt-4"
          >
            <p className="text-sm font-medium mb-2">Result:</p>
            {isImage ? (
              <motion.img
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                src={file.result}
                alt="Processed result"
                className="w-full max-h-32 object-contain rounded-lg bg-muted"
              />
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 bg-muted rounded-lg text-center"
              >
                <FileText className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">Processed file ready</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Download Button */}
      <AnimatePresence>
        {onDownload && file.status === 'completed' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Button
              onClick={() => onDownload(file.id)}
              className="w-full focus-ring rounded-xl"
              size="sm"
            >
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}