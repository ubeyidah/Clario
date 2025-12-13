import { AdminCoursesType } from "@/app/data/admin/get-admin-courses"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useFileKeyToUrl } from "@/hooks/use-file-key-to-url"
import { badgeClasses, courseStatusToVariant } from "@/lib/badge"
import { cn, formatDuration, formatETB } from "@/lib/utils"
import { Edit, Eye, Trash } from "lucide-react"
import Image from "next/image"


interface iAppProps {
  isFirst?: boolean
  course: AdminCoursesType
}


const CourseCard = ({ course, isFirst }: iAppProps) => {
  const thumbnailUrl = useFileKeyToUrl(course.fileKey)
  return (
    <div className={cn("border-b group py-4 px-2 hover:bg-card/50 transition-colors duration-300 grid grid-cols-[200px_1fr] gap-4", isFirst && "border-t")}>
      <div className="relative rounded-xl bg-linear-to-bl from-neutral-100/30 via-neutral-50/30 to-neutral-100/30 overflow-hidden">
        <Image src={thumbnailUrl} width={200} height={100} alt="thumbnail image" className="aspect-video rounded-xl" loading="lazy" />
        <p className="absolute bottom-2 px-2 py-0.5 rounded-md right-2 text-sm bg-background/50 backdrop-blur-3xl">{formatDuration(course.duration)}</p>
      </div>
      <div className="flex flex-col justify-between relative">
        <div className={badgeClasses(courseStatusToVariant(course.status), "absolute top-0 right-2")}>{course.status}</div>
        <div>
          <h1 className="text-lg font-bold">{course.title}</h1>
          <p className="text-muted-foreground line-clamp-2">{course.shortDescription}</p>
          <div className="absolute bottom-2 right-2 gap-2 flex opacity-0 translate-y-3 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"ghost"} size={"sm"} className="cursor-pointer rounded-full">
                    <Edit />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Edit
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"ghost"} size={"sm"} className="cursor-pointer rounded-full">
                    <Eye />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  View Detail
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant={"ghost"} size={"sm"} className="cursor-pointer text-destructive hover:bg-destructive/20 hover:text-destructive rounded-full">
                    <Trash />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Delete
                </TooltipContent>
              </Tooltip>

            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <p className="uppercase text-green-600 bg-green-800/20 px-3 py-0.5 rounded-xl text-sm">{formatETB(course.price)}</p>
          <Badge variant={"secondary"}>{course.category}</Badge>
        </div>
      </div>

    </div>
  )
}

export default CourseCard 
