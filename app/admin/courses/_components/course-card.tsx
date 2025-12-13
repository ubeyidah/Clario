import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { Edit, Eye, Trash } from "lucide-react"
import Image from "next/image"


interface iAppProps {
  isFirst?: boolean
}


const CourseCard = ({ isFirst }: iAppProps) => {
  return (
    <div className={cn("border-b group py-4 px-2 grid grid-cols-[200px_1fr] gap-4", isFirst && "border-t")}>
      <div className="relative">
        <Image src={"/dashboard.png"} width={200} height={100} alt="thumbnail image" className="aspect-video rounded-xl" />
        <p className="absolute bottom-2 px-2 py-0.5 rounded-md right-2 text-sm bg-background/50 backdrop-blur-3xl">2:00</p>
      </div>
      <div className="flex flex-col justify-between relative">
        <div className="absolute top-0 right-2 text-xs uppercase text-green-600 bg-green-800/20 px-2 py-1 rounded-md">Published</div>
        <div>
          <h1 className="text-lg font-bold">AWS S3 Mastery: Store, Secure, and Scale Files in the Cloud</h1>
          <p className="text-muted-foreground line-clamp-2">Learn how to use Amazon S3 to store files, manage access, and build scalable cloud storage for real applications. earn how to use Amazon S3 to store files, manage access,</p>
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
          <p className="uppercase text-green-600 bg-green-800/20 px-3 py-0.5 rounded-xl text-sm">ETB 3,000</p>
          <Badge variant={"secondary"}>Development</Badge>
        </div>
      </div>

    </div>
  )
}

export default CourseCard 
