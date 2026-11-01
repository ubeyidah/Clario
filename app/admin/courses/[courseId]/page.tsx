import { getAdminCourseDetails } from "@/app/data/admin/get-admin-course-details";
import { SiteHeader } from "@/components/common/site-header";
import { CourseDetailView } from "./_components/course-detail-view";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconChevronLeft, IconEdit } from "@tabler/icons-react";

interface CourseDetailPageProps {
  params: Promise<{ courseId: string }>;
}

export const dynamic = "force-dynamic";

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { courseId } = await params;
  const course = await getAdminCourseDetails(courseId);

  return (
    <main>
      <SiteHeader>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
            <Link href="/admin/courses">
              <IconChevronLeft className="size-3.5 mr-1" />
              All Courses
            </Link>
          </Button>
          <Button size="sm" asChild className="h-8 text-xs">
            <Link href={`/admin/courses/${course.id}/edit`}>
              <IconEdit className="size-3.5 mr-1" />
              Edit Course
            </Link>
          </Button>
        </div>
      </SiteHeader>

      <div className="p-4 md:p-6 max-w-7xl mx-auto">
        <CourseDetailView course={course} />
      </div>
    </main>
  );
}
