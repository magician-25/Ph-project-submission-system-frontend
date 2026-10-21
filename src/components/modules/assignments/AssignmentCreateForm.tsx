"use client";

import { IconClipboardPlus } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { useCreateAssignment, useGetBatches } from "@/hooks";
import { createAssignmentSchema } from "@/schemas";
import { triggerToast } from "@/utils";

export default function AssignmentCreateForm() {
  const {
    data: batchResponse,
    isPending: batchesPending,
    isError: batchesError,
  } = useGetBatches();
  const batches = batchResponse?.success ? (batchResponse.data ?? []) : [];
  const batchLoadError =
    (batchResponse && !batchResponse.success && batchResponse.message) ||
    (batchesError ? "Batch choices could not be loaded." : undefined);
  const { mutate: createAssignment, isPending } = useCreateAssignment();
  const router = useRouter();

  const form = useForm({
    defaultValues: {
      title: "",
      batchId: "",
      requirementDocUrl: "",
      assignmentRepoUrl: "",
      assignmentNumber: "",
    },
    validators: {
      onSubmit: createAssignmentSchema,
    },
    onSubmit: ({ value }) => {
      const payload = {
        ...value,
        assignmentNumber: Number(value.assignmentNumber),
      };
      createAssignment(payload, {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Assignment creation failed",
              description:
                response.message || "Unable to create this assignment.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Assignment created",
            description: response.message || "The assignment has been created.",
          });
          form.reset();
          router.push(`/dashboard/admin/assignments`);
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Unable to create assignment",
            description:
              error.data?.message || error.message || "Please try again.",
          });
        },
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <div className="mb-1 grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
          <IconClipboardPlus aria-hidden="true" className="size-5" />
        </div>
        <CardTitle>Assignment details</CardTitle>
        <CardDescription>
          Add the assignment details and choose its batch.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="title">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Assignment title</FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="off"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. B12 A7"
                    required
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="batchId">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Batch</FieldLabel>
                  {batchesPending ? (
                    <div className="flex h-10 items-center justify-center rounded-lg border">
                      <Spinner />
                    </div>
                  ) : (
                    <Select
                      items={batches.map((batch) => ({
                        label: `${batch.name} (${batch.code})`,
                        value: batch.id,
                      }))}
                      onValueChange={(value) => field.handleChange(value ?? "")}
                      value={field.state.value || null}
                    >
                      <SelectTrigger
                        aria-invalid={isInvalid}
                        className="w-full"
                        disabled={
                          batches.length === 0 || Boolean(batchLoadError)
                        }
                        id={field.name}
                        onBlur={field.handleBlur}
                      >
                        <SelectValue
                          placeholder={
                            batchLoadError
                              ? "Unable to load batches"
                              : "Select a batch"
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
                  )}
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                  {batchLoadError && (
                    <p className="text-sm text-destructive">
                      {batchLoadError} Refresh and try again.
                    </p>
                  )}
                  {!batchesPending &&
                    !batchLoadError &&
                    batches.length === 0 && (
                      <p className="text-sm text-muted-foreground">
                        Create a batch before adding an assignment.
                      </p>
                    )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="assignmentNumber">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Assignment number
                  </FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    id={field.name}
                    max={9999}
                    min={1}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    required
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="requirementDocUrl">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Requirement document URL
                  </FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="url"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="https://..."
                    required
                    type="url"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="assignmentRepoUrl">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Assignment repository URL
                  </FieldLabel>
                  <Input
                    aria-invalid={isInvalid}
                    autoComplete="url"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="https://github.com/..."
                    required
                    type="url"
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <Button
            className="w-full"
            disabled={
              isPending ||
              batchesPending ||
              Boolean(batchLoadError) ||
              batches.length === 0
            }
            type="submit"
          >
            {isPending && <Spinner />}
            {isPending ? "Creating assignment..." : "Create assignment"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
