import { z } from "zod";
import { courseSchema } from "./zod-validation";

export type CourseSchema = z.infer<typeof courseSchema>;

export type ApiResponse = {
  success: boolean;
  message: string;
}
