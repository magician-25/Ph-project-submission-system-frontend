"use client";

import {
  IconAlertCircle,
  IconExternalLink,
  IconFileText,
  IconRefresh,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetMySubmissions } from "@/hooks";
import type { Submission } from "@/types";
import { formatDate } from "@/utils";

function SubmissionStatus({ submission }: { submission: Submission }) {
  const statusLabel =
    submission.status === "PENDING"
      ? "Pending review"
      : submission.status === "APPROVED"
        ? "Approved"
        : "Rejected";
  const statusStyle =
    submission.status === "PENDING"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
      : submission.status === "APPROVED"
        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "bg-destructive/10 text-destructive";

  return (
    <span
      className={`w-fit rounded-full px-2.5 py-1 text-xs font-medium ${statusStyle}`}
    >
      {statusLabel}
    </span>
  );
}

function StudentSubmissionCard({
  submission,
}: {
  submission: Submission;
}) {
  const assignment = submission.assignment;
  const isPending = submission.status === "PENDING";

  return (
    <Card>
      <CardHeader className="gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex min-w-0 items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <IconFileText aria-hidden="true" className="size-5" />
          </span>
          <div className="min-w-0 space-y-1">
            <CardTitle className="text-base">
              {assignment?.title ?? "Assignment submission"}
            </CardTitle>
            <CardDescription>
              {assignment?.assignment_number
                ? `Assignment ${assignment.assignment_number}`
                : `Assignment ID: ${submission.assignment_id}`}
              {assignment?.batch
                ? ` · ${assignment.batch.name}`
                : ""}
            </CardDescription>
          </div>
        </div>
        <SubmissionStatus submission={submission} />
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3 rounded-lg border bg-muted/20 p-4 sm:grid-cols-2">
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
              <div className="sm:col-span-2">
                <p className="text-xs text-muted-foreground">Review note</p>
                <p className="mt-1 whitespace-pre-wrap text-sm">
                  {submission.review_note || "No review note provided."}
                </p>
              </div>
            </>
          )}
          {isPending && (
            <p className="self-end text-sm text-muted-foreground">
              Your submission is waiting for review.
            </p>
          )}
        </div>

        <div className="space-y-2">
          <h3 className="text-sm font-medium">Submitted work</h3>
          <p className="whitespace-pre-wrap break-words rounded-lg border p-3 text-sm">
            {submission.user_input}
          </p>
        </div>

        {(assignment?.requirement_doc_url || assignment?.assignment_repo_url) && (
          <div className="flex flex-wrap gap-x-5 gap-y-2 border-t pt-4 text-sm">
            {assignment.requirement_doc_url && (
              <a
                className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                href={assignment.requirement_doc_url}
                rel="noreferrer"
                target="_blank"
              >
                <IconExternalLink aria-hidden="true" className="size-4" />
                Requirement document
              </a>
            )}
            {assignment.assignment_repo_url && (
              <a
                className="inline-flex items-center gap-2 text-muted-foreground underline-offset-4 hover:text-primary hover:underline"
                href={assignment.assignment_repo_url}
                rel="noreferrer"
                target="_blank"
              >
                <IconExternalLink aria-hidden="true" className="size-4" />
                Assignment repository
              </a>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function StudentSubmissionList() {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetMySubmissions();
  const submissions = data?.success ? (data.data ?? []) : [];
  const responseError = data && !data.success ? data.message : undefined;
  const errorMessage =
    responseError ||
    (error instanceof Error
      ? error.message
      : "Your submissions could not be loaded. Please try again.");

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Learning
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            My submissions
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Track your submitted work, review status, marks, and feedback.
          </p>
        </div>
        <Button
          aria-label="Refresh submissions"
          disabled={isFetching}
          onClick={() => void refetch()}
          size="icon"
          type="button"
          variant="outline"
        >
          <IconRefresh
            aria-hidden="true"
            className={isFetching ? "animate-spin" : undefined}
          />
        </Button>
      </header>

      {isPending ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index}>
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : isError || responseError ? (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <IconAlertCircle
                aria-hidden="true"
                className="mt-0.5 size-5 text-destructive"
              />
              <div className="space-y-1">
                <CardTitle className="text-base">
                  Unable to load submissions
                </CardTitle>
                <CardDescription>{errorMessage}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              disabled={isFetching}
              onClick={() => void refetch()}
              type="button"
              variant="outline"
            >
              <IconRefresh
                aria-hidden="true"
                className={isFetching ? "animate-spin" : undefined}
              />
              Try again
            </Button>
          </CardContent>
        </Card>
      ) : submissions.length ? (
        <section
          aria-label="My submissions"
          className="grid gap-4 lg:grid-cols-2"
        >
          {submissions.map((submission) => (
            <StudentSubmissionCard
              key={submission.id}
              submission={submission}
            />
          ))}
        </section>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <IconFileText aria-hidden="true" className="size-6" />
            </span>
            <h2 className="font-semibold">No submissions yet</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Submissions you make for assignments will appear here.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
