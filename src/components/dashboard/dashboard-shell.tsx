"use client";

import {
  IconBell,
  IconBook2,
  IconClipboardList,
  IconFileText,
  IconLayoutDashboard,
  IconLogout,
  IconSearch,
} from "@tabler/icons-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { useGetProfile, useLogout } from "@/hooks";
import { cn } from "@/lib/utils";
import { triggerToast } from "@/utils";

const adminNavigation = [
  { href: "/dashboard", label: "Overview", icon: IconLayoutDashboard },
  { href: "/batches", label: "Batches", icon: IconBook2 },
  { href: "/assignments", label: "Assignments", icon: IconClipboardList },
  { href: "/submissions", label: "Submissions", icon: IconFileText },
];

const studentNavigation = [
  { href: "/dashboard", label: "Overview", icon: IconLayoutDashboard },
  { href: "/assignments", label: "Assignments", icon: IconClipboardList },
  { href: "/submissions", label: "My submissions", icon: IconFileText },
];

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profileResponse } = useGetProfile();
  const profile = profileResponse?.data;
  const navigation =
    profile?.role === "ADMIN" ? adminNavigation : studentNavigation;
  const logoutMutation = useLogout();

  function handleLogout() {
    logoutMutation.mutate(undefined, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Sign out failed",
            description: response.message || "Unable to sign out.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "Signed out",
          description: response.message || "You have been signed out.",
        });
        router.replace("/login");
      },
      onError: (error: FetchError) => {
        const message = error.data.message;
        triggerToast({
          type: "error",
          title: "Unable to sign out",
          description: message || "Unable to sign out. Try again.",
        });
      },
    });
  }

  return (
    <div className="min-h-svh bg-muted/40">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r bg-sidebar text-sidebar-foreground lg:flex">
        <Link
          className="flex h-16 items-center gap-3 border-b px-6"
          href="/dashboard"
        >
          <span className="grid size-9 place-items-center rounded-xl bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
            P
          </span>
          <span className="font-semibold tracking-tight">PH Instructor</span>
        </Link>
        <div className="px-4 pt-7">
          <p className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Workspace
          </p>
          <nav aria-label="Main navigation" className="mt-3 space-y-1">
            {navigation.map(({ href, label, icon: Icon }) => {
              const isActive =
                pathname === href ||
                (href !== "/dashboard" && pathname.startsWith(`${href}/`));

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "flex h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                      : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                  )}
                  href={href}
                  key={href}
                >
                  <Icon
                    aria-hidden="true"
                    className="size-4.5"
                    stroke={1.8}
                  />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="mt-auto p-4">
          <div className="rounded-xl border border-sidebar-border bg-background/70 p-3">
            <p className="text-sm font-medium">Need a hand?</p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Ask your administrator for account and batch access.
            </p>
          </div>
          <Button
            className="mt-3 w-full justify-start gap-3 text-muted-foreground"
            disabled={logoutMutation.isPending}
            onClick={handleLogout}
            variant="ghost"
          >
            <IconLogout
              aria-hidden="true"
              className="size-4.5"
              stroke={1.8}
            />
            {logoutMutation.isPending ? "Signing out..." : "Sign out"}
          </Button>
        </div>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur md:px-8">
          <Link className="flex items-center gap-2 lg:hidden" href="/dashboard">
            <span className="grid size-8 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              P
            </span>
            <span className="text-sm font-semibold">PH Instructor</span>
          </Link>
          <div className="hidden w-full max-w-sm items-center gap-2 rounded-lg border bg-muted/40 px-3 md:flex">
            <IconSearch
              aria-hidden="true"
              className="size-4 text-muted-foreground"
            />
            <input
              aria-label="Search workspace"
              className="h-9 w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              placeholder="Search your workspace"
              type="search"
            />
            <kbd className="rounded border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground">
              /
            </kbd>
          </div>
          <div className="flex items-center gap-2">
            <Button aria-label="Notifications" size="icon" variant="ghost">
              <IconBell
                aria-hidden="true"
                className="size-4.5"
                stroke={1.8}
              />
            </Button>
            <div className="ml-1 flex items-center gap-3 border-l pl-4">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium leading-none">
                  {profile?.name ?? "My workspace"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {profile?.role === "ADMIN" ? "Administrator" : "Student"}
                </p>
              </div>
              <div
                aria-label={`${profile?.name ?? "Workspace"} profile`}
                className="grid size-9 place-items-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
                role="img"
              >
                {profile?.name
                  ?.split(/\s+/)
                  .slice(0, 2)
                  .map((part) => part[0])
                  .join("")
                  .toUpperCase() ?? "PH"}
              </div>
            </div>
          </div>
        </header>
        <div className="border-b bg-background px-4 py-2 lg:hidden">
          <nav
            aria-label="Mobile navigation"
            className="flex gap-1 overflow-x-auto"
          >
            {navigation.map(({ href, label }) => {
              const isActive = pathname === href;

              return (
                <Link
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "whitespace-nowrap rounded-md px-3 py-2 text-xs font-medium",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted",
                  )}
                  href={href}
                  key={href}
                >
                  {label}
                </Link>
              );
            })}
            <Button
              className="ml-auto shrink-0"
              disabled={logoutMutation.isPending}
              onClick={handleLogout}
              size="sm"
              variant="ghost"
            >
              <IconLogout aria-hidden="true" className="size-4" />
              Sign out
            </Button>
          </nav>
        </div>
        <main className="mx-auto w-full max-w-360 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
