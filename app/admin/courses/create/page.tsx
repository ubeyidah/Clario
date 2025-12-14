import { SiteHeader } from "@/components/common/site-header"
import CourseCreateForm from "./_components/course-create-form"

const CreatePage = () => {
  return (
    <div>
      <SiteHeader />
      <div className="py-5 px-5 md:px-8">
        <CourseCreateForm />
      </div>
    </div>
  )
}

export default CreatePage 
