"use client";

import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Laptop,
  Smartphone,
  Globe,
  Clock,
  ShieldAlert,
  Loader2,
  Trash2,
  LogOut,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";

export interface SessionData {
  id: string;
  token: string;
  userId: string;
  expiresAt: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
  ipAddress?: string | null;
  userAgent?: string | null;
  impersonatedBy?: string | null;
}

interface SessionsSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userId: string;
  userName: string;
}

function parseUserAgent(userAgent?: string | null) {
  if (!userAgent) {
    return {
      browser: "Unknown Browser",
      os: "Unknown OS",
      device: "desktop" as const,
      icon: Laptop,
    };
  }

  const ua = userAgent.toLowerCase();

  let browser = "Unknown Browser";
  if (ua.includes("firefox")) {
    browser = "Firefox";
  } else if (ua.includes("edg")) {
    browser = "Edge";
  } else if (ua.includes("chrome")) {
    browser = "Chrome";
  } else if (ua.includes("safari")) {
    browser = "Safari";
  } else if (ua.includes("opera") || ua.includes("opr")) {
    browser = "Opera";
  }

  let os = "Unknown OS";
  let device: "mobile" | "desktop" | "tablet" = "desktop";
  let icon = Laptop;

  if (ua.includes("windows")) {
    os = "Windows";
  } else if (ua.includes("mac os") || ua.includes("macintosh")) {
    os = "macOS";
  } else if (ua.includes("linux")) {
    os = "Linux";
  } else if (ua.includes("android")) {
    os = "Android";
    device = "mobile";
    icon = Smartphone;
  } else if (ua.includes("iphone") || ua.includes("ipad")) {
    os = ua.includes("ipad") ? "iPadOS" : "iOS";
    device = ua.includes("ipad") ? "tablet" : "mobile";
    icon = Smartphone;
  }

  return { browser, os, device, icon };
}

function isSessionActive(expiresAt: Date | string) {
  return new Date(expiresAt) > new Date();
}

function SessionCard({
  session,
  onRevoke,
  isRevoking,
}: {
  session: SessionData;
  onRevoke: (token: string) => void;
  isRevoking: boolean;
}) {
  const { browser, os, icon: DeviceIcon } = parseUserAgent(session.userAgent);
  const active = isSessionActive(session.expiresAt);
  const createdDate = new Date(session.createdAt);
  const expiresDate = new Date(session.expiresAt);

  return (
    <Card className="border border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <DeviceIcon className="size-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm">
                  {browser} on {os}
                </span>
                {session.impersonatedBy && (
                  <Badge variant="outline" className="text-xs border-amber-500/50 text-amber-500">
                    Impersonated
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-0.5">
                <Globe className="size-3" />
                <span>{session.ipAddress || "Unknown IP"}</span>
              </div>
            </div>
          </div>

          <Badge
            variant={active ? "default" : "secondary"}
            className={
              active
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-muted text-muted-foreground"
            }
          >
            {active ? (
              <CheckCircle2 className="size-3 mr-1" />
            ) : (
              <AlertCircle className="size-3 mr-1" />
            )}
            {active ? "Active" : "Expired"}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground pt-1 border-t border-border/40">
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 text-muted-foreground/70" />
            <span>
              Signed in:{" "}
              <strong className="text-foreground/80 font-medium">
                {formatDistanceToNow(createdDate, { addSuffix: true })}
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="size-3 text-muted-foreground/70" />
            <span>
              Expires:{" "}
              <strong className="text-foreground/80 font-medium">
                {format(expiresDate, "MMM d, yyyy")}
              </strong>
            </span>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onRevoke(session.token)}
            disabled={isRevoking}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 h-7 text-xs px-2"
          >
            {isRevoking ? (
              <Loader2 className="size-3 mr-1 animate-spin" />
            ) : (
              <LogOut className="size-3 mr-1" />
            )}
            Revoke Session
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function SessionsSheet({ open, onOpenChange, userId, userName }: SessionsSheetProps) {
  const [sessions, setSessions] = useState<SessionData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRevokingAll, setIsRevokingAll] = useState(false);
  const [revokingIds, setRevokingIds] = useState<Set<string>>(new Set());

  const fetchSessions = React.useCallback(async (targetUserId: string) => {
    setIsLoading(true);
    try {
      const response = await authClient.admin.listUserSessions({ userId: targetUserId });
      if (response && "sessions" in response) {
        setSessions(response.sessions as SessionData[]);
      } else {
        setSessions([]);
      }
    } catch (error) {
      console.error("Failed to fetch sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setIsLoading(false);
    }
  }, []);

  React.useEffect(() => {
    if (open && userId) {
      const timer = setTimeout(() => {
        fetchSessions(userId);
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [open, userId, fetchSessions]);

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSessions([]);
    }
    onOpenChange(isOpen);
  };

  const handleRevoke = async (sessionToken: string) => {
    setRevokingIds(prev => new Set(prev).add(sessionToken));
    try {
      await authClient.admin.revokeUserSession({ sessionToken });
      setSessions(prev => prev.filter(s => s.token !== sessionToken));
      toast.success("Session revoked");
    } catch (error) {
      console.error("Failed to revoke session:", error);
      toast.error("Failed to revoke session");
    } finally {
      setRevokingIds(prev => {
        const next = new Set(prev);
        next.delete(sessionToken);
        return next;
      });
    }
  };

  const handleRevokeAll = async () => {
    setIsRevokingAll(true);
    try {
      await authClient.admin.revokeUserSessions({ userId });
      setSessions([]);
      toast.success("All sessions revoked");
    } catch (error) {
      console.error("Failed to revoke all sessions:", error);
      toast.error("Failed to revoke all sessions");
    } finally {
      setIsRevokingAll(false);
    }
  };

  const activeSessionsCount = sessions.filter(s => isSessionActive(s.expiresAt)).length;

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
        <SheetHeader className="pb-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-primary" />
            Active Sessions
          </SheetTitle>
          <SheetDescription>
            Manage active and expired login sessions for{" "}
            <strong className="text-foreground">{userName}</strong>
          </SheetDescription>

          <div className="flex items-center justify-between pt-2">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Badge variant="outline" className="font-normal">
                Total: {sessions.length}
              </Badge>
              <Badge variant="outline" className="font-normal border-emerald-500/30 text-emerald-600 dark:text-emerald-400">
                Active: {activeSessionsCount}
              </Badge>
            </div>

            {sessions.length > 0 && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="destructive"
                    size="sm"
                    className="h-7 text-xs"
                    disabled={isRevokingAll}
                  >
                    {isRevokingAll ? (
                      <Loader2 className="size-3 mr-1 animate-spin" />
                    ) : (
                      <Trash2 className="size-3 mr-1" />
                    )}
                    Revoke All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Revoke All Sessions?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will sign <strong>{userName}</strong> out of all devices immediately.
                      They will need to sign in again to access the platform.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleRevokeAll}
                      className="bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                    >
                      Revoke All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </SheetHeader>

        <div className="py-4 space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2">
              <Loader2 className="size-6 animate-spin text-primary" />
              <p className="text-sm">Loading sessions...</p>
            </div>
          ) : sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground gap-2 text-center">
              <LogOut className="size-8 text-muted-foreground/40" />
              <p className="text-sm font-medium">No active sessions found</p>
              <p className="text-xs text-muted-foreground/70">
                This user is not currently signed in to any device.
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <SessionCard
                key={session.id || session.token}
                session={session}
                onRevoke={handleRevoke}
                isRevoking={revokingIds.has(session.token)}
              />
            ))
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

