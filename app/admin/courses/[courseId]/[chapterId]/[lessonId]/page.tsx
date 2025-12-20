import { getAdminLesson } from "@/app/data/admin/get-admin-lesson"
import { SiteHeader } from "@/components/common/site-header"
import LessonForm from "./_components/lesson-form"

type Params = {
  lessonId: string
  chapterId: string,
  courseId: string
}

const LessonPage = async ({ params }: { params: Promise<Params> }) => {
  const { lessonId, chapterId, courseId } = await params
  const lesson = await getAdminLesson(lessonId)
  return (
    <div>
      <SiteHeader />
      <div>
        <LessonForm chapterId={chapterId} courseId={courseId} lesson={lesson} />
      </div>
    </div>
  )
}

export default LessonPage 
