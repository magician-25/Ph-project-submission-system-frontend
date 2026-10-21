"use client";

import { IconEye } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Assignment } from "@/types";
import { formatDate } from "@/utils";

export default function StudentSubmissionDetailsDialog({
  assignment,
}: {
  assignment: Assignment;
}) {
  const submission = assignment.mySubmission;

  if (!submission) {
    return null;
  }

  const isPending = submission.status === "PENDING";

  return (
    <Dialog>
      <DialogTrigger
        render={
          <Button type="button" variant="outline">
            <IconEye aria-hidden="true" />
            View submission
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Your submission</DialogTitle>
          <DialogDescription>
            {assignment.title} · Assignment {assignment.assignment_number}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Submitted work</h3>
            <p className="max-h-56 overflow-y-auto whitespace-pre-wrap break-words rounded-lg border bg-muted/40 p-3 text-sm">
              {submission.user_input}
            </p>
          </div>
          <div className="grid gap-3 rounded-lg border p-3 sm:grid-cols-2">
            <div>
              <p className="text-xs text-muted-foreground">Status</p>
              <p className="mt-1 text-sm font-medium">
                {isPending
                  ? "Pending review"
                  : submission.status === "APPROVED"
                    ? "Approved"
                    : "Rejected"}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Submitted</p>
              <p className="mt-1 text-sm font-medium">
                {formatDate(submission.created_at)}
              </p>
            </div>
            {!isPending && (
              <>
                <div>
                  <p className="text-xs text-muted-foreground">Mark</p>
                  <p className="mt-1 text-sm font-medium">
                    {submission.mark ?? "Not provided"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Reviewed</p>
                  <p className="mt-1 text-sm font-medium">
                    {submission.reviewed_at
                      ? formatDate(submission.reviewed_at)
                      : "Not available"}
                  </p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs text-muted-foreground">Review note</p>
                  <p className="mt-1 whitespace-pre-wrap text-sm">
                    {submission.review_note || "No review note provided."}
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
