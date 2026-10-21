"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import type { FetchError } from "ofetch";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useReviewSubmission } from "@/hooks";
import { reviewSubmissionSchema } from "@/schemas";
import type {
  ReviewSubmissionPayload,
  Submission,
} from "@/types";
import { triggerToast } from "@/utils";

type ReviewStatus = ReviewSubmissionPayload["status"];

interface ReviewFormValues {
  status: ReviewStatus;
  mark: number | null;
  reviewNote: string;
}

export default function SubmissionReviewDialog({
  submission,
  status,
}: {
  submission: Submission;
  status: ReviewStatus;
}) {
  const [open, setOpen] = useState(false);
  const { mutate: reviewSubmission, isPending } = useReviewSubmission();
  const isApproval = status === "APPROVED";
  const defaultValues: ReviewFormValues = {
    status,
    mark: null,
    reviewNote: "",
  };
  const form = useForm({
    defaultValues,
    validators: {
      onSubmit: reviewSubmissionSchema,
    },
    onSubmit: ({ value }) => {
      const payload: ReviewSubmissionPayload = {
        status: value.status,
        mark: value.mark ?? undefined,
        reviewNote: value.reviewNote.trim() || undefined,
      };

      reviewSubmission(
        {
          submissionId: submission.id,
          payload,
        },
        {
          onSuccess: (response) => {
            if (!response.success) {
              triggerToast({
                type: "error",
                title: "Review failed",
                description: response.message || "Unable to review submission.",
              });
              return;
            }

            triggerToast({
              type: "success",
              title: isApproval ? "Submission approved" : "Submission rejected",
              description:
                response.message ||
                `The submission has been ${status.toLowerCase()}.`,
            });
            form.reset();
            setOpen(false);
          },
          onError: (error: FetchError) => {
            triggerToast({
              type: "error",
              title: "Unable to review submission",
              description:
                error.data?.message || error.message || "Please try again.",
            });
          },
        },
      );
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button
            size="sm"
            type="button"
            variant={isApproval ? "default" : "destructive"}
          >
            {isApproval ? (
              <IconCheck aria-hidden="true" />
            ) : (
              <IconX aria-hidden="true" />
            )}
            {isApproval ? "Approve" : "Reject"}
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {isApproval ? "Approve submission" : "Reject submission"}
          </DialogTitle>
          <DialogDescription>
            {submission.student?.name ?? "Student"} · Assignment{" "}
            {submission.assignment?.assignment_number ?? ""}
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          {isApproval && (
            <form.Field name="mark">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor={field.name}>Mark (0–60)</FieldLabel>
                    <Input
                      aria-invalid={isInvalid}
                      id={field.name}
                      max={60}
                      min={0}
                      name={field.name}
                      onBlur={field.handleBlur}
                      onChange={(event) => {
                        const value = event.currentTarget.value;
                        field.handleChange(
                          value === "" ? null : Number(value),
                        );
                      }}
                      required
                      step={1}
                      type="number"
                      value={field.state.value ?? ""}
                    />
                    {isInvalid && (
                      <FieldError errors={field.state.meta.errors} />
                    )}
                  </Field>
                );
              }}
            </form.Field>
          )}

          <form.Field name="reviewNote">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>Review note</FieldLabel>
                  <Textarea
                    aria-invalid={isInvalid}
                    id={field.name}
                    maxLength={2000}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder={
                      isApproval
                        ? "Share feedback for the student (optional)"
                        : "Explain why the submission was rejected (optional)"
                    }
                    rows={4}
                    value={field.state.value}
                  />
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>

          <DialogFooter>
            <Button disabled={isPending} type="submit">
              {isPending
                ? "Saving review..."
                : isApproval
                  ? "Confirm approval"
                  : "Confirm rejection"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
