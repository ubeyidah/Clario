import { PublicCourse } from "@/app/data/course/get-public-courses"
import { Badge } from "@/components/ui/badge"
import { useFileKeyToUrl } from "@/hooks/use-file-key-to-url"
import { formatDuration } from "@/lib/utils"
import { School } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

interface iAppProps {
  course: PublicCourse
}
const CourseCard = ({ course }: iAppProps) => {
  const thumbnailUrl = useFileKeyToUrl(course.fileKey) // Todo: fallback image incase if it fail
  return (
    <Link href={`/courses/${course.slug}`} className="rounded-xl flex flex-col justify-between overflow-hidden hover:bg-accent/30 transition-colors duration-300 p-2">
      <div>
        <div className="relative">
          <Image src={thumbnailUrl} alt={course.title} width={400} height={300} className="aspect-video object-cover rounded-xl" />
          <span className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white text-xs px-2 py-1 rounded-md">{formatDuration(course.duration)}</span>

          <Badge className="absolute top-2 right-2 uppercase bg-radial from-green-900 to-green-800" variant={"secondary"}>{course.level}</Badge>
        </div>
        <div className="p-3">
          <div>
            <h1 className="font-medium text-lg capitalize">{course.title}</h1>
            <p className="text-sm text-muted-foreground line-clamp-2">{course.shortDescription}</p>
          </div>
        </div>
      </div>
      <div className="px-3 pb-3">
        <Badge variant={"secondary"}>
          <School className="size-5" /> {course.category}
        </Badge>
      </div>
    </Link>
  )
}

export default CourseCard
