import { Skeleton } from "@/components/ui/skeleton"
import { cn } from "@/lib/utils"

const CourseCardSkeleton = () => {
  return (
    <div className="mt-6">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className={cn(
            "border-b py-4 px-2 grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4",
            i === 0 && "border-t"
          )}
        >
          <div className="relative rounded-xl overflow-hidden">
            <Skeleton className="aspect-video w-full rounded-xl" />
            <Skeleton className="absolute bottom-2 right-2 h-5 w-14 rounded-md" />
          </div>

          <div className="flex flex-col justify-between gap-4 relative">
            <Skeleton className="absolute top-0 right-2 h-5 w-20 rounded-md" />

            <div className="space-y-2">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>

            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-20 rounded-xl" />
              <Skeleton className="h-6 w-24 rounded-md" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default CourseCardSkeleton
