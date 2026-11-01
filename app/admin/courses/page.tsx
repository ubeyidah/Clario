import { Suspense } from "react";
import Link from "next/link";
import { SiteHeader } from "@/components/common/site-header";
import { buttonVariants } from "@/components/ui/button";
import CourseCard from "./_components/course-card";
import { getAdminCourses } from "@/app/data/admin/get-admin-courses";
import type { AdminCourseFilterParams } from "@/app/data/admin/get-admin-courses";
import { EmptyCourse } from "./_components/course-empty";
import CourseCardSkeleton from "./_components/course-card-skeleton";
import { CoursesFilterBar } from "./_components/courses-filter-bar";
import { IconCirclePlus } from "@tabler/icons-react";

interface CoursesPageProps {
  searchParams: Promise<{
    search?: string;
    category?: string;
    status?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const resolvedParams = await searchParams;

  const filters: AdminCourseFilterParams = {
    search: resolvedParams.search,
    category: resolvedParams.category,
    status: resolvedParams.status as "Draft" | "Published" | "Archived" | "all" | undefined,
  };

  return (
    <main>
      <SiteHeader>
        <Link
          className={buttonVariants({ size: "sm", className: "h-8 text-xs gap-1" })}
          href="/admin/courses/create"
        >
          <IconCirclePlus className="size-3.5" />
          Create Course
        </Link>
      </SiteHeader>

      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-xl font-bold tracking-tight">Course Management</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Create, publish, and monitor performance across your instructional library.
          </p>
        </div>

        <CoursesFilterBar
          currentSearch={filters.search}
          currentCategory={filters.category}
          currentStatus={filters.status}
        />

        <Suspense fallback={<CourseCardSkeleton />}>
          <RenderAdminCourses filters={filters} />
        </Suspense>
      </div>
    </main>
  );
}

async function RenderAdminCourses({
  filters,
}: {
  filters: AdminCourseFilterParams;
}) {
  const courses = await getAdminCourses(filters);

  if (courses.length === 0) {
    return <EmptyCourse />;
  }

  return (
    <div className="rounded-xl border bg-card/30 divide-y divide-border/60 overflow-hidden">
      {courses.map((course, i) => (
        <CourseCard course={course} key={course.id} isFirst={i === 0} />
      ))}
    </div>
  );
}
