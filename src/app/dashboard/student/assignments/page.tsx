import SectionPlaceholder from "@/components/dashboard/section-placeholder";

export default function AssignmentsPage() {
  return (
    <SectionPlaceholder
      description="Create assignments, set deadlines, and keep course work organized."
      endpoint="GET /assignments"
      title="Assignments"
    />
  );
}
