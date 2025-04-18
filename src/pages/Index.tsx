
import { useState } from "react"
import { CardForm } from "@/components/CardForm"
import { ImagePreview } from "@/components/ImagePreview"
import { useToast } from "@/components/ui/use-toast"

const Index = () => {
  const { toast } = useToast()
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | undefined>(undefined)

  const handleGenerate = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl)
  }

  const handleSend = () => {
    toast({
      title: "E-Card Sent",
      description: "Your e-card has been sent successfully!",
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-sky-50">
      <div className="container px-4 py-8 mx-auto">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-center mb-2 text-gray-800">
            Create Your E-Card
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Design and send personalized e-cards in minutes
          </p>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="order-2 md:order-1">
              <CardForm 
                onGenerate={handleGenerate}
                onSend={handleSend}
              />
            </div>
            <div className="order-1 md:order-2">
              <ImagePreview imageUrl={generatedImageUrl} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index
