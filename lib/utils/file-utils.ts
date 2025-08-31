export const SUPPORTED_IMAGE_TYPES = {
  'image/jpeg': ['.jpg', '.jpeg'],
  'image/png': ['.png'],
  'image/webp': ['.webp'],
} as const;

export const SUPPORTED_DOCUMENT_TYPES = {
  'application/pdf': ['.pdf'],
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
} as const;

export const MAX_FILE_SIZE = {
  image: 10 * 1024 * 1024, // 10MB
  document: 25 * 1024 * 1024, // 25MB
} as const;

export function validateFile(file: File, tool: 'editor' | 'remover' | 'converter') {
  const errors: string[] = [];
  
  // Size validation
  const isImage = file.type.startsWith('image/');
  const maxSize = isImage ? MAX_FILE_SIZE.image : MAX_FILE_SIZE.document;
  
  if (file.size > maxSize) {
    errors.push(`File size must be less than ${Math.round(maxSize / 1024 / 1024)}MB`);
  }
  
  // Type validation based on tool
  switch (tool) {
    case 'editor':
    case 'remover':
      if (!Object.keys(SUPPORTED_IMAGE_TYPES).includes(file.type)) {
        errors.push('Only JPG, PNG, and WebP images are supported');
      }
      break;
    case 'converter':
      const allTypes = { ...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOCUMENT_TYPES };
      if (!Object.keys(allTypes).includes(file.type)) {
        errors.push('Unsupported file type for conversion');
      }
      break;
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

export function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_|_$/g, '');
}

export function generateDownloadFilename(originalName: string, tool: string, extension?: string): string {
  const baseName = originalName.split('.').slice(0, -1).join('.');
  const timestamp = Date.now();
  const ext = extension || 'png';
  return sanitizeFilename(`${baseName}-${tool}-${timestamp}.${ext}`);
}