import { z } from "zod";
import {
  chapterSchema,
  courseSchema,
  lessonSchema,
  lessonProgressSchema,
} from "./zod-validation";

export type CourseSchema = z.infer<typeof courseSchema>;
export type ChapterSchema = z.infer<typeof chapterSchema>;
export type LessonSchema = z.infer<typeof lessonSchema>;
export type LessonProgressSchema = z.infer<typeof lessonProgressSchema>;

export type ApiResponse<T = undefined> = {
  success: boolean;
  message: string;
  data?: T;
};
