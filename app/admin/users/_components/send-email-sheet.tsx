"use client";

import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
  SheetFooter,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { IconMail } from "@tabler/icons-react";

interface SendEmailSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userEmail: string;
  userName: string;
}

export function SendEmailSheet({ open, onOpenChange, userEmail, userName }: SendEmailSheetProps) {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [errors, setErrors] = useState<{ subject?: string; message?: string }>({});

  const validate = () => {
    const newErrors: { subject?: string; message?: string } = {};

    if (!subject.trim()) {
      newErrors.subject = "Subject is required";
    } else if (subject.length > 200) {
      newErrors.subject = "Subject must be less than 200 characters";
    }

    if (!message.trim()) {
      newErrors.message = "Message is required";
    } else if (message.length > 5000) {
      newErrors.message = "Message must be less than 5000 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSend = async () => {
    if (!validate()) return;

    setIsPending(true);
    try {
      // Simulate API call - replace with actual API call
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast.success(`Email sent to ${userEmail}`);
      onOpenChange(false);
      setSubject("");
      setMessage("");
      setErrors({});
    } catch (error) {
      console.error("Failed to send email:", error);
      toast.error("Failed to send email. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setSubject("");
      setMessage("");
      setErrors({});
    }
    onOpenChange(isOpen);
  };

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-lg flex flex-col">
        <SheetHeader className="px-6">
          <SheetTitle>Send Email</SheetTitle>
          <SheetDescription>
            Send an email to {userName} ({userEmail})
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 px-6 space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="email">To</Label>
            <Input id="email" value={userEmail} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              placeholder="Enter subject..."
              value={subject}
              onChange={(e) => {
                setSubject(e.target.value);
                if (errors.subject) setErrors({ ...errors, subject: undefined });
              }}
              className={errors.subject ? "border-destructive" : ""}
            />
            {errors.subject && (
              <p className="text-sm text-destructive">{errors.subject}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              placeholder="Write your message..."
              rows={8}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value);
                if (errors.message) setErrors({ ...errors, message: undefined });
              }}
              className={errors.message ? "border-destructive" : ""}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message}</p>
            )}
            <p className="text-xs text-muted-foreground text-right">
              {message.length}/5000
            </p>
          </div>
        </div>

        <SheetFooter className="px-6">
          <Button variant="outline" onClick={() => handleOpenChange(false)} disabled={isPending}>
            Cancel
          </Button>
          <Button onClick={handleSend} disabled={isPending}>
            {isPending ? <Spinner className="mr-2" /> : <IconMail className="mr-2 h-4 w-4" />}
            Send Email
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}