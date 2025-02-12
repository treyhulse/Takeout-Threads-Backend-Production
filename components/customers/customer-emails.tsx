'use client'

import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { getCustomerEmails, sendEmail, deleteEmail } from '@/lib/nylas/actions/emails'
import type { NylasEmail } from '@/lib/nylas/actions/emails'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'
import { Trash2, Reply, Send, Mail } from 'lucide-react'
import { cn } from '@/lib/utils'

interface CustomerEmailsProps {
  customerEmail: string
  altEmail?: string | null
  customerName?: string
}

export function CustomerEmails({ customerEmail, altEmail, customerName }: CustomerEmailsProps) {
  const [emails, setEmails] = useState<NylasEmail[]>([])
  const [selectedEmail, setSelectedEmail] = useState<NylasEmail | null>(null)
  const [selectedRecipientEmail, setSelectedRecipientEmail] = useState(customerEmail)
  const [isComposeOpen, setIsComposeOpen] = useState(false)
  const [isReplyOpen, setIsReplyOpen] = useState(false)
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false)
  const [emailToDelete, setEmailToDelete] = useState<string | null>(null)
  const [subject, setSubject] = useState('')
  const [body, setBody] = useState('')
  const { toast } = useToast()

  useEffect(() => {
    const fetchEmails = async () => {
      const primaryEmails = await getCustomerEmails(customerEmail)
      let allEmails = primaryEmails
      if (altEmail) {
        const altEmails = await getCustomerEmails(altEmail)
        allEmails = [...primaryEmails, ...altEmails]
      }
      setEmails(allEmails)
    }
    fetchEmails()
  }, [customerEmail, altEmail])

  const handleEmailSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRecipientEmail(event.target.value)
  }

  const handleSendEmail = async (replyToMessageId?: string) => {
    try {
      await sendEmail({
        to: [{ 
          email: selectedRecipientEmail, 
          name: customerName 
        }],
        subject: replyToMessageId ? `Re: ${selectedEmail?.subject}` : subject,
        body,
        replyToMessageId,
        trackingOptions: {
          opens: true,
          links: true,
          threadReplies: true,
          label: 'customer-portal'
        }
      })

      toast({
        title: 'Success',
        description: 'Email sent successfully',
      })

      // Refresh emails list - now include both email addresses
      const primaryEmails = await getCustomerEmails(customerEmail)
      let allEmails = primaryEmails
      if (altEmail) {
        const altEmails = await getCustomerEmails(altEmail)
        allEmails = [...primaryEmails, ...altEmails]
      }
      setEmails(allEmails)

      // Reset form
      setSubject('')
      setBody('')
      setIsComposeOpen(false)
      setIsReplyOpen(false)
    } catch (error) {
      console.error('Error sending email:', error)
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to send email',
        variant: 'destructive',
      })
    }
  }

  const confirmDelete = (messageId: string) => {
    setEmailToDelete(messageId)
    setIsDeleteConfirmOpen(true)
  }

  const handleDeleteEmail = async () => {
    if (!emailToDelete) return

    try {
      await deleteEmail(emailToDelete)
      
      toast({
        title: 'Success',
        description: 'Email deleted successfully',
      })

      setEmails(emails.filter(email => email.id !== emailToDelete))
      if (selectedEmail?.id === emailToDelete) {
        setSelectedEmail(null)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to delete email',
        variant: 'destructive',
      })
    } finally {
      setIsDeleteConfirmOpen(false)
      setEmailToDelete(null)
    }
  }

  const EmailSelectField = () => (
    <div className="space-y-2">
      <label htmlFor="recipient-email" className="text-sm font-medium">
        Send to:
      </label>
      <select
        id="recipient-email"
        value={selectedRecipientEmail}
        onChange={handleEmailSelect}
        className="w-full rounded-md border border-input bg-background px-3 py-2"
      >
        <option value={customerEmail}>Primary: {customerEmail}</option>
        {altEmail && <option value={altEmail}>Alternative: {altEmail}</option>}
      </select>
    </div>
  )

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <Dialog open={isComposeOpen} onOpenChange={setIsComposeOpen}>
          <DialogTrigger asChild>
            <Button>
              <Mail className="mr-2 h-4 w-4" />
              Compose
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>New Email</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <EmailSelectField />
              <Input
                placeholder="Subject"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
              <Textarea
                placeholder="Write your message..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className="min-h-[200px]"
              />
              <Button onClick={() => handleSendEmail()} className="w-full">
                <Send className="mr-2 h-4 w-4" />
                Send
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-12 gap-4">
        {/* Email List */}
        <div className="col-span-4 border rounded-lg overflow-hidden h-[600px]">
          <div className="h-full flex flex-col">
            <div className="p-4 border-b bg-muted">
              <h3 className="font-semibold">Inbox</h3>
            </div>
            <div className="flex-1 overflow-auto">
              {emails.map((email) => (
                <div
                  key={email.id}
                  className={cn(
                    "p-4 border-b cursor-pointer hover:bg-muted transition-colors",
                    selectedEmail?.id === email.id && "bg-muted"
                  )}
                  onClick={() => setSelectedEmail(email)}
                >
                  <div className="font-medium truncate">{email.subject}</div>
                  <div className="text-sm text-muted-foreground">
                    {format(new Date(email.date * 1000), 'MMM d')}
                  </div>
                  <div className="text-sm text-muted-foreground truncate">
                    {email.snippet}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Email Content */}
        <div className="col-span-8 border rounded-lg h-[600px] overflow-hidden">
          {selectedEmail ? (
            <div className="h-full flex flex-col">
              <div className="p-4 border-b bg-background sticky top-0">
                <div className="flex justify-between items-start mb-4">
                  <h2 className="text-xl font-semibold">{selectedEmail.subject}</h2>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsReplyOpen(true)}
                    >
                      <Reply className="h-4 w-4 mr-2" />
                      Reply
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => confirmDelete(selectedEmail.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  <div>From: {selectedEmail.from[0].name} ({selectedEmail.from[0].email})</div>
                  <div>{format(new Date(selectedEmail.date * 1000), 'PPp')}</div>
                </div>
              </div>
              <div className="flex-1 p-4 overflow-y-auto">
                <div className="prose prose-sm max-w-none">
                  <div dangerouslySetInnerHTML={{ __html: selectedEmail.body }} />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              Select an email to view
            </div>
          )}
        </div>
      </div>

      {/* Reply Dialog */}
      <Dialog open={isReplyOpen} onOpenChange={setIsReplyOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to: {selectedEmail?.subject}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <EmailSelectField />
            <Textarea
              placeholder="Write your reply..."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              className="min-h-[200px]"
            />
            <Button 
              onClick={() => handleSendEmail(selectedEmail?.id)} 
              className="w-full"
            >
              <Reply className="mr-2 h-4 w-4" />
              Send Reply
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmOpen} onOpenChange={setIsDeleteConfirmOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this email? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setIsDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteEmail}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 