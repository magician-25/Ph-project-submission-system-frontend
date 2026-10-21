"use client";

import { useEffect, useState } from "react";
import type { FetchError } from "ofetch";
import { IconAlertCircle, IconRefresh, IconSearch, IconUsers } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import MyPagination from "@/components/shared/Pagination";
import { useGetUsers, usePromoteUserToMentor } from "@/hooks";
import type { Role } from "@/types";
import { formatDate, triggerToast } from "@/utils";

const pageSize = 10;
type RoleFilter = Role | "ALL";

export default function UserManagement() {
  const [searchInput, setSearchInput] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [role, setRole] = useState<RoleFilter>("ALL");
  const [page, setPage] = useState(1);
  const query = {
    page,
    limit: pageSize,
    searchTerm: searchTerm || undefined,
    role: role === "ALL" ? undefined : role,
  };
  const {
    data,
    isPending,
    isError,
    error,
    refetch,
    isFetching,
  } = useGetUsers(query);
  const {
    mutate: promoteToMentor,
    isPending: isPromoting,
    variables: promotingUserId,
  } = usePromoteUserToMentor();
  const users = data?.success ? (data.data ?? []) : [];
  const responseError = data && !data.success ? data.message : undefined;
  const errorMessage =
    responseError ||
    (error instanceof Error
      ? error.message
      : "Users could not be loaded. Please try again.");
  const totalPages = Math.max(1, Number(data?.meta?.totalPages) || 1);
  const totalCount = Number(data?.meta?.dataCount) || 0;

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setSearchTerm(searchInput.trim());
      setPage(1);
    }, 300);
    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  useEffect(() => {
    if (data?.success && page > totalPages) {
      setPage(totalPages);
    }
  }, [data?.success, page, totalPages]);

  function handlePromote(userId: string, userName: string) {
    promoteToMentor(userId, {
      onSuccess: (response) => {
        if (!response.success) {
          triggerToast({
            type: "error",
            title: "Role update failed",
            description: response.message || "Unable to promote this user.",
          });
          return;
        }

        triggerToast({
          type: "success",
          title: "User promoted",
          description:
            response.message || `${userName} is now a mentor.`,
        });
      },
      onError: (promotionError: FetchError) => {
        triggerToast({
          type: "error",
          title: "Unable to promote user",
          description:
            promotionError.data?.message ||
            promotionError.message ||
            "Please try again.",
        });
      },
    });
  }

  function handleRoleChange(value: string | null) {
    if (
      value === "ALL" ||
      value === "ADMIN" ||
      value === "MENTOR" ||
      value === "STUDENT"
    ) {
      setRole(value);
      setPage(1);
    }
  }

  return (
    <div className="space-y-7">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div className="space-y-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Administration
          </p>
          <h1 className="text-3xl font-semibold tracking-tight">
            User management
          </h1>
          <p className="max-w-2xl text-sm text-muted-foreground">
            Browse accounts and promote students to mentors.
          </p>
        </div>
        <Button
          aria-label="Refresh users"
          disabled={isFetching}
          onClick={() => void refetch()}
          size="icon"
          type="button"
          variant="outline"
        >
          <IconRefresh
            aria-hidden="true"
            className={isFetching ? "animate-spin" : undefined}
          />
        </Button>
      </header>

      <Card>
        <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle className="text-lg">Platform users</CardTitle>
            <CardDescription>
              {totalCount} {totalCount === 1 ? "account" : "accounts"} found
            </CardDescription>
          </div>
          <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
            <div className="relative w-full sm:w-72">
              <IconSearch
                aria-hidden="true"
                className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                aria-label="Search users by name or email"
                className="pl-9"
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search name or email"
                value={searchInput}
              />
            </div>
            <Select
              items={[
                { label: "All roles", value: "ALL" },
                { label: "Students", value: "STUDENT" },
                { label: "Mentors", value: "MENTOR" },
                { label: "Admins", value: "ADMIN" },
              ]}
              onValueChange={handleRoleChange}
              value={role}
            >
              <SelectTrigger
                aria-label="Filter users by role"
                className="w-full sm:w-40"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ALL">All roles</SelectItem>
                <SelectItem value="STUDENT">Students</SelectItem>
                <SelectItem value="MENTOR">Mentors</SelectItem>
                <SelectItem value="ADMIN">Admins</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {isPending ? (
            <div className="space-y-3">
              {Array.from({ length: 6 }, (_, index) => (
                <Skeleton className="h-12 w-full" key={index} />
              ))}
            </div>
          ) : isError || responseError ? (
            <div className="flex flex-col items-start gap-4 rounded-lg border border-destructive/30 p-5">
              <div className="flex items-start gap-3">
                <IconAlertCircle
                  aria-hidden="true"
                  className="mt-0.5 size-5 text-destructive"
                />
                <div className="space-y-1">
                  <p className="font-medium">Unable to load users</p>
                  <p className="text-sm text-muted-foreground">{errorMessage}</p>
                </div>
              </div>
              <Button
                disabled={isFetching}
                onClick={() => void refetch()}
                type="button"
                variant="outline"
              >
                <IconRefresh
                  aria-hidden="true"
                  className={isFetching ? "animate-spin" : undefined}
                />
                Try again
              </Button>
            </div>
          ) : users.length ? (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Account status</TableHead>
                    <TableHead>Batch</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        <span className="rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                          {user.role}
                        </span>
                      </TableCell>
                      <TableCell>{user.user_status}</TableCell>
                      <TableCell className="max-w-40 truncate text-muted-foreground">
                        {user.batch_id ?? "Not assigned"}
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {formatDate(user.created_at)}
                      </TableCell>
                      <TableCell className="text-right">
                        {user.role === "STUDENT" ? (
                          <Button
                            disabled={isPromoting}
                            onClick={() => handlePromote(user.id, user.name)}
                            size="sm"
                            type="button"
                            variant="outline"
                          >
                            {isPromoting && promotingUserId === user.id
                              ? "Promoting..."
                              : "Make mentor"}
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            No action
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <div className="mt-5 flex flex-col items-center justify-between gap-3 border-t pt-4 sm:flex-row">
                <p className="text-sm text-muted-foreground">
                  Showing {(page - 1) * pageSize + 1}–
                  {Math.min(page * pageSize, totalCount)} of {totalCount}
                </p>
                <MyPagination
                  handlePageChange={setPage}
                  page={page}
                  totalPages={totalPages}
                />
              </div>
            </>
          ) : (
            <div className="flex min-h-52 flex-col items-center justify-center p-8 text-center">
              <span className="mb-4 grid size-12 place-items-center rounded-2xl bg-muted text-muted-foreground">
                <IconUsers aria-hidden="true" className="size-6" />
              </span>
              <h2 className="font-semibold">No users found</h2>
              <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                Try another search term or role filter.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
