
import { Textarea } from "@/components/ui/textarea"

interface MessageInputProps {
  message: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

export const MessageInput = ({ message, onChange }: MessageInputProps) => {
  return (
    <div className="space-y-2">
      <span className="text-sm font-medium text-gray-700">Personal Message</span>
      <Textarea
        name="message"
        value={message}
        onChange={onChange}
        placeholder="Write your personal message here..."
        className="min-h-[120px]"
      />
    </div>
  )
}
