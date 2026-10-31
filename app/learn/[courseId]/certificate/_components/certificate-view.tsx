"use client";

import { useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  PrinterIcon,
  Share01Icon,
  ArrowLeft01Icon,
  DashboardSquare01Icon,
  CheckmarkBadge01Icon,
  Award01Icon,
  Clock01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";
import { toast } from "sonner";
import { formatDuration } from "@/lib/utils";

interface CertificateViewProps {
  studentName: string;
  courseTitle: string;
  courseCategory: string;
  courseLevel: string;
  courseDuration: number;
  courseId: string;
  completedAt: string;
  certificateId: string;
}

export function CertificateView({
  studentName,
  courseTitle,
  courseCategory,
  courseLevel,
  courseDuration,
  courseId,
  completedAt,
  certificateId,
}: CertificateViewProps) {
  const certificateRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Certificate verification link copied to clipboard!");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Action Toolbar (Hidden in Print) */}
      <div className="print:hidden flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-card/60 border border-border backdrop-blur-md">
        <div className="flex items-center gap-2">
          <Link
            href={`/learn/${courseId}`}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "rounded-xl gap-1.5 text-xs",
            })}
          >
            <HugeiconsIcon icon={ArrowLeft01Icon} className="size-4" />
            Back to Course
          </Link>
          <Link
            href="/dashboard"
            className={buttonVariants({
              variant: "ghost",
              size: "sm",
              className: "rounded-xl gap-1.5 text-xs",
            })}
          >
            <HugeiconsIcon icon={DashboardSquare01Icon} className="size-4" />
            My Dashboard
          </Link>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="rounded-xl gap-1.5 text-xs"
          >
            <HugeiconsIcon icon={Share01Icon} className="size-4" />
            Share Credential
          </Button>
          <Button
            size="sm"
            onClick={handlePrint}
            className="rounded-xl gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
          >
            <HugeiconsIcon icon={PrinterIcon} className="size-4" />
            Print / Save as PDF
          </Button>
        </div>
      </div>

      {/* Printable Certificate Frame */}
      <div
        ref={certificateRef}
        className="relative mx-auto max-w-4xl w-full aspect-[1.414/1] rounded-3xl border-8 border-double border-amber-600/30 bg-gradient-to-br from-card via-background to-card p-8 md:p-14 shadow-2xl flex flex-col justify-between overflow-hidden print:m-0 print:w-full print:max-w-none print:shadow-none print:border-black print:aspect-[1.414/1]"
      >
        {/* Subtle Decorative Background Watermark */}
        <div className="absolute inset-0 flex items-center justify-center opacity-[0.03] pointer-events-none select-none">
          <HugeiconsIcon icon={Award01Icon} className="size-[450px]" />
        </div>

        {/* Certificate Header */}
        <div className="relative z-10 flex items-center justify-between border-b border-border/60 pb-6">
          <div className="flex items-center gap-3">
            <Image
              src="/clario.png"
              width={48}
              height={48}
              alt="Clario Logo"
              className="rounded-xl shadow-xs"
            />
            <div>
              <h2 className="text-xl font-bold tracking-tight text-foreground font-heading">
                Clario Academy
              </h2>
              <p className="text-[11px] uppercase tracking-widest text-muted-foreground font-semibold">
                Verified Certificate of Achievement
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground block font-mono">
              Credential ID
            </span>
            <span className="text-xs font-mono font-bold text-foreground">
              {certificateId}
            </span>
          </div>
        </div>

        {/* Certificate Body */}
        <div className="relative z-10 text-center my-auto py-6 space-y-4">
          <span className="text-xs md:text-sm uppercase tracking-[0.25em] text-muted-foreground font-semibold">
            This is to certify that
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-foreground font-heading capitalize py-1">
            {studentName}
          </h1>

          <p className="text-xs md:text-sm text-muted-foreground max-w-xl mx-auto leading-relaxed">
            has demonstrated exceptional commitment and successfully satisfied all curriculum requirements, practical exercises, and examinations for
          </p>

          <div className="py-2">
            <h3 className="text-2xl md:text-3xl font-bold text-primary font-heading tracking-tight">
              {courseTitle}
            </h3>
            <div className="flex items-center justify-center gap-2 mt-2">
              <Badge variant="outline" className="text-xs">
                {courseCategory}
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {courseLevel}
              </Badge>
            </div>
          </div>
        </div>

        {/* Certificate Footer & Signatures */}
        <div className="relative z-10 grid grid-cols-3 items-end border-t border-border/60 pt-6 text-xs text-muted-foreground">
          {/* Left: Issue Date & Duration */}
          <div className="space-y-1">
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Calendar01Icon} className="size-3.5 text-muted-foreground" />
              <span>Issued on: <strong className="text-foreground">{completedAt}</strong></span>
            </div>
            <div className="flex items-center gap-1.5">
              <HugeiconsIcon icon={Clock01Icon} className="size-3.5 text-muted-foreground" />
              <span>Total Learning: <strong className="text-foreground">{formatDuration(courseDuration)}</strong></span>
            </div>
          </div>

          {/* Center: Official Seal */}
          <div className="flex flex-col items-center justify-center">
            <div className="size-16 rounded-full border-2 border-amber-600/50 bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 shadow-inner">
              <HugeiconsIcon icon={CheckmarkBadge01Icon} className="size-9" />
            </div>
            <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-bold mt-1">
              Official Seal
            </span>
          </div>

          {/* Right: Academic Director Signature */}
          <div className="text-right space-y-1">
            <div className="border-b border-muted-foreground/40 pb-1 inline-block w-36 text-center font-serif italic text-foreground text-sm">
              Clario Academic Board
            </div>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground block">
              Authorized Signatory
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
