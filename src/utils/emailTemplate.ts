
/**
 * Generates the HTML for an e-card email
 * @param message Personal message for the e-card
 * @param imageUrl URL of the e-card image
 * @returns HTML string for the email
 */
export const generateECardEmailHtml = (message: string, imageUrl: string): string => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>You've received an e-card!</title>
      <style>
        body {
          background-color: #ffffff;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen-Sans, Ubuntu, Cantarell, "Helvetica Neue", sans-serif;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px 0 48px;
        }
        h1 {
          color: #333;
          font-size: 24px;
          font-weight: bold;
          margin: 40px 0;
          padding: 0;
          text-align: center;
        }
        .image-container {
          margin: 20px 0;
        }
        .e-card-image {
          width: 100%;
          height: auto;
          border-radius: 8px;
        }
        .message {
          color: #333;
          font-size: 16px;
          line-height: 26px;
          margin: 24px 0;
          padding: 24px;
          background-color: #f9f9f9;
          border-radius: 8px;
          white-space: pre-wrap;
        }
        .footer {
          color: #898989;
          font-size: 12px;
          margin: 24px 0;
          text-align: center;
        }
        .link {
          color: #2754C5;
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>You've received an e-card!</h1>
        <div class="image-container">
          <img src="${imageUrl}" alt="E-card" class="e-card-image">
        </div>
        <div class="message">${message || "No message provided."}</div>
        <div class="footer">
          <a href="/" class="link" style="color: #898989;">Create your own e-card</a>
        </div>
      </div>
    </body>
    </html>
  `;
};
