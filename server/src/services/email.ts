// email.ts
// Sends email through Brevo's HTTP API (works on Render's free tier, unlike SMTP).
// Env vars needed: BREVO_API_KEY, EMAIL_USER (must be a verified sender in Brevo)

export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log(`Attempting to send email to: ${to}`);

  // Read at call time, so it works as long as dotenv is loaded in index.ts
  const apiKey = process.env.BREVO_API_KEY;
  const from = process.env.EMAIL_USER;

  if (!apiKey || !from) {
    console.error('Email not sent: BREVO_API_KEY or EMAIL_USER is missing');
    return;
  }

  try {
    const res = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': apiKey,
        'Content-Type': 'application/json',
        accept: 'application/json',
      },
      body: JSON.stringify({
        sender: { name: 'TalentScreen', email: from },
        to: [{ email: to }],
        subject,
        htmlContent: html,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Brevo email error:', res.status, errorBody);
      return;
    }

    const data = (await res.json()) as { messageId?: string };
    console.log('Email sent successfully:', data.messageId);
  } catch (error) {
    console.error('Email send error:', error);
    // Not thrown, so it doesn't break the main application flow
  }
};