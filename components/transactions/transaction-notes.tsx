"use client"

import { Transaction } from "@/types/transactions"
import { CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useState } from "react"

interface TransactionNotesProps {
  transaction: Transaction
  onChange: (notes: string) => void
}

export function TransactionNotes({
  transaction,
  onChange
}: TransactionNotesProps) {
  const [notes, setNotes] = useState("")
  const [isEditing, setIsEditing] = useState(false)

  const handleSave = () => {
    onChange(notes)
    setIsEditing(false)
  }

  return (
    <div className="rounded-lg border">
      <div className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Notes</h3>
          {!isEditing && (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setIsEditing(true)}
            >
              Add Note
            </Button>
          )}
        </div>

        {isEditing ? (
          <div className="space-y-4">
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Enter notes about this transaction..."
              className="min-h-[100px]"
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button onClick={handleSave}>
                Save Note
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            {notes ? (
              <p className="whitespace-pre-wrap">{notes}</p>
            ) : (
              <p>No notes added yet</p>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 