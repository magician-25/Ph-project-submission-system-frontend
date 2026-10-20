import RoleGuard from "@/components/authentication/role-guard";
import SectionPlaceholder from "@/components/dashboard/section-placeholder";

export default function BatchesPage() {
  return (
    <RoleGuard roles={["ADMIN"]}>
      <SectionPlaceholder
        description="Organize your classes and see the students assigned to each learning group."
        endpoint="GET /batches"
        title="Batches"
      />
    </RoleGuard>
  );
}
