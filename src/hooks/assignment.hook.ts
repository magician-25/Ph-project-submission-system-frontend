import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  getAssignments,
  getBatchAssignments,
  getMentorBatchAssignments,
  updateAssignmentStatus,
} from "@/api";
import type {
  AssignmentStatus,
  CreateAssignmentPayload,
  UpdateAssignmentStatusPayload,
} from "@/types";

const assignmentQueryKey = ["assignments"] as const;

export const useGetAssignments = (status?: AssignmentStatus) => {
  return useQuery({
    queryKey: [...assignmentQueryKey, status ?? "all"],
    queryFn: () => getAssignments(status),
  });
};

export const useGetBatchAssignments = (
  batchId: string,
  status: AssignmentStatus,
  page = 1,
  limit = 10,
) => {
  return useQuery({
    queryKey: [...assignmentQueryKey, "admin", batchId, status, page, limit],
    queryFn: () => getBatchAssignments(batchId, status, page, limit),
    enabled: Boolean(batchId),
  });
};

export const useGetMentorBatchAssignments = (
  batchId: string,
  status: AssignmentStatus | undefined,
  page: number,
  limit: number,
) => {
  return useQuery({
    queryKey: [...assignmentQueryKey, "mentor", batchId, status, page, limit],
    queryFn: () => getMentorBatchAssignments(batchId, status, page, limit),
    enabled: Boolean(batchId),
  });
};

export const useCreateAssignment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateAssignmentPayload) => createAssignment(payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: assignmentQueryKey }),
  });
};

export const useUpdateAssignmentStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      assignmentId,
      payload,
    }: {
      assignmentId: string;
      payload: UpdateAssignmentStatusPayload;
    }) => updateAssignmentStatus(assignmentId, payload),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: assignmentQueryKey }),
  });
};
