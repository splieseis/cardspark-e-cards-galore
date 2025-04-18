
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Image, Mail, Wand2 } from "lucide-react"

interface CardFormProps {
  onGenerate: () => void;
  onSend: () => void;
}

export const CardForm = ({ onGenerate, onSend }: CardFormProps) => {
  return (
    <Card className="w-full max-w-md mx-auto bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Image className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Image Prompt</span>
          </div>
          <Input
            placeholder="Describe the image you want (e.g., 'A cat in space')"
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-gray-700">Personal Message</span>
          <Textarea
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
            type="email"
            placeholder="recipient@example.com"
            className="w-full"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={onGenerate}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Wand2 className="w-4 h-4 mr-2" />
            Generate Image
          </Button>
          <Button 
            onClick={onSend}
            className="flex-1 bg-sky-500 hover:bg-sky-600 text-white"
          >
            <Mail className="w-4 h-4 mr-2" />
            Send E-Card
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
