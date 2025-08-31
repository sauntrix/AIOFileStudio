'use client';

import { useCallback, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw, Upload, Download, Settings, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ToolHero } from '@/components/ui/tool-hero';
import { Dropzone } from '@/components/ui/dropzone';
import { EmptyState } from '@/components/ui/empty-state';
import { FilePreview } from '@/components/ui/file-preview';
import { useFileStore } from '@/lib/stores/file-store';
import { SUPPORTED_IMAGE_TYPES, SUPPORTED_DOCUMENT_TYPES, generateDownloadFilename } from '@/lib/utils/file-utils';
import { useImageProcessor } from '@/lib/hooks/use-image-processor';
import { toast } from 'sonner';

export default function FileConverter() {
  const { files, addFile, updateFile, removeFile, clearFiles } = useFileStore();
  const { processImage, isProcessing } = useImageProcessor();
  const [conversionType, setConversionType] = useState('image-to-image');
  const [targetFormat, setTargetFormat] = useState('png');

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    acceptedFiles.forEach(file => addFile(file));
  }, [addFile]);

  const convertFile = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    updateFile(fileId, { status: 'processing', progress: 0 });

    if (conversionType === 'image-to-image' && file.file.type.startsWith('image/')) {
      const result = await processImage(file.file, {
        format: targetFormat === 'jpg' ? 'jpeg' : targetFormat as 'png' | 'webp',
        quality: 0.9,
      }, (progress) => {
        updateFile(fileId, { progress });
      });

      if (result) {
        const resultUrl = URL.createObjectURL(result.blob);
        updateFile(fileId, {
          status: 'completed',
          progress: 100,
          result: resultUrl,
        });
      } else {
        updateFile(fileId, {
          status: 'error',
          error: 'Conversion failed',
          progress: 0,
        });
      }
    } else {
      // For non-image conversions, show not implemented message
      updateFile(fileId, {
        status: 'error',
        error: 'This conversion type is not yet implemented in the demo',
        progress: 0,
      });
      toast.error('This conversion type is not yet implemented in the demo');
    }
  };

  const downloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !file.result) return;

    const link = document.createElement('a');
    link.href = file.result;
    link.download = generateDownloadFilename(file.file.name, 'converted', targetFormat);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const downloadAll = () => {
    files
      .filter(f => f.status === 'completed' && f.result)
      .forEach(file => downloadFile(file.id));
  };

  const getAcceptedTypes = () => {
    switch (conversionType) {
      case 'image-to-image':
        return SUPPORTED_IMAGE_TYPES;
      case 'pdf-to-image':
        return { 'application/pdf': ['.pdf'] };
      case 'word-to-pdf':
        return { 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] };
      default:
        return { ...SUPPORTED_IMAGE_TYPES, ...SUPPORTED_DOCUMENT_TYPES };
    }
  };

  const getTargetFormats = () => {
    switch (conversionType) {
      case 'image-to-image':
        return [
          { value: 'jpg', label: 'JPG' },
          { value: 'png', label: 'PNG' },
          { value: 'webp', label: 'WebP' },
        ];
      case 'pdf-to-image':
        return [
          { value: 'jpg', label: 'JPG (per page)' },
          { value: 'png', label: 'PNG (per page)' },
        ];
      case 'word-to-pdf':
        return [{ value: 'pdf', label: 'PDF' }];
      default:
        return [{ value: 'auto', label: 'Auto-detect' }];
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToolHero
          title="File Converter"
          description="Convert between multiple file formats with professional quality and speed"
          icon={RefreshCw}
          badges={['Multi-Format', 'Batch Processing', 'High Quality', 'Fast Conversion']}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-2"
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                {files.length === 0 ? (
                  <div className="space-y-6">
                    <EmptyState
                      title="No Files Selected"
                      description="Upload files to start converting. Multiple files supported for batch processing."
                      icon={Upload}
                    />
                    
                    <div className="space-y-4">
                      <Tabs value={conversionType} onValueChange={setConversionType}>
                        <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="image-to-image">Image ⇄ Image</TabsTrigger>
                          <TabsTrigger value="pdf-to-image">PDF → Image</TabsTrigger>
                          <TabsTrigger value="word-to-pdf">Word → PDF</TabsTrigger>
                        </TabsList>
                      </Tabs>
                      
                      <Dropzone
                        onDrop={handleDrop}
                        accept={getAcceptedTypes()}
                        tool="converter"
                        maxFiles={5}
                      />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold">Files to Convert</h3>
                      {files.filter(f => f.status === 'completed').length > 1 && (
                        <Button
                          onClick={downloadAll}
                          variant="outline"
                          size="sm"
                          className="focus-ring rounded-xl"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Download All
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {files.map(file => (
                        <FilePreview
                          key={file.id}
                          file={file}
                          onRemove={removeFile}
                          onDownload={file.status === 'completed' ? downloadFile : undefined}
                          showResult={file.status === 'completed'}
                        />
                      ))}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={clearFiles}
                      className="w-full focus-ring rounded-xl"
                    >
                      Upload Different Files
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                {files.length === 0 ? (
                  <EmptyState
                    title="Conversion Settings"
                    description="Upload files to access conversion options and settings"
                    icon={Settings}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Settings className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Conversion Settings</h3>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Conversion Type</Label>
                      <Tabs value={conversionType} onValueChange={setConversionType}>
                        <TabsList className="grid w-full grid-cols-1">
                          <TabsTrigger value={conversionType} className="text-sm">
                            {conversionType === 'image-to-image' && 'Image ⇄ Image'}
                            {conversionType === 'pdf-to-image' && 'PDF → Image'}
                            {conversionType === 'word-to-pdf' && 'Word → PDF'}
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <div className="space-y-4">
                      <Label className="text-base font-medium">Target Format</Label>
                      <Select value={targetFormat} onValueChange={setTargetFormat}>
                        <SelectTrigger className="focus-ring rounded-xl">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          {getTargetFormats().map(format => (
                            <SelectItem key={format.value} value={format.value}>
                              {format.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <Button
                      onClick={() => files.forEach(file => {
                        if (file.status === 'idle') convertFile(file.id);
                      })}
                      disabled={files.every(f => f.status !== 'idle') || isProcessing}
                      className="w-full focus-ring rounded-xl"
                      size="lg"
                    >
                      {isProcessing ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                            className="mr-2"
                          >
                            <RefreshCw className="w-4 h-4" />
                          </motion.div>
                          Converting... {files.find(f => f.status === 'processing')?.progress || 0}%
                        </>
                      ) : (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2" />
                          Convert Files
                        </>
                      )}
                    </Button>

                    <div className="p-4 bg-muted/50 rounded-xl">
                      <h4 className="font-medium mb-2">📋 Supported Conversions</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• JPG ↔ PNG ↔ WebP</li>
                        <li>• PDF → JPG/PNG (per page)</li>
                        <li>• DOCX → PDF</li>
                      </ul>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}