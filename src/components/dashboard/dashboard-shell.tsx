"use client";

import { IconBell, IconLogout } from "@tabler/icons-react";
import Link from "next/link";
import { notFound, usePathname, useRouter } from "next/navigation";
import type { FetchError } from "ofetch";
import type { CSSProperties, ReactNode } from "react";
import { adminRoutes, mentorRoutes, studentRoutes } from "@/app/routes";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { useGetProfile, useLogout } from "@/hooks";
import type { Role } from "@/types";
import { triggerToast } from "@/utils";

function getRoutes(role: Role) {
  if (role === "ADMIN") {
    return adminRoutes;
  } else if (role === "MENTOR") {
    return mentorRoutes;
  } else if (role === "STUDENT") {
    return studentRoutes;
  } else {
    notFound();
  }
}

export default function DashboardShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { data: profileResponse } = useGetProfile();
  const { mutate: logout, isPending } = useLogout();
  const profile = profileResponse?.data;

  function handleLogout() {
    logout(undefined, {
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

  const routes = getRoutes(profile?.role as Role);

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as CSSProperties
      }
    >
      <Sidebar collapsible="offcanvas" variant="sidebar">
        <SidebarHeader className="border-b border-sidebar-border px-4 py-3">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton
                className="h-10 gap-3 px-2"
                size="lg"
              >
                <span className="grid size-8 place-items-center rounded-lg bg-sidebar-primary text-sm font-bold text-sidebar-primary-foreground">
                  P
                </span>
                <span className="font-semibold tracking-tight">
                  PH Instructor
                </span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent className="pt-4">
          <SidebarGroup>
            <SidebarGroupLabel className="px-3 text-[11px] font-semibold uppercase tracking-[0.16em]">
              Workspace
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {routes.map(({ href, label, icon: Icon }) => {
                  const isActive =
                    pathname === href ||
                    (href !== "/dashboard" && pathname.startsWith(`${href}/`));

                  return (
                    <SidebarMenuItem key={href}>
                      <SidebarMenuButton
                        aria-current={isActive ? "page" : undefined}
                        className="mb-1 h-10 px-3"
                        isActive={isActive}
                        render={<Link href={href} />}
                      >
                        <Icon aria-hidden="true" />
                        <span>{label}</span>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>

        <SidebarFooter className="p-4">
          <Button
            className="mt-1 w-full justify-start gap-3 text-muted-foreground"
            disabled={isPending}
            onClick={handleLogout}
            variant="ghost"
          >
            <IconLogout aria-hidden="true" className="size-4.5" stroke={1.8} />
            {isPending ? "Signing out..." : "Sign out"}
          </Button>
        </SidebarFooter>
      </Sidebar>

      <SidebarInset>
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-4 border-b bg-background/90 px-4 backdrop-blur md:px-8">
          <div className="flex min-w-0 items-center gap-2">
            <SidebarTrigger aria-label="Toggle dashboard navigation" />
            <Separator className="mx-1 h-5" orientation="vertical" />
            <Link
              className="flex items-center gap-2 lg:hidden"
              href="/dashboard"
            >
              <span className="grid size-8 place-items-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
                P
              </span>
              <span className="text-sm font-semibold">PH Instructor</span>
            </Link>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <Button aria-label="Notifications" size="icon" variant="ghost">
              <IconBell aria-hidden="true" className="size-4.5" stroke={1.8} />
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

        <div className="flex flex-1 flex-col">
          <div className="@container/main mx-auto flex w-full max-w-360 flex-1 flex-col gap-2 p-4 md:p-8">
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
