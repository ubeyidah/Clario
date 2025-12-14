"use client"
import { EditorContent, useEditor } from "@tiptap/react"
import starterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import MenuBar from "./menu-bar"
import { cn } from "@/lib/utils"

const Editor = ({ value, onChange, invalid = false }: { value: string, invalid?: boolean, onChange: (value: string) => void }) => {
  const editor = useEditor({
    extensions: [starterKit, TextAlign.configure({
      types: ['heading', 'paragraph'],
    }), Underline.configure({})],
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "min-h-[300px] p-4 focus:outline-none prose prose-sm sm:prose !w-full !max-w-none dark:prose-invert"
      }
    },
    onUpdate: ({ editor }) => {
      onChange(JSON.stringify(editor.getJSON()))
    },
    content: (() => {
      if (!value) return "<p>Write a detail here.....</p>"
      try {
        return JSON.parse(value)
      } catch {
        return "<p>Write a detail here.....</p>"
      }
    })(),

  })
  if (!editor) return null
  return (
    <div className={cn("w-full border border-input rounded-lg overflow-hidden dark:bg-input/30", invalid && "border-destructive")}>
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
