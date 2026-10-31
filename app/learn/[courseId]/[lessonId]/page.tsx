import { getCoursePlayerData } from "@/app/data/student/get-course-player";
import { VideoPlayer } from "../_components/video-player";
import { CoursePlayerSidebar } from "../_components/course-player-sidebar";
import { LessonNavigationControls } from "../_components/lesson-navigation-controls";
import RenderEditor from "@/components/text-editor/render-editor";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { HugeiconsIcon } from "@hugeicons/react";
import { Menu01Icon } from "@hugeicons/core-free-icons";

export const dynamic = "force-dynamic";

interface LessonPageProps {
  params: Promise<{
    courseId: string;
    lessonId: string;
  }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = await params;
  const data = await getCoursePlayerData(courseId, lessonId);

  let parsedDescription = null;
  if (data.currentLesson.description) {
    try {
      parsedDescription = JSON.parse(data.currentLesson.description);
    } catch {
      // Plain text fallback if not JSON
      parsedDescription = null;
    }
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row w-full overflow-hidden">
      {/* Mobile Syllabus Drawer Trigger */}
      <div className="lg:hidden p-3 border-b border-border bg-card/40 flex items-center justify-between">
        <span className="text-xs font-semibold text-muted-foreground uppercase">
          Curriculum
        </span>
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="sm" className="rounded-xl gap-2 text-xs">
              <HugeiconsIcon icon={Menu01Icon} className="size-4" />
              Course Syllabus
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0 w-80">
            <CoursePlayerSidebar
              courseId={data.course.id}
              courseTitle={data.course.title}
              currentLessonId={data.currentLesson.id}
              chapters={data.chapters}
              progress={data.progress}
            />
          </SheetContent>
        </Sheet>
      </div>

      {/* Main Content Area (Video Player & Lesson Details) */}
      <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 space-y-6 max-w-5xl mx-auto w-full">
        {/* Video Player */}
        <VideoPlayer
          videoFileKey={data.currentLesson.videoFileKey}
          thumbnailFileKey={data.currentLesson.thumbnailFileKey}
          lessonTitle={data.currentLesson.title}
        />

        {/* Lesson Metadata Header */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              Lesson {data.currentLesson.position}
            </Badge>
            {data.currentLesson.isCompleted && (
              <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-xs">
                Completed
              </Badge>
            )}
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-foreground">
            {data.currentLesson.title}
          </h1>
        </div>

        {/* Navigation Controls (Prev / Next / Complete) */}
        <LessonNavigationControls
          courseId={data.course.id}
          lessonId={data.currentLesson.id}
          isCompleted={data.currentLesson.isCompleted}
          prevLesson={data.prevLesson}
          nextLesson={data.nextLesson}
        />

        {/* Lesson Description & Notes */}
        <div className="space-y-4 pt-2">
          <h2 className="text-lg font-semibold tracking-tight text-foreground">
            Lesson Notes
          </h2>

          {parsedDescription ? (
            <div className="prose prose-sm sm:prose dark:prose-invert max-w-none">
              <RenderEditor json={parsedDescription} />
            </div>
          ) : data.currentLesson.description ? (
            <p className="text-sm text-muted-foreground whitespace-pre-wrap">
              {data.currentLesson.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">
              No written notes provided for this lesson.
            </p>
          )}
        </div>
      </main>

      {/* Desktop Curriculum Sidebar */}
      <aside className="hidden lg:block w-80 xl:w-96 shrink-0 h-[calc(100vh-3.5rem)] sticky top-0">
        <CoursePlayerSidebar
          courseId={data.course.id}
          courseTitle={data.course.title}
          currentLessonId={data.currentLesson.id}
          chapters={data.chapters}
          progress={data.progress}
        />
      </aside>
    </div>
  );
}
