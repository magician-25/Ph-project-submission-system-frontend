"use client";

import { Toast as ToastPrimitive } from "@base-ui/react/toast";
import {
  IconAlertCircle,
  IconCircleCheck,
  IconInfoCircle,
  IconX,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export const toast = ToastPrimitive.createToastManager();

function ToastList() {
  const { toasts } = ToastPrimitive.useToastManager();

  return toasts.map((toastItem) => {
    const Icon =
      toastItem.type === "success"
        ? IconCircleCheck
        : toastItem.type === "info"
          ? IconInfoCircle
          : IconAlertCircle;

    return (
      <ToastPrimitive.Root
        className="pointer-events-auto w-full rounded-xl border bg-popover text-popover-foreground shadow-lg outline-none data-ending-style:translate-y-2 data-ending-style:opacity-0 data-starting-style:translate-y-2 data-starting-style:opacity-0"
        key={toastItem.id}
        toast={toastItem}
      >
        <ToastPrimitive.Content className="flex items-start gap-3 p-4">
          <Icon
            aria-hidden="true"
            className={cn(
              "mt-0.5 size-5 shrink-0",
              toastItem.type === "success" && "text-primary",
              toastItem.type === "error" && "text-destructive",
              toastItem.type === "info" && "text-muted-foreground",
            )}
          />
          <div className="min-w-0 flex-1">
            <ToastPrimitive.Title className="text-sm font-semibold" />
            <ToastPrimitive.Description className="mt-1 text-sm text-muted-foreground" />
          </div>
          <ToastPrimitive.Close
            aria-label="Close notification"
            className="rounded-md p-1 text-muted-foreground transition hover:bg-muted hover:text-foreground"
          >
            <IconX aria-hidden="true" className="size-4" />
          </ToastPrimitive.Close>
        </ToastPrimitive.Content>
      </ToastPrimitive.Root>
    );
  });
}

export function Toaster() {
  return (
    <ToastPrimitive.Provider toastManager={toast}>
      <ToastPrimitive.Portal>
        <ToastPrimitive.Viewport className="pointer-events-none fixed inset-x-4 bottom-4 z-50 mx-auto flex w-auto max-w-sm flex-col gap-2 outline-none sm:right-4 sm:left-auto sm:mx-0 sm:w-full">
          <ToastList />
        </ToastPrimitive.Viewport>
      </ToastPrimitive.Portal>
    </ToastPrimitive.Provider>
  );
}
