import type { z } from "zod";
import type {
  loginSchema,
  registerStudentSchema,
} from "@/schemas";
import type { User } from "./user.types";

export type LoginPayload = z.infer<typeof loginSchema>;
export type RegisterStudentPayload = z.infer<typeof registerStudentSchema>;

export interface GetUsersQuery {
  page: number;
  limit: number;
  searchTerm?: string;
  role?: User["role"];
}
