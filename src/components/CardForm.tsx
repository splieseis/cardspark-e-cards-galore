
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { uploadEcardImage } from "@/utils/storage"
import { generateECardEmailHtml } from "@/utils/emailTemplate"
import { ImageUploader } from "./card/ImageUploader"
import { ImageGenerator } from "./card/ImageGenerator"
import { MessageInput } from "./card/MessageInput"
import { RecipientInput } from "./card/RecipientInput"
import { SendButton } from "./card/SendButton"

interface CardFormProps {
  onGenerate: (imageUrl: string) => void;
  onSend: () => void;
}

export const CardForm = ({ onGenerate, onSend }: CardFormProps) => {
  const { toast } = useToast()
  const [formData, setFormData] = useState({
    imagePrompt: '',
    message: '',
    recipientEmail: ''
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedImage(e.target.files[0])
      setCurrentImageUrl(null)
    }
  }

  const generateImage = async () => {
    if (!formData.imagePrompt) {
      toast({
        title: "Input required",
        description: "Please enter a description for your image",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true)
      
      const { data, error } = await supabase.functions.invoke('generate-image', {
        body: { prompt: formData.imagePrompt },
      })

      if (error) {
        throw error
      }

      if (data.imageUrl) {
        onGenerate(data.imageUrl)
        
        try {
          setIsUploading(true)
          
          const uploadedUrl = await uploadEcardImage(data.imageUrl)
          
          if (uploadedUrl) {
            setCurrentImageUrl(uploadedUrl)
            onGenerate(uploadedUrl)
            toast({
              title: "Success",
              description: "Your image has been generated and saved!",
            })
          } else {
            throw new Error('Failed to upload image to storage')
          }
        } catch (uploadError) {
          console.error('Error uploading generated image:', uploadError)
          toast({
            title: "Upload failed",
            description: "Your image was generated but couldn't be saved. You can still use it.",
            variant: "destructive",
          })
        } finally {
          setIsUploading(false)
        }
      } else {
        throw new Error('No image URL returned')
      }
    } catch (error) {
      console.error('Error generating image:', error)
      toast({
        title: "Generation failed",
        description: "Failed to generate image. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.recipientEmail) {
      toast({
        title: "Email required",
        description: "Please enter recipient's email address",
        variant: "destructive",
      })
      return
    }

    if (!currentImageUrl && !selectedImage) {
      toast({
        title: "Image required",
        description: "Please upload or generate an image for your e-card",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      let imageUrl = currentImageUrl
      
      if (selectedImage && !currentImageUrl) {
        imageUrl = await uploadEcardImage(selectedImage)
        setCurrentImageUrl(imageUrl)
      }

      // Generate email HTML
      const emailHtml = generateECardEmailHtml(formData.message, imageUrl!)

      const { error: dbError } = await supabase
        .from('ecards')
        .insert({
          message: formData.message,
          recipient_email: formData.recipientEmail,
          image_url: imageUrl
        })

      if (dbError) throw dbError

      console.log("Sending email with imageUrl:", imageUrl)

      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-ecard', {
        body: {
          recipientEmail: formData.recipientEmail,
          message: formData.message,
          imageUrl: imageUrl,
          emailHtml: emailHtml
        },
      })

      if (emailError) {
        console.error("Email error details:", emailError)
        throw emailError
      }

      console.log("Email response:", emailData)

      toast({
        title: "Success!",
        description: "Your e-card has been sent.",
      })

      setFormData({
        imagePrompt: '',
        message: '',
        recipientEmail: ''
      })
      setSelectedImage(null)
      setCurrentImageUrl(null)
      
      onSend()
    } catch (error) {
      console.error('Error sending e-card:', error)
      toast({
        title: "Error",
        description: "Failed to send your e-card. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
      <CardContent className="space-y-6 pt-6">
        <ImageUploader onImageSelect={handleImageSelect} />
        
        <ImageGenerator
          imagePrompt={formData.imagePrompt}
          onImagePromptChange={handleInputChange}
          onGenerate={generateImage}
          isGenerating={isGenerating}
          isUploading={isUploading}
        />

        <MessageInput
          message={formData.message}
          onChange={handleInputChange}
        />

        <RecipientInput
          recipientEmail={formData.recipientEmail}
          onChange={handleInputChange}
        />

        <SendButton
          onClick={handleSubmit}
          isSending={isSending}
        />
      </CardContent>
    </Card>
  )
}
