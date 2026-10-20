import {
  IconCircleCheck,
  IconClipboardText,
  IconSparkles,
} from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface SectionPlaceholderProps {
  title: string;
  description: string;
  endpoint: string;
}

export default function SectionPlaceholder({
  title,
  description,
  endpoint,
}: SectionPlaceholderProps) {
  return (
    <div className="space-y-7">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Workspace
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
        <p className="max-w-2xl text-sm text-muted-foreground">{description}</p>
      </header>
      <Card className="overflow-hidden border-dashed shadow-none">
        <CardHeader className="border-b bg-muted/30">
          <div className="flex items-center gap-3">
            <span className="grid size-10 place-items-center rounded-xl bg-primary/10 text-primary">
              <IconClipboardText
                aria-hidden="true"
                className="size-5"
                stroke={1.8}
              />
            </span>
            <div className="space-y-1">
              <CardTitle className="text-base">
                Your {title.toLowerCase()} will appear here
              </CardTitle>
              <CardDescription>
                This section is ready for its API-backed table and workflows.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-5 p-6 md:grid-cols-2">
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <IconCircleCheck
                aria-hidden="true"
                className="size-4 text-primary"
              />
              Base structure is in place
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Shared route groups, navigation, and UI primitives are ready to
              extend.
            </p>
          </div>
          <div className="rounded-lg border bg-background p-4">
            <div className="flex items-center gap-2 text-sm font-medium">
              <IconSparkles
                aria-hidden="true"
                className="size-4 text-primary"
              />
              Data integration point
            </div>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Connect this page to{" "}
              <code className="rounded bg-muted px-1.5 py-0.5">{endpoint}</code>{" "}
              with a TanStack Query hook.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
