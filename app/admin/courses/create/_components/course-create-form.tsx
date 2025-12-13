"use client"
import { CourseLevel } from "@/lib/generated/prisma/enums"
import { CourseSchema } from "@/lib/types"
import { courseSchema, COURSE_CATEGORIES_ENUM } from "@/lib/zod-validation"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
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

const CourseCreateForm = () => {
  const form = useForm({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: '',
      category: COURSE_CATEGORIES_ENUM[0],
      description: '',
      duration: "",
      level: "Beginner",
      price: "",
      shortDescription: '',
      slug: '',
      status: "Draft",
      fileKey: ""
    }
  })
  const onSubmit = (data: CourseSchema) => {
    console.log(data)

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
            <FieldLegend className="text-2xl!">Create Course</FieldLegend>
            <FieldDescription >
              Provide basic information about your course.
            </FieldDescription>
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
                    <Uploader onChange={field.onChange} value={field.value} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>
            <FieldGroup className="grid grid-cols-1 md:grid-cols-2 gap-4">

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

            </FieldGroup>
          </FieldSet>
        </FieldGroup>
        <Button type="submit" className="mt-8">Create Course <PlusIcon /> </Button>
      </form>
    </>
  )
}

export default CourseCreateForm
