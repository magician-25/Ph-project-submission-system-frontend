"use client";

import { IconEye, IconEyeClosed } from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLogin } from "@/hooks";
import { loginSchema } from "@/schemas";
import { triggerToast } from "@/utils";
import { Field, FieldError, FieldLabel } from "../ui/field";

const DEMO_ACCOUNTS = [
  {
    label: "Admin",
    email: "admin@example.com",
    password: "AdminExample1",
  },
  {
    label: "Mentor",
    email: "mentor@gmail.com",
    password: "a12345678A",
  },
  { label: "Student", email: "student@gmail.com", password: "a12345678A" },
];

export default function LoginForm() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: login, isPending } = useLogin();

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: loginSchema,
    },
    onSubmit: ({ value }) => {
      login(value, {
        onSuccess: (response) => {
          if (!response.success) {
            triggerToast({
              type: "error",
              title: "Sign in failed",
              description: response.message || "Unable to sign in.",
            });
            return;
          }

          triggerToast({
            type: "success",
            title: "Signed in",
            description: response.message || "Welcome back.",
          });
          router.push(`/dashboard/${response.data?.role.toLowerCase()}`);
        },
        onError: (error: FetchError) => {
          const message = error.data.message;
          triggerToast({
            type: "error",
            title: "Unable to sign in",
            description: message || "An unexpected error occurred.",
          });
        },
      });
    },
  });

  return (
    <form
      className="space-y-5"
      onSubmit={(event) => {
        event.preventDefault();
        form.handleSubmit();
      }}
    >
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

      <Button className="h-11 w-full" disabled={isPending} type="submit">
        {isPending ? "Signing in..." : "Sign in"}
      </Button>

      <div className="mx-auto grid grid-cols-1 lg:grid-cols-3 gap-2">
        {DEMO_ACCOUNTS.map((acc) => (
          <Button
            key={acc.label}
            type="button"
            className="h-auto min-h-9 w-full min-w-0 whitespace-normal wrap-break-word px-2 py-2 text-center leading-tight"
            size="lg"
            variant="secondary"
            onClick={() => {
              form.setFieldValue("email", acc.email);
              form.setFieldValue("password", acc.password);
            }}
          >
            {acc.label}
          </Button>
        ))}
      </div>

      <p className="text-center text-sm text-muted-foreground">
        New to the workspace?{" "}
        <Link
          className="font-medium text-primary underline-offset-4 hover:underline"
          href="/register"
        >
          Create a student account
        </Link>
      </p>
    </form>
  );
}
