"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { AdminCourseDetail } from "@/app/data/admin/get-admin-course-details";
import { useFileKeyToUrl } from "@/hooks/use-file-key-to-url";
import { formatDuration, formatETB } from "@/lib/utils";
import { timeAgo } from "@/lib/date";
import { updateCourseStatusA } from "../../actions";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { DeleteCourseDialog } from "../../_components/delete-course-dialog";
import {
  IconEdit,
  IconVideo,
  IconUsers,
  IconCurrencyDollar,
  IconBook,
  IconAward,
  IconExternalLink,
} from "@tabler/icons-react";

interface CourseDetailViewProps {
  course: AdminCourseDetail;
}

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const router = useRouter();
  const thumbnailUrl = useFileKeyToUrl(course.fileKey);
  const [status, setStatus] = React.useState<"Draft" | "Published" | "Archived">(
    course.status
  );
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false);

  const handleStatusChange = async (newStatus: "Draft" | "Published" | "Archived") => {
    setIsUpdatingStatus(true);
    try {
      const res = await updateCourseStatusA(course.id, newStatus);
      if (res.success) {
        setStatus(newStatus);
        toast.success(res.message);
        router.refresh();
      } else {
        toast.error(res.message);
      }
    } catch {
      toast.error("Failed to update status");
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusBadge = (st: "Draft" | "Published" | "Archived") => {
    switch (st) {
      case "Published":
        return <Badge className="bg-emerald-500/15 text-emerald-600 border-emerald-500/30">Published</Badge>;
      case "Draft":
        return <Badge variant="secondary" className="bg-amber-500/15 text-amber-600 border-amber-500/30">Draft</Badge>;
      case "Archived":
        return <Badge variant="outline" className="text-muted-foreground">Archived</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <Card className="overflow-hidden border-border/60">
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 p-6">
          <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border">
            {thumbnailUrl ? (
              <Image
                src={thumbnailUrl}
                alt={course.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className="size-full flex items-center justify-center text-muted-foreground text-sm">
                No Thumbnail
              </div>
            )}
            <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md text-xs font-medium bg-background/80 backdrop-blur-md">
              {formatDuration(course.duration)}
            </span>
          </div>

          <div className="flex flex-col justify-between gap-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{course.category}</Badge>
                  <Badge variant="secondary">{course.level}</Badge>
                  {getStatusBadge(status)}
                </div>

                <div className="flex items-center gap-2">
                  <Select
                    value={status}
                    onValueChange={(val) =>
                      handleStatusChange(val as "Draft" | "Published" | "Archived")
                    }
                    disabled={isUpdatingStatus}
                  >
                    <SelectTrigger className="w-[130px] h-8 text-xs">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent align="end">
                      <SelectItem value="Published">Publish</SelectItem>
                      <SelectItem value="Draft">Draft</SelectItem>
                      <SelectItem value="Archived">Archive</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button variant="outline" size="sm" asChild className="h-8 text-xs">
                    <Link href={`/admin/courses/${course.id}/edit`}>
                      <IconEdit className="size-3.5 mr-1" />
                      Edit Course
                    </Link>
                  </Button>

                  <Button variant="ghost" size="sm" asChild className="h-8 text-xs">
                    <Link href={`/courses/${course.slug}`} target="_blank">
                      <IconExternalLink className="size-3.5 mr-1" />
                      Public Page
                    </Link>
                  </Button>

                  <DeleteCourseDialog courseId={course.id} courseTitle={course.title} />
                </div>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                {course.title}
              </h1>
              <p className="text-muted-foreground text-sm line-clamp-2">
                {course.shortDescription}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-6 pt-2 border-t text-sm">
              <div>
                <span className="text-xs text-muted-foreground block">Course Price</span>
                <span className="text-base font-bold text-emerald-600 dark:text-emerald-400">
                  {formatETB(course.price)}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Instructor</span>
                <span className="font-medium text-foreground">{course.creator.name}</span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground block">Last Updated</span>
                <span className="text-muted-foreground">{timeAgo(new Date(course.updatedAt))}</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Course Revenue
            </CardTitle>
            <IconCurrencyDollar className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {formatETB(course.stats.totalRevenue)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              From {course.stats.totalStudents} paid student enrollments
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Enrolled Students
            </CardTitle>
            <IconUsers className="size-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {course.stats.totalStudents}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Active learners enrolled in this syllabus
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Curriculum Scope
            </CardTitle>
            <IconBook className="size-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {course.stats.totalChapters} Chapters · {course.stats.totalLessons} Lessons
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {formatDuration(course.duration)} total instructional content
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Completion Rate
            </CardTitle>
            <IconAward className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold tabular-nums">
              {course.stats.completionRate}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Average lesson completion by enrolled students
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs Section: Curriculum vs Enrolled Students */}
      <Tabs defaultValue="curriculum" className="space-y-4">
        <TabsList>
          <TabsTrigger value="curriculum" className="text-xs">
            Curriculum Structure ({course.stats.totalLessons} lessons)
          </TabsTrigger>
          <TabsTrigger value="students" className="text-xs">
            Enrolled Students ({course.enrolledStudents.length})
          </TabsTrigger>
          <TabsTrigger value="details" className="text-xs">
            Technical Details & Stripe
          </TabsTrigger>
        </TabsList>

        {/* Tab 1: Curriculum */}
        <TabsContent value="curriculum" className="space-y-4">
          {course.chapters.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground text-sm">
              No chapters or lessons created yet.{" "}
              <Link
                href={`/admin/courses/${course.id}/edit`}
                className="text-primary underline ml-1"
              >
                Add chapters in Course Structure editor
              </Link>
            </Card>
          ) : (
            course.chapters.map((chapter, chIdx) => (
              <Card key={chapter.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30 py-3 px-4 border-b">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-sm">
                      Chapter {chIdx + 1}: {chapter.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {chapter.lessons.length} lesson{chapter.lessons.length === 1 ? "" : "s"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="p-0 divide-y divide-border/40">
                  {chapter.lessons.map((lesson, lIdx) => (
                    <div
                      key={lesson.id}
                      className="flex items-center justify-between px-4 py-3 hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-muted-foreground w-6">
                          {chIdx + 1}.{lIdx + 1}
                        </span>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {lesson.title}
                          </p>
                          {lesson.description && (
                            <p className="text-xs text-muted-foreground line-clamp-1">
                              {lesson.description.replace(/<[^>]*>?/gm, "")}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {lesson.videoFileKey ? (
                          <Badge variant="secondary" className="text-xs gap-1">
                            <IconVideo className="size-3 text-emerald-500" />
                            Video Ready
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-xs text-muted-foreground">
                            No Video
                          </Badge>
                        )}
                        <Button variant="ghost" size="sm" asChild className="h-7 text-xs">
                          <Link
                            href={`/admin/courses/${course.id}/${chapter.id}/${lesson.id}`}
                          >
                            <IconEdit className="size-3 mr-1" />
                            Edit
                          </Link>
                        </Button>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Tab 2: Enrolled Students */}
        <TabsContent value="students">
          <Card>
            <CardHeader className="pb-3 border-b">
              <CardTitle className="text-base">Enrolled Students Roster</CardTitle>
              <CardDescription>
                Detailed progress and learning completion for this course
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              {course.enrolledStudents.length === 0 ? (
                <div className="py-12 text-center text-muted-foreground text-sm">
                  No students are enrolled in this course yet.
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Completed</TableHead>
                      <TableHead>Amount</TableHead>
                      <TableHead className="text-right">Enrolled Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {course.enrolledStudents.map((st) => (
                      <TableRow key={st.enrollmentId}>
                        <TableCell>
                          <div className="flex items-center gap-2.5">
                            <Avatar className="size-8">
                              <AvatarImage src={st.image || undefined} alt={st.name} />
                              <AvatarFallback className="text-xs">
                                {st.name.slice(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium text-sm">{st.name}</p>
                              <p className="text-xs text-muted-foreground">{st.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={st.status === "ACTIVE" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {st.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="w-[180px]">
                          <div className="space-y-1">
                            <Progress value={st.progressPercentage} className="h-1.5" />
                            <span className="text-xs font-mono text-muted-foreground">
                              {st.progressPercentage}%
                            </span>
                          </div>
                        </TableCell>
                        <TableCell className="text-sm">
                          {st.completedLessons} / {course.stats.totalLessons} lessons
                        </TableCell>
                        <TableCell className="font-semibold text-sm tabular-nums">
                          {formatETB(st.amount)}
                        </TableCell>
                        <TableCell className="text-right text-xs text-muted-foreground">
                          {timeAgo(new Date(st.enrolledAt))}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Tab 3: Technical Details */}
        <TabsContent value="details">
          <Card>
            <CardHeader className="border-b pb-3">
              <CardTitle className="text-base">Metadata & Integrations</CardTitle>
            </CardHeader>
            <CardContent className="pt-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Course Slug
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {course.slug}
                  </code>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Course ID
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {course.id}
                  </code>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Stripe Price ID
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {course.stripePriceId || "Not connected"}
                  </code>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Stripe Product ID
                  </span>
                  <code className="text-xs bg-muted px-2 py-1 rounded">
                    {course.stripeProductId || "Not connected"}
                  </code>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Created At
                  </span>
                  <span>{new Date(course.createdAt).toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-xs font-medium text-muted-foreground block">
                    Last Updated
                  </span>
                  <span>{new Date(course.updatedAt).toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
