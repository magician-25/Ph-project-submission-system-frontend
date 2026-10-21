import z from "zod";

export const createSubmissionSchema = z.object({
  assignmentId: z.string().min(1, "Assignment is required"),
  userInput: z
    .string({ error: "Submission input must be text" })
    .trim()
    .min(1, "Add your submission link or details")
    .max(10000, "Submission input cannot exceed 10,000 characters"),
});

export const reviewSubmissionSchema = z
  .object({
    status: z.enum(["APPROVED", "REJECTED"]),
    mark: z
      .number()
      .int("Mark must be a whole number")
      .min(0, "Mark cannot be less than 0")
      .max(60, "Mark cannot exceed 60")
      .nullable(),
    reviewNote: z
      .string()
      .trim()
      .max(2000, "Review note cannot exceed 2,000 characters"),
  })
  .refine((review) => review.status !== "APPROVED" || review.mark !== null, {
    message: "A mark is required when approving a submission",
    path: ["mark"],
  });
