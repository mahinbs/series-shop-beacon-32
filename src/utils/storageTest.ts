import { StorageService } from '@/services/storageService';

/**
 * Test function to verify Supabase Storage is working
 * This can be called from the browser console for testing
 */
export const testStorageUpload = async () => {
  try {
    console.log('🧪 Testing Supabase Storage...');
    
    // Create a simple test file
    const testContent = 'This is a test file for storage verification';
    const testFile = new File([testContent], 'test.txt', { type: 'text/plain' });
    
    // Try to upload
    const result = await StorageService.uploadFile(testFile, 'test');
    
    if (result.error) {
      console.error('❌ Storage test failed:', result.error);
      return {
        success: false,
        error: result.error,
        message: 'Storage bucket may not be configured. Please check Supabase Storage setup.'
      };
    }
    
    console.log('✅ Storage test successful!');
    console.log('📁 File uploaded to:', result.path);
    console.log('🔗 Public URL:', result.url);
    
    // Clean up test file
    await StorageService.deleteFile(result.path);
    console.log('🧹 Test file cleaned up');
    
    return {
      success: true,
      message: 'Storage is working correctly!'
    };
    
  } catch (error) {
    console.error('❌ Storage test error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      message: 'Storage test failed. Please check your Supabase configuration.'
    };
  }
};

// Make it available globally for testing
if (typeof window !== 'undefined') {
  (window as any).testStorageUpload = testStorageUpload;
}
