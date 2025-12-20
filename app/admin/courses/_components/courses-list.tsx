import CourseCard from "./course-card";
import { getAdminCourses } from "@/app/data/admin/get-admin-courses";
import { EmptyCourse } from "./course-empty";

interface CoursesListProps {
  searchQuery?: string;
  category?: string;
  status?: string;
}

export async function CoursesList({ searchQuery, category, status }: CoursesListProps) {
  const courses = await getAdminCourses(searchQuery, category, status);
  
  return (
    <div className="mt-6">
      {courses.length ? 
        courses.map((course, i) => <CourseCard course={course} key={course.id} isFirst={i == 0} />) : 
        <EmptyCourse />
      }
    </div>
  );
}