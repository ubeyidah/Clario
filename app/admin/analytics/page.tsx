import { Suspense } from "react";
import { SiteHeader } from "@/components/common/site-header";
import {
  getAdminRevenueAndEnrollmentTrends,
  getAdminCategoryDistribution,
  getTopPerformingCourses,
} from "@/app/data/admin/get-admin-analytics";
import { getAdminDashboardStats } from "@/app/data/admin/get-admin-dashboard-stats";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { formatETB } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import {
  IconCurrencyDollar,
  IconSchool,
  IconChartBar,
  IconTrophy,
  IconCategory,
  IconReceipt2,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  return (
    <main>
      <SiteHeader />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Analytics</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Real-time business performance, student acquisition, and revenue intelligence.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="h-28 w-full rounded-xl" />}>
          <AnalyticsTopKPIs />
        </Suspense>

        <Suspense fallback={<Skeleton className="h-[360px] w-full rounded-xl" />}>
          <AnalyticsChartSection />
        </Suspense>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Suspense fallback={<Skeleton className="h-[380px] w-full rounded-xl" />}>
            <CategoryDistributionSection />
          </Suspense>

          <Suspense fallback={<Skeleton className="h-[380px] w-full rounded-xl" />}>
            <TopCoursesSection />
          </Suspense>
        </div>
      </div>
    </main>
  );
}

async function AnalyticsTopKPIs() {
  const stats = await getAdminDashboardStats();
  const avgOrderValue =
    stats.activeEnrollments > 0
      ? Math.round(stats.totalRevenue / stats.activeEnrollments)
      : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Gross Platform Revenue
          </CardTitle>
          <IconCurrencyDollar className="size-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">
            {formatETB(stats.totalRevenue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {stats.revenueGrowthPercentage >= 0 ? "+" : ""}
            {stats.revenueGrowthPercentage}% compared to previous 30 days
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Total Paid Enrollments
          </CardTitle>
          <IconSchool className="size-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">
            {stats.activeEnrollments}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Across {stats.coursesSummary.published} live published courses
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Average Order Value (AOV)
          </CardTitle>
          <IconReceipt2 className="size-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">
            {formatETB(avgOrderValue)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Per enrolled student transaction
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Curriculum Completion
          </CardTitle>
          <IconChartBar className="size-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold tabular-nums">
            {stats.completionRate}%
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            Platform-wide student lesson completion
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

async function AnalyticsChartSection() {
  const trends = await getAdminRevenueAndEnrollmentTrends(30);
  return <AdminRevenueChart data={trends} />;
}

async function CategoryDistributionSection() {
  const categories = await getAdminCategoryDistribution();

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <IconCategory className="size-5 text-primary" />
          Revenue by Subject Category
        </CardTitle>
        <CardDescription>
          Category market performance across active student checkouts
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-4">
        {categories.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No category sales recorded yet.
          </div>
        ) : (
          categories.map((cat) => (
            <div key={cat.category} className="space-y-1.5">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{cat.category}</span>
                <span className="font-semibold tabular-nums text-emerald-600 dark:text-emerald-400">
                  {formatETB(cat.revenue)}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{cat.coursesCount} course{cat.coursesCount === 1 ? "" : "s"}</span>
                <span>{cat.enrollmentsCount} student enrollment{cat.enrollmentsCount === 1 ? "" : "s"}</span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}

async function TopCoursesSection() {
  const topCourses = await getTopPerformingCourses(5);

  return (
    <Card>
      <CardHeader className="border-b pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <IconTrophy className="size-5 text-amber-500" />
          Top Performing Courses Leaderboard
        </CardTitle>
        <CardDescription>
          Highest grossing courses by student enrollment and revenue
        </CardDescription>
      </CardHeader>
      <CardContent className="p-0 divide-y divide-border/50">
        {topCourses.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">
            No course performance data available yet.
          </div>
        ) : (
          topCourses.map((c, idx) => (
            <div
              key={c.id}
              className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-bold text-sm text-muted-foreground w-4">
                  #{idx + 1}
                </span>
                <div>
                  <Link
                    href={`/admin/courses/${c.id}`}
                    className="font-medium text-sm hover:underline hover:text-primary transition-colors line-clamp-1"
                  >
                    {c.title}
                  </Link>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Badge variant="outline" className="text-xs">
                      {c.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {c.enrollmentsCount} student{c.enrollmentsCount === 1 ? "" : "s"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-right">
                <span className="font-bold text-sm text-emerald-600 dark:text-emerald-400 block tabular-nums">
                  {formatETB(c.revenue)}
                </span>
                <span className="text-xs text-muted-foreground">
                  Price: {formatETB(c.price)}
                </span>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
