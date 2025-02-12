import { getUnreadEmails } from '@/lib/nylas/actions/emails'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { format } from 'date-fns'

export default async function CRMPage() {
  const emails = await getUnreadEmails()

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Recent Unread Emails</h1>
      
      <div className="grid gap-6">
        {emails.map((email) => (
          <Card key={email.id}>
            <CardHeader>
              <CardTitle className="text-lg">
                {email.subject}
              </CardTitle>
              <div className="text-sm text-muted-foreground">
                From: {email.from[0].name} ({email.from[0].email})
              </div>
              <div className="text-sm text-muted-foreground">
                {format(new Date(email.date * 1000), 'PPP')}
              </div>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                {/* Using a div with dangerouslySetInnerHTML since email body might contain HTML */}
                <div 
                  dangerouslySetInnerHTML={{ 
                    __html: email.body.substring(0, 200) + '...' 
                  }} 
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 