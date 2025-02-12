'use server'

import { headers } from 'next/headers'

interface Email {
  id: string;
  subject: string;
  from: Array<{ name: string; email: string }>;
  body: string;
  date: number;
  unread: boolean;
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
    return data.data as Email[];
  } catch (error) {
    console.error('Error fetching emails:', error);
    return []; // Return empty array on error instead of throwing
  }
} 