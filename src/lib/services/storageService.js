// Storage service for handling media uploads
import { supabase } from '@/lib/supabase/client';

/**
 * Upload file to Supabase storage
 * @param {File} file - The file to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} folder - Optional folder within bucket
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const uploadFile = async (file, bucket, folder = '') => {
  try {
    if (!file) {
      return { data: null, error: new Error('No file provided') };
    }

    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Error uploading file:', error);
      return { data: null, error };
    }

    // Get public URL
    const { data: publicData } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return { 
      data: { 
        path: data.path, 
        fullPath: data.fullPath,
        publicUrl: publicData.publicUrl 
      }, 
      error: null 
    };
  } catch (error) {
    console.error('Unexpected error uploading file:', error);
    return { data: null, error };
  }
};

/**
 * Upload multiple files
 * @param {FileList|Array} files - Files to upload
 * @param {string} bucket - The storage bucket name
 * @param {string} folder - Optional folder within bucket
 * @returns {Promise<{data: Array|null, error: Error|null}>}
 */
export const uploadMultipleFiles = async (files, bucket, folder = '') => {
  try {
    const uploadPromises = Array.from(files).map(file => 
      uploadFile(file, bucket, folder)
    );
    
    const results = await Promise.all(uploadPromises);
    const errors = results.filter(result => result.error);
    
    if (errors.length > 0) {
      return { data: null, error: errors[0].error };
    }
    
    const successfulUploads = results.map(result => result.data);
    return { data: successfulUploads, error: null };
  } catch (error) {
    console.error('Error uploading multiple files:', error);
    return { data: null, error };
  }
};

/**
 * Delete file from storage
 * @param {string} filePath - Path to the file in storage
 * @param {string} bucket - The storage bucket name
 * @returns {Promise<{success: boolean, error: Error|null}>}
 */
export const deleteFile = async (filePath, bucket) => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Error deleting file:', error);
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error('Unexpected error deleting file:', error);
    return { success: false, error };
  }
};

/**
 * Get public URL for a file
 * @param {string} filePath - Path to the file in storage
 * @param {string} bucket - The storage bucket name
 * @returns {string} Public URL
 */
export const getPublicUrl = (filePath, bucket) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  
  return data.publicUrl;
};

/**
 * Upload workout cover image
 * @param {File} file - The image file
 * @param {string} userId - User ID for folder organization
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const uploadWorkoutCover = async (file, userId) => {
  return uploadFile(file, 'workout-covers', userId);
};

/**
 * Upload exercise media (video or image)
 * @param {File} file - The media file
 * @param {string} userId - User ID for folder organization
 * @param {string} exerciseId - Exercise ID for organization
 * @returns {Promise<{data: Object|null, error: Error|null}>}
 */
export const uploadExerciseMedia = async (file, userId, exerciseId) => {
  return uploadFile(file, 'exercise-media', `${userId}/${exerciseId}`);
};

/**
 * Validate file type and size
 * @param {File} file - The file to validate
 * @param {Object} options - Validation options
 * @returns {Object} Validation result
 */
export const validateFile = (file, options = {}) => {
  const {
    maxSize = 50 * 1024 * 1024, // 50MB default
    allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
  } = options;

  const errors = [];

  if (file.size > maxSize) {
    errors.push(`File size must be less than ${maxSize / (1024 * 1024)}MB`);
  }

  if (!allowedTypes.includes(file.type)) {
    errors.push(`File type ${file.type} is not allowed. Allowed types: ${allowedTypes.join(', ')}`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

/**
 * Create optimized thumbnail for images
 * @param {File} file - Image file
 * @param {number} maxWidth - Maximum width for thumbnail
 * @param {number} maxHeight - Maximum height for thumbnail
 * @returns {Promise<Blob>} Optimized image blob
 */
export const createThumbnail = async (file, maxWidth = 300, maxHeight = 300) => {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();

    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img;
      if (width > height) {
        if (width > maxWidth) {
          height = (height * maxWidth) / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = (width * maxHeight) / height;
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(resolve, 'image/jpeg', 0.8);
    };

    img.onerror = reject;
    img.src = URL.createObjectURL(file);
  });
}; 