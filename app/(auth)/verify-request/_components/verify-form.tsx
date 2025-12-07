"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InputOTP, InputOTPGroup, InputOTPSeparator, InputOTPSlot } from "@/components/ui/input-otp";
import { Spinner } from "@/components/ui/spinner";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const VerifyForm = () => {
  const [otp, setOtp] = useState("")
  const [verifyPending, startVerifyTransition] = useTransition()
  const params = useSearchParams()
  const email = params.get("email") as string
  const isCompletedOtp = otp.length === 6

  const router = useRouter()
  const verifyOtp = async () => {
    if (otp.length < 6 || !email) return toast.error("Please enter a valid 6-digit code.")
    startVerifyTransition(async () => {
      await authClient.signIn.emailOtp({
        otp,
        email,
        fetchOptions: {
          onSuccess: () => {
            router.replace("/")
          }
          , onError: () => {
            toast.error("Verification failed. The code may have expired or is incorrect. Please try again.")
          }
        }
      })
    })
  }
  return (

    <Card className="bg-transparent border-none">
      <CardHeader className="text-center">
        <CardTitle>Verify Your <Link href="https://gmail.com" className="text-primary hover:underline">Email</Link></CardTitle>
        <CardDescription>We’ve sent a one-time code (OTP) to your email. Enter it below to complete your sign-in. The code is valid for 5 minutes.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex justify-center">
          <InputOTP maxLength={6} value={otp} onChange={(value) => setOtp(value)}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
            </InputOTPGroup>
          </InputOTP>
        </div>
        <p className="text-center text-sm text-muted-foreground">Didn’t receive the code? Check your spam folder or request a new one.</p>
        <Button className="w-full mt-2" disabled={verifyPending || !isCompletedOtp} onClick={verifyOtp}>
          {
            verifyPending ? <Spinner /> : "Verify OTP"
          }
        </Button>
      </CardContent>
    </Card>
  )
}

export default VerifyForm; 
