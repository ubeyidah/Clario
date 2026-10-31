import { notFound, redirect, RedirectType } from "next/navigation";
import Link from "next/link";
import Wrapper from "@/components/common/wrapper";
import { prisma } from "@/lib/db";
import { requireUser } from "@/app/data/user/require-user";
import { CertificateView } from "./_components/certificate-view";
import { buttonVariants } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockKeyIcon,
  PlayIcon,
  DashboardSquare01Icon,
} from "@hugeicons/core-free-icons";

export const dynamic = "force-dynamic";

interface CertificatePageProps {
  params: Promise<{
    courseId: string;
  }>;
}

export default async function CertificatePage({ params }: CertificatePageProps) {
  const { courseId } = await params;
  const user = await requireUser();

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    select: {
      id: true,
      title: true,
      slug: true,
      category: true,
      level: true,
      duration: true,
      chapters: {
        select: {
          lessons: {
            select: {
              id: true,
            },
          },
        },
      },
    },
  });

  if (!course) {
    return notFound();
  }

  // Verify active enrollment
  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: user.id,
        courseId,
      },
    },
    select: {
      id: true,
      status: true,
      createdAt: true,
    },
  });

  if (!enrollment || enrollment.status !== "ACTIVE") {
    return redirect(`/courses/${course.slug}`, RedirectType.replace);
  }

  const allLessonIds = course.chapters.flatMap((c) =>
    c.lessons.map((l) => l.id)
  );
  const totalLessons = allLessonIds.length;

  const progressRecords =
    totalLessons > 0
      ? await prisma.lessonProgress.findMany({
          where: {
            userId: user.id,
            lessonId: { in: allLessonIds },
            completed: true,
          },
          select: {
            completedAt: true,
          },
          orderBy: {
            completedAt: "desc",
          },
        })
      : [];

  const completedCount = progressRecords.length;
  const isCourseComplete = totalLessons > 0 && completedCount === totalLessons;

  // If the course is not completed yet, show informative unlock instructions
  if (!isCourseComplete) {
    const progressPercentage =
      totalLessons === 0 ? 0 : Math.round((completedCount / totalLessons) * 100);

    return (
      <Wrapper as="main" className="py-16 max-w-xl mx-auto text-center space-y-6">
        <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <HugeiconsIcon icon={LockKeyIcon} className="size-8" />
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Certificate Locked
          </h1>
          <p className="text-sm text-muted-foreground">
            You must complete all lessons in{" "}
            <span className="font-semibold text-foreground">{course.title}</span>{" "}
            to unlock your verified Certificate of Achievement.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-card border border-border/70 text-left space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Progress: {progressPercentage}%</span>
            <span>
              {completedCount} of {totalLessons} lessons completed
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2.5" />
        </div>

        <div className="flex items-center justify-center gap-3 pt-2">
          <Link
            href={`/learn/${course.id}`}
            className={buttonVariants({
              size: "lg",
              className: "rounded-xl gap-2 font-medium shadow-sm",
            })}
          >
            <HugeiconsIcon icon={PlayIcon} className="size-4 fill-current" />
            Continue Lessons
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "outline",
              size: "lg",
              className: "rounded-xl gap-2",
            })}
          >
            <HugeiconsIcon icon={DashboardSquare01Icon} className="size-4" />
            Dashboard
          </Link>
        </div>
      </Wrapper>
    );
  }

  // Determine completion date
  const latestCompletion = progressRecords[0]?.completedAt || new Date();
  const formattedCompletionDate = new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(latestCompletion));

  // Deterministic Credential ID
  const credentialId = `CLARIO-${course.id.slice(-6).toUpperCase()}-${enrollment.id.slice(-6).toUpperCase()}`;
  const studentName = user.name?.trim() || user.email?.split("@")[0] || "Student";

  return (
    <Wrapper as="main" className="py-8 md:py-12">
      <CertificateView
        studentName={studentName}
        courseTitle={course.title}
        courseCategory={course.category}
        courseLevel={course.level}
        courseDuration={course.duration}
        courseId={course.id}
        completedAt={formattedCompletionDate}
        certificateId={credentialId}
      />
    </Wrapper>
  );
}
