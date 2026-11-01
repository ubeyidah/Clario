import { ReactNode } from "react";
import Navbar from "@/app/(marketing)/_components/navbar";
import Footer from "@/app/(marketing)/_components/footer";
import { requireUser } from "@/app/data/user/require-user";

export default async function ProfileLayout({
  children,
}: {
  children: ReactNode;
}) {
  await requireUser();

  return (
    <div className="min-h-screen flex flex-col justify-between bg-background">
      <Navbar />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
