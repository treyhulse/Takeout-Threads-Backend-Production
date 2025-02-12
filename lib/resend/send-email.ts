import { resend } from './config';
import { WelcomeEmail } from './templates/welcome';

export async function sendWelcomeEmail({
  email,
  orgName,
  userName,
}: {
  email: string;
  orgName: string;
  userName: string;
}) {
  if (!resend) {
    throw new Error('Resend configuration is not available.');
  }
  try {
    await resend.emails.send({
      from: 'Takeout Threads <team@takeout-threads.com>',
      to: email,
      subject: `Welcome to ${orgName}!`,
      react: WelcomeEmail({ orgName, userName }),
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    throw error;
  }
} 