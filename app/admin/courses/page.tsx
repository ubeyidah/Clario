import { SiteHeader } from "@/components/common/site-header";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import CourseCardSkeleton from "./_components/course-card-skeleton";
import { CoursesFilters } from "./_components/courses-filters";
import { CoursesList } from "./_components/courses-list";

interface CoursesPageProps {
  searchParams: {
    search?: string;
    category?: string;
    status?: string;
  };
}

const CoursesPage = async ({ searchParams }: CoursesPageProps) => {
  const { search, category, status } = searchParams;

  return (
    <main>
      <SiteHeader>
        <Link className={buttonVariants({ size: "sm", variant: "secondary" })} href="/admin/courses/create">Create Course</Link>
      </SiteHeader>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl font-sem">Your Courses</h1>
          <CoursesFilters 
            initialSearch={search}
            initialCategory={category}
            initialStatus={status}
          />
        </div>

        <Suspense fallback={<CourseCardSkeleton />}>
          <CoursesList 
            searchQuery={search}
            category={category}
            status={status}
          />
        </Suspense>
      </div>
    </main>
  );
};

export default CoursesPage;

