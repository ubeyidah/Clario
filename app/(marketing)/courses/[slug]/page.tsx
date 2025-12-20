import { getCourseBySlug } from "@/app/data/course/get-course-detail";
import Wrapper from "@/components/common/wrapper";
import RenderEditor from "@/components/text-editor/render-editor";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Separator } from "@/components/ui/separator";
import { formatDuration, formatETB } from "@/lib/utils";
import { IconBook, IconCategory, IconChartBar, IconClock, IconPlayerPlay } from "@tabler/icons-react";
import { Check, ChevronsUpDown } from "lucide-react";
import Image from "next/image";
import { Suspense } from "react";

type Params = { slug: string }
const CourseDetail = async ({ params }: { params: Promise<Params> }) => {
  const { slug } = await params;

  return (
    <Wrapper as="main" className="min-h-screen">
      <Suspense fallback={<div>Loading...</div>}>
        <RenderCourseDetail slug={slug} />
      </Suspense>
    </Wrapper>
  )
}

const features = [
  "Full-time Access",
  "Access on Mobile and Desktop"
];
async function RenderCourseDetail({ slug }: { slug: string }) {
  const course = await getCourseBySlug(slug);
  const thumbnailUrl = `https://clario.t3.storage.dev/${course.fileKey}`;
  const totalLessons = course.chapters.reduce((acc, chapter) => acc + chapter.lessons.length, 0)
  return <div className="grid grid-cols-1 md:grid-cols-[2fr_1fr] mt-5 gap-10 mb-24">
    <div>
      <div className="aspect-video w-full overflow-hidden rounded-lg shadow-lg bg-accent/40 relative">
        <Image src={thumbnailUrl} alt={course.title} width={500} height={400} className="object-cover w-full h-full" priority />
        <div className="absolute w-full h-full inset-0 bg-linear-to-t from-bg-black/20 to-transparent"></div>
        <div className="absolute bottom-4 right-4 bg-black/80 px-3 py-0.5 rounded-2xl text-md">{formatDuration(course.duration)}</div>
      </div>
      <div className="mt-6 px-1 space-y-1">
        <h1 className="capitalize text-xl md:text-2xl font-medium">{course.title}</h1>
        <p className="text-muted-foreground">{course.shortDescription}</p>
        <div className="flex flex-wrap mt-4 gap-3">
          <Badge>
            <IconChartBar className="size-4" />
            <span>{course.level}</span>
          </Badge>

          <Badge>
            <IconCategory className="size-4" />
            <span>{course.category}</span>
          </Badge>
        </div>
      </div>

      <Separator className="my-7" />

      <div className="space-y-6">
        <h2 className="text-lg font-semibold tracking-tight">Course Description</h2>
        <div className="prose prose-sm sm:prose dark:prose-invert">
          <RenderEditor json={JSON.parse(course.description)} />
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold tracking-tight">Course Content</h3>
          <p className="text-sm text-muted-foreground">
            {course.chapters.length} Chapters • {totalLessons} Lessons
          </p>
        </div>
        <div className="space-y-4">
          {
            course.chapters.map((chapter, index) => (<Collapsible className="border rounded-md p-2 border-border/40" key={chapter.id} defaultOpen={index === 0} >
              <CollapsibleTrigger className="w-full">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-3">
                    <p className="flex items-center size-10 rounded-full bg-secondary/20 text-foreground justify-center font-semibold">
                      {index + 1}
                    </p>
                    <h3 className="font-medium capitalize">{chapter.title}</h3>
                  </div>
                  <div className="flex items-center gap-1 pr-2">
                    <Badge variant="secondary">
                      {chapter.lessons.length} Lesson{chapter.lessons.length > 1 ? 's' : ''}
                    </Badge>
                    <ChevronsUpDown className="size-4" />
                  </div>
                </div>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <Separator className="my-2 bg-border/40" />
                <div className="pl-8 pr-3 pt-3 space-y-4 mb-2">
                  {
                    chapter.lessons.map((lesson, index) => (<div key={lesson.id} className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className="size-8 flex items-center justify-center rounded-full bg-secondary/20 text-foreground">
                          <IconPlayerPlay className="size-4" />
                        </div>
                        <h4>{lesson.title}</h4>
                      </div>
                      <span className="text-sm text-muted-foreground">Lesson {index + 1}</span>
                    </div>))
                  }
                </div>
              </CollapsibleContent>
            </Collapsible>))
          }

        </div>
      </div>
    </div>
    <div>
      <Card className="sticky top-8 bg-card/40">
        <CardContent>
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-medium uppercase">Price</span>
            <span className="text-xl font-bold text-green-600">{formatETB(course.price)}</span>
          </div>
          <Separator className="my-2" />
          <div className="space-y-3 mb-6  rounded-lg p-3">
            <h4 className="font-medium">What you will get</h4>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <div className="size-10 flex items-center justify-center rounded-full bg-accent/40 text-foreground">
                  <IconClock className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Course Duration</p>
                  <p className="text-sm text-muted-foreground">{formatDuration(course.duration)}  hours</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-10 flex items-center justify-center rounded-full bg-accent/40 text-foreground">
                  <IconChartBar className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Diffcuality Level</p>
                  <p className="text-sm text-muted-foreground">{course.level}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 flex items-center justify-center rounded-full bg-accent/40 text-foreground">
                  <IconCategory className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Category</p>
                  <p className="text-sm text-muted-foreground">{course.category}</p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="size-10 flex items-center justify-center rounded-full bg-accent/40 text-foreground">
                  <IconBook className="size-4" />
                </div>
                <div>
                  <p className="text-sm font-medium">Total Lessons</p>
                  <p className="text-sm text-muted-foreground">{totalLessons} lessons</p>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-3 space-y-3 mb-8">
            <h3 className="font-medium">This course includes</h3>
            {
              features.map((feature) => (<div key={feature} className="pl-2 text-sm flex items-center gap-2">
                <div className="bg-green-600/20 rounded-full size-5 flex items-center justify-center mr-2">
                  <Check className="size-3 text-green-300" />
                </div>
                <p>{feature}</p>
              </div>))
            }
          </div>
          <Button className="w-full">Enroll Now</Button>
        </CardContent>
      </Card>
    </div>
  </div>
}

export default CourseDetail 
