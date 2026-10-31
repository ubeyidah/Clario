import { getCoursePlayerData } from "@/app/data/student/get-course-player";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

interface CourseIndexProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CourseIndexPage({ params }: CourseIndexProps) {
  const { courseId } = await params;
  const data = await getCoursePlayerData(courseId);

  redirect(`/learn/${courseId}/${data.currentLesson.id}`);
}
