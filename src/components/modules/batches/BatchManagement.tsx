"use client";

import { IconAlertCircle, IconBooks, IconRefresh } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetBatches } from "@/hooks";
import BatchCard from "./BatchCard";
import BatchCreateForm from "./BatchCreateForm";

export default function BatchManagement() {
  const { data, isPending, isError, error, refetch, isFetching } =
    useGetBatches();
  const batches = data?.success ? data.data : undefined;
  const responseError = data && !data.success ? data.message : undefined;

  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Administration
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Batches</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">
          Create learning groups and keep track of the batches in your
          workspace.
        </p>
      </header>

      <div className="grid items-start gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <section aria-labelledby="batch-list-heading" className="space-y-4">
          <div className="flex items-end justify-between gap-4">
            <div>
              <h2
                className="text-xl font-semibold tracking-tight"
                id="batch-list-heading"
              >
                All batches
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {batches
                  ? `${batches.length} ${batches.length === 1 ? "batch" : "batches"}`
                  : "Batches available to your organization"}
              </p>
            </div>
            <Button
              aria-label="Refresh batches"
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
          </div>

          {isPending ? (
            <div className="grid gap-4 md:grid-cols-2">
              {Array.from({ length: 4 }, (_, index) => (
                <Card key={index}>
                  <CardContent className="space-y-4 p-5">
                    <Skeleton className="h-5 w-2/3" />
                    <Skeleton className="h-4 w-1/2" />
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
                      Unable to load batches
                    </CardTitle>
                    <CardDescription>
                      {responseError ||
                        (error instanceof Error
                          ? error.message
                          : "Please check your connection and try again.")}
                    </CardDescription>
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
          ) : batches?.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {batches.map((batch) => (
                <BatchCard batch={batch} key={batch.id} />
              ))}
            </div>
          ) : (
            <Card className="border-dashed shadow-none">
              <CardContent className="flex min-h-64 flex-col items-center justify-center p-8 text-center">
                <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                  <IconBooks aria-hidden="true" className="size-6" />
                </span>
                <h3 className="font-semibold">No batches yet</h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Create your first batch to organize students into learning
                  groups.
                </p>
              </CardContent>
            </Card>
          )}
        </section>

        <aside aria-label="Create a batch">
          <BatchCreateForm />
        </aside>
      </div>
    </div>
  );
}
