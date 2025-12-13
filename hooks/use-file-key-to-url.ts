import { env } from "@/lib/env";

export function useFileKeyToUrl(key: string): string {
  return `https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMG}.t3.storage.dev/${key}`
}
