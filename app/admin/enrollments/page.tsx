import { SiteHeader } from "@/components/common/site-header";
import { getAdminEnrollments } from "@/app/data/admin/get-admin-enrollments";
import type { EnrollmentListParams } from "@/app/data/admin/get-admin-enrollments";
import { EnrollmentsLedgerClient } from "./_components/enrollments-ledger-client";

interface EnrollmentsPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    page?: string;
  }>;
}

export const dynamic = "force-dynamic";

export default async function EnrollmentsPage({
  searchParams,
}: EnrollmentsPageProps) {
  const resolvedParams = await searchParams;

  const params: EnrollmentListParams = {
    search: resolvedParams.search,
    status: resolvedParams.status as
      | "ACTIVE"
      | "PENDING"
      | "CANCELED"
      | "all"
      | undefined,
    page: resolvedParams.page ? parseInt(resolvedParams.page) : 0,
    pageSize: 25,
  };

  const data = await getAdminEnrollments(params);

  return (
    <main>
      <SiteHeader />
      <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Sales & Enrollments Ledger</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Audit course purchases, transactions, student enrollments, and payment statuses.
          </p>
        </div>

        <EnrollmentsLedgerClient initialData={data} params={params} />
      </div>
    </main>
  );
}
