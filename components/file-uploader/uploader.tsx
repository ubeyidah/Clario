"use client"
import { useCallback, useState } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'
import { Card, CardContent } from '../ui/card'
import { cn } from '@/lib/utils'
import { RenderEmptyState, RenderErrorState, RenderUploadedState, RenderUploadingState } from './render-state'
import { toast } from 'sonner'
import { v4 as uuidv4 } from "uuid"

interface UploaderState {
  id: string | null,
  file: File | null,
  uploading: boolean,
  progress: number,
  key?: string | null,
  isDeleting: boolean,
  error: boolean,
  objectUrl?: string | null,
  imageType: "image" | "video"
}

interface iAppProps {
  value: string,
  onChange: (value: string) => void
}

const maxFileSize = 5 * 1024 * 1024 // 5MB
const Uploader = ({ value, onChange }: iAppProps) => {
  const [fileState, setFileState] = useState<UploaderState>({
    error: false,
    file: null,
    id: null,
    imageType: "image",
    isDeleting: false,
    progress: 0,
    objectUrl: null,
    key: value,
    uploading: false
  })

  async function uploadFile(file: File) {
    setFileState(prev => ({ ...prev, progress: 0, uploading: true }))
    try {
      const presignedUrlResponse = await fetch('/api/s3/upload', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          fileName: file.name,
          size: file.size,
          contentType: file.type,
          isImage: true
        })
      })
      if (!presignedUrlResponse.ok) {
        toast.error("Failed to get upload URL.")
        setFileState(prev => ({ ...prev, error: true, uploading: false, progress: 0 }))
        return
      }
      const {
        data: {
          presignedUrl,
          key
        }

      } = await presignedUrlResponse.json()

      await new Promise<void>((res, rej) => {
        const xhr = new XMLHttpRequest()
        xhr.upload.onprogress = ((event) => {
          if (event.lengthComputable) {
            const percent = event.loaded / event.total * 100;
            setFileState(prev => ({ ...prev, progress: Math.round(percent) }))
          }
        })

        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) {
            setFileState(prev => ({ ...prev, progress: 100, uploading: false, key }))
            onChange(key)
            console.log(value + "from the key")
            toast.success("File uploaded successfully.")
            res()
          } else {
            rej(new Error("failed to upload"))
          }
        }

        xhr.onerror = () => {
          rej(new Error("failed to upload."))
        }

        xhr.open("PUT", presignedUrl)
        xhr.setRequestHeader("Content-Type", file.type)
        xhr.send(file)

      })
    } catch {
      toast.error("An error occurred during file upload. try again")
      setFileState(prev => ({ ...prev, error: true, uploading: false, progress: 0 }))
    }
  }

  const handleRemoveFile = async () => {
    if (fileState.isDeleting || !fileState.objectUrl) return
    try {
      setFileState(prev => ({ ...prev, isDeleting: true }))
      const res = await fetch("/api/s3/delete", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ key: fileState.key })
      })

      if (!res.ok) {
        toast.error("Failed to delete the file. Please try again.")
        setFileState(prev => ({ ...prev, isDeleting: false, error: true }))
        return;
      }

      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl) // reset past url object to prevent from memory leak
      }
      onChange("")

      setFileState({
        error: false,
        file: null,
        id: null,
        imageType: "image",
        isDeleting: false,
        progress: 0,
        objectUrl: null,
        key: value,
        uploading: false
      })

      toast.success("File deleted successfully.")
    } catch {
      toast.error("An error occurred while deleting the file. Please try again.")
      setFileState(prev => ({ ...prev, isDeleting: false, error: true }))
    }
  }

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length) {
      const file = acceptedFiles[0]
      if (fileState.objectUrl && !fileState.objectUrl.startsWith("http")) {
        URL.revokeObjectURL(fileState.objectUrl) // reset past url object to prevent from memory leak
      }
      setFileState({ file, objectUrl: URL.createObjectURL(file), id: uuidv4(), progress: 0, uploading: false, error: false, imageType: "image", isDeleting: false, key: null })
      uploadFile(file)
    }
  }, [fileState.objectUrl])

  const rejectedFiles = (fileRejection: FileRejection[]) => {
    if (fileRejection.length) {
      const tooManyFiles = fileRejection.find(rejection => rejection.errors[0].code === "too-many-files")
      const fileTooLarge = fileRejection.find(rejection => rejection.errors[0].code === "file-too-large")
      const nonImageFile = fileRejection.find(rejection => rejection.errors[0].code === "file-invalid-type")
      if (tooManyFiles) {
        toast.error("You can only upload one file at a time.")
      }
      if (fileTooLarge) {
        toast.error("File is too large. Maximum size is 5MB.")
      }
      if (nonImageFile) {
        toast.error("Invalid file type. Please upload an image file.")
      }
    }
  }
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] }, maxFiles: 1, multiple: false, maxSize: maxFileSize, onDropRejected: rejectedFiles, disabled: !!fileState.objectUrl || fileState.uploading })

  function renderContnet() {
    if (fileState.uploading) {
      return <RenderUploadingState fileName={fileState.file?.name as string} progress={fileState.progress} />
    }
    if (fileState.error) {
      return <RenderErrorState />
    }
    if (fileState.objectUrl) {
      return <RenderUploadedState previewUrl={fileState.objectUrl} handleRemoveFile={handleRemoveFile} isDeleting={fileState.isDeleting} />
    }
    return <RenderEmptyState isActiveDrag={isDragActive} />
  }
  return (
    <Card {...getRootProps()} className={cn("relative border-2 bg-input/20 p-4 border-dashed transition-colors duration-200 ease-in-out w-full h-64", isDragActive ? "border-green-500 bg-green-500/5" : "border-border hover:border-primary")}>
      <CardContent className='flex items-center justify-center h-full w-full'>
        <input {...getInputProps()} />
        {renderContnet()}
      </CardContent>
    </Card>
  )
}

export default Uploader;
