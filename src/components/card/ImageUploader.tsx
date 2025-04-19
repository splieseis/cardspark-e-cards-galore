
import { Input } from "@/components/ui/input"
import { Image } from "lucide-react"

interface ImageUploaderProps {
  onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ImageUploader = ({ onImageSelect }: ImageUploaderProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Image className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Upload Image</span>
      </div>
      <Input
        type="file"
        accept="image/*"
        onChange={onImageSelect}
        className="w-full"
      />
    </div>
  )
}
