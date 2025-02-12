'use server';

import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { getResendClient } from '../config';
import prisma from "@/utils/db";
import { revalidatePath } from "next/cache";
import { EmailFormData, EmailMessage } from "@/types/emails";
import { Conversation } from "@/types/conversations";
import { CreateEmailResponse } from 'resend';

export async function sendEmail(formData: EmailFormData) {
  try {
    const { getUser, getOrganization } = getKindeServerSession();
    const user = await getUser();
    const org = await getOrganization();
    
    if (!user?.id || !org?.orgCode) {
      throw new Error("Unauthorized");
    }

    const resend = getResendClient();
    
    // Create or get conversation
    const conversation = formData.conversationId 
      ? await prisma.conversation.findFirstOrThrow({
          where: { 
            id: formData.conversationId,
            org_id: org.orgCode,
            user_id: user.id
          }
        })
      : await prisma.conversation.create({
          data: {
            subject: formData.subject,
            org_id: org.orgCode,
            user_id: user.id,
          }
        });

    // Send email
    const result = await resend.emails.send({
      from: 'Takeout Threads <team@takeout-threads.com>',
      to: formData.to,
      subject: formData.subject,
      text: formData.message,
      headers: {
        'X-Entity-Ref-ID': new Date().getTime().toString(),
        'X-Conversation-ID': conversation.id,
        'Reply-To': 'team@takeout-threads.com',
      }
    }) as CreateEmailResponse;

    // Log the email in database
    await prisma.emailMessage.create({
      data: {
        resendId: result.data?.id,
        from: 'Takeout Threads <team@takeout-threads.com>',
        to: formData.to,
        subject: formData.subject,
        message: formData.message,
        conversationId: conversation.id,
        org_id: org.orgCode,
        user_id: user.id,
      },
    });

    revalidatePath('/dashboard/messages');
    return { success: true, id: result.data?.id, conversationId: conversation.id };
  } catch (error) {
    console.error('Failed to send email:', error);
    return { error: 'Failed to send email' };
  }
}

type ConversationsResponse = {
  conversations?: Conversation[];
  metadata?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
  error?: string;
};

export async function getConversations(page = 1, limit = 10): Promise<ConversationsResponse> {
  try {
    const { getUser, getOrganization } = getKindeServerSession();
    const user = await getUser();
    const org = await getOrganization();
    
    if (!user?.id || !org?.orgCode) {
      throw new Error("Unauthorized");
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        org_id: org.orgCode,
        user_id: user.id,
      },
      include: {
        messages: {
          orderBy: {
            createdAt: 'desc'
          },
          take: 1, // Get latest message
        }
      },
      orderBy: {
        updatedAt: 'desc',
      },
      skip: (page - 1) * limit,
      take: limit,
    });

    const total = await prisma.conversation.count({
      where: {
        org_id: org.orgCode,
        user_id: user.id,
      },
    });

    return {
      conversations,
      metadata: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('Failed to fetch conversations:', error);
    return { error: 'Failed to fetch conversations' };
  }
}

type MessagesResponse = {
  messages: EmailMessage[];
} | { error: string };

export async function getConversationMessages(conversationId: string): Promise<MessagesResponse> {
  try {
    const { getUser, getOrganization } = getKindeServerSession();
    const user = await getUser();
    const org = await getOrganization();
    
    if (!user?.id || !org?.orgCode) {
      throw new Error("Unauthorized");
    }

    const messages = await prisma.emailMessage.findMany({
      where: {
        conversationId,
        org_id: org.orgCode,
        user_id: user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { messages };
  } catch (error) {
    console.error('Failed to fetch conversation messages:', error);
    return { error: 'Failed to fetch conversation messages' };
  }
}

export async function handleIncomingEmail(emailData: {
  from: string;
  to: string;
  subject: string;
  text: string;
  headers: { [key: string]: string };
}) {
  try {
    const conversationId = emailData.headers['X-Conversation-ID'];
    
    if (!conversationId) {
      throw new Error('No conversation ID found');
    }

    const conversation = await prisma.conversation.findUniqueOrThrow({
      where: { id: conversationId }
    });

    await prisma.emailMessage.create({
      data: {
        from: emailData.from,
        to: emailData.to,
        subject: emailData.subject,
        message: emailData.text,
        conversationId,
        org_id: conversation.org_id,
        user_id: conversation.user_id,
      }
    });

    revalidatePath('/dashboard/messages');
    return { success: true };
  } catch (error) {
    console.error('Failed to handle incoming email:', error);
    return { error: 'Failed to handle incoming email' };
  }
} 