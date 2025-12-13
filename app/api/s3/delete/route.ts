import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { env } from "@/lib/env"
import { S3 } from "@/lib/s3-client"
import { fileDeleteSchema } from "@/lib/zod-validation"
import { DeleteObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"


// SECUIRITY
const aj = arcjet.withRule(detectBot({
  mode: "LIVE",
  allow: []
})).withRule(fixedWindow({
  mode: "LIVE",
  window: "1m",
  max: 5
})) // in 1 minute max 5 requests

export const DELETE = async (req: Request) => {
  try {
    const decision = await aj.protect(req, {
      fingerprint: "lksfj"
    });

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return NextResponse.json(
          { success: false, message: "We detected automated or unusual activity.", reason: decision.reason },
          { status: 403 },
        );
      } else if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { success: false, message: "Please wait a few seconds before trying again.", reason: decision.reason },
          { status: 429 })
      } else {
        return NextResponse.json(
          { success: "Forbidden", reason: decision.reason },
          { status: 403 },
        );
      }
    }
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
