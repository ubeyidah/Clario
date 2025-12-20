import { getAdminCourse } from "@/app/data/admin/get-admin-course";
import { SiteHeader } from "@/components/common/site-header";
import { DatabaseIcon, PictureInPictureIcon } from "lucide-react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import CourseEditForm from "./_components/course-edit-form";
import { truncateText } from "@/lib/utils";
import { timeAgo } from "@/lib/date";
import CourseStructure from "./_components/course-structure";


type Params = Promise<{ courseId: string }>
const EditCoursePage = async ({ params }: { params: Params }) => {
  const { courseId } = await params;
  const course = await getAdminCourse(courseId);
  return (
    <div>
      <SiteHeader><span className="font-mono text-sm">last updated {timeAgo(course.updatedAt)}</span></SiteHeader>
      <div className="p-4 md:p-6 mt-5">
        <div>
          <Tabs defaultValue="basic-info">
            <div className="flex items-center flex-col gap-4">

              <h3 className="truncate text-lg font-semibold"><span className="text-yellow-700 bg-yellow-600/10 rounded-md px-2 py-1">Edit</span> {truncateText(course.title, 40)}</h3>
              <TabsList>
                <TabsTrigger
                  value="basic-info"
                >
                  <DatabaseIcon
                    aria-hidden="true"
                    size={16}
                  />
                  Basic Info
                </TabsTrigger>
                <TabsTrigger
                  value="course-strucutre"
                >
                  <PictureInPictureIcon
                    aria-hidden="true"
                    size={16}
                  />
                  Course Structure
                </TabsTrigger>
              </TabsList>

            </div>
            <TabsContent value="basic-info">
              <CourseEditForm courseId={courseId} course={course} />
            </TabsContent>
            <TabsContent value="course-strucutre">
              <CourseStructure data={course} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default EditCoursePage;
