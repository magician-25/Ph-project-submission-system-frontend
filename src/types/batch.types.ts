import type z from "zod";
import type { createBatchSchema } from "@/schemas";

export type CreateBatchPayload = z.infer<typeof createBatchSchema>;

export interface Batch {
    name: string;
    id: string;
    code: string;
}