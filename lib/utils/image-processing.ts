// Client-side image processing utilities

export interface ProcessingOptions {
  width?: number;
  height?: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp';
  maintainAspectRatio?: boolean;
}

export interface ProcessingResult {
  blob: Blob;
  width: number;
  height: number;
  size: number;
}

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    const ctx = this.canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas not supported');
    this.ctx = ctx;
  }

  async loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = URL.createObjectURL(file);
    });
  }

  async processImage(file: File, options: ProcessingOptions): Promise<ProcessingResult> {
    const img = await this.loadImage(file);
    
    let { width = img.width, height = img.height } = options;
    const { quality = 0.9, format = 'jpeg', maintainAspectRatio = true } = options;

    if (maintainAspectRatio && options.width && !options.height) {
      height = Math.round((options.width / img.width) * img.height);
    } else if (maintainAspectRatio && options.height && !options.width) {
      width = Math.round((options.height / img.height) * img.width);
    }

    this.canvas.width = width;
    this.canvas.height = height;

    // Use high-quality scaling
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';
    
    this.ctx.drawImage(img, 0, 0, width, height);

    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to process image'));
            return;
          }
          resolve({
            blob,
            width,
            height,
            size: blob.size,
          });
        },
        `image/${format}`,
        quality
      );
    });
  }


  cleanup() {
    // Clean up canvas and any blob URLs
    if (this.canvas) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function getImageDimensions(file: File): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.width, height: img.height });
      URL.revokeObjectURL(img.src);
    };
    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}