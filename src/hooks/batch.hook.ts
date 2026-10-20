import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createBatch, getBatches } from "@/api";

export const useGetBatches = () => {
    return useQuery({
        queryKey: ["batches"],
        queryFn: getBatches,
    });
};

export const useCreateBatch = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: createBatch,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["batches"] })
        }
    })
}