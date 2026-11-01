import { Suspense } from "react";
import { SiteHeader } from "@/components/common/site-header";
import { AdminStatsCards } from "@/components/admin/admin-stats-cards";
import { AdminRevenueChart } from "@/components/admin/admin-revenue-chart";
import { RecentEnrollmentsTable } from "@/components/admin/recent-enrollments-table";
import { getAdminDashboardStats } from "@/app/data/admin/get-admin-dashboard-stats";
import { getAdminRevenueAndEnrollmentTrends } from "@/app/data/admin/get-admin-analytics";
import { getRecentEnrollments } from "@/app/data/admin/get-recent-enrollments";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { IconCirclePlus, IconChartBar } from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default function AdminDashboardPage() {
  return (
    <>
      <SiteHeader>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild className="text-xs h-8">
            <Link href="/admin/analytics">
              <IconChartBar className="size-3.5 mr-1" />
              Full Analytics
            </Link>
          </Button>
          <Button size="sm" asChild className="text-xs h-8">
            <Link href="/admin/courses/create">
              <IconCirclePlus className="size-3.5 mr-1" />
              New Course
            </Link>
          </Button>
        </div>
      </SiteHeader>

      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-6 py-4 md:py-6">
          <Suspense fallback={<DashboardCardsSkeleton />}>
            <AdminStatsSection />
          </Suspense>

          <div className="px-4 lg:px-6">
            <Suspense fallback={<Skeleton className="h-[340px] w-full rounded-xl" />}>
              <AdminChartSection />
            </Suspense>
          </div>

          <Suspense fallback={<Skeleton className="h-[300px] mx-4 lg:mx-6 rounded-xl" />}>
            <RecentEnrollmentsSection />
          </Suspense>
        </div>
      </div>
    </>
  );
}

async function AdminStatsSection() {
  const stats = await getAdminDashboardStats();
  return <AdminStatsCards stats={stats} />;
}

async function AdminChartSection() {
  const trends = await getAdminRevenueAndEnrollmentTrends(30);
  return <AdminRevenueChart data={trends} />;
}

async function RecentEnrollmentsSection() {
  const enrollments = await getRecentEnrollments(8);
  return <RecentEnrollmentsTable enrollments={enrollments} />;
}

function DashboardCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-4 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}
