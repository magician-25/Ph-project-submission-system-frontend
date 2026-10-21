"use client";

import { IconSend } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import type { FetchError } from "ofetch";
import { useState } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useCreateSubmission } from "@/hooks";
import { createSubmissionSchema } from "@/schemas";
import type { Assignment } from "@/types";
import { triggerToast } from "@/utils";

export default function AssignmentSubmitDialog({
  assignment,
}: {
  assignment: Assignment;
}) {
  const [open, setOpen] = useState(false);
  const { mutate: createSubmission, isPending } = useCreateSubmission();
  const form = useForm({
    defaultValues: {
      assignmentId: assignment.id,
      userInput: "",
    },
    validators: {
      onSubmit: createSubmissionSchema,
    },
    onSubmit: ({ value }) => {
      createSubmission(value, {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Submission failed",
              description: response.message || "Unable to submit your work.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Assignment submitted",
            description: response.message || "Your work has been submitted.",
          });
          form.reset();
          setOpen(false);
        },
        onError: (error: FetchError) => {
          triggerToast({
            type: "error",
            title: "Unable to submit assignment",
            description:
              error.data?.message || error.message || "Please try again.",
          });
        },
      });
    },
  });

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger
        render={
          <Button type="button">
            <IconSend aria-hidden="true" />
            Submit assignment
          </Button>
        }
      />
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Submit {assignment.title}</DialogTitle>
          <DialogDescription>
            Add the link or details for your assignment submission.
          </DialogDescription>
        </DialogHeader>
        <form
          className="space-y-5"
          onSubmit={(event) => {
            event.preventDefault();
            form.handleSubmit();
          }}
        >
          <form.Field name="userInput">
            {(field) => {
              const isInvalid =
                field.state.meta.isTouched && !field.state.meta.isValid;

              return (
                <Field data-invalid={isInvalid}>
                  <FieldLabel htmlFor={field.name}>
                    Submission link or details
                  </FieldLabel>
                  <Textarea
                    aria-invalid={isInvalid}
                    autoFocus
                    id={field.name}
                    maxLength={10000}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={(event) => field.handleChange(event.target.value)}
                    placeholder="Paste your live link, repository link, or submission details"
                    required
                    rows={5}
                    value={field.state.value}
                  />
                  <p className="text-xs text-muted-foreground">
                    Include the links your reviewer needs to check your work.
                  </p>
                  {isInvalid && <FieldError errors={field.state.meta.errors} />}
                </Field>
              );
            }}
          </form.Field>
          <DialogFooter>
            <Button disabled={isPending} type="submit">
              <IconSend aria-hidden="true" />
              {isPending ? "Submitting..." : "Submit work"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
