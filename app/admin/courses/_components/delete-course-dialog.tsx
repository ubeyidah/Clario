"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { tryCatch } from "@/hooks/try-catch"
import { deleteCourseA } from "../actions"
import { AlertTriangle, Trash2 } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

interface DeleteCourseDialogProps {
  courseId: string
  courseTitle: string
}

export function DeleteCourseDialog({
  courseId,
  courseTitle,
}: DeleteCourseDialogProps) {
  const [confirmCourseTitle, setConfirmCourseTitle] = useState("")
  const [pending, startTransition] = useTransition()

  const handleDelete = () => {
    startTransition(async () => {
      const { data, error } = await tryCatch(deleteCourseA(courseId))

      if (error) {
        toast.error("Something went wrong. Please try again.")
        return
      }
      if (data.success) {
        toast.success(data.message)
        return
      } else if (!data.success) {
        toast.error(data.message)
        return
      }
    })
  }

  const isDisabled =
    confirmCourseTitle.trim() !== courseTitle.trim() || pending

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="rounded-full text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-4" />
        </Button>
      </DialogTrigger>

      <DialogContent className="max-w-lg rounded-xl">
        <DialogHeader className="space-y-4">
          <div className="mx-auto flex size-16 items-center justify-center rounded-full
            bg-destructive/10 text-destructive border border-destructive/20">
            <AlertTriangle className="size-7" />
          </div>

          <DialogTitle className="text-center text-lg">
            Permanently delete this course?
          </DialogTitle>

          <DialogDescription className="text-center">
            The course <strong>“{courseTitle}”</strong> will be permanently deleted.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2">
          <p className="text-sm text-muted-foreground">
            To confirm deletion, type the course title exactly as shown.
          </p>
          <Input
            placeholder={courseTitle}
            value={confirmCourseTitle}
            onChange={(e) => setConfirmCourseTitle(e.target.value)}
            disabled={pending}
          />
        </div>

        <DialogFooter className="pt-4">
          <Button variant="outline" disabled={pending}>
            Cancel
          </Button>

          <Button
            onClick={handleDelete}
            disabled={isDisabled}
            variant={"destructive"}
          >
            {pending ? <Spinner /> : "Delete Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
