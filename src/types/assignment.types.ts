import type z from "zod";
import type {
  createAssignmentSchema,
  updateAssignmentStatusSchema,
} from "@/schemas";

export type CreateAssignmentPayload = Omit<z.infer<typeof createAssignmentSchema>, 'assignmentNumber'> & {
  assignmentNumber: number;
}; export type UpdateAssignmentStatusPayload = z.infer<
  typeof updateAssignmentStatusSchema
>;
export type AssignmentStatus = "PENDING" | "RELEASED" | "ENDED";

export interface AssignmentBatch {
  id: string;
  name: string;
  code: string;
  created_at?: string;
  updated_at?: string;
}

export interface StudentAssignmentSubmission {
  id: string;
  user_input: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  mark: number | null;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
}

export interface Assignment {
  id: string;
  title: string;
  requirement_doc_url: string;
  assignment_repo_url: string;
  assignment_number: number;
  status: AssignmentStatus;
  released_at: string | null;
  created_at: string;
  updated_at: string;
  batch_id: string;
  batch?: AssignmentBatch;
  mySubmission?: StudentAssignmentSubmission | null;
}
