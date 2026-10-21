import z from "zod";

export const createSubmissionSchema = z.object({
  assignmentId: z.string().min(1, "Assignment is required"),
  userInput: z
    .string({ error: "Submission input must be text" })
    .trim()
    .min(1, "Add your submission link or details")
    .max(10000, "Submission input cannot exceed 10,000 characters"),
});
