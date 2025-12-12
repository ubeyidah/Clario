import { env } from "@/lib/env"
import { S3 } from "@/lib/s3-client"
import { fileDeleteSchema } from "@/lib/zod-validation"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"

export const DELETE = async (req: Request) => {
  try {
    const body = await req.json()
    const { data, error, success } = fileDeleteSchema.safeParse(body)
    if (!success) return NextResponse.json({ success: false, message: error?.issues[0].message }, { status: 400 })

    const command = new DeleteObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMG,
      Key: data.key
    })

    await S3.send(command);
    return NextResponse.json({ success: true, message: "file deleted successfully" })
  } catch {
    return NextResponse.json({ success: false, message: "internal server error" }, { status: 500 })
  }
}
