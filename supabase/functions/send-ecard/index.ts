
import { serve } from "https://deno.land/std@0.190.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"
import React from 'npm:react@18.3.1'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import { ECardEmail } from "./_templates/ecard.tsx"

const resend = new Resend(Deno.env.get("RESEND_API_KEY"))

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SendECardRequest {
  recipientEmail: string
  message: string
  imageUrl: string
  senderEmail?: string
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { recipientEmail, message, imageUrl, senderEmail }: SendECardRequest = await req.json()

    const html = await renderAsync(
      React.createElement(ECardEmail, {
        message,
        imageUrl,
        senderEmail,
      })
    )

    const emailResponse = await resend.emails.send({
      from: "E-Cards <onboarding@resend.dev>",
      to: [recipientEmail],
      subject: "You've received an e-card! 🎉",
      html,
    })

    console.log("Email sent successfully:", emailResponse)

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    })
  } catch (error: any) {
    console.error("Error in send-ecard function:", error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    )
  }
}

serve(handler)
