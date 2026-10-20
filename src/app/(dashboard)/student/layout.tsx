import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function StudentDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <RoleGuard roles={["STUDENT"]}>
            <DashboardShell>{children}</DashboardShell>
        </RoleGuard>
    );
}
