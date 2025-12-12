"use client"
import { type Editor } from "@tiptap/react"

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip"
import { Toggle } from "../ui/toggle"
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Heading1Icon,
  Heading2Icon,
  Heading3Icon,
  Italic,
  ListIcon,
  ListOrdered,
  Redo,
  Strikethrough,
  Underline,
  Undo,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "../ui/button"
import { useEditorState } from "@tiptap/react"

interface iAppProps {
  editor: Editor
}

const MenuBar = ({ editor }: iAppProps) => {

  const state = useEditorState({
    editor,
    selector: (ctx) => ({
      isBold: ctx.editor.isActive("bold"),
      isItalic: ctx.editor.isActive("italic"),
      isStrike: ctx.editor.isActive("strike"),
      isUnderline: ctx.editor.isActive("underline"),

      h1: ctx.editor.isActive("heading", { level: 1 }),
      h2: ctx.editor.isActive("heading", { level: 2 }),
      h3: ctx.editor.isActive("heading", { level: 3 }),

      bullet: ctx.editor.isActive("bulletList"),
      ordered: ctx.editor.isActive("orderedList"),

      left: ctx.editor.isActive({ textAlign: "left" }),
      center: ctx.editor.isActive({ textAlign: "center" }),
      right: ctx.editor.isActive({ textAlign: "right" }),

      canUndo: ctx.editor.can().undo(),
      canRedo: ctx.editor.can().redo(),
    }),
  })

  return (
    <div className="border-b border-input rounded-t-lg p-2 bg-card/60 flex flex-wrap gap-3 items-center">
      <TooltipProvider>
        {/* TEXT STYLING */}
        <div className="flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.isBold}
                onPressedChange={() => editor.chain().focus().toggleBold().run()}
                className={cn(state.isBold && "bg-muted text-muted-foreground")}
              >
                <Bold />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bold</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.isItalic}
                onPressedChange={() =>
                  editor.chain().focus().toggleItalic().run()
                }
                className={cn(
                  state.isItalic && "bg-muted text-muted-foreground"
                )}
              >
                <Italic />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Italic</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.isStrike}
                onPressedChange={() =>
                  editor.chain().focus().toggleStrike().run()
                }
                className={cn(
                  state.isStrike && "bg-muted text-muted-foreground"
                )}
              >
                <Strikethrough />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Strike</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.isUnderline}
                onPressedChange={() =>
                  editor.chain().focus().toggleUnderline().run()
                }
                className={cn(
                  state.isUnderline && "bg-muted text-muted-foreground"
                )}
              >
                <Underline />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Underline</TooltipContent>
          </Tooltip>

          {/* HEADINGS */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.h1}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(state.h1 && "bg-muted text-muted-foreground")}
              >
                <Heading1Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 1</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.h2}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(state.h2 && "bg-muted text-muted-foreground")}
              >
                <Heading2Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 2</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.h3}
                onPressedChange={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(state.h3 && "bg-muted text-muted-foreground")}
              >
                <Heading3Icon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Heading 3</TooltipContent>
          </Tooltip>

          {/* LISTS */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.bullet}
                onPressedChange={() =>
                  editor.chain().focus().toggleBulletList().run()
                }
                className={cn(state.bullet && "bg-muted text-muted-foreground")}
              >
                <ListIcon />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Bullet list</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.ordered}
                onPressedChange={() =>
                  editor.chain().focus().toggleOrderedList().run()
                }
                className={cn(state.ordered && "bg-muted text-muted-foreground")}
              >
                <ListOrdered />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Ordered list</TooltipContent>
          </Tooltip>
        </div>

        {/* SEPARATOR */}
        <div className="w-px h-6 bg-border"></div>

        {/* ALIGNMENT */}
        <div className="flex flex-wrap gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.left}
                onPressedChange={() =>
                  editor.chain().focus().toggleTextAlign("left").run()
                }
                className={cn(state.left && "bg-muted text-muted-foreground")}
              >
                <AlignLeft />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align left</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.center}
                onPressedChange={() =>
                  editor.chain().focus().toggleTextAlign("center").run()
                }
                className={cn(state.center && "bg-muted text-muted-foreground")}
              >
                <AlignCenter />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align center</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Toggle
                size="sm"
                pressed={state.right}
                onPressedChange={() =>
                  editor.chain().focus().toggleTextAlign("right").run()
                }
                className={cn(state.right && "bg-muted text-muted-foreground")}
              >
                <AlignRight />
              </Toggle>
            </TooltipTrigger>
            <TooltipContent>Align right</TooltipContent>
          </Tooltip>
        </div>

        {/* UNDO / REDO */}
        <div className="flex items-center gap-2 ml-auto">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                disabled={!state.canUndo}
                onClick={() => editor.chain().focus().undo().run()}
              >
                <Undo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Undo</TooltipContent>
          </Tooltip>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                type="button"
                disabled={!state.canRedo}
                onClick={() => editor.chain().focus().redo().run()}
              >
                <Redo />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Redo</TooltipContent>
          </Tooltip>
        </div>
      </TooltipProvider>
    </div>
  )
}

export default MenuBar
