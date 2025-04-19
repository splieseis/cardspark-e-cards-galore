
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Wand2 } from "lucide-react"

interface ImageGeneratorProps {
  imagePrompt: string;
  onImagePromptChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  isUploading: boolean;
}

export const ImageGenerator = ({ 
  imagePrompt, 
  onImagePromptChange, 
  onGenerate, 
  isGenerating, 
  isUploading 
}: ImageGeneratorProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Wand2 className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Or Generate Image</span>
      </div>
      <Input
        name="imagePrompt"
        value={imagePrompt}
        onChange={onImagePromptChange}
        placeholder="Describe the image you want to generate..."
        className="w-full"
      />
      <Button 
        onClick={onGenerate}
        disabled={isGenerating || isUploading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white"
      >
        <Wand2 className="w-4 h-4 mr-2" />
        {isGenerating ? 'Generating...' : isUploading ? 'Uploading...' : 'Generate Image'}
      </Button>
    </div>
  )
}
