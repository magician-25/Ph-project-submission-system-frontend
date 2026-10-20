import type { Metadata } from "next";
import LoginForm from "@/components/authentication/login-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Sign in",
};

export default function LoginPage() {
  return (
    <Card className="border-border/80 shadow-xl shadow-foreground/4">
      <CardHeader className="space-y-2 pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Welcome back
        </p>
        <CardTitle className="text-2xl">Sign in to your account</CardTitle>
        <CardDescription>
          Access your classes, assignments, and student submissions.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <LoginForm />
      </CardContent>
    </Card>
  );
}
