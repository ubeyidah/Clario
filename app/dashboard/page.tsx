import { Suspense } from "react";
import Wrapper from "@/components/common/wrapper";
import { getEnrolledCourses } from "@/app/data/student/get-enrolled-courses";
import { requireUser } from "@/app/data/user/require-user";
import { DashboardStatsCards } from "./_components/stats-cards";
import { ContinueLearningHero } from "./_components/continue-learning-hero";
import { EnrolledCourseCard } from "./_components/enrolled-course-card";
import { DashboardEmptyState } from "./_components/empty-state";
import { DashboardSkeleton } from "./_components/dashboard-skeleton";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <StudentDashboardContent />
    </Suspense>
  );
}

async function StudentDashboardContent() {
  const user = await requireUser();
  const { courses, stats } = await getEnrolledCourses();

  // Find the most recently active or in-progress course, or default to the first course
  const activeCourse =
    courses.find((course) => !course.isCompleted) ||
    courses[0] ||
    null;

  const displayName = user.name || user.email.split("@")[0];

  return (
    <Wrapper as="main" className="py-8 space-y-8">
      {/* Welcome Header */}
      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Welcome back, {displayName}
        </h1>
        <p className="text-muted-foreground text-sm">
          Pick up right where you left off and keep expanding your skills.
        </p>
      </div>

      {/* Stats Summary */}
      <DashboardStatsCards stats={stats} />

      {courses.length === 0 ? (
        <DashboardEmptyState />
      ) : (
        <>
          {/* Continue Learning Featured Banner */}
          {activeCourse && <ContinueLearningHero course={activeCourse} />}

          {/* All Enrolled Courses Grid */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  My Courses
                </h2>
                <p className="text-xs text-muted-foreground">
                  You are enrolled in {courses.length} course{courses.length > 1 ? "s" : ""}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <EnrolledCourseCard key={course.id} course={course} />
              ))}
            </div>
          </div>
        </>
      )}
    </Wrapper>
  );
}
