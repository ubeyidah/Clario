import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-center min-h-svh">
    <Link href={"/"} className={buttonVariants({ variant: "outline", className: "absolute top-5 left-5 hover:gap-5" })}>
      <ArrowLeft /> Back
    </Link>
    <div className="flex w-full max-w-sm flex-col gap-6">
      <Link href={"/"} className="flex items-center flex-col self-center font-medium">
        <Image src={"/clario.png"} width={60} height={60} alt="clario logo" />
        Clario.
      </Link>
      {children}
      <div className="text-balance text-xs text-muted-foreground text-center">
        By clicking continue, you agree to our <span className="hover:text-primary hover:underline">Terms of service</span> and <span className="hover:text-primary hover:underline">Privacy Policy</span>.
      </div>
    </div>
  </div>
}
