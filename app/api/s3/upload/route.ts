import { env } from "@/lib/env"
import { S3 } from "@/lib/s3-client"
import { fileUploadSchema } from "@/lib/zod-validation"
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { NextResponse } from "next/server"
import { v4 as uuidv4 } from "uuid"
import { getSignedUrl } from "@aws-sdk/s3-request-presigner"
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet"
import { requireAdmin } from "@/app/data/admin/require-admin"

// SECUIRITY
const aj = arcjet.withRule(detectBot({
  mode: "LIVE",
  allow: []
})).withRule(fixedWindow({
  mode: "LIVE",
  window: "1m",
  max: 5
})) // in 1 minute max 5 requests

const EXPIRES_IN = 360 // url expiresIn 6 min
export const POST = async (req: Request) => {
  const session = await requireAdmin()
  try {
    const decision = await aj.protect(req, {
      fingerprint: session.user.id
    });

    if (decision.isDenied()) {
      if (decision.reason.isBot()) {
        return NextResponse.json(
          { success: false, message: "We detected automated or unusual activity." },
          { status: 403 },
        );
      } else if (decision.reason.isRateLimit()) {
        return NextResponse.json(
          { success: false, message: "Please wait a few seconds before trying again." },
          { status: 429 })
      } else {
        return NextResponse.json(
          { success: false, message: "Forbidden" },
          { status: 403 },
        );
      }
    }

    const body = await req.json()
    const { error, success, data } = fileUploadSchema.safeParse(body)
    if (!success) return NextResponse.json({ success: false, message: error?.issues[0].message }, { status: 400 })
    const uniqeKey = `${uuidv4()}-${data?.fileName}`
    const command = new PutObjectCommand({
      Bucket: env.NEXT_PUBLIC_S3_BUCKET_NAME_IMG,
      Key: uniqeKey,
      ContentType: data.contentType,
      ContentLength: data.size
    })
    const presignedUrl = await getSignedUrl(S3, command, { expiresIn: EXPIRES_IN })
    const response = {
      success: true,
      message: "presigned url generated",
      data: {
        presignedUrl,
        key: uniqeKey
      }
    }
    return NextResponse.json(response)
  } catch {
    return NextResponse.json({ success: false, message: "internal server error" }, { status: 500 })
  }
}
