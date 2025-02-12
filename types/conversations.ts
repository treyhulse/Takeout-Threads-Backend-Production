import { EmailMessage } from "./emails";

export interface Conversation {
  id: string;
  subject: string;
  org_id: string;
  user_id: string;
  createdAt: Date;
  updatedAt: Date;
  messages: EmailMessage[];
}

export type CreateConversationInput = {
  subject: string;
}

export type ConversationUpdateInput = Partial<CreateConversationInput>; 