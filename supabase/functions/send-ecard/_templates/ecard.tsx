
import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Image,
  Link,
  Preview,
  Section,
  Text,
} from 'npm:@react-email/components@0.0.22'
import * as React from 'npm:react@18.3.1'

interface ECardEmailProps {
  message: string
  imageUrl: string
  senderEmail?: string
}

export const ECardEmail = ({
  message,
  imageUrl,
  senderEmail,
}: ECardEmailProps) => (
  <Html>
    <Head />
    <Preview>You've received an e-card!</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>You've received an e-card!</Heading>
        {senderEmail && (
          <Text style={text}>From: {senderEmail}</Text>
        )}
        <Section style={imageContainer}>
          <Image
            src={imageUrl}
            alt="E-card"
            width="600"
            height="400"
            style={image}
          />
        </Section>
        <Text style={messageStyle}>{message}</Text>
        <Text style={footer}>
          <Link
            href="/"
            target="_blank"
            style={{ ...link, color: '#898989' }}
          >
            Create your own e-card
          </Link>
        </Text>
      </Container>
    </Body>
  </Html>
)

export default ECardEmail

const main = {
  backgroundColor: '#ffffff',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif',
}

const container = {
  margin: '0 auto',
  padding: '20px 0 48px',
  maxWidth: '600px',
}

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0',
  textAlign: 'center' as const,
}

const imageContainer = {
  margin: '20px 0',
}

const image = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
}

const messageStyle = {
  color: '#333',
  fontSize: '16px',
  lineHeight: '26px',
  margin: '24px 0',
  padding: '24px',
  backgroundColor: '#f9f9f9',
  borderRadius: '8px',
  whiteSpace: 'pre-wrap' as const,
}

const text = {
  color: '#333',
  fontSize: '14px',
  margin: '24px 0',
}

const footer = {
  color: '#898989',
  fontSize: '12px',
  margin: '24px 0',
  textAlign: 'center' as const,
}

const link = {
  color: '#2754C5',
  textDecoration: 'underline',
}
