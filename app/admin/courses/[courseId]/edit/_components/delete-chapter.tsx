"use client"

import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { tryCatch } from "@/hooks/try-catch"
import { ReactNode, useState, useTransition } from "react"
import { deleteChapterA } from "../actions"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { Button } from "@/components/ui/button"

interface iAppProps {
  chapterId: string,
  courseId: string,
  children: ReactNode
}

const DeleteChapter = ({ chapterId, courseId, children }: iAppProps) => {
  const [open, setOpen] = useState(false)
  const [pending, startTransition] = useTransition()
  const handleDelete = async () => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteChapterA({ chapterId, courseId }))
      if (error) {
        toast.error("Something went wrong")
        return
      }

      if (result.success) {
        setOpen(false)
        toast.success("Chapter deleted successfully")
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
          <AlertDialogTitle>Are you sure you want to delete this chapter</AlertDialogTitle>
          <AlertDialogDescription>akldfjasdklfjas</AlertDialogDescription>
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

export default DeleteChapter
