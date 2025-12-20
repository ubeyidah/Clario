import { z } from "zod";
import { chapterSchema, courseSchema } from "./zod-validation";

export type CourseSchema = z.infer<typeof courseSchema>;
export type ChapterSchema = z.infer<typeof chapterSchema>;

export type ApiResponse = {
  success: boolean;
  message: string;
}
