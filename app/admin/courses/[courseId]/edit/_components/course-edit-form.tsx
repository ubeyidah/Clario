"use client"
import { CourseLevel, CourseStatus } from "@/lib/generated/prisma/enums"
import { CourseSchema } from "@/lib/types"
import { courseSchema } from "@/lib/zod-validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSet,
} from "@/components/ui/field"
import slugify from "slugify"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { COURSE_CATEGORIES } from "@/lib/constants"
import { PlusIcon } from "lucide-react"
import Editor from "@/components/text-editor/editor"
import Uploader from "@/components/file-uploader/uploader"
import { useTransition } from "react"
import { tryCatch } from "@/hooks/try-catch"
import { toast } from "sonner"
import { Spinner } from "@/components/ui/spinner"
import { useRouter } from "next/navigation"
import { updateCourseA } from "../actions"
import { Course } from "@/lib/generated/prisma/client"

interface iAppProps {
  courseId: string,
  course: Course
}

const CourseEditForm = ({ courseId, course }: iAppProps) => {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      category: course.category as CourseSchema["category"],
      description: course.description,
      duration: course.duration,
      level: course.level,
      price: course.price,
      shortDescription: course.shortDescription,
      slug: course.slug,
      status: course.status,
      fileKey: course.fileKey
    }
  })
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const onSubmit = (data: CourseSchema) => {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(updateCourseA(courseId, data))
      if (error) {
        toast.error("An unexpected error occurred.")
        return;
      }
      if (result.success) {
        toast.success(result.message)
        form.reset()
        router.push("/admin/courses")
      } else if (result.success === false) {
        toast.error(result.message)
        return
      }
    })
  }

  const generateSlug = () => {
    const title = form.getValues("title")
    const slug = slugify(title)
    form.setValue("slug", slug, { shouldValidate: true })
  }

  return (
    <>
      <form className="max-w-3xl mx-auto py-8 pb-20" id="course-create-form" onSubmit={form.handleSubmit(onSubmit)}>
        <FieldGroup>
          <FieldSet>
            <FieldGroup>
              <Controller name="title" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="title">
                      Title
                    </FieldLabel>
                    <Input
                      {...field}
                      id="title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Course title"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller name="slug" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <div className="grid grid-cols-[6fr_1fr] gap-2 items-end">
                      <div>
                        <FieldLabel htmlFor="slug" className="mb-2">
                          Slug
                        </FieldLabel>
                        <Input
                          {...field}
                          id="slug"
                          aria-invalid={fieldState.invalid}
                          placeholder="slug"
                        />
                      </div>
                      <Button type="button" onClick={generateSlug}>Generate</Button>
                    </div>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}

                  </Field>
                )}
              />
              <Controller name="shortDescription" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="short-description">
                      Short Description
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id="short-description"
                      className="min-h-[120px]"
                      aria-invalid={fieldState.invalid}
                      placeholder="short description about the course"
                    />
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
                    <Editor value={field.value} onChange={field.onChange} invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller name="fileKey" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="thumbnail">
                      Thumbnail Image
                    </FieldLabel>
                    <Uploader onChange={field.onChange} value={field.value} invalid={fieldState.invalid} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <div className="grid md:grid-cols-2 gap-4">

              <Controller name="category" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="category">
                      Category
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="category"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {COURSE_CATEGORIES.map((category) => (
                          <SelectItem key={category.id} value={category.label}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller name="level" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="level">
                      Level
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="level"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {Object.entries(CourseLevel).map(([level]) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller name="duration" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="duration">
                      Duration (hours)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value as string}
                      type="number"
                      id="duration"
                      aria-invalid={fieldState.invalid}
                      placeholder="course duration"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller name="price" control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="price">
                      Price (ETB)
                    </FieldLabel>
                    <Input
                      {...field}
                      value={field.value as string}
                      type="number"
                      id="price"
                      aria-invalid={fieldState.invalid}
                      placeholder="course price"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller name="status" control={form.control}
                render={({ field, fieldState }) => (
                  <Field className="col-span-2" data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="status">
                      Status
                    </FieldLabel>
                    <Select
                      name={field.name}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger
                        id="status"
                        aria-invalid={fieldState.invalid}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent position="item-aligned">
                        {Object.entries(CourseStatus).map(([status]) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>
          </FieldSet>
        </FieldGroup>
        <Button disabled={isPending} type="submit" className="mt-8">{
          isPending ? <>Updating... <Spinner /> </> : <>Update Course <PlusIcon /></>
        } </Button>
      </form>
    </>
  )
}

export default CourseEditForm;
