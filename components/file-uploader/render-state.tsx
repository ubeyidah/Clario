import { cn } from "@/lib/utils"
import { ImageIcon, UploadCloud, UploadCloudIcon, XIcon } from "lucide-react"
import { Button } from "../ui/button"
import Image from "next/image"
import { Progress } from "../ui/progress"

export const RenderEmptyState = ({ isActiveDrag }: { isActiveDrag: boolean }) => {
  return <div className="text-center flex flex-col items-center">
    <div className="mx-atuo size-12 flex items-center justify-center bg-muted rounded-3xl mb-4">
      <UploadCloudIcon className={cn("size-6 text-muted-foreground", isActiveDrag && "text-primary")} />
    </div>
    <p className="text-center text-base text-muted-foreground">Drop your file here or <span className="cursor-pointer text-primary">click to upload</span></p>
    <Button className="mt-4" type="button" size={"sm"} variant={"ghost"}>Select file</Button>
  </div>
}

export const RenderErrorState = () => {
  return <div className="text-center flex flex-col items-center">
    <div className="mx-atuo size-12 flex items-center justify-center bg-destructive/20 rounded-3xl mb-4">
      <ImageIcon className={"size-6 text-destructive"} />
    </div>
    <p className="text-base">File couldn’t be uploaded.</p>
    <p className="text-sm text-muted-foreground">Your upload didn’t complete. Make sure the file is valid <br /> and your network is stable. </p>
    <Button className="mt-4 cursor-pointer" type="button" variant={"destructive"} size={"sm"}>Retry</Button>
  </div>
}


export const RenderUploadedState = ({ previewUrl }: { previewUrl: string }) => {
  return <div>
    <Image src={previewUrl} alt="preivew of uploaded image" fill className="object-contain p-2 rounded-lg" />
    <Button className="absolute top-2 right-2 size-8 p-0 rounded-full border-accent border hover:bg-white" type="button" variant={"ghost"} size={"icon"}>
      <XIcon /> </Button>
  </div>
}


export const RenderUploadingState = ({ progress, fileName }: { progress: number, fileName: string }) => {
  return <div className="flex items-center justify-center w-full max-w-72 text-center flex-col">

    <UploadCloud className="size-9 mb-5" />
    <div className="flex justify-between w-full">

      <p className="text-xs text-foreground">Uploading...</p>
      <p text-xs>{progress}%</p>
    </div>
    <Progress value={progress} className="h-1" />

    <p className="mt-2 text-xs text-muted-foreground truncate">{fileName}</p>
  </div>
}
