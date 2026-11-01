"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  LockPasswordIcon,
  Loading01Icon,
  Tick01Icon,
  Shield01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { authClient } from "@/lib/auth-client";

interface PasswordChangeFormProps {
  providers: string[];
}

export function PasswordChangeForm({ providers }: PasswordChangeFormProps) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [revokeOtherSessions, setRevokeOtherSessions] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasCredentialLogin = providers.includes("credential") || providers.length === 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentPassword) {
      toast.error("Please enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      toast.error("New password must be at least 8 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("New passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword,
        newPassword,
        revokeOtherSessions,
      });

      if (error) {
        toast.error(error.message || "Failed to update password. Please check your current password.");
        return;
      }

      toast.success("Password updated successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error changing password";
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="bg-card/40 border-border/70 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Security & Password
            </CardTitle>
            <CardDescription>
              Manage your account credentials and authentication methods.
            </CardDescription>
          </div>
          <div className="flex items-center gap-1.5">
            {providers.map((p) => (
              <Badge key={p} variant="secondary" className="capitalize text-xs font-mono">
                {p}
              </Badge>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {hasCredentialLogin ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <div className="relative">
                <Input
                  id="currentPassword"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 rounded-xl"
                  required
                />
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <div className="relative">
                <Input
                  id="newPassword"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  className="pl-9 rounded-xl"
                  minLength={8}
                  required
                />
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat new password"
                  className="pl-9 rounded-xl"
                  minLength={8}
                  required
                />
                <HugeiconsIcon
                  icon={LockPasswordIcon}
                  className="size-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
              </div>
            </div>

            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="revokeOthers"
                checked={revokeOtherSessions}
                onCheckedChange={(checked) => setRevokeOtherSessions(!!checked)}
              />
              <label
                htmlFor="revokeOthers"
                className="text-xs text-muted-foreground leading-none cursor-pointer select-none"
              >
                Log out of all other devices after changing password
              </label>
            </div>

            <div className="pt-2">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="rounded-xl gap-2 font-medium shadow-sm"
              >
                {isSubmitting ? (
                  <HugeiconsIcon icon={Loading01Icon} className="size-4 animate-spin" />
                ) : (
                  <HugeiconsIcon icon={Tick01Icon} className="size-4" />
                )}
                Update Password
              </Button>
            </div>
          </form>
        ) : (
          <div className="p-4 rounded-2xl bg-muted/40 border border-border/60 flex items-start gap-3">
            <HugeiconsIcon icon={Shield01Icon} className="size-5 text-primary shrink-0 mt-0.5" />
            <div className="space-y-1 text-xs">
              <p className="font-semibold text-foreground">
                External Identity Provider
              </p>
              <p className="text-muted-foreground">
                Your account is authenticated through a social login provider ({providers.join(", ")}). Password management is handled by your identity provider.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
