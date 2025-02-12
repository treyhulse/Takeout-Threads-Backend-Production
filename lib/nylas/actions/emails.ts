'use server'

import nylas from '@/lib/nylas/nylas'
import { headers } from 'next/headers'

export interface NylasEmail {
  id: string;
  subject: string;
  from: Array<{ name: string; email: string }>;
  to: Array<{ name: string; email: string }>;
  body: string;
  date: number;
  unread: boolean;
  snippet: string;
}

export async function getUnreadEmails() {
  try {
    const response = await fetch(
      `${process.env.NYLAS_API_URI}/v3/grants/${process.env.NYLAS_GRANT_ID}/messages?limit=5&unread=true`,
      {
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${process.env.NYLAS_API_KEY}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }

    const data = await response.json();
    // The Nylas API returns { data: Email[] }
    return data.data as NylasEmail[];
  } catch (error) {
    console.error('Error fetching emails:', error);
    return []; // Return empty array on error instead of throwing
  }
}

export async function getCustomerEmails(customerEmail: string) {
  try {
    const messages = await nylas.messages.list({
      identifier: process.env.NYLAS_GRANT_ID!,
      queryParams: {
        limit: 10,
        anyEmail: [customerEmail],
      },
    });

    return messages.data as NylasEmail[];
  } catch (error) {
    console.error('Error fetching customer emails:', error);
    return [];
  }
}

interface EmailParticipant {
  email: string;
  name?: string;
}

interface SendEmailParams {
  to: Array<{ email: string; name?: string }>;
  subject: string;
  body: string;
  replyToMessageId?: string;
  trackingOptions?: {
    opens?: boolean;
    links?: boolean;
    threadReplies?: boolean;
    label?: string;
  };
}

export async function sendEmail({
  to,
  subject,
  body,
  replyToMessageId,
  trackingOptions
}: SendEmailParams) {
  try {
    const response = await nylas.messages.send({
      identifier: process.env.NYLAS_GRANT_ID!,
      requestBody: {
        to,
        subject,
        body,
        ...(replyToMessageId && { reply_to_message_id: replyToMessageId }),
        trackingOptions: {
          opens: trackingOptions?.opens ?? true,
          links: trackingOptions?.links ?? true,
          threadReplies: trackingOptions?.threadReplies ?? true,
          label: trackingOptions?.label ?? 'customer-portal'
        }
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function deleteEmail(messageId: string) {
  try {
    await nylas.messages.destroy({
      identifier: process.env.NYLAS_GRANT_ID!,
      messageId: messageId,
    });

    return true;
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
} 