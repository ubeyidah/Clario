"use client"

import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import type { AdminLesson } from "@/app/data/admin/get-admin-lesson"
import { SaveIcon } from "lucide-react"
import { Controller, useForm } from "react-hook-form"
import { LessonSchema } from "@/lib/types"
import { zodResolver } from "@hookform/resolvers/zod"
import { lessonSchema } from "@/lib/zod-validation"
import Editor from "@/components/text-editor/editor"
import Uploader from "@/components/file-uploader/uploader"
import { useTransition } from "react"
import { tryCatch } from "@/hooks/try-catch"
import { updateLesson } from "../actions"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"

interface iAppProps {
  lesson: AdminLesson
  courseId: string,
  chapterId: string
}
const LessonForm = ({ lesson, courseId, chapterId }: iAppProps) => {
  const [pending, startTransition] = useTransition()
  const form = useForm<LessonSchema>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: lesson?.title || '',
      courseId,
      chapterId,
      description: lesson?.description || '',
      videoFileKey: lesson?.videoFileKey || '',
      thumbnailFileKey: lesson?.thumbnailFileKey || '',
    }
  })
  const onSubmit = (data: LessonSchema) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateLesson(data, lesson.id))
      if (error) {
        toast.error("An unexpected error occurred.")
        return;
      }
      if (result.success) {
        toast.success(result.message)
      } else if (result.success === false) {
        toast.error(result.message)
        return
      }
    })
  }
  return (
    <div className="max-w-4xl mx-auto py-8 pb-20">

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldLegend className="text-2xl!">
              Lesson Setup</FieldLegend>
            <FieldDescription >
              Add video, images, title, and description for this lesson.
            </FieldDescription>
            <FieldGroup>
              <Controller name="name" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="name">
                      Lesson Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id="name"
                      aria-invalid={fieldState.invalid}
                      placeholder="lesson name"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller name="thumbnailFileKey" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="thumbnail">
                      Thumbnail Image
                    </FieldLabel>
                    <Uploader onChange={field.onChange} value={field.value as string} invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller name="videoFileKey" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="videoFileKey">
                      Lesson Video
                    </FieldLabel>
                    <Uploader onChange={field.onChange} fileType="video" value={field.value as string} invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller name="description" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="description">
                      Description
                    </FieldLabel>
                    <Editor value={field.value as string} onChange={field.onChange} invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
          </FieldSet>
        </FieldGroup>
        <div className="flex items-center justify-end">
          <Button disabled={pending} type="submit" className="mt-4">{pending ? <Spinner /> : <><SaveIcon /> Save Lesson</>} </Button>
        </div>
      </form>
    </div>
  )
}

export default LessonForm 
