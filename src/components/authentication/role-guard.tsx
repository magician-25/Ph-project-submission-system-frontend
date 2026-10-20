"use client";

import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useGetProfile } from "@/hooks";
import type { Role } from "@/types";
import AccessDenied from "./AccessDenied";
import AuthLoading from "./AuthLoading";

interface RoleGuardProps {
  children: ReactNode;
  roles: readonly Role[];
}

export default function RoleGuard({ children, roles }: RoleGuardProps) {
  const { data, isPending, isError } = useGetProfile();
  const profile = data?.data;
  const router = useRouter();

  useEffect(() => {
    if (isPending) {
      return;
    }
    if (isError || !profile) {
      router.replace("/login");
      return;
    }
  }, [profile, isError, router, isPending]);

  if (isPending || isError || !profile?.role) {
    return <AuthLoading />;
  }

  if (roles.includes(profile.role)) {
    return <>{children}</>;
  }

  return <AccessDenied />;
}
