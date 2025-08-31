import { create } from 'zustand';

export interface ProcessingFile {
  id: string;
  file: File;
  preview?: string;
  result?: string;
  status: 'idle' | 'processing' | 'completed' | 'error';
  progress: number;
  error?: string;
}

interface FileState {
  files: ProcessingFile[];
  addFile: (file: File) => string;
  updateFile: (id: string, updates: Partial<ProcessingFile>) => void;
  removeFile: (id: string) => void;
  clearFiles: () => void;
}

export const useFileStore = create<FileState>((set) => ({
  files: [],
  addFile: (file: File) => {
    const id = Math.random().toString(36).slice(2);
    const preview = URL.createObjectURL(file);
    
    set((state) => ({
      files: [...state.files, { 
        id, 
        file, 
        preview, 
        status: 'idle', 
        progress: 0 
      }],
    }));
    
    return id;
  },
  updateFile: (id: string, updates: Partial<ProcessingFile>) =>
    set((state) => ({
      files: state.files.map((f) => 
        f.id === id ? { ...f, ...updates } : f
      ),
    })),
  removeFile: (id: string) =>
    set((state) => ({
      files: state.files.filter((f) => f.id !== id),
    })),
  clearFiles: () => set({ files: [] }),
}));