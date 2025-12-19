"use client"
import { AdminCourseType } from "@/app/data/admin/get-admin-course";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { DndContext, DragEndEvent, DraggableSyntheticListeners, KeyboardSensor, PointerSensor, rectIntersection, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { CSS } from '@dnd-kit/utilities';
import { ChevronDown, ChevronRight, FileTextIcon, GripVertical, MoreVertical } from "lucide-react";
import Link from "next/link";
import { ReactNode, useState } from "react"
import { reorderLessonsA } from "../actions";
import { toast } from "sonner";


interface iAppProps {
  data: AdminCourseType
}

type SortableItemType = "lesson" | "chapter"

interface SortableItemProps {
  id: string,
  children: (listeners: DraggableSyntheticListeners, isDragging: boolean) => ReactNode;
  className?: string,
  data?: {
    type: SortableItemType,
    chapterId?: string
  }
}

const CourseStructure = ({ data }: iAppProps) => {
  const initialItems = data.chapters.map((chapter) => ({
    id: chapter.id,
    title: chapter.title,
    order: chapter.position,
    isOpen: true,
    lessons: chapter.lessons.map(lesson => ({
      id: lesson.id,
      order: lesson.position,
      title: lesson.title
    }))
  })) || [];
  const [items, setItems] = useState(initialItems)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );


  function SortableItem({ className, children, id, data }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging
    } = useSortable({ id, data });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div ref={setNodeRef} style={style} {...attributes} className={cn("touch-none", className, isDragging ? "z-20" : "")}>
        {
          children(listeners, isDragging)
        }
      </div>
    );
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return
    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as SortableItemType
    const overType = over.data.current?.type as SortableItemType;
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) return
      const oldIndex = items.findIndex((item) => item.id == activeId)
      const newIndex = items.findIndex(item => item.id == overId)
      if (oldIndex == -1 || newIndex == -1) return;
      const reordedChapters = arrayMove(items, oldIndex, newIndex)
      const updatedChaptersForState = reordedChapters.map((chapter, index) => ({ ...chapter, order: index++ }))
      const backupState = [...items]
      setItems(updatedChaptersForState)

      // TODO: muate the reordering to the db
    }


    if (activeType == "lesson" || overType == "lesson") {
      const chapterId = active.data.current?.chapterId;
      const overChapterId = over.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) return;

      const chapterIndex = items.findIndex(chapter => chapter.id === chapterId);
      if (chapterIndex === -1) return;
      const chapterToUpdate = items[chapterIndex];
      const oldLessonIndex = chapterToUpdate.lessons.findIndex(lesson => lesson.id == activeId)
      const newLessonIndex = chapterToUpdate.lessons.findIndex(lesson => lesson.id == overId)
      if (newLessonIndex === -1 || oldLessonIndex === -1) return;
      const reordedLessons = arrayMove(chapterToUpdate.lessons, oldLessonIndex, newLessonIndex)
      const updatedLessonsForState = reordedLessons.map((lesson, index) => ({ ...lesson, order: index++ }))
      const newItems = [...items]
      newItems[chapterIndex] = { ...chapterToUpdate, lessons: updatedLessonsForState }
      const buackupItems = [...items]
      setItems(newItems)
      if (courseId) {
        const lessonsToUpdate = updatedLessonsForState.map(lesson => ({ id: lesson.id, position: lesson.order }))
        const lessonsReorderPromise = () => reorderLessonsA(courseId, lessonsToUpdate, chapterId)
        toast.promise(lessonsReorderPromise, {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.success) return result.message;
            throw new Error(result.message);
          },
          error: (err) => {
            setItems(buackupItems)
            return `Failed to reorder lessons: ${err.message}`;
          }
        })
      }
    }

  }

  function toggleChapter(chapterId: string) {
    setItems(prev => prev.map(chapter => chapter.id === chapterId ? { ...chapter, isOpen: !chapter.isOpen } : chapter))
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors} collisionDetection={rectIntersection}>
      <Card>
        <CardHeader className="flex flex-row itecems-center justify-between border-b border-border">
          <CardTitle>Chapters</CardTitle>
        </CardHeader>
        <CardContent>
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {
              items.map(chapter => (
                <SortableItem data={{ type: "chapter" }} id={chapter.id} key={chapter.id}>
                  {(listeners, isDragging) => <div>
                    <Collapsible className="border mb-4 bg-card" open={isDragging ? false : chapter.isOpen} onOpenChange={() => toggleChapter(chapter.id)}>
                      <div className="flex items-center justify-between p-3 border-b border-border">
                        <div className="flex items-center gap-2">
                          <button className="cursor-grab opacity-60 hover:opacity-100" {...listeners}>
                            <GripVertical className="size-4" />
                          </button>
                          <CollapsibleTrigger asChild>
                            <Button size="sm" variant={"ghost"} className="rounded-xl">
                              {chapter.isOpen ? <ChevronDown /> : <ChevronRight />}
                            </Button>
                          </CollapsibleTrigger>

                          <h1 className="capitalize font-semibold pl-2">{chapter.title}</h1>
                        </div>

                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button size="sm" variant={"ghost"} className="rounded-xl">
                              <MoreVertical />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>New Lesson</DropdownMenuItem>
                            <DropdownMenuItem>Edit Chapter</DropdownMenuItem>
                            <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>

                      <CollapsibleContent>
                        <div className="p-1 pl-10">
                          <SortableContext strategy={verticalListSortingStrategy} items={chapter.lessons.map(l => l.id)}>
                            {
                              chapter.lessons.map(lesson => <SortableItem id={lesson.id} data={{ type: "lesson", chapterId: chapter.id }} key={lesson.id}>
                                {
                                  (lessonListeners) => <div className="flex items-center justify-between p-2 hover:bg-accent rounded-sm">
                                    <div className="flex items-center gap-2">
                                      <button className="cursor-grab opacity-60 hover:opacity-100" {...lessonListeners}>
                                        <GripVertical className="size-4" />
                                      </button>
                                      <FileTextIcon className="size-4" />
                                      <Link href={`/admin/courses/${data.id}/${chapter.id}/${lesson.id}`}>{lesson.title}</Link>
                                    </div>

                                    <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                        <Button size="sm" variant={"ghost"} className="rounded-xl">
                                          <MoreVertical />
                                        </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent align="end">
                                        <DropdownMenuItem>Edit</DropdownMenuItem>
                                        <DropdownMenuItem variant="destructive">Delete</DropdownMenuItem>
                                      </DropdownMenuContent>
                                    </DropdownMenu>
                                  </div>
                                }
                              </SortableItem>)
                            }
                          </SortableContext>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </div>}
                </SortableItem>
              ))
            }
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  )
}

export default CourseStructure

