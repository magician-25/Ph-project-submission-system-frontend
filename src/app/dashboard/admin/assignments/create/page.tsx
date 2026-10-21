import { IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import AssignmentCreateForm from "@/components/modules/assignments/AssignmentCreateForm";
import { Button } from "@/components/ui/button";
import { CardDescription } from "@/components/ui/card";

export default function CreateAssignmentPage() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-7">
      <header className="space-y-3">
        <Link href="/dashboard/admin/assignments">
          <Button className="-ml-4 mb-2" variant="ghost">
            <IconArrowLeft aria-hidden="true" />
            Manage assignments
          </Button>
        </Link>
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Administration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Create assignment
          </h1>
          <CardDescription className="max-w-2xl">
            Add an assignment to a batch. New assignments start as pending and
            can be released from the management page.
          </CardDescription>
        </div>
      </header>

      <AssignmentCreateForm />
    </div>
  );
}
