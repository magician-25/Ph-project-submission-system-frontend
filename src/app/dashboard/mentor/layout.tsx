import type { ReactNode } from "react";
import RoleGuard from "@/components/authentication/role-guard";
import DashboardShell from "@/components/dashboard/dashboard-shell";

export default function MentorDashboardLayout({
    children,
}: {
    children: ReactNode;
}) {
    return (
        <RoleGuard roles={["MENTOR"]}>
            <DashboardShell>{children}</DashboardShell>
        </RoleGuard>
    );
}
