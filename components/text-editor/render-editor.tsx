"use client"
import { useMemo } from "react"
import { type JSONContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import TextAlign from "@tiptap/extension-text-align"
import Underline from "@tiptap/extension-underline"
import parse from 'html-react-parser';
import { generateHTML } from "@tiptap/html"

const RenderEditor = ({ json }: { json: JSONContent }) => {
  const outPut = useMemo(() => {
    return generateHTML(json, [StarterKit, TextAlign.configure({
      types: ['heading', 'paragraph'],
    }), Underline.configure({})])
  }, [json])
  return (
    parse(outPut)
  )
}

export default RenderEditor 
