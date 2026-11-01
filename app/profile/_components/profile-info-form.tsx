"use client";

import { useState, useTransition, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Camera01Icon,
  Loading01Icon,
  Tick01Icon,
  UserIcon,
  Delete02Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { updateProfileA } from "../actions";

interface ProfileInfoFormProps {
  initialName: string;
  initialImage: string | null;
  email: string;
}

export function ProfileInfoForm({
  initialName,
  initialImage,
  email,
}: ProfileInfoFormProps) {
  const [name, setName] = useState(initialName);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImage);
  const [isUploading, setIsUploading] = useState(false);
  const [isPending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fallbackImage = `https://avatar.vercel.sh/${name || "Student"}?rounded=60`;

  const handleAvatarFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image file (PNG, JPG, WebP).");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("Image size must be less than 5MB.");
      return;
    }

    setIsUploading(true);
    try {
      // 1. Request presigned upload URL from S3 API
      const presignedRes = await fetch("/api/s3/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fileName: file.name,
          contentType: file.type,
          size: file.size,
          isImage: true,
        }),
      });

      if (!presignedRes.ok) {
        throw new Error("Failed to prepare upload destination.");
      }

      const { url, key } = await presignedRes.json();

      // 2. Direct upload to S3 / Tigris storage
      const uploadRes = await fetch(url, {
        method: "PUT",
        headers: { "Content-Type": file.type },
        body: file,
      });

      if (!uploadRes.ok) {
        throw new Error("Failed to upload image file to storage.");
      }

      const finalUrl = `https://clario.t3.storage.dev/${key}`;
      setImageUrl(finalUrl);
      toast.success("Avatar uploaded. Save changes to finalize.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error uploading avatar";
      toast.error(msg);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveAvatar = () => {
    setImageUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty.");
      return;
    }

    startTransition(async () => {
      const { data: res, error } = await tryCatch(
        updateProfileA({
          name: name.trim(),
          image: imageUrl,
        })
      );

      if (error) {
        toast.error("Failed to update profile.");
        return;
      }

      if (res?.success) {
        toast.success(res.message);
      } else {
        toast.error(res?.message || "Failed to update profile.");
      }
    });
  };

  return (
    <Card className="bg-card/40 border-border/70 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-foreground">
          Personal Information
        </CardTitle>
        <CardDescription>
          Update your public profile details and profile picture.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar Edit Section */}
          <div className="space-y-3">
            <Label className="text-xs font-semibold uppercase text-muted-foreground">
              Profile Photo
            </Label>
            <div className="flex flex-col sm:flex-row items-center gap-5">
              <div className="relative size-20 rounded-2xl overflow-hidden border border-border shadow-xs shrink-0">
                <Image
                  src={imageUrl || fallbackImage}
                  alt={name || "User Avatar"}
                  fill
                  className="object-cover"
                />
                {isUploading && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white">
                    <HugeiconsIcon icon={Loading01Icon} className="size-6 animate-spin" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/gif"
                  className="hidden"
                  onChange={handleAvatarFileChange}
                  disabled={isUploading || isPending}
                />

                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading || isPending}
                  className="rounded-xl gap-2 text-xs font-medium cursor-pointer"
                >
                  <HugeiconsIcon icon={Camera01Icon} className="size-4" />
                  {isUploading ? "Uploading..." : "Change Photo"}
                </Button>

                {imageUrl && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleRemoveAvatar}
                    disabled={isUploading || isPending}
                    className="rounded-xl gap-1.5 text-xs text-destructive hover:text-destructive cursor-pointer"
                  >
                    <HugeiconsIcon icon={Delete02Icon} className="size-4" />
                    Remove
                  </Button>
                )}
              </div>
            </div>
            <p className="text-[11px] text-muted-foreground">
              Recommended: Square JPG, PNG, or WebP. Max 5MB.
            </p>
          </div>

          {/* Name Field */}
          <div className="space-y-2">
            <Label htmlFor="displayName" className="text-sm font-medium">
              Display Name
            </Label>
            <div className="relative">
              <Input
                id="displayName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your full name"
                className="pl-9 rounded-xl"
                maxLength={50}
                required
              />
              <HugeiconsIcon
                icon={UserIcon}
                className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
            </div>
          </div>

          {/* Email (Readonly) */}
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              value={email}
              readOnly
              disabled
              className="rounded-xl bg-muted/40 cursor-not-allowed opacity-80"
            />
            <p className="text-[11px] text-muted-foreground">
              Email address cannot be changed directly as it is bound to your account credentials.
            </p>
          </div>

          {/* Submit Action */}
          <div className="pt-2">
            <Button
              type="submit"
              disabled={isPending || isUploading}
              className="rounded-xl gap-2 font-medium shadow-sm"
            >
              {isPending ? (
                <HugeiconsIcon icon={Loading01Icon} className="size-4 animate-spin" />
              ) : (
                <HugeiconsIcon icon={Tick01Icon} className="size-4" />
              )}
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
