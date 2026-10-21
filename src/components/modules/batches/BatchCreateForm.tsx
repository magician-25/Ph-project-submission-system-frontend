"use client";

import { IconPlus } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
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
import { useCreateBatch } from "@/hooks";
import { createBatchSchema } from "@/schemas";
import { triggerToast } from "@/utils";

export default function BatchCreateForm() {
  const { mutate: createBatch, isPending } = useCreateBatch();

  const form = useForm({
    defaultValues: {
      name: "",
      code: "",
    },
    validators: {
      onSubmit: createBatchSchema,
    },
    onSubmit: ({ value }) => {
      createBatch(value, {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Batch creation failed",
              description: response.message || "Unable to create this batch.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Batch created",
            description: response.message || "The batch is ready.",
          });
          form.reset();
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Unable to create batch",
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
          <IconPlus aria-hidden="true" className="size-5" />
        </div>
        <CardTitle>Create a batch</CardTitle>
        <CardDescription>
          Add a learning group and give it a unique code.
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
          <form.Field name="name">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Batch name</FieldLabel>
                  <Input
                    autoComplete="off"
                    aria-invalid={isInvalid}
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. Level 1"
                    required
                    value={field.state.value}
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                </Field>
              );
            }}
          </form.Field>

          <form.Field name="code">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Batch code</FieldLabel>
                  <Input
                    autoComplete="off"
                    aria-invalid={isInvalid}
                    className="uppercase"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="e.g. ABC"
                    required
                    value={field.state.value}
                  />
                  {isInvalid && (
                    <FieldError errors={field.state.meta.errors} />
                  )}
                  <p className="text-xs text-muted-foreground">
                    Letters, numbers, spaces, and hyphens are allowed.
                  </p>
                </Field>
              );
            }}
          </form.Field>

          <Button className="w-full" disabled={isPending} type="submit">
            <IconPlus aria-hidden="true" />
            {isPending ? "Creating batch..." : "Create batch"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
