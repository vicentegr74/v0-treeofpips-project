"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import { useProjects } from "@/context/projects-context"

interface ProjectJournalProps {
  projectId: string
}

export function ProjectJournal({ projectId }: ProjectJournalProps) {
  const { getProjectJournalEntries, addJournalEntry } = useProjects()
  const [journalEntry, setJournalEntry] = useState("")
  const entries = getProjectJournalEntries(projectId)

  const handleAddEntry = () => {
    if (!journalEntry.trim()) return

    addJournalEntry(projectId, journalEntry)
    setJournalEntry("")
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Diario de Trading</h3>
      <div className="space-y-3">
        <Textarea
          placeholder="Escribe tus reflexiones, estrategias o aprendizajes del día..."
          value={journalEntry}
          onChange={(e) => setJournalEntry(e.target.value)}
          className="min-h-[100px]"
        />
        <Button onClick={handleAddEntry} className="w-full bg-green-600 hover:bg-green-700">
          Guardar entrada
        </Button>
      </div>

      <div className="space-y-3 mt-4">
        {entries.map((entry) => (
          <Card key={entry.id} className="bg-green-50/50 dark:bg-green-900/10">
            <CardContent className="p-4">
              <p className="text-sm text-muted-foreground flex items-center mb-2">
                <CalendarIcon className="h-3 w-3 mr-1" />
                {formatDate(entry.date)}
              </p>
              <p className="text-sm">{entry.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
