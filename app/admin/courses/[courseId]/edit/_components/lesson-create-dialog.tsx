"use client"
import { ReactNode } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { tryCatch } from "@/hooks/try-catch"
import { LessonSchema } from "@/lib/types"
import { lessonSchema } from "@/lib/zod-validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { createLessonA } from "../actions"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface iAppProps {
  courseId: string
  chapterId: string
  children: ReactNode
}

const LessonCreateDialog = ({ courseId, chapterId, children }: iAppProps) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition()
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: '',
      courseId: courseId,
      chapterId: chapterId
    }
  })


  const onSubmit = async (data: LessonSchema) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLessonA(data))
      if (error) {
        toast.error("Failed to create lesson")
        return
      }

      if (result.success) {
        toast.success(result.message || "Lesson created successfully")
        form.reset()
        setOpen(false)
        return
      } else if (!result.success) {
        toast.error(result.message || "Failed to create lesson")
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={(state) => setOpen(state)}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
          <DialogDescription>
            Give your Lesson a clear title.
          </DialogDescription>
        </DialogHeader>

        <form id="course-lesson-form" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup>
            <Controller name="name" control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="name">
                    Name
                  </FieldLabel>
                  <Input
                    {...field}
                    id="name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Lesson Name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <div className="mt-4 flex justify-end">
            <Button type="submit" form="course-lesson-form" disabled={pending}>{pending ? <Spinner /> : "Create Lesson"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>)
}

export default LessonCreateDialog 
