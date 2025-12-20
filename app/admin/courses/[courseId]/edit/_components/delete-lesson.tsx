"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { tryCatch } from "@/hooks/try-catch"
import { ReactNode, useState, useTransition } from "react"
import { deleteLessonA } from "../actions"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

interface iAppProps {
  chapterId: string,
  courseId: string,
  lessonId: string,
  children: ReactNode
}

export default function DeleteLessonDialog({ chapterId, courseId, lessonId, children }: iAppProps) {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const handleDelete = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteLessonA({ chapterId, courseId, lessonId }))
      if (error) {
        toast.error("Something went wrong")
        return
      }

      if (result.success) {
        setOpen(false)
        toast.success("Lesson deleted successfully")
      } else if (!result.success) {
        toast.error(result.message)
      }
    })
  }
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {children}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Lesson</AlertDialogTitle>
          <AlertDialogDescription>Remove this lesson from the chapter. This action cannot be undone.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={pending}>Cancel</AlertDialogCancel>
          <Button disabled={pending} className="bg-destructive/20 text-destructive hover:bg-destructive/30" onClick={handleDelete}>
            {pending ? <Spinner /> : "Delete"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

