"use client";

import { useState, useTransition } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  ComputerIcon,
  SmartPhone01Icon,
  Loading01Icon,
  Delete02Icon,
  Logout01Icon,
  Clock01Icon,
  Location01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { revokeOwnSessionA, revokeOtherSessionsA } from "../actions";

export interface SessionItem {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  createdAt: Date;
  expiresAt: Date;
}

interface ActiveSessionsCardProps {
  sessions: SessionItem[];
  currentSessionId: string;
}

function parseDevice(userAgent: string | null) {
  if (!userAgent) return { type: "desktop", name: "Unknown Device", browser: "Web Browser" };

  const isMobile = /Mobile|Android|iPhone|iPad/i.test(userAgent);
  let browser = "Web Browser";
  if (/Edg/i.test(userAgent)) browser = "Microsoft Edge";
  else if (/Chrome/i.test(userAgent)) browser = "Google Chrome";
  else if (/Firefox/i.test(userAgent)) browser = "Mozilla Firefox";
  else if (/Safari/i.test(userAgent)) browser = "Apple Safari";

  let os = "Desktop";
  if (/Windows/i.test(userAgent)) os = "Windows";
  else if (/Macintosh|Mac OS X/i.test(userAgent)) os = "macOS";
  else if (/Linux/i.test(userAgent)) os = "Linux";
  else if (/iPhone|iPad/i.test(userAgent)) os = "iOS";
  else if (/Android/i.test(userAgent)) os = "Android";

  return {
    type: isMobile ? "mobile" : "desktop",
    name: `${browser} on ${os}`,
    browser,
  };
}

export function ActiveSessionsCard({
  sessions,
  currentSessionId,
}: ActiveSessionsCardProps) {
  const [sessionList, setSessionList] = useState(sessions);
  const [isPending, startTransition] = useTransition();

  const handleRevokeSingle = (sessionId: string) => {
    startTransition(async () => {
      const { data: res, error } = await tryCatch(revokeOwnSessionA(sessionId));
      if (error) {
        toast.error("Failed to revoke session.");
        return;
      }
      if (res?.success) {
        toast.success(res.message);
        setSessionList((prev) => prev.filter((s) => s.id !== sessionId));
      } else {
        toast.error(res?.message || "Failed to revoke session.");
      }
    });
  };

  const handleRevokeAllOthers = () => {
    startTransition(async () => {
      const { data: res, error } = await tryCatch(revokeOtherSessionsA());
      if (error) {
        toast.error("Failed to revoke other sessions.");
        return;
      }
      if (res?.success) {
        toast.success(res.message);
        setSessionList((prev) => prev.filter((s) => s.id === currentSessionId));
      } else {
        toast.error(res?.message || "Failed to revoke other sessions.");
      }
    });
  };

  const otherSessionsCount = sessionList.filter((s) => s.id !== currentSessionId).length;

  return (
    <Card className="bg-card/40 border-border/70 backdrop-blur-md">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-xl font-bold text-foreground">
              Active Sessions & Devices
            </CardTitle>
            <CardDescription>
              Devices currently signed in to your Clario account.
            </CardDescription>
          </div>

          {otherSessionsCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRevokeAllOthers}
              disabled={isPending}
              className="rounded-xl text-xs text-destructive hover:text-destructive border-destructive/30 hover:bg-destructive/10 gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              {isPending ? (
                <HugeiconsIcon icon={Loading01Icon} className="size-3.5 animate-spin" />
              ) : (
                <HugeiconsIcon icon={Logout01Icon} className="size-3.5" />
              )}
              Log Out All Other Devices
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {sessionList.map((session) => {
          const isCurrent = session.id === currentSessionId;
          const device = parseDevice(session.userAgent);
          const createdAtFormatted = new Intl.DateTimeFormat("en-US", {
            month: "short",
            day: "numeric",
            hour: "numeric",
            minute: "2-digit",
          }).format(new Date(session.createdAt));

          return (
            <div
              key={session.id}
              className={`p-4 rounded-2xl border transition-colors flex items-center justify-between gap-4 ${
                isCurrent
                  ? "bg-card border-primary/40 shadow-xs"
                  : "bg-card/20 border-border/60 hover:bg-card/40"
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`size-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isCurrent
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  <HugeiconsIcon
                    icon={device.type === "mobile" ? SmartPhone01Icon : ComputerIcon}
                    className="size-5"
                  />
                </div>

                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {device.name}
                    </p>
                    {isCurrent && (
                      <Badge className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold">
                        Current Device
                      </Badge>
                    )}
                  </div>

                  <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    {session.ipAddress && (
                      <span className="flex items-center gap-1 font-mono">
                        <HugeiconsIcon icon={Location01Icon} className="size-3" />
                        {session.ipAddress}
                      </span>
                    )}
                    <span className="flex items-center gap-1">
                      <HugeiconsIcon icon={Clock01Icon} className="size-3" />
                      Started {createdAtFormatted}
                    </span>
                  </div>
                </div>
              </div>

              {!isCurrent && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRevokeSingle(session.id)}
                  disabled={isPending}
                  className="rounded-xl text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 gap-1.5 shrink-0 cursor-pointer"
                >
                  <HugeiconsIcon icon={Delete02Icon} className="size-3.5" />
                  <span className="hidden sm:inline">Revoke</span>
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
