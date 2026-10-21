import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function AdminDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <RoleGuard roles={["ADMIN"]}>
            <DashboardShell>{children}</DashboardShell>
        </RoleGuard>
    );
}
