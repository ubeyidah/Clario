import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Wrapper from "@/components/common/wrapper";

export function DashboardSkeleton() {
  return (
    <Wrapper as="main" className="py-8 space-y-8">
      {/* Header skeleton */}
      <div className="space-y-2">
        <Skeleton className="h-8 w-48 rounded-lg" />
        <Skeleton className="h-4 w-72 rounded-lg" />
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="bg-card/40 border-border/60">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-6 w-12" />
              </div>
              <Skeleton className="size-12 rounded-xl" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Continue learning skeleton */}
      <Skeleton className="h-64 w-full rounded-2xl" />

      {/* Courses grid skeleton */}
      <div className="space-y-4">
        <Skeleton className="h-6 w-36" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className="bg-card/40 border-border/60 overflow-hidden">
              <Skeleton className="aspect-video w-full" />
              <CardContent className="p-4 space-y-3">
                <Skeleton className="h-4 w-1/3" />
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-9 w-full rounded-xl" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </Wrapper>
  );
}
