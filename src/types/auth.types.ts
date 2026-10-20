import type { z } from "zod";
import type {
  loginSchema,
  registerStudentSchema,
} from "@/schemas";

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterStudentPayload = z.infer<typeof registerStudentSchema>;
