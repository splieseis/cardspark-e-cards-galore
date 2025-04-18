
import { Card, CardContent } from "@/components/ui/card"

interface ImagePreviewProps {
  imageUrl?: string;
}

export const ImagePreview = ({ imageUrl }: ImagePreviewProps) => {
  return (
    <Card className="w-full max-w-md mx-auto overflow-hidden bg-white/50 backdrop-blur-sm border border-gray-200 shadow-lg">
      <CardContent className="p-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Generated card preview"
            className="w-full h-64 object-cover rounded-lg"
          />
        ) : (
          <div className="w-full h-64 bg-gray-100 rounded-lg flex items-center justify-center">
            <p className="text-gray-400 text-sm">Image preview will appear here</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
