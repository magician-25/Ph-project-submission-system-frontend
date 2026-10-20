import apiClient from "@/lib/api-client";
import type { ApiResponse, Batch, CreateBatchPayload } from "@/types";

const prefix = "/batches";

export const getBatches = () => {
    return apiClient<ApiResponse<Batch[]>>(`${prefix}`);
};

export const createBatch = (payload: CreateBatchPayload) => {
    return apiClient<ApiResponse<Batch>>(`${prefix}`, {
        method: "POST",
        body: payload
    })
};
