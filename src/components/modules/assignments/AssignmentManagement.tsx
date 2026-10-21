"use client";

import {
  IconAlertCircle,
  IconClipboardList,
  IconPlus,
  IconRefresh,
} from "@tabler/icons-react";
import Link from "next/link";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  useGetBatchAssignments,
  useGetBatches,
  useUpdateAssignmentStatus,
} from "@/hooks";
import type {
  Assignment,
  AssignmentStatus,
  UpdateAssignmentStatusPayload,
} from "@/types";
import { triggerToast } from "@/utils";
import AssignmentCard from "./AssignmentCard";

export default function AssignmentManagement() {
  const [batchId, setBatchId] = useState("");
  const [status, setStatus] = useState<AssignmentStatus>("PENDING");
  const {
    data: batchResponse,
    isPending: batchesPending,
    isError: batchesError,
    error: batchesErrorDetail,
    refetch: refetchBatches,
    isFetching: batchesFetching,
  } = useGetBatches();
  const batches = batchResponse?.success ? (batchResponse.data ?? []) : [];
  const {
    data: assignmentResponse,
    isPending: assignmentsPending,
    isError: assignmentsError,
    error: assignmentsErrorDetail,
    refetch: refetchAssignments,
    isFetching: assignmentsFetching,
  } = useGetBatchAssignments(batchId, status);
  const {
    mutate: updateStatus,
    isPending: isUpdating,
    variables,
  } = useUpdateAssignmentStatus();

  const assignments = assignmentResponse?.success
    ? (assignmentResponse.data ?? [])
    : [];
  const responseError =
    (batchResponse && !batchResponse.success && batchResponse.message) ||
    (assignmentResponse &&
      !assignmentResponse.success &&
      assignmentResponse.message);

  function handleStatusChange(
    assignment: Assignment,
    status: UpdateAssignmentStatusPayload["status"],
  ) {
    updateStatus(
      {
        assignmentId: assignment.id,
        payload: { status },
      },
      {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Assignment status update failed",
              description:
                response.message || "Unable to update this assignment.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title:
              status === "RELEASED"
                ? "Assignment released"
                : "Assignment ended",
            description:
              response.message ||
              (status === "RELEASED"
                ? `${assignment.title} is now available.`
                : `${assignment.title} has ended.`),
          });
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Unable to update assignment",
            description:
              error.data?.message || error.message || "Please try again.",
          });
        },
      },
    );
  }

  const isRefreshing = batchesFetching || assignmentsFetching;
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
        : undefined);

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Administration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Manage assignments
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Review assignments by batch and release them when they are ready.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            aria-label="Refresh assignments"
            disabled={isRefreshing}
            onClick={() => {
              void refetchBatches();
              if (batchId) void refetchAssignments();
            }}
            size="icon"
            type="button"
            variant="outline"
          >
            <IconRefresh
              aria-hidden="true"
              className={isRefreshing ? "animate-spin" : undefined}
            />
          </Button>
          <Link href="/dashboard/admin/assignments/create">
            <Button>
              <IconPlus aria-hidden="true" />
              Create assignment
            </Button>
          </Link>
        </div>
      </header>

      <Card>
        <CardContent className="grid gap-5 p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-end">
          <Field>
            <FieldLabel htmlFor="assignment-batch">Batch</FieldLabel>
            <Select
              items={batches.map((batch) => ({
                label: `${batch.name} (${batch.code})`,
                value: batch.id,
              }))}
              onValueChange={(value) => setBatchId(value ?? "")}
              value={batchId || null}
            >
              <SelectTrigger
                className="w-full"
                disabled={batchesPending || batches.length === 0}
                id="assignment-batch"
              >
                <SelectValue
                  placeholder={
                    batchesPending ? "Loading batches..." : "Select a batch"
                  }
                />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectLabel>Batches</SelectLabel>
                  {batches.map((batch) => (
                    <SelectItem key={batch.id} value={batch.id}>
                      {batch.name} ({batch.code})
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>
          <div className="flex gap-2">
            <Button
              aria-pressed={status === "PENDING"}
              onClick={() => setStatus("PENDING")}
              type="button"
              variant={status === "PENDING" ? "default" : "outline"}
            >
              Pending
            </Button>
            <Button
              aria-pressed={status === "RELEASED"}
              onClick={() => setStatus("RELEASED")}
              type="button"
              variant={status === "RELEASED" ? "default" : "outline"}
            >
              Released
            </Button>
            <Button
              aria-pressed={status === "ENDED"}
              onClick={() => setStatus("ENDED")}
              type="button"
              variant={status === "ENDED" ? "default" : "outline"}
            >
              Ended
            </Button>
          </div>
        </CardContent>
      </Card>

      {errorMessage ? (
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
              disabled={isRefreshing}
              onClick={() => {
                if (batchesError || (batchResponse && !batchResponse.success)) {
                  void refetchBatches();
                }
                if (batchId) void refetchAssignments();
              }}
              type="button"
              variant="outline"
            >
              <IconRefresh
                aria-hidden="true"
                className={isRefreshing ? "animate-spin" : undefined}
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
            <h2 className="font-semibold">Create a batch first</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Assignments are organized by batch. Create a batch before managing
              its assignments.
            </p>
          </CardContent>
        </Card>
      ) : !batchId && !batchesPending ? (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <IconClipboardList aria-hidden="true" className="size-6" />
            </span>
            <h2 className="font-semibold">Choose a batch</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Select a batch above to view its assignments.
            </p>
          </CardContent>
        </Card>
      ) : assignmentsPending ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }, (_) => (
            <Card key={crypto.randomUUID()}>
              <CardContent className="space-y-4 p-5">
                <Skeleton className="h-5 w-2/3" />
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-8 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : assignments.length ? (
        <section
          aria-label={`${status.toLowerCase()} assignments`}
          className="grid gap-4 lg:grid-cols-2"
        >
          {assignments.map((assignment) => (
            <AssignmentCard
              assignment={assignment}
              isUpdating={
                isUpdating && variables?.assignmentId === assignment.id
              }
              key={assignment.id}
              onStatusChange={handleStatusChange}
            />
          ))}
        </section>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-56 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <IconClipboardList aria-hidden="true" className="size-6" />
            </span>
            <h2 className="font-semibold">
              No {status.toLowerCase()} assignments
            </h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              There are no {status.toLowerCase()} assignments in this batch.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
