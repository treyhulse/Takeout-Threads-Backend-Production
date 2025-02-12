'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";
import { sendEmail, getConversations, getConversationMessages } from '@/lib/resend/actions/emails';

interface Conversation {
  id: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
  messages: EmailMessage[];
}

interface EmailMessage {
  id: string;
  to: string;
  from: string;
  subject: string;
  message: string;
  status: string;
  readAt: Date | null;
  createdAt: Date;
}

export default function MessagesPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    to: '',
    subject: '',
    message: ''
  });
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [page, setPage] = useState(1);
  const [metadata, setMetadata] = useState<any>(null);

  const loadConversations = useCallback(async () => {
    const result = await getConversations(page);
    if (result.error || !result.conversations) {
      toast.error('Failed to load conversations');
    } else {
      setConversations(result.conversations);
      setMetadata(result.metadata);
    }
  }, [page]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await sendEmail(formData);
      if (result.error) throw new Error(result.error);
      
      toast.success('Email sent successfully!');
      setFormData({ to: '', subject: '', message: '' });
      loadConversations();
    } catch (error) {
      toast.error('Failed to send email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Send Email</h1>
      
      <Card className="p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="to" className="block text-sm font-medium mb-1">
              To
            </label>
            <Input
              id="to"
              type="email"
              value={formData.to}
              onChange={(e) => setFormData({ ...formData, to: e.target.value })}
              placeholder="recipient@example.com"
              required
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium mb-1">
              Subject
            </label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Email subject"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium mb-1">
              Message
            </label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              placeholder="Type your message here..."
              rows={5}
              required
            />
          </div>

          <Button type="submit" disabled={isLoading}>
            {isLoading ? 'Sending...' : 'Send Email'}
          </Button>
        </form>
      </Card>

      <h2 className="text-xl font-bold mb-4">Conversations</h2>
      <Card className="p-6">
        <div className="space-y-4">
          {conversations.map((conv) => (
            <div key={conv.id} className="border-b pb-4">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">Subject: {conv.subject}</p>
                  <p className="text-sm text-muted-foreground">
                    Latest message to: {conv.messages[0]?.to}
                  </p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {new Date(conv.updatedAt).toLocaleString()}
                </div>
              </div>
              <p className="mt-2 text-sm">{conv.messages[0]?.message}</p>
            </div>
          ))}
        </div>

        {metadata && (
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {metadata.totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage(p => p + 1)}
              disabled={page >= metadata.totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}