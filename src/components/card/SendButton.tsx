
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"

interface SendButtonProps {
  onClick: () => void;
  isSending: boolean;
}

export const SendButton = ({ onClick, isSending }: SendButtonProps) => {
  return (
    <Button 
      onClick={onClick}
      disabled={isSending}
      className="w-full bg-sky-500 hover:bg-sky-600 text-white"
    >
      <Mail className="w-4 h-4 mr-2" />
      {isSending ? 'Sending...' : 'Send E-Card'}
    </Button>
  )
}
