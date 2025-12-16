import { IconVideo } from "@tabler/icons-react"

import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"

export function EmptyCourse() {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <IconVideo />
        </EmptyMedia>
        <EmptyTitle>No Courses Yet</EmptyTitle>
        <EmptyDescription>
          You haven&apos;t created any courses yet. Get started by creating
          your first course.
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <div>
          <Link className={buttonVariants()} href="/admin/courses/create">Create Course</Link>
        </div>
      </EmptyContent>
    </Empty>
  )
}
