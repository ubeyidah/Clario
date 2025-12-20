import { SiteHeader } from "@/components/common/site-header";
import { buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/ui/search-bar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { COURSE_CATEGORIES } from "@/lib/constants";
import Link from "next/link";
import CourseCard from "./_components/course-card";
import { getAdminCourses } from "@/app/data/admin/get-admin-courses";
import { EmptyCourse } from "./_components/course-empty";
import { Suspense } from "react";
import CourseCardSkeleton from "./_components/course-card-skeleton";

const CoursesPage = () => {
  return (
    <main>
      <SiteHeader>
        <Link className={buttonVariants({ size: "sm", variant: "secondary" })} href="/admin/courses/create">Create Course</Link>
      </SiteHeader>
      <div className="p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-xl font-sem">Your Courses</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <SearchBar />
            <Select defaultValue="All Courses">
              <SelectTrigger
                id="category"
              >
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent position="item-aligned">
                {[{ label: "All Courses", id: "all-courses" }, ...COURSE_CATEGORIES].map((category) => (
                  <SelectItem key={category.id} value={category.label}>
                    {category.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <Suspense fallback={<CourseCardSkeleton />}>
          <RenderAdminCourses />
        </Suspense>
      </div>
    </main>
  )
}

async function RenderAdminCourses() {
  const courses = await getAdminCourses();
  return <div className="mt-6">
    {
      courses.length ? courses.map((course, i) => <CourseCard course={course} key={course.id} isFirst={i == 0} />) : <EmptyCourse />
    }
  </div>
}


export default CoursesPage;

