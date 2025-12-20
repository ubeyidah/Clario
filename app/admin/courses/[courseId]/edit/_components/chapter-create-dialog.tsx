"use client"
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
import { ChapterSchema } from "@/lib/types"
import { chapterSchema } from "@/lib/zod-validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { useState, useTransition } from "react"
import { Controller, useForm } from "react-hook-form"
import { createChapterA } from "../actions"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface iAppProps {
  courseId: string
  text?: string
}

const ChapterCreateDialog = ({ courseId, text = "New Chapter" }: iAppProps) => {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition()
  const form = useForm<ChapterSchema>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      name: '',
      courseId: courseId
    }
  })


  const onSubmit = async (data: ChapterSchema) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createChapterA(data))
      if (error) {
        toast.error("Failed to create chapter")
        return
      }

      if (result.success) {
        toast.success(result.message || "Chapter created successfully")
        form.reset()
        setOpen(false)
        return
      } else if (!result.success) {
        toast.error(result.message || "Failed to create chapter")
      }
    })
  }

  const handleOpenChange = (state: boolean) => {
    if (!state) {
      form.reset()
    }
    setOpen(state)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant={"outline"} size={"sm"}>{text}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Chapter</DialogTitle>
          <DialogDescription>
            Give your chapter a clear title.
          </DialogDescription>
        </DialogHeader>

        <form id="course-chapter-form" onSubmit={form.handleSubmit(onSubmit)}>
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
                    placeholder="Chapter Name"
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
          <div className="mt-4 flex justify-end">
            <Button type="submit" form="course-chapter-form" disabled={pending}>{pending ? <Spinner /> : "Create Chapter"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>)
}

export default ChapterCreateDialog 
