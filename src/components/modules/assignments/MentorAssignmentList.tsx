"use client";

import { useEffect, useState } from "react";
import {
  IconAlertCircle,
  IconClipboardList,
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
import {
  Field,
  FieldLabel,
} from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import MyPagination from "@/components/shared/Pagination";
import { useGetBatches, useGetMentorBatchAssignments } from "@/hooks";
import type { AssignmentStatus } from "@/types";
import StudentAssignmentCard from "./StudentAssignmentCard";

const pageSize = 10;
type AssignmentFilter = AssignmentStatus | "ALL";

export default function MentorAssignmentList() {
  const [batchId, setBatchId] = useState("");
  const [status, setStatus] = useState<AssignmentFilter>("RELEASED");
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

  useEffect(() => {
    if (!batchId && batches.length) {
      setBatchId(batches[0].id);
    }
  }, [batchId, batches]);

  const {
    data: assignmentResponse,
    isPending: assignmentsPending,
    isError: assignmentsError,
    error: assignmentsErrorDetail,
    refetch: refetchAssignments,
    isFetching: assignmentsFetching,
  } = useGetMentorBatchAssignments(
    batchId,
    status === "ALL" ? undefined : status,
    page,
    pageSize,
  );
  const assignments = assignmentResponse?.success
    ? (assignmentResponse.data ?? [])
    : [];
  const totalPages = Math.max(
    1,
    Number(assignmentResponse?.meta?.totalPages) || 1,
  );
  const responseError =
    (batchResponse && !batchResponse.success && batchResponse.message) ||
    (assignmentResponse &&
      !assignmentResponse.success &&
      assignmentResponse.message);
  const errorMessage =
    responseError ||
    (batchesError
      ? batchesErrorDetail instanceof Error
        ? batchesErrorDetail.message
        : "Batches could not be loaded."
      : assignmentsError
        ? assignmentsErrorDetail instanceof Error
          ? assignmentsErrorDetail.message
          : "Assignments could not be loaded."
        : "Assignments could not be loaded. Please try again.");
  const isFetching = batchesFetching || assignmentsFetching;

  useEffect(() => {
    if (assignmentResponse?.success && page > totalPages) {
      setPage(totalPages);
    }
  }, [assignmentResponse?.success, page, totalPages]);

  function handleStatusChange(value: string | null) {
    if (
      value === "ALL" ||
      value === "PENDING" ||
      value === "RELEASED" ||
      value === "ENDED"
    ) {
      setStatus(value);
      setPage(1);
    }
  }

  function handleBatchChange(value: string | null) {
    if (value) {
      setBatchId(value);
      setPage(1);
    }
  }

  function refresh() {
    void refetchBatches();
    if (batchId) void refetchAssignments();
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Mentor workspace
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Batch assignments
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            View assignment details for a batch and track assignment status.
          </p>
        </div>
        <Button
          aria-label="Refresh assignments"
          disabled={isFetching}
          onClick={refresh}
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

      <Card>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="mentor-assignment-batch">Batch</FieldLabel>
            <Select
              items={batches.map((batch) => ({
                label: `${batch.name} (${batch.code})`,
                value: batch.id,
              }))}
              onValueChange={handleBatchChange}
              value={batchId || null}
            >
              <SelectTrigger
                className="w-full"
                disabled={batchesPending || batches.length === 0}
                id="mentor-assignment-batch"
              >
                <SelectValue
                  placeholder={
                    batchesPending ? "Loading batches..." : "Select a batch"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {batches.map((batch) => (
                  <SelectItem key={batch.id} value={batch.id}>
                    {batch.name} ({batch.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </Field>
          <Field>
            <FieldLabel htmlFor="mentor-assignment-status">Status</FieldLabel>
            <Select
              items={[
                { label: "All statuses", value: "ALL" },
                { label: "Pending", value: "PENDING" },
                { label: "Released", value: "RELEASED" },
                { label: "Ended", value: "ENDED" },
              ]}
              onValueChange={handleStatusChange}
              value={status}
            >
              <SelectTrigger
                className="w-full"
                id="mentor-assignment-status"
              >
                <SelectValue placeholder="Choose a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All statuses</SelectItem>
                <SelectItem value="PENDING">Pending</SelectItem>
                <SelectItem value="RELEASED">Released</SelectItem>
                <SelectItem value="ENDED">Ended</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </CardContent>
      </Card>

      {errorMessage && (batchesError || assignmentsError || responseError) ? (
        <Card>
          <CardHeader>
            <div className="flex items-start gap-3">
              <IconAlertCircle
                aria-hidden="true"
                className="mt-0.5 size-5 text-destructive"
              />
              <div className="space-y-1">
                <CardTitle className="text-base">
                  Unable to load assignments
                </CardTitle>
                <CardDescription>{errorMessage}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Button
              disabled={isFetching}
              onClick={refresh}
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
      ) : !batchesPending && batches.length === 0 ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <IconClipboardList aria-hidden="true" className="size-6" />
            </span>
            <h2 className="font-semibold">No batches available</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              There are no batches available to view assignments for.
            </p>
          </CardContent>
        </Card>
      ) : assignmentsPending || batchesPending ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_, index) => (
            <Card key={index}>
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-36" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : assignments.length ? (
        <>
          <section
            aria-label={`${status.toLowerCase()} assignments`}
            className="grid gap-4 lg:grid-cols-2"
          >
            {assignments.map((assignment) => (
              <StudentAssignmentCard
                assignment={assignment}
                canSubmit={false}
                key={assignment.id}
                showSubmissionPrompt={false}
              />
            ))}
          </section>
          <div className="flex justify-end border-t pt-4">
            <MyPagination
              handlePageChange={setPage}
              page={page}
              totalPages={totalPages}
            />
          </div>
        </>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <IconClipboardList aria-hidden="true" className="size-6" />
            </span>
            <h2 className="font-semibold">No assignments found</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              There are no assignments matching the selected batch and status.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
