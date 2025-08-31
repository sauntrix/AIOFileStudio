'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface LoadingSkeletonProps {
  className?: string;
  rows?: number;
}

export function LoadingSkeleton({ className, rows = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {Array.from({ length: rows }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1, duration: 0.4 }}
          className="h-4 bg-muted rounded-lg animate-pulse"
        />
      ))}
    </div>
  );
}

export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={cn("aspect-square bg-muted rounded-2xl animate-pulse", className)}
    />
  );
}