"use client"
import { EditorContent, useEditor } from "@tiptap/react"
import starterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import MenuBar from "./menu-bar"

const Editor = ({ value, onChange }: { value: string, onChange: (value: string) => void }) => {
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
    content: value ? JSON.parse(value) : "<p>Write a detail here.....</p>",
  })
  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  )
}

export default Editor
