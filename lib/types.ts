import { z } from "zod";
import { chapterSchema, courseSchema, lessonSchema } from "./zod-validation";

export type CourseSchema = z.infer<typeof courseSchema>;
export type ChapterSchema = z.infer<typeof chapterSchema>;

export type LessonSchema = z.infer<typeof lessonSchema>;
export type ApiResponse = {
  success: boolean;
  message: string;
}
