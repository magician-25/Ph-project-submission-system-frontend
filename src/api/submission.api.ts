import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CreateSubmissionPayload,
  ReviewSubmissionPayload,
  Submission,
  SubmissionReviewQuery,
  SubmissionStatistics,
} from "@/types";

const prefix = "/submissions";

export const createSubmission = (payload: CreateSubmissionPayload) => {
  return apiClient<ApiResponse<Submission>>(prefix, {
    method: "POST",
    body: payload,
  });
};

export const getMySubmissions = () => {
  return apiClient<ApiResponse<Submission[]>>(`${prefix}/mine`);
};

export const getSubmissionsForReview = ({
  status,
  page,
  limit,
}: SubmissionReviewQuery) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) {
    query.set("status", status);
  }
  return apiClient<ApiResponse<Submission[]>>(`${prefix}?${query.toString()}`);
};

export const getSubmissionStatistics = (batchId?: string) => {
  const query = batchId
    ? `?batchId=${encodeURIComponent(batchId)}`
    : "";
  return apiClient<ApiResponse<SubmissionStatistics>>(`${prefix}/stats${query}`);
};

export const reviewSubmission = (
  submissionId: string,
  payload: ReviewSubmissionPayload,
) => {
  return apiClient<ApiResponse<Submission>>(
    `${prefix}/${encodeURIComponent(submissionId)}/review`,
    {
      method: "PATCH",
      body: payload,
    },
  );
};
