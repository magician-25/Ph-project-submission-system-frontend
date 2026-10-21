import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import {
  createSubmission,
  getMySubmissions,
  getSubmissionStatistics,
  getSubmissionsForReview,
  reviewSubmission,
} from "@/api";
import type {
  CreateSubmissionPayload,
  ReviewSubmissionPayload,
  SubmissionReviewQuery,
} from "@/types";

const submissionQueryKey = ["submissions"] as const;

export const useGetMySubmissions = () => {
  return useQuery({
    queryKey: [...submissionQueryKey, "mine"],
    queryFn: getMySubmissions,
  });
};

export const useGetSubmissionsForReview = (
  query: SubmissionReviewQuery,
) => {
  return useQuery({
    queryKey: [...submissionQueryKey, "review", query],
    queryFn: () => getSubmissionsForReview(query),
  });
};

export const useGetSubmissionStatistics = (batchId?: string) => {
  return useQuery({
    queryKey: [...submissionQueryKey, "stats", batchId],
    queryFn: () => getSubmissionStatistics(batchId),
  });
};

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

export const useReviewSubmission = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      submissionId,
      payload,
    }: {
      submissionId: string;
      payload: ReviewSubmissionPayload;
    }) => reviewSubmission(submissionId, payload),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: submissionQueryKey }),
        queryClient.invalidateQueries({ queryKey: ["assignments"] }),
      ]);
    },
  });
};
