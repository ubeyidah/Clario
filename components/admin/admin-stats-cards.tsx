import {
  IconTrendingDown,
  IconTrendingUp,
  IconCurrencyDollar,
  IconUsers,
  IconSchool,
  IconAward,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { AdminDashboardStats } from "@/app/data/admin/get-admin-dashboard-stats";
import { formatETB } from "@/lib/utils";

interface AdminStatsCardsProps {
  stats: AdminDashboardStats;
}

export function AdminStatsCards({ stats }: AdminStatsCardsProps) {
  const isRevenuePositive = stats.revenueGrowthPercentage >= 0;
  const isStudentPositive = stats.studentGrowthPercentage >= 0;
  const isEnrollmentPositive = stats.enrollmentGrowthPercentage >= 0;

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      {/* 1. Total Platform Revenue */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1.5 font-medium">
              <IconCurrencyDollar className="size-4 text-emerald-500" />
              Total Revenue
            </CardDescription>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  isRevenuePositive
                    ? "text-emerald-600 border-emerald-500/20 bg-emerald-500/10"
                    : "text-rose-600 border-rose-500/20 bg-rose-500/10"
                }
              >
                {isRevenuePositive ? (
                  <IconTrendingUp className="size-3 mr-1" />
                ) : (
                  <IconTrendingDown className="size-3 mr-1" />
                )}
                {isRevenuePositive ? "+" : ""}
                {stats.revenueGrowthPercentage}%
              </Badge>
            </CardAction>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-foreground">
            {formatETB(stats.totalRevenue)}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">
            Active paid course checkouts platform-wide
          </div>
        </CardFooter>
      </Card>

      {/* 2. Total Students */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1.5 font-medium">
              <IconUsers className="size-4 text-blue-500" />
              Registered Students
            </CardDescription>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  isStudentPositive
                    ? "text-blue-600 border-blue-500/20 bg-blue-500/10"
                    : "text-amber-600 border-amber-500/20 bg-amber-500/10"
                }
              >
                {isStudentPositive ? (
                  <IconTrendingUp className="size-3 mr-1" />
                ) : (
                  <IconTrendingDown className="size-3 mr-1" />
                )}
                {isStudentPositive ? "+" : ""}
                {stats.studentGrowthPercentage}%
              </Badge>
            </CardAction>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-foreground">
            {stats.totalStudents.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">
            Enrolled and registered learner community
          </div>
        </CardFooter>
      </Card>

      {/* 3. Active Enrollments */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1.5 font-medium">
              <IconSchool className="size-4 text-purple-500" />
              Active Enrollments
            </CardDescription>
            <CardAction>
              <Badge
                variant="outline"
                className={
                  isEnrollmentPositive
                    ? "text-purple-600 border-purple-500/20 bg-purple-500/10"
                    : "text-muted-foreground"
                }
              >
                {isEnrollmentPositive ? "+" : ""}
                {stats.enrollmentGrowthPercentage}%
              </Badge>
            </CardAction>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-foreground">
            {stats.activeEnrollments.toLocaleString()}
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">
            Across {stats.coursesSummary.published} published courses ({stats.coursesSummary.draft} draft)
          </div>
        </CardFooter>
      </Card>

      {/* 4. Course Completion Rate */}
      <Card className="@container/card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardDescription className="flex items-center gap-1.5 font-medium">
              <IconAward className="size-4 text-amber-500" />
              Completion Rate
            </CardDescription>
            <CardAction>
              <Badge variant="outline" className="text-amber-600 border-amber-500/20 bg-amber-500/10">
                LMS Metric
              </Badge>
            </CardAction>
          </div>
          <CardTitle className="text-2xl font-bold tabular-nums @[250px]/card:text-3xl text-foreground">
            {stats.completionRate}%
          </CardTitle>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1 text-xs">
          <div className="text-muted-foreground">
            Student lesson progress & milestone completion
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
