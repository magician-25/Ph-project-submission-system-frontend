import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createSubmission } from "@/api";
import type { CreateSubmissionPayload } from "@/types";

const submissionQueryKey = ["submissions"] as const;

export const useCreateSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateSubmissionPayload) =>
      createSubmission(payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["assignments"] }),
        queryClient.invalidateQueries({ queryKey: submissionQueryKey }),
      ]);
    },
  });
};
