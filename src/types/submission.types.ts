import type z from "zod";
import type { createSubmissionSchema } from "@/schemas";
import type { Assignment } from "./assignment.types";

export type CreateSubmissionPayload = z.infer<typeof createSubmissionSchema>;
export type SubmissionStatus = "PENDING" | "APPROVED" | "REJECTED";

export interface SubmissionStudent {
  id: string;
  name: string;
  email: string;
}

export interface SubmissionReviewer {
  id: string;
  name: string;
  email: string;
}

export interface SubmissionAssignment {
  id?: string;
  title?: string;
  requirement_doc_url?: string;
  assignment_repo_url?: string;
  assignment_number?: number;
  status?: Assignment["status"];
  released_at?: string | null;
  created_at?: string;
  updated_at?: string;
  batch_id?: string;
  batch?: {
    name: string;
    code: string;
  };
}

export interface Submission {
  id: string;
  user_input: string;
  status: SubmissionStatus;
  review_note: string | null;
  reviewed_at: string | null;
  created_at: string;
  updated_at: string;
  assignment_id: string;
  student_id: string;
  reviewer_id: string | null;
  mark?: number | null;
  student?: SubmissionStudent;
  reviewer?: SubmissionReviewer | null;
  assignment?: SubmissionAssignment;
}
