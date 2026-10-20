"use client";

import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRegisterStudent } from "@/hooks";
import { useGetBatches } from "@/hooks/batch.hook";
import { registerStudentSchema } from "@/schemas";
import { triggerToast } from "@/utils";
import { Field, FieldError, FieldLabel } from "../ui/field";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

export default function RegisterForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerStudent, isPending: studentPending } =
    useRegisterStudent();
  const {
    data: batchesData,
    isLoading,
    isPending: batchesPending,
  } = useGetBatches();
  const batches =
    batchesData?.data?.map((b) => ({
      label: b.name,
      value: b.id,
    })) || [];

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      batchId: "",
    },
    validators: {
      onSubmit: registerStudentSchema,
    },
    onSubmit: ({ value }) => {
      registerStudent(value, {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Registration failed",
              description: response.message || "Unable to create your account.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Account created",
            description: response.message || "Your account is ready to use.",
          });
          router.push(`/dashboard/${response.data?.role.toLowerCase()}`);
        },
        onError: (error: FetchError) => {
          const message = error.data.message;
          triggerToast({
            type: "error",
            title: "Unable to create your account",
            description: message || "An unexpected error occurred.",
          });
        },
      });
    },
  });

  return (
    <form
      className="space-y-4"
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
              <FieldLabel htmlFor={field.name}>Name</FieldLabel>
              <Input
                autoComplete="name"
                name={field.name}
                id={field.name}
                type="text"
                onBlur={field.handleBlur}
                placeholder="Your name"
                required
                onChange={(e) => field.handleChange(e.target.value)}
                value={field.state.value}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="email">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;

          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Email</FieldLabel>
              <Input
                name={field.name}
                id={field.name}
                type="email"
                onBlur={field.handleBlur}
                placeholder="m@example.com"
                required
                onChange={(event) => field.handleChange(event.target.value)}
                value={field.state.value}
                aria-invalid={isInvalid}
              />
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <form.Field name="password">
        {(field) => {
          const isInvalid =
            field.state.meta.isTouched && !field.state.meta.isValid;
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>Password</FieldLabel>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-2 translate-y-2.5"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <IconEye size={20} />
                  ) : (
                    <IconEyeClosed size={20} />
                  )}
                </button>
                <Input
                  name={field.name}
                  id={field.name}
                  type={showPassword ? "text" : "password"}
                  onBlur={field.handleBlur}
                  placeholder="your password"
                  onChange={(e) => field.handleChange(e.target.value)}
                  value={field.state.value}
                  aria-invalid={isInvalid}
                />
              </div>
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
              {isLoading || batchesPending ? (
                <div className="flex w-full justify-center">
                  <Spinner />
                </div>
              ) : (
                <Select
                  items={batches}
                  value={field.state.value || null}
                  onValueChange={(value) => field.handleChange(value ?? "")}
                >
                  <SelectTrigger
                    id={field.name}
                    aria-invalid={isInvalid}
                    className="w-full"
                    disabled={batches.length === 0}
                    onBlur={field.handleBlur}
                  >
                    <SelectValue placeholder="Select a batch" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Batches</SelectLabel>
                      {batches.map((batch) => (
                        <SelectItem key={batch.value} value={batch.value}>
                          {batch.label}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
              {isInvalid && <FieldError errors={field.state.meta.errors} />}
            </Field>
          );
        }}
      </form.Field>

      <Button
        className="h-11 w-full"
        disabled={studentPending || batchesPending}
        type="submit"
      >
        {studentPending && <Spinner />}
        {studentPending || batchesPending
          ? "Creating account..."
          : "Create account"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href="/login"
        >
          Sign in
        </Link>
      </p>
    </form>
  );
}
