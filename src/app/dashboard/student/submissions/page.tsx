import SectionPlaceholder from "@/components/dashboard/section-placeholder";

export default function SubmissionsPage() {
  return (
    <SectionPlaceholder
      description="Review student work, follow submission status, and provide feedback."
      endpoint="GET /submissions"
      title="Submissions"
    />
  );
}
