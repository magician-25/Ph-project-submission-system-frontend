import apiClient from "@/lib/api-client";
import type {
  ApiResponse,
  Assignment,
  AssignmentStatus,
  CreateAssignmentPayload,
  UpdateAssignmentStatusPayload,
} from "@/types";

const prefix = "/assignments";

export const createAssignment = (payload: CreateAssignmentPayload) => {
  return apiClient<ApiResponse<Assignment>>(prefix, {
    method: "POST",
    body: payload,
  });
};

export const getAssignments = (status?: AssignmentStatus) => {
  const query = status ? `?status=${encodeURIComponent(status.toLowerCase())}` : "";
  return apiClient<ApiResponse<Assignment[]>>(`${prefix}${query}`);
};

export const getBatchAssignments = (
  batchId: string,
  status: AssignmentStatus,
  page = 1,
  limit = 10,
) => {
  const query = new URLSearchParams({
    status: status.toLowerCase(),
    page: String(page),
    limit: String(limit),
  });
  return apiClient<ApiResponse<Assignment[]>>(
    `${prefix}/admin/batches/${encodeURIComponent(batchId)}?${query.toString()}`,
  );
};

export const getMentorBatchAssignments = (
  batchId: string,
  status: AssignmentStatus | undefined,
  page: number,
  limit: number,
) => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });
  if (status) query.set("status", status.toLowerCase());
  return apiClient<ApiResponse<Assignment[]>>(
    `${prefix}/batches/${encodeURIComponent(batchId)}?${query.toString()}`,
  );
};

export const updateAssignmentStatus = (
  assignmentId: string,
  payload: UpdateAssignmentStatusPayload,
) => {
  return apiClient<ApiResponse<Assignment[]>>(
    `${prefix}/${encodeURIComponent(assignmentId)}/status`,
    {
      method: "PATCH",
      body: payload,
    },
  );
};
