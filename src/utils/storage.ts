
import { supabase } from "@/integrations/supabase/client"

export const uploadEcardImage = async (file: File | string): Promise<string | null> => {
  try {
    const timestamp = new Date().getTime()
    let uploadedFile: File;
    
    // If the input is a URL string, fetch the image and convert to File
    if (typeof file === 'string') {
      try {
        const response = await fetch(file);
        if (!response.ok) throw new Error('Failed to fetch image from URL');
        
        const blob = await response.blob();
        uploadedFile = new File([blob], `ecard-${timestamp}.png`, { type: blob.type });
      } catch (error) {
        console.error('Error converting URL to File:', error);
        throw error;
      }
    } else {
      // If it's already a File, use it directly
      uploadedFile = file;
    }

    const fileExt = uploadedFile.name.split('.').pop()
    const fileName = `ecard-${timestamp}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('ecards')
      .upload(fileName, uploadedFile)

    if (error) {
      console.error('Error uploading file:', error.message)
      throw error
    }

    // Get the public URL for the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from('ecards')
      .getPublicUrl(fileName)

    return publicUrl
  } catch (error) {
    console.error('Upload failed:', error)
    return null
  }
}
