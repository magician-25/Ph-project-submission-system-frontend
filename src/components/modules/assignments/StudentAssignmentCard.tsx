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
import StudentSubmissionDetailsDialog from "./StudentSubmissionDetailsDialog";

export default function StudentAssignmentCard({
  assignment,
  canSubmit = true,
  showSubmissionPrompt = true,
}: {
  assignment: Assignment;
  canSubmit?: boolean;
  showSubmissionPrompt?: boolean;
}) {
  const submission = assignment.mySubmission;
  const statusLabel = assignment.status === "ENDED" ? "Ended" : "Released";

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
        <span
          className={`w-fit shrink-0 rounded-full px-2.5 py-1 text-xs font-medium ${
            assignment.status === "ENDED"
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
            {assignment.status === "ENDED" ? "Ended" : "Released"}{" "}
            {formatDate(
              assignment.status === "ENDED"
                ? assignment.updated_at
                : (assignment.released_at ?? assignment.updated_at),
            )}
          </p>
          {canSubmit ? (
            submission ? (
              <div className="flex flex-wrap items-center justify-end gap-3">
                {submission.status === "PENDING" ? (
                  <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
                    Pending review
                  </span>
                ) : (
                  <div className="text-right text-xs text-muted-foreground">
                    <p>Mark: {submission.mark ?? "Not provided"}</p>
                    <p className="max-w-56 truncate">
                      Review: {submission.review_note || "No review note"}
                    </p>
                  </div>
                )}
                <StudentSubmissionDetailsDialog assignment={assignment} />
              </div>
            ) : (
              assignment.status === "ENDED" ? (
                <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  Submission closed
                </span>
              ) : (
                <AssignmentSubmitDialog assignment={assignment} />
              )
            )
          ) : (
            showSubmissionPrompt && (
              <p className="text-xs text-muted-foreground">
                Student submissions are reviewed separately.
              </p>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );
}
