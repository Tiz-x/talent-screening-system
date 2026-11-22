import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create the transporter with explicit TLS settings to bypass the self-signed certificate error
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // Use STARTTLS
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  // This is the key fix for the "self-signed certificate" error
  tls: {
    rejectUnauthorized: false
  }
});

export const sendEmail = async (to: string, subject: string, html: string) => {
  console.log(`Attempting to send email to: ${to}`); // Debug log
  
  try {
    const info = await transporter.sendMail({
      from: `"TalentScreen" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    });
    console.log('Email sent successfully: %s', info.messageId);
  } catch (error) {
    console.error('Email send error:', error);
    // We don't throw the error so it doesn't break the main application flow
  }
};