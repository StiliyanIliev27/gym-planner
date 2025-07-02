'use client';

import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { uploadWorkoutCover, validateFile } from '@/lib/services/storageService';
import { toast } from 'sonner';

export default function WorkoutCoverUpload({ 
  currentCoverUrl = null, 
  onCoverUploaded, 
  userId, 
  className = '' 
}) {
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(currentCoverUrl);
  const fileInputRef = useRef(null);

  const handleFile = async (file) => {
    if (!file) return;

    // Validate file
    const validation = validateFile(file, {
      maxSize: 10 * 1024 * 1024, // 10MB
      allowedTypes: ['image/jpeg', 'image/png', 'image/webp']
    });

    if (!validation.isValid) {
      toast.error(validation.errors[0]);
      return;
    }

    setUploading(true);

    try {
      // Create preview
      const filePreview = URL.createObjectURL(file);
      setPreviewUrl(filePreview);

      // Upload file
      const { data, error } = await uploadWorkoutCover(file, userId);

      if (error) {
        toast.error('Failed to upload cover image');
        setPreviewUrl(currentCoverUrl); // Revert preview
        return;
      }

      toast.success('Cover image uploaded successfully!');
      onCoverUploaded?.(data.publicUrl);

    } catch (error) {
      console.error('Error uploading cover:', error);
      toast.error('Something went wrong uploading the image');
      setPreviewUrl(currentCoverUrl); // Revert preview
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const removeCover = () => {
    setPreviewUrl(null);
    onCoverUploaded?.(null);
    toast.success('Cover image removed');
  };

  return (
    <div className={className}>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFileInput}
        className="hidden"
      />
      
      {previewUrl ? (
        <Card className="relative group">
          <CardContent className="p-0">
            <div className="relative aspect-video rounded-lg overflow-hidden">
              <img
                src={previewUrl}
                alt="Workout cover"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={openFileDialog}
                  disabled={uploading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Change
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={removeCover}
                  disabled={uploading}
                >
                  <X className="h-4 w-4 mr-2" />
                  Remove
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card 
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-primary bg-primary/5' 
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <CardContent className="p-6">
            <div className="flex flex-col items-center justify-center text-center space-y-4">
              <div className="p-4 rounded-full bg-muted">
                <ImageIcon className="h-8 w-8 text-muted-foreground" />
              </div>
              
              <div className="space-y-2">
                <h4 className="text-sm font-medium">Add Workout Cover</h4>
                <p className="text-xs text-muted-foreground">
                  Drag and drop an image here, or click to select
                </p>
                <p className="text-xs text-muted-foreground">
                  PNG, JPG, WebP up to 10MB
                </p>
              </div>

              <Button 
                variant="outline" 
                size="sm"
                disabled={uploading}
                onClick={(e) => {
                  e.stopPropagation();
                  openFileDialog();
                }}
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Uploading...' : 'Select Image'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 