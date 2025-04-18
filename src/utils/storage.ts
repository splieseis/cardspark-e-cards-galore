
import { supabase } from "@/integrations/supabase/client"

export const uploadEcardImage = async (file: File): Promise<string | null> => {
  try {
    const timestamp = new Date().getTime()
    const fileExt = file.name.split('.').pop()
    const fileName = `ecard-${timestamp}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('ecards')
      .upload(fileName, file)

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
