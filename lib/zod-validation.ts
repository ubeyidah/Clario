import { z } from 'zod';
import { CourseLevel, CourseStatus } from './generated/prisma/enums';
import { COURSE_CATEGORIES } from './constants';

export const COURSE_CATEGORIES_ENUM = COURSE_CATEGORIES.map(item => item.label)
export const courseSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters long').max(100, 'Title cannot exceed 100 characters'),
  description: z.string().min(6, 'Description must be at least 6 characters long'),
  price: z.coerce.number().min(1, "price must be at least 1"),
  duration: z.coerce.number().min(0.1, "duration must be at least 0.1 hour").max(500, "course duration cannot exceed 500 hours"),
  level: z.enum(CourseLevel),
  category: z.enum(COURSE_CATEGORIES_ENUM, "select valid category"),
  shortDescription: z.string().min(6, 'Short description must be at least 6 characters long').max(255, 'Short description cannot exceed 255 characters'),
  slug: z.string().min(3, 'Slug must be at least 3 characters long'), // TODO: validate slug is valid with regex 
  status: z.enum(CourseStatus),
  fileKey: z.url({ message: "thumbnail url is required" })
})


export const fileUploadSchema = z.object({
  fileName: z.string().min(1, "file name is required"),
  contentType: z.string().min(1, "content type is required"),
  size: z.number().min(1, "file size is required"),
  isImage: z.boolean()
})


export const fileDeleteSchema = z.object({
  key: z.string().min(1, "file key is required")
})
