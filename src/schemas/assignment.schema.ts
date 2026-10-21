import z from "zod";

export const createAssignmentSchema = z.object({
  title: z
    .string({ error: "Assignment title must be text" })
    .trim()
    .min(2, "Assignment title must be at least 2 characters")
    .max(100, "Assignment title cannot exceed 100 characters"),
  batchId: z.string().min(1, "Select a batch"),
  requirementDocUrl: z.url("Enter a valid requirement document URL"),
  assignmentRepoUrl: z.url("Enter a valid assignment repository URL"),
  assignmentNumber: z.string("").min(1, "Assignment number is required"),
});

export const updateAssignmentStatusSchema = z.object({
  status: z.enum(["RELEASED", "ENDED"], "Invalid status"),
});
