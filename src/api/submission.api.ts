import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  CreateSubmissionPayload,
  Submission,
} from "@/types";

const prefix = "/submissions";

export const createSubmission = (payload: CreateSubmissionPayload) => {
  return apiClient<ApiResponse<Submission>>(prefix, {
    method: "POST",
    body: payload,
  });
};
