"use client";

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
import { Skeleton } from "@/components/ui/skeleton";
import { useGetAssignments } from "@/hooks";
import StudentAssignmentCard from "./StudentAssignmentCard";

interface StudentAssignmentListProps {
  roleLabel: "student" | "mentor";
}

export default function StudentAssignmentList({
  roleLabel,
}: StudentAssignmentListProps) {
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetAssignments("RELEASED");
  const assignments = data?.success ? (data.data ?? []) : [];
  const responseError = data && !data.success ? data.message : undefined;
  const errorMessage =
    responseError ||
    (error instanceof Error
      ? error.message
      : "Assignments could not be loaded. Please try again.");

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Learning
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            Assignments
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Released assignments for your batch.
          </p>
        </div>
        <Button
          aria-label="Refresh assignments"
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
                <Skeleton className="h-8 w-36" />
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
                  Unable to load assignments
                </CardTitle>
                <CardDescription>{errorMessage}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {roleLabel === "mentor" && (
              <p className="text-sm text-muted-foreground">
                The current assignments endpoint only grants access to students.
                Ask an administrator to enable mentor access.
              </p>
            )}
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
      ) : assignments.length ? (
        <section
          aria-label="Released assignments"
          className="grid gap-4 lg:grid-cols-2"
        >
          {assignments.map((assignment) => (
            <StudentAssignmentCard
              assignment={assignment}
              canSubmit={roleLabel === "student"}
              key={assignment.id}
            />
          ))}
        </section>
      ) : (
        <Card className="border-dashed shadow-none">
          <CardContent className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
            <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
              <IconClipboardList
                aria-hidden="true"
                className="size-6"
              />
            </span>
            <h2 className="font-semibold">No released assignments</h2>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              New assignments will appear here after they are released for your
              batch.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
