import { SiteHeader } from "@/components/common/site-header";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

const CoursesPage = () => {
  return (
    <main>
      <SiteHeader>
        <Link className={buttonVariants({ size: "sm", variant: "secondary" })} href="/admin/courses/create">Create Course</Link>
      </SiteHeader>
      Courses List
    </main>
  )
}

export default CoursesPage; 
