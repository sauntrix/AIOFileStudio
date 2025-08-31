'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Edit, Upload, Download, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { ToolHero } from '@/components/ui/tool-hero';
import { Dropzone } from '@/components/ui/dropzone';
import { EmptyState } from '@/components/ui/empty-state';
import { FilePreview } from '@/components/ui/file-preview';
import { useFileStore } from '@/lib/stores/file-store';
import { useImageProcessor } from '@/lib/hooks/use-image-processor';
import { getImageDimensions, formatFileSize } from '@/lib/utils/image-processing';
import { SUPPORTED_IMAGE_TYPES, generateDownloadFilename } from '@/lib/utils/file-utils';
import { toast } from 'sonner';

export default function ImageEditor() {
  const { files, addFile, updateFile, removeFile, clearFiles } = useFileStore();
  const { processImage, isProcessing } = useImageProcessor();
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [quality, setQuality] = useState([85]);
  const [format, setFormat] = useState('jpg');
  const [maintainAspect, setMaintainAspect] = useState(true);
  const [originalAspect, setOriginalAspect] = useState(1);
  const [estimatedSize, setEstimatedSize] = useState<string>('');

  const handleDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      const fileId = addFile(file);
      
      // Get original dimensions using utility
      getImageDimensions(file).then(({ width: imgWidth, height: imgHeight }) => {
        const aspect = imgWidth / imgHeight;
        setOriginalAspect(aspect);
        setWidth(imgWidth);
        setHeight(imgHeight);
        updateEstimatedSize(imgWidth, imgHeight, quality[0], format);
      }).catch(console.error);
    }
  }, [addFile, quality, format]);

  const updateEstimatedSize = useCallback((w: number, h: number, q: number, fmt: string) => {
    // Rough estimation based on dimensions and quality
    const pixels = w * h;
    const baseSize = fmt === 'png' ? pixels * 4 : pixels * 3 * (q / 100);
    setEstimatedSize(formatFileSize(baseSize));
  }, []);
  const handleWidthChange = (newWidth: number) => {
    setWidth(newWidth);
    if (maintainAspect) {
      setHeight(Math.round(newWidth / originalAspect));
    }
    updateEstimatedSize(newWidth, maintainAspect ? Math.round(newWidth / originalAspect) : height, quality[0], format);
  };

  const handleHeightChange = (newHeight: number) => {
    setHeight(newHeight);
    if (maintainAspect) {
      setWidth(Math.round(newHeight * originalAspect));
    }
    updateEstimatedSize(maintainAspect ? Math.round(newHeight * originalAspect) : width, newHeight, quality[0], format);
  };

  const handleQualityChange = (newQuality: number[]) => {
    setQuality(newQuality);
    updateEstimatedSize(width, height, newQuality[0], format);
  };

  const handleFormatChange = (newFormat: string) => {
    setFormat(newFormat);
    updateEstimatedSize(width, height, quality[0], newFormat);
  };

  const handleProcessImage = async (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    updateFile(fileId, { status: 'processing', progress: 0 });

    const result = await processImage(file.file, {
      width,
      height,
      quality: quality[0] / 100,
      format: format === 'jpg' ? 'jpeg' : format as 'png' | 'webp',
      maintainAspectRatio: maintainAspect,
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
        error: 'Processing failed',
        progress: 0,
      });
    }
  };

  const downloadFile = (fileId: string) => {
    const file = files.find(f => f.id === fileId);
    if (!file || !file.result) return;

    const link = document.createElement('a');
    link.href = file.result;
    link.download = generateDownloadFilename(file.file.name, 'edited', format);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const currentFile = files[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToolHero
          title="Image Editor"
          description="Resize, compress, and optimize your images with professional quality and precision"
          icon={Edit}
          badges={['Smart Resize', 'Quality Control', 'Multiple Formats']}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                {!currentFile ? (
                  <div className="space-y-6">
                    <EmptyState
                      title="No Image Selected"
                      description="Upload an image to start editing. Supports JPG, PNG, and WebP formats."
                      icon={Upload}
                      action={{
                        label: "Choose Image",
                        onClick: () => document.getElementById('file-input')?.click()
                      }}
                    />
                    <Dropzone
                      onDrop={handleDrop}
                      accept={SUPPORTED_IMAGE_TYPES}
                      tool="editor"
                      maxFiles={1}
                    />
                  </div>
                ) : (
                  <div className="space-y-4">
                    <FilePreview
                      file={currentFile}
                      onRemove={removeFile}
                      onDownload={currentFile.status === 'completed' ? downloadFile : undefined}
                      showResult={currentFile.status === 'completed'}
                    />
                    
                    <Button
                      variant="outline"
                      onClick={() => {
                        clearFiles();
                        setWidth(800);
                        setHeight(600);
                        setQuality([85]);
                        setFormat('jpg');
                      }}
                      className="w-full focus-ring rounded-xl"
                    >
                      Upload Different Image
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Controls Section */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Card className="glass-card">
              <CardContent className="p-6">
                {!currentFile ? (
                  <EmptyState
                    title="Settings Panel"
                    description="Upload an image to access editing controls and options"
                    icon={Settings}
                  />
                ) : (
                  <div className="space-y-6">
                    <div className="flex items-center space-x-2 mb-6">
                      <Settings className="w-5 h-5" />
                      <h3 className="text-lg font-semibold">Edit Settings</h3>
                    </div>

                    {/* Dimensions */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Dimensions</Label>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="width" className="text-sm">Width (px)</Label>
                          <Input
                            id="width"
                            type="number"
                            value={width}
                            onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                            className="focus-ring rounded-xl mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="height" className="text-sm">Height (px)</Label>
                          <Input
                            id="height"
                            type="number"
                            value={height}
                            onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                            className="focus-ring rounded-xl mt-1"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Quality */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Quality: {quality[0]}%</Label>
                      <Slider
                        value={quality}
                        onValueChange={handleQualityChange}
                        max={100}
                        min={1}
                        step={1}
                        className="focus-ring"
                      />
                    </div>

                    {/* Format */}
                    <div className="space-y-4">
                      <Label className="text-base font-medium">Output Format</Label>
                      <Select value={format} onValueChange={handleFormatChange}>
                        <SelectTrigger className="focus-ring rounded-xl">
                          <SelectValue placeholder="Select format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="jpg">JPG</SelectItem>
                          <SelectItem value="png">PNG</SelectItem>
                          <SelectItem value="webp">WebP</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Size Estimation */}
                    {estimatedSize && (
                      <div className="p-3 bg-muted/50 rounded-xl">
                        <p className="text-sm font-medium mb-1">Estimated Size</p>
                        <p className="text-sm text-muted-foreground">{estimatedSize}</p>
                      </div>
                    )}

                    {/* Process Button */}
                    <Button
                      onClick={() => currentFile && handleProcessImage(currentFile.id)}
                      disabled={!currentFile || isProcessing}
                      className="w-full focus-ring rounded-xl"
                      size="lg"
                    >
                      {isProcessing ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                          className="mr-2"
                        >
                          <Settings className="w-4 h-4" />
                        </motion.div>
                      ) : (
                        <Edit className="w-4 h-4 mr-2" />
                      )}
                      {isProcessing ? `Processing... ${currentFile?.progress || 0}%` : 'Apply Changes'}
                    </Button>
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