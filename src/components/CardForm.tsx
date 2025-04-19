
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Image, Mail, Wand2 } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/components/ui/use-toast"
import { uploadEcardImage } from "@/utils/storage"

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
      setCurrentImageUrl(null) // Reset generated image URL when uploading a new one
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

    setIsSending(true)

    try {
      let imageUrl = currentImageUrl
      
      if (selectedImage && !currentImageUrl) {
        imageUrl = await uploadEcardImage(selectedImage)
        setCurrentImageUrl(imageUrl)
      }

      // Save to database
      const { error: dbError } = await supabase
        .from('ecards')
        .insert({
          message: formData.message,
          recipient_email: formData.recipientEmail,
          image_url: imageUrl
        })

      if (dbError) throw dbError

      console.log("Sending email with imageUrl:", imageUrl)

      // Send email
      const { data: emailData, error: emailError } = await supabase.functions.invoke('send-ecard', {
        body: {
          recipientEmail: formData.recipientEmail,
          message: formData.message,
          imageUrl: imageUrl
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
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Upload Image</span>
          </div>
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageSelect}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Or Generate Image</span>
          </div>
          <Input
            name="imagePrompt"
            value={formData.imagePrompt}
            onChange={handleInputChange}
            placeholder="Describe the image you want to generate..."
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Personal Message</span>
          <Textarea
            name="message"
            value={formData.message}
            onChange={handleInputChange}
            placeholder="Write your personal message here..."
            className="min-h-[120px]"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Mail className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Recipient's Email</span>
          </div>
          <Input
            name="recipientEmail"
            value={formData.recipientEmail}
            onChange={handleInputChange}
            type="email"
            placeholder="recipient@example.com"
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={generateImage}
            disabled={isGenerating || isUploading}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            {isGenerating ? 'Generating...' : isUploading ? 'Uploading...' : 'Generate Image'}
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSending}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            {isSending ? 'Sending...' : 'Send E-Card'}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
