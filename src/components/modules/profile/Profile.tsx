"use client";

import { IconUserCircle } from "@tabler/icons-react";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { useGetProfile } from "@/hooks";
import { getInitials } from "@/utils";
import ProfileDetails from "./ProfileDetails";



export default function Profile() {
    const { data, isPending, isError, error, refetch, isFetching } =
        useGetProfile();
    const user = data?.data;

    return (
        <div className="space-y-7">
            <header className="space-y-2">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                    Account
                </p>
                <h1 className="text-3xl font-semibold tracking-tight">Profile</h1>
                <p className="max-w-2xl text-sm text-muted-foreground">
                    View your account information and membership details.
                </p>
            </header>

            {isPending ? (
                <Card>
                    <CardContent className="flex min-h-40 items-center justify-center gap-3 p-6 text-sm text-muted-foreground">
                        <Spinner />
                        Loading profile…
                    </CardContent>
                </Card>
            ) : isError ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Unable to load your profile</CardTitle>
                        <CardDescription>
                            {error instanceof Error
                                ? error.message
                                : "Your account information could not be loaded."}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <button
                            className="text-sm font-medium text-primary underline-offset-4 hover:underline disabled:opacity-50"
                            disabled={isFetching}
                            onClick={() => void refetch()}
                            type="button"
                        >
                            {isFetching ? "Retrying…" : "Try again"}
                        </button>
                    </CardContent>
                </Card>
            ) : !user ? (
                <Card>
                    <CardHeader>
                        <CardTitle>Profile unavailable</CardTitle>
                        <CardDescription>
                            The profile response did not include account information.
                        </CardDescription>
                    </CardHeader>
                </Card>
            ) : (
                <>
                    <Card>
                        <CardContent className="flex flex-wrap items-center gap-4 p-6">
                            <div
                                aria-label={`${user.name} profile`}
                                className="grid size-16 shrink-0 place-items-center rounded-2xl bg-primary/10 text-lg font-semibold text-primary"
                                role="img"
                            >
                                {getInitials(user.name)}
                            </div>
                            <div className="min-w-0 flex-1 space-y-1">
                                <h2 className="truncate text-xl font-semibold tracking-tight">
                                    {user.name}
                                </h2>
                                <p className="truncate text-sm text-muted-foreground">
                                    {user.email}
                                </p>
                            </div>
                            <span className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium">
                                <IconUserCircle
                                    aria-hidden="true"
                                    className="size-4 text-primary"
                                />
                                {user.role.replaceAll("_", " ")}
                            </span>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Account information</CardTitle>
                            <CardDescription>
                                Your profile details are shared across all account roles.
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ProfileDetails user={user} />
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    );
}
