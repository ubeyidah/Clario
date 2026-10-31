import { Card, CardContent } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Book02Icon,
  CheckmarkBadge01Icon,
  Playlist02Icon,
  Clock01Icon,
} from "@hugeicons/core-free-icons";
import { StudentDashboardStats } from "@/app/data/student/get-enrolled-courses";

interface DashboardStatsCardsProps {
  stats: StudentDashboardStats;
}

export function DashboardStatsCards({ stats }: DashboardStatsCardsProps) {
  const cards = [
    {
      title: "Enrolled Courses",
      value: stats.totalCourses,
      icon: Book02Icon,
      accent: "text-blue-500 bg-blue-500/10",
    },
    {
      title: "In Progress",
      value: stats.inProgressCourses,
      icon: Playlist02Icon,
      accent: "text-amber-500 bg-amber-500/10",
    },
    {
      title: "Completed",
      value: stats.completedCourses,
      icon: CheckmarkBadge01Icon,
      accent: "text-emerald-500 bg-emerald-500/10",
    },
    {
      title: "Total Hours",
      value: `${stats.totalHours}h`,
      icon: Clock01Icon,
      accent: "text-purple-500 bg-purple-500/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        return (
          <Card key={card.title} className="bg-card/40 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                  {card.title}
                </p>
                <p className="text-2xl font-bold mt-1 text-foreground">
                  {card.value}
                </p>
              </div>
              <div className={`p-3 rounded-xl ${card.accent}`}>
                <HugeiconsIcon icon={card.icon} className="size-6" />
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
