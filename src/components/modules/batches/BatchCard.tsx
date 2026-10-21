import { IconBarcode, IconId } from "@tabler/icons-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { Batch } from "@/types";

export default function BatchCard({ batch }: { batch: Batch }) {
  return (
    <Card className="transition-colors hover:border-primary/30">
      <CardHeader className="flex-row items-start justify-between gap-4 space-y-0">
        <CardTitle className="min-w-0 truncate text-base">
          {batch.name}
        </CardTitle>
        <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary">
          <IconBarcode aria-hidden="true" className="size-3.5" />
          {batch.code}
        </span>
      </CardHeader>
      <CardContent>
        <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">
          <IconId aria-hidden="true" className="size-4 shrink-0" />
          <span className="truncate" title={batch.id}>
            {batch.id}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
