import { Resend } from 'resend';

// Initialize with undefined if API key is not available
export const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export function getResendClient() {
  if (!resend) {
    throw new Error('RESEND_API_KEY is not defined in environment variables');
  }
  return resend;
} 