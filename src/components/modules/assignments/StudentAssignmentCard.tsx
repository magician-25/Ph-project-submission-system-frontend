import { IconExternalLink, IconFileText } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Assignment } from "@/types";
import { formatDate } from "@/utils";
import AssignmentSubmitDialog from "./AssignmentSubmitDialog";

export default function StudentAssignmentCard({
  assignment,
  canSubmit = true,
}: {
  assignment: Assignment;
  canSubmit?: boolean;
}) {
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
            </CardDescription>
          </div>
        </div>
        <span className="w-fit shrink-0 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
          Released
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
            Released{" "}
            {formatDate(assignment.released_at ?? assignment.updated_at)}
          </p>
          {canSubmit ? (
            <AssignmentSubmitDialog assignment={assignment} />
          ) : (
            <p className="text-xs text-muted-foreground">
              Student submissions are reviewed separately.
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
