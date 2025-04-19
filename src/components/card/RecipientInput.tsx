
import { Input } from "@/components/ui/input"
import { Mail } from "lucide-react"

interface RecipientInputProps {
  recipientEmail: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const RecipientInput = ({ recipientEmail, onChange }: RecipientInputProps) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center space-x-2">
        <Mail className="w-4 h-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Recipient's Email</span>
      </div>
      <Input
        name="recipientEmail"
        value={recipientEmail}
        onChange={onChange}
        type="email"
        placeholder="recipient@example.com"
        className="w-full"
      />
    </div>
  )
}
