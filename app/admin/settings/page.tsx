import { Suspense } from "react";
import { SiteHeader } from "@/components/common/site-header";
import { getSystemHealth } from "@/app/data/admin/get-system-health";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  IconServer,
  IconDatabase,
  IconCreditCard,
  IconCloudUpload,
  IconMail,
  IconShieldLock,
  IconSettings,
  IconCheck,
  IconAlertCircle,
} from "@tabler/icons-react";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  return (
    <main>
      <SiteHeader />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Platform Settings & Health</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Infrastructure diagnostics, cloud service connectivity, and platform configuration.
          </p>
        </div>

        <Suspense fallback={<Skeleton className="h-[400px] w-full rounded-xl" />}>
          <SettingsContent />
        </Suspense>
      </div>
    </main>
  );
}

async function SettingsContent() {
  const health = await getSystemHealth();

  return (
    <div className="space-y-6">
      {/* Infrastructure Diagnostic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* PostgreSQL Database */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconDatabase className="size-4 text-blue-500" />
              PostgreSQL Database
            </CardTitle>
            <Badge
              variant="outline"
              className={
                health.database.status === "healthy"
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-destructive/10 text-destructive border-destructive/20"
              }
            >
              {health.database.status === "healthy" ? (
                <IconCheck className="size-3 mr-1" />
              ) : (
                <IconAlertCircle className="size-3 mr-1" />
              )}
              {health.database.status}
            </Badge>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Query Latency:</span>
              <span className="font-mono font-medium">{health.database.latencyMs}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Total Users:</span>
              <span className="font-mono font-medium">{health.database.totalUsers}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Active Sessions:</span>
              <span className="font-mono font-medium">{health.database.totalSessions}</span>
            </div>
          </CardContent>
        </Card>

        {/* Stripe Gateway */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconCreditCard className="size-4 text-emerald-500" />
              Stripe Payments
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              <IconCheck className="size-3 mr-1" />
              Configured
            </Badge>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Operating Mode:</span>
              <span className="font-medium">{health.stripe.mode}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Billing Currency:</span>
              <span className="font-mono font-medium">{health.stripe.currency}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Webhook Target:</span>
              <span className="font-mono text-muted-foreground">/api/webhook/stripe</span>
            </div>
          </CardContent>
        </Card>

        {/* S3 Storage */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconCloudUpload className="size-4 text-purple-500" />
              S3 / Tigris Storage
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              <IconCheck className="size-3 mr-1" />
              Active
            </Badge>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bucket:</span>
              <span className="font-mono font-medium truncate max-w-[140px]">
                {health.storage.bucket}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Upload Mode:</span>
              <span className="font-medium">Direct Presigned S3</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Asset Types:</span>
              <span>Videos & Thumbnails</span>
            </div>
          </CardContent>
        </Card>

        {/* Resend Email */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconMail className="size-4 text-indigo-500" />
              Resend Mailer
            </CardTitle>
            <Badge
              variant="outline"
              className={
                health.email.configured
                  ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-600 border-amber-500/20"
              }
            >
              {health.email.configured ? "Production" : "Dev Simulation"}
            </Badge>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Provider:</span>
              <span className="font-medium">{health.email.provider}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Sender:</span>
              <span className="font-mono truncate max-w-[150px]">{health.email.sender}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Features:</span>
              <span>OTP Auth & Admin Emails</span>
            </div>
          </CardContent>
        </Card>

        {/* Arcjet Defense */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconShieldLock className="size-4 text-emerald-500" />
              Arcjet Security
            </CardTitle>
            <Badge
              variant="outline"
              className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20"
            >
              <IconCheck className="size-3 mr-1" />
              Protected
            </Badge>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bot Protection:</span>
              <span className="font-medium text-emerald-600">Active</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Rate Limiting:</span>
              <span className="font-medium">5m Sliding & Fixed Window</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Guard Endpoints:</span>
              <span>Course Creation & Edit</span>
            </div>
          </CardContent>
        </Card>

        {/* Server Runtime */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 border-b">
            <CardTitle className="text-sm font-semibold flex items-center gap-2">
              <IconServer className="size-4 text-neutral-500" />
              Next.js Runtime
            </CardTitle>
            <Badge variant="outline">Next.js 16</Badge>
          </CardHeader>
          <CardContent className="pt-3 space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Environment:</span>
              <span className="font-mono font-medium">{health.system.environment}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Node Version:</span>
              <span className="font-mono">{health.system.nodeVersion}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Server Timestamp:</span>
              <span className="text-muted-foreground">
                {new Date(health.system.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Information Card */}
      <Card>
        <CardHeader className="border-b pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <IconSettings className="size-5 text-primary" />
            Platform Defaults & Configuration
          </CardTitle>
          <CardDescription>
            Core configuration settings for Clario Learning Management System
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-sm">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-xs text-muted-foreground block">Platform Title</span>
              <span className="font-semibold text-foreground">Clario LMS</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-xs text-muted-foreground block">Default Currency</span>
              <span className="font-semibold text-foreground">ETB (Ethiopian Birr)</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-xs text-muted-foreground block">Session Adapter</span>
              <span className="font-semibold text-foreground">Better-Auth (Prisma PG)</span>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <span className="text-xs text-muted-foreground block">Admin Access Role</span>
              <span className="font-semibold text-foreground">&quot;admin&quot;</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
