import type { Metadata } from "next";
import RegisterForm from "@/components/authentication/register-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Create an account",
};

export default function RegisterPage() {
  return (
    <Card className="border-border/80 shadow-xl shadow-foreground/[0.04]">
      <CardHeader className="space-y-2 pb-2">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          Student registration
        </p>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>
          Join your batch to access course assignments and submit your work.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-5">
        <RegisterForm />
      </CardContent>
    </Card>
  );
}
