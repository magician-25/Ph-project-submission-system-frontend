import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createAssignment,
  getAssignments,
  getBatchAssignments,
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
    queryKey: [...assignmentQueryKey, "released", status],
    queryFn: () => getAssignments(status),
  });
};

export const useGetBatchAssignments = (
  batchId: string,
  status: AssignmentStatus,
) => {
  return useQuery({
    queryKey: [...assignmentQueryKey, "admin", batchId, status],
    queryFn: () => getBatchAssignments(batchId, status),
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
