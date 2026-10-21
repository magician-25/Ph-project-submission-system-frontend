"use client";

import { useEffect, useState } from "react";
import {
  IconAlertCircle,
  IconCheck,
  IconClockHour4,
  IconFileText,
  IconRefresh,
  IconX,
  type TablerIcon,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetBatches,
  useGetSubmissionStatistics,
  useGetSubmissionsForReview,
} from "@/hooks";
import type { Submission, SubmissionStatus } from "@/types";
import { formatDate } from "@/utils";
import SubmissionReviewDialog from "./SubmissionReviewDialog";

const pageSize = 10;

type ReviewFilter = SubmissionStatus | "ALL";

function StatusBadge({ status }: { status: SubmissionStatus }) {
  const label =
    status === "PENDING"
      ? "Pending"
      : status === "APPROVED"
        ? "Approved"
        : "Rejected";
  const style =
    status === "PENDING"
      ? "bg-amber-500/10 text-amber-700 dark:text-amber-300"
      : status === "APPROVED"
        ? "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300"
        : "bg-destructive/10 text-destructive";

  return (
    <span
      className={`inline-flex w-fit items-center rounded-full px-2.5 py-1 text-xs font-medium ${style}`}
    >
      {label}
    </span>
  );
}

function StatisticCard({
  title,
  value,
  detail,
  icon: Icon,
  isPending,
}: {
  title: string;
  value: number | undefined;
  detail: string;
  icon: TablerIcon;
  isPending: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0 pb-2">
        <CardDescription>{title}</CardDescription>
        <span className="grid size-9 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </CardHeader>
      <CardContent>
        {isPending ? (
          <Skeleton className="h-8 w-16" />
        ) : (
          <p className="text-2xl font-semibold tracking-tight">{value ?? "—"}</p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">{detail}</p>
      </CardContent>
    </Card>
  );
}

function SubmissionTableRow({ submission }: { submission: Submission }) {
  return (
    <tr className="border-b last:border-0">
      <td className="px-4 py-4 align-top">
        <p className="font-medium">{submission.student?.name ?? "Unknown student"}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {submission.student?.email ?? "Email unavailable"}
        </p>
      </td>
      <td className="px-4 py-4 align-top">
        <p className="font-medium">
          Assignment {submission.assignment?.assignment_number ?? "—"}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          {submission.assignment?.batch
            ? `${submission.assignment.batch.name} (${submission.assignment.batch.code})`
            : "Batch unavailable"}
        </p>
      </td>
      <td className="max-w-sm px-4 py-4 align-top">
        <p className="max-h-24 overflow-auto whitespace-pre-wrap break-words text-sm">
          {submission.user_input}
        </p>
      </td>
      <td className="px-4 py-4 align-top">
        <StatusBadge status={submission.status} />
      </td>
      <td className="whitespace-nowrap px-4 py-4 align-top text-sm text-muted-foreground">
        {formatDate(submission.created_at)}
      </td>
      <td className="px-4 py-4 align-top">
        {submission.status === "PENDING" ? (
          <div className="flex flex-wrap gap-2">
            <SubmissionReviewDialog
              status="APPROVED"
              submission={submission}
            />
            <SubmissionReviewDialog
              status="REJECTED"
              submission={submission}
            />
          </div>
        ) : (
          <div className="text-sm">
            <p className="font-medium">
              {submission.status === "APPROVED"
                ? `Mark: ${submission.mark ?? "—"}`
                : "Reviewed"}
            </p>
            {submission.review_note && (
              <p className="mt-1 max-w-48 truncate text-xs text-muted-foreground">
                {submission.review_note}
              </p>
            )}
          </div>
        )}
      </td>
    </tr>
  );
}

export default function MentorReviewDashboard() {
  const [filter, setFilter] = useState<ReviewFilter>("PENDING");
  const [statisticsBatchId, setStatisticsBatchId] = useState("");
  const [page, setPage] = useState(1);
  const {
    data: batchResponse,
    isPending: batchesPending,
    isError: batchesError,
    error: batchesErrorDetail,
    refetch: refetchBatches,
    isFetching: batchesFetching,
  } = useGetBatches();
  const batches = batchResponse?.success ? (batchResponse.data ?? []) : [];
  const query = {
    status: filter === "ALL" ? undefined : filter,
    page,
    limit: pageSize,
  };
  const {
    data: reviewResponse,
    isPending: reviewsPending,
    isError: reviewsError,
    error: reviewsErrorDetail,
    refetch: refetchReviews,
    isFetching: reviewsFetching,
  } = useGetSubmissionsForReview(query);
  const {
    data: statisticsResponse,
    isPending: statisticsPending,
    isError: statisticsError,
    error: statisticsErrorDetail,
    refetch: refetchStatistics,
    isFetching: statisticsFetching,
  } = useGetSubmissionStatistics(statisticsBatchId || undefined);

  const submissions = reviewResponse?.success
    ? (reviewResponse.data ?? [])
    : [];
  const responseError =
    reviewResponse && !reviewResponse.success
      ? reviewResponse.message
      : undefined;
  const statsResponseError =
    statisticsResponse && !statisticsResponse.success
      ? statisticsResponse.message
      : undefined;
  const errorMessage =
    responseError ||
    (reviewsErrorDetail instanceof Error
      ? reviewsErrorDetail.message
      : "Submissions could not be loaded. Please try again.");
  const totalPages = Math.max(
    1,
    Number(reviewResponse?.meta?.totalPages) || 1,
  );
  const totalCount = Number(reviewResponse?.meta?.dataCount) || 0;
  const stats = statisticsResponse?.success
    ? statisticsResponse.data
    : undefined;

  useEffect(() => {
    if (reviewResponse?.success && page > totalPages) {
      setPage(totalPages);
    }
  }, [page, reviewResponse?.success, totalPages]);

  async function refreshDashboard() {
    await Promise.all([refetchReviews(), refetchStatistics(), refetchBatches()]);
  }

  function changeFilter(value: string | null) {
    if (
      value === "ALL" ||
      value === "PENDING" ||
      value === "APPROVED" ||
      value === "REJECTED"
    ) {
      setFilter(value);
      setPage(1);
    }
  }

  const startItem = totalCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Mentor workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Review dashboard
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Review student projects, record marks, and share feedback.
          </p>
        </div>
        <Button
          aria-label="Refresh review dashboard"
          disabled={reviewsFetching || statisticsFetching || batchesFetching}
          onClick={() => void refreshDashboard()}
          size="icon"
          type="button"
          variant="outline"
        >
          <IconRefresh
            aria-hidden="true"
            className={
              reviewsFetching || statisticsFetching
                ? "animate-spin"
                : undefined
            }
          />
        </Button>
      </header>

      {statisticsError || statsResponseError ? (
        <Card className="border-destructive/40">
          <CardContent className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3 text-sm">
              <IconAlertCircle
                aria-hidden="true"
                className="size-5 text-destructive"
              />
              <span>
                {statsResponseError ||
                  (statisticsErrorDetail instanceof Error
                    ? statisticsErrorDetail.message
                    : "Submission statistics could not be loaded.")}
              </span>
            </div>
            <Button
              disabled={statisticsFetching}
              onClick={() => void refetchStatistics()}
              size="sm"
              type="button"
              variant="outline"
            >
              Retry stats
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <section
        aria-label="Submission statistics"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <div className="sm:col-span-2 xl:col-span-4">
          <Select
            items={[
              { label: "All batches", value: "ALL" },
              ...batches.map((batch) => ({
                label: `${batch.name} (${batch.code})`,
                value: batch.id,
              })),
            ]}
            onValueChange={(value) =>
              setStatisticsBatchId(value === "ALL" ? "" : (value ?? ""))
            }
            value={statisticsBatchId || "ALL"}
          >
            <SelectTrigger
              aria-label="Choose batch for submission statistics"
              className="w-full sm:w-72"
              disabled={batchesPending || batchesError}
            >
              <SelectValue
                placeholder={
                  batchesPending ? "Loading batches..." : "Statistics for all batches"
                }
              />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All batches</SelectItem>
              {batches.map((batch) => (
                <SelectItem key={batch.id} value={batch.id}>
                  {batch.name} ({batch.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {batchesError && (
            <p className="mt-2 text-sm text-destructive">
              {batchesErrorDetail instanceof Error
                ? batchesErrorDetail.message
                : "Batch options could not be loaded."}
              {" "}
              <button
                className="underline underline-offset-4"
                onClick={() => void refetchBatches()}
                type="button"
              >
                Retry
              </button>
            </p>
          )}
        </div>
        <StatisticCard
          detail="All student submissions"
          icon={IconFileText}
          isPending={statisticsPending}
          title="Total submissions"
          value={stats?.total}
        />
        <StatisticCard
          detail="Waiting for your review"
          icon={IconClockHour4}
          isPending={statisticsPending}
          title="Total pending"
          value={stats?.pending}
        />
        <StatisticCard
          detail="Successfully approved"
          icon={IconCheck}
          isPending={statisticsPending}
          title="Total approved"
          value={stats?.approved}
        />
        <StatisticCard
          detail="Returned to students"
          icon={IconX}
          isPending={statisticsPending}
          title="Total rejected"
          value={stats?.rejected}
        />
      </section>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Student projects</CardTitle>
            <CardDescription>
              Filter results on the server and review pending submissions.
            </CardDescription>
          </div>
          <Select
            items={[
              { label: "Pending", value: "PENDING" },
              { label: "Approved", value: "APPROVED" },
              { label: "Rejected", value: "REJECTED" },
              { label: "All statuses", value: "ALL" },
            ]}
            onValueChange={changeFilter}
            value={filter}
          >
            <SelectTrigger
              aria-label="Filter submissions by status"
              className="w-full sm:w-48"
            >
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="APPROVED">Approved</SelectItem>
              <SelectItem value="REJECTED">Rejected</SelectItem>
              <SelectItem value="ALL">All statuses</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>
        <CardContent>
          {reviewsPending ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }, (_, index) => (
                <Skeleton className="h-14 w-full" key={index} />
              ))}
            </div>
          ) : reviewsError || responseError ? (
            <div className="flex flex-col items-start gap-4 rounded-lg border border-destructive/30 p-5">
              <div className="flex items-start gap-3">
                <IconAlertCircle
                  aria-hidden="true"
                  className="mt-0.5 size-5 text-destructive"
                />
                <div className="space-y-1">
                  <p className="font-medium">Unable to load submissions</p>
                  <p className="text-sm text-muted-foreground">{errorMessage}</p>
                </div>
              </div>
              <Button
                disabled={reviewsFetching}
                onClick={() => void refetchReviews()}
                type="button"
                variant="outline"
              >
                <IconRefresh
                  aria-hidden="true"
                  className={reviewsFetching ? "animate-spin" : undefined}
                />
                Try again
              </Button>
            </div>
          ) : submissions.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px] border-collapse text-left">
                <thead>
                  <tr className="border-b text-xs uppercase tracking-wide text-muted-foreground">
                    <th className="px-4 py-3 font-medium">Student</th>
                    <th className="px-4 py-3 font-medium">Assignment</th>
                    <th className="px-4 py-3 font-medium">Submitted work</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Submitted</th>
                    <th className="px-4 py-3 font-medium">Actions / result</th>
                  </tr>
                </thead>
                <tbody>
                  {submissions.map((submission: Submission) => (
                    <SubmissionTableRow
                      key={submission.id}
                      submission={submission}
                    />
                  ))}
                </tbody>
              </table>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t pt-4">
                <p className="text-sm text-muted-foreground">
                  Showing {startItem}–{endItem} of {totalCount}
                </p>
                <div className="flex items-center gap-2">
                  <span className="mr-2 text-sm text-muted-foreground">
                    Page {page} of {totalPages}
                  </span>
                  <Button
                    disabled={page <= 1 || reviewsFetching}
                    onClick={() => setPage((current) => current - 1)}
                    type="button"
                    variant="outline"
                  >
                    Previous
                  </Button>
                  <Button
                    disabled={page >= totalPages || reviewsFetching}
                    onClick={() => setPage((current) => current + 1)}
                    type="button"
                    variant="outline"
                  >
                    Next
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
              <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                <IconFileText aria-hidden="true" className="size-6" />
              </span>
              <h2 className="font-semibold">No submissions found</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                There are no {filter === "ALL" ? "" : filter.toLowerCase()}{" "}
                submissions for this filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
