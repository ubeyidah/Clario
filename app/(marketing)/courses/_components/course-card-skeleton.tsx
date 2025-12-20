import { Skeleton } from "@/components/ui/skeleton"

export const CourseGridSkeleton = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-10">
      {Array.from({ length: 9 }).map((_, i) => (
        <div key={i} className="rounded-xl flex flex-col justify-between overflow-hidden p-2">
          <div>
            <div className="relative">
              <Skeleton className="aspect-video w-full rounded-xl" />
              <Skeleton className="absolute bottom-2 right-2 h-5 w-12" />
              <Skeleton className="absolute top-2 right-2 h-5 w-16" />
            </div>

            <div className="p-3 space-y-3">
              <Skeleton className="h-6 w-3/4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>
          </div>

          <div className="px-3 pb-3">
            <Skeleton className="h-7 w-24 rounded-md" />
          </div>
        </div>
      ))}
    </div>
  )
}
