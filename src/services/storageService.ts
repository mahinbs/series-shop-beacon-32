import { supabase } from '@/integrations/supabase/client';

export interface UploadResult {
  url: string;
  path: string;
  error?: string;
}

export class StorageService {
  private static readonly BUCKET_NAME = 'product-images';
  private static readonly COMIC_BUCKET_NAME = 'comic-pages';
  private static readonly MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  private static readonly ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  /**
   * Upload a file to Supabase Storage
   */
  static async uploadFile(
    file: File, 
    folder: string = 'products',
    fileName?: string,
    bucketName: string = StorageService.BUCKET_NAME
  ): Promise<UploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return { url: '', path: '', error: validation.error };
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomId = Math.random().toString(36).substring(2, 15);
      const fileExtension = file.name.split('.').pop();
      const finalFileName = fileName || `${timestamp}-${randomId}.${fileExtension}`;
      const filePath = `${folder}/${finalFileName}`;

      // Upload file to Supabase Storage
      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Upload error:', error);
        return { url: '', path: '', error: error.message };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(filePath);

      return {
        url: urlData.publicUrl,
        path: filePath
      };

    } catch (error) {
      console.error('Storage upload error:', error);
      return { 
        url: '', 
        path: '', 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Upload a comic page image
   */
  static async uploadComicPage(
    file: File, 
    seriesSlug: string,
    episodeNumber: number,
    pageNumber: number
  ): Promise<UploadResult> {
    const folder = `series/${seriesSlug}/episode-${episodeNumber}`;
    const fileName = `page-${pageNumber}.${file.name.split('.').pop()}`;
    return this.uploadFile(file, folder, fileName, this.COMIC_BUCKET_NAME);
  }

  /**
   * Delete a file from Supabase Storage
   */
  static async deleteFile(filePath: string, bucketName: string = StorageService.BUCKET_NAME): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(bucketName)
        .remove([filePath]);

      if (error) {
        console.error('Delete error:', error);
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error) {
      console.error('Storage delete error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Delete failed' 
      };
    }
  }

  /**
   * Get public URL for a file
   */
  static getPublicUrl(filePath: string, bucketName: string = StorageService.BUCKET_NAME): string {
    const { data } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);
    
    return data.publicUrl;
  }

  /**
   * Validate file before upload
   */
  private static validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.MAX_FILE_SIZE) {
      return {
        valid: false,
        error: `File size must be less than ${this.MAX_FILE_SIZE / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!this.ALLOWED_TYPES.includes(file.type)) {
      return {
        valid: false,
        error: `File type not supported. Allowed types: ${this.ALLOWED_TYPES.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Create a temporary preview URL for immediate display
   */
  static createPreviewUrl(file: File): string {
    return URL.createObjectURL(file);
  }

  /**
   * Revoke a preview URL to free memory
   */
  static revokePreviewUrl(url: string): void {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Check if URL is a temporary preview URL
   */
  static isPreviewUrl(url: string): boolean {
    return url.startsWith('blob:');
  }

  /**
   * Extract file path from Supabase Storage URL
   */
  static extractPathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url);
      const pathMatch = urlObj.pathname.match(/\/storage\/v1\/object\/public\/[^/]+\/(.+)/);
      return pathMatch ? pathMatch[1] : null;
    } catch {
      return null;
    }
  }
}
