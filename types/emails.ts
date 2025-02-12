export type EmailStatus = 'SENT' | 'DELIVERED' | 'FAILED' | 'OPENED';

export interface EmailMessage {
  id: string;
  resendId?: string | null;
  conversationId: string;
  from: string;
  to: string;
  subject: string;
  message: string;
  status: EmailStatus;
  readAt: Date | null;
  org_id: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
}

export type EmailFormData = {
  to: string;
  subject: string;
  message: string;
  conversationId?: string;
}

export type EmailCreateInput = Omit<EmailMessage, 'id' | 'createdAt' | 'updatedAt' | 'status' | 'readAt'>; 