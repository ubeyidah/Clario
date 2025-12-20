import { getPublicCourses } from "@/app/data/course/get-public-courses";
import Wrapper from "@/components/common/wrapper"
import CourseCard from "./_components/course-card";
import { Suspense } from "react";
import { CourseGridSkeleton } from "./_components/course-card-skeleton";

const CoursesPage = () => {
  return (
    <Wrapper as="main" className="min-h-screen">
      <div className="text-center flex flex-col gap-1 mt-5">
        <h1 className="text-2xl font-medium">Explore Courses</h1>
        <p className="text-muted-foreground">Discover our wide rage of courses designed to help you achieve your learning goals.</p>
      </div>
      <Suspense fallback={<CourseGridSkeleton />}>
        <RenderPublicCourses />
      </Suspense>
    </Wrapper>
  )
}


async function RenderPublicCourses() {
  const courses = await getPublicCourses();
  return <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
    {courses.map(course => <CourseCard key={course.id} course={course} />)}
  </div>
}

export default CoursesPage 
