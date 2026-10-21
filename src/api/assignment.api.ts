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

export const getAssignments = () => {
  return apiClient<ApiResponse<Assignment[]>>(prefix);
};

export const getBatchAssignments = (
  batchId: string,
  status: AssignmentStatus,
) => {
  return apiClient<ApiResponse<Assignment[]>>(
    `${prefix}/admin/batches/${encodeURIComponent(batchId)}?status=${status.toLowerCase()}`,
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
