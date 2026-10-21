import { IconExternalLink, IconFileText } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Assignment } from "@/types";
import { formatDate } from "@/utils";

interface AssignmentCardProps {
  assignment: Assignment;
  isUpdating: boolean;
  onStatusChange: (assignment: Assignment, status: "RELEASED" | "ENDED") => void;
}

export default function AssignmentCard({
  assignment,
  isUpdating,
  onStatusChange,
}: AssignmentCardProps) {
  const isPending = assignment.status === "PENDING";
  const canEnd = assignment.status === "RELEASED";
  const statusLabel =
    assignment.status === "ENDED"
      ? "Ended"
      : assignment.status === "RELEASED"
        ? "Released"
        : "Pending";

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <IconFileText aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base">{assignment.title}</CardTitle>
            <CardDescription>
              Assignment {assignment.assignment_number}
              {assignment.batch ? ` · ${assignment.batch.name}` : ""}
            </CardDescription>
          </div>
        </div>
        <span
          className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            assignment.status === "PENDING"
              ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
              : assignment.status === "ENDED"
                ? "bg-muted text-muted-foreground"
                : "bg-primary/10 text-primary"
          }`}
        >
          {statusLabel}
        </span>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2 text-sm">
          <a
            className="inline-flex min-w-0 items-center gap-2 text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            href={assignment.requirement_doc_url}
            rel="noreferrer"
            target="_blank"
          >
            <IconExternalLink aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">Requirement document</span>
          </a>
          <a
            className="inline-flex min-w-0 items-center gap-2 text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
            href={assignment.assignment_repo_url}
            rel="noreferrer"
            target="_blank"
          >
            <IconExternalLink aria-hidden="true" className="size-4 shrink-0" />
            <span className="truncate">Assignment repository</span>
          </a>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
          <p className="text-xs text-muted-foreground">
            {isPending
              ? `Created ${formatDate(assignment.created_at)}`
              : assignment.status === "ENDED"
                ? `Updated ${formatDate(assignment.updated_at)}`
                : `Released ${formatDate(assignment.released_at ?? assignment.updated_at)}`}
          </p>
          {(isPending || canEnd) && (
            <Button
              disabled={isUpdating}
              onClick={() =>
                onStatusChange(assignment, isPending ? "RELEASED" : "ENDED")
              }
              size="sm"
              type="button"
              variant={canEnd ? "outline" : "default"}
            >
              {isUpdating
                ? canEnd
                  ? "Ending..."
                  : "Releasing..."
                : canEnd
                  ? "End assignment"
                  : "Release assignment"}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
